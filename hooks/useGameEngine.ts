import { useEffect, useRef } from "react";

import { ENEMY_CONFIGS } from "@/constants/enemies";
import { GAME_CONFIG, WAYPOINTS } from "@/constants/gameConfig";
import { LOOKOUT_POST, CANNON_TOWER, PROJECTILE_CONFIG } from "@/constants/towers";
import { WAVE_CONFIGS } from "@/constants/waves";
import { useGame } from "@/contexts/GameContext";
import { Enemy, Position, Projectile } from "@/types/game";
import { calculatePathProgress, getDistance, moveAlongPath } from "@/utils/pathfinding";

export function useGameEngine() {
  const { gameState: currentGameState, setGameState, addFloatingText, addParticles } = useGame();

  const spawnTimerRef = useRef<number>(0);
  const enemyQueueRef = useRef<{ type: string; spawnTime: number }[]>([]);
  const lastUpdateRef = useRef<number>(Date.now());

  /**
   * Get wave configuration based on current game mode
   * Campaign mode uses level's waves, classic mode uses hardcoded waves
   */
  const getWaveConfig = (waveNumber: number, gameState: any) => {
    // If campaign mode, use level's waves
    if (gameState.sessionConfig?.mode === 'campaign' && gameState.sessionConfig?.currentLevel) {
      return gameState.sessionConfig.currentLevel.mapConfig.waves.find((w: any) => w.wave === waveNumber);
    }

    // Otherwise use classic mode (hardcoded waves)
    return WAVE_CONFIGS.find(w => w.wave === waveNumber);
  };

  /**
   * Get total number of waves based on current game mode
   */
  const getTotalWaves = (gameState: any) => {
    if (gameState.sessionConfig?.mode === 'campaign' && gameState.sessionConfig?.currentLevel) {
      return gameState.sessionConfig.currentLevel.mapConfig.waves.length;
    }
    return GAME_CONFIG.TOTAL_WAVES; // Classic mode: 10 waves
  };

  /**
   * Get waypoints based on current game mode
   */
  const getWaypoints = (gameState: any): readonly Position[] => {
    if (gameState.sessionConfig?.mode === 'campaign' && gameState.sessionConfig?.currentLevel) {
      return gameState.sessionConfig.currentLevel.mapConfig.waypoints;
    }
    return WAYPOINTS; // Classic mode: hardcoded waypoints
  };

  useEffect(() => {
    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = (now - lastUpdateRef.current) / 1000;
      lastUpdateRef.current = now;

      setGameState((prev) => {
        if (prev.isPaused || prev.phase === "victory" || prev.phase === "defeat") {
          return prev;
        }

        const dt = deltaTime * prev.gameSpeed;
        let newState = { ...prev };

        if (newState.phase === "playing") {
          const waveConfig = getWaveConfig(newState.currentWave, newState);

          if (!waveConfig) {
            // No more waves - victory
            newState.phase = "victory";
            return newState;
          }

          if (enemyQueueRef.current.length === 0 && newState.enemies.length === 0) {
            const allEnemies: { type: string; spawnTime: number }[] = [];
            let spawnTime = 0;

            waveConfig.enemies.forEach((enemyGroup) => {
              for (let i = 0; i < enemyGroup.count; i++) {
                allEnemies.push({
                  type: enemyGroup.type,
                  spawnTime,
                });
                spawnTime += waveConfig.spawnDelay;
              }
            });

            enemyQueueRef.current = allEnemies;
            spawnTimerRef.current = 0;
          }

          spawnTimerRef.current += dt;

          while (
            enemyQueueRef.current.length > 0 &&
            spawnTimerRef.current >= enemyQueueRef.current[0].spawnTime
          ) {
            const enemyToSpawn = enemyQueueRef.current.shift()!;
            const enemyConfig = ENEMY_CONFIGS[enemyToSpawn.type as keyof typeof ENEMY_CONFIGS];

            const waypoints = getWaypoints(newState);
            const newEnemy: Enemy = {
              id: `enemy_${now}_${Math.random()}`,
              type: enemyToSpawn.type as any,
              health: enemyConfig.health,
              maxHealth: enemyConfig.health,
              position: { x: waypoints[0].x, y: waypoints[0].y },
              pathProgress: 0,
              waypointIndex: 0,
            };

            newState.enemies.push(newEnemy);
          }

          const waypoints = getWaypoints(newState);
          newState.enemies = newState.enemies.map((enemy: Enemy) => {
            const enemyConfig = ENEMY_CONFIGS[enemy.type];

            // Hive Queen regeneration (3 HP/sec)
            if (enemy.type === "hiveQueen" && enemy.health < enemy.maxHealth) {
              enemy.health = Math.min(enemy.health + (3 * dt), enemy.maxHealth);
            }

            // Crawler speed boost at <50% HP (2.2 → 3.08)
            let effectiveSpeed = enemyConfig.speed;
            if (enemy.type === "crawler") {
              const healthPercent = enemy.health / enemy.maxHealth;
              if (healthPercent < 0.5) {
                effectiveSpeed = enemyConfig.speed * 1.4; // Speed boost!
              }
            }

            const moveResult = moveAlongPath(
              enemy.position,
              enemy.waypointIndex,
              effectiveSpeed,
              dt,
              waypoints
            );

            if (moveResult.reachedEnd) {
              newState.hullIntegrity -= enemyConfig.damageToBastion;
              
              addFloatingText(
                `-${enemyConfig.damageToBastion}`,
                enemy.position.x,
                enemy.position.y,
                "#FF4444"
              );

              return null;
            }

            const pathProgress = calculatePathProgress(
              moveResult.newWaypointIndex,
              moveResult.newPosition,
              waypoints
            );

            return {
              ...enemy,
              position: moveResult.newPosition,
              waypointIndex: moveResult.newWaypointIndex,
              pathProgress,
            };
          }).filter((e): e is Enemy => e !== null);

          if (enemyQueueRef.current.length === 0 && newState.enemies.length === 0) {
            newState.scrap += GAME_CONFIG.WAVE_COMPLETION_BONUS;

            addFloatingText(
              `+${GAME_CONFIG.WAVE_COMPLETION_BONUS}`,
              10,
              6,
              "#FFD700"
            );

            const totalWaves = getTotalWaves(newState);
            if (newState.currentWave >= totalWaves) {
              newState.phase = "victory";
            } else {
              newState.currentWave += 1;
              newState.phase = "between_waves";
              newState.waveCountdown = GAME_CONFIG.AUTO_START_DELAY;
            }
          }
        }

        newState.towers.forEach((tower) => {
          // Get tower config based on type
          const towerConfig = tower.type === "tower_cannon" ? CANNON_TOWER : LOOKOUT_POST;
          const towerStats = towerConfig.levels[tower.level - 1];
          const timeSinceLastFire = now / 1000 - tower.lastFireTime;
          const fireInterval = 1 / towerStats.fireRate;

          if (timeSinceLastFire >= fireInterval) {
            const enemiesInRange = newState.enemies.filter((enemy: Enemy) => {
              const distance = getDistance(tower.position, enemy.position);
              return distance <= towerStats.range;
            });

            if (enemiesInRange.length > 0) {
              enemiesInRange.sort((a: Enemy, b: Enemy) => b.pathProgress - a.pathProgress);
              const target = enemiesInRange[0];

              const newProjectile: Projectile = {
                id: `projectile_${now}_${Math.random()}`,
                towerId: tower.id,
                towerType: tower.type,
                position: { ...tower.position },
                targetPosition: { ...target.position },
                targetEnemyId: target.id,
                damage: towerStats.damage,
                spawnTime: now,
              };

              newState.projectiles.push(newProjectile);
              tower.lastFireTime = now / 1000;
            }
          }
        });

        newState.projectiles = newState.projectiles
          .map((projectile: Projectile) => {
            const age = (now - projectile.spawnTime) / 1000;

            if (age > PROJECTILE_CONFIG.LIFETIME) {
              return null;
            }

            const dx = projectile.targetPosition.x - projectile.position.x;
            const dy = projectile.targetPosition.y - projectile.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 0.3) {
              // Cannon Tower: AOE damage
              if (projectile.towerType === "tower_cannon") {
                const aoeRadius = 1.0;

                // Find all enemies in AOE range
                const enemiesInAOE = newState.enemies.filter((enemy) => {
                  const distToImpact = getDistance(enemy.position, projectile.targetPosition);
                  return distToImpact <= aoeRadius;
                });

                // Damage all enemies in AOE
                enemiesInAOE.forEach((enemy) => {
                  // Apply Tank armor (25% damage reduction)
                  let finalDamage = projectile.damage;
                  if (enemy.type === "tank") {
                    finalDamage = Math.floor(projectile.damage * 0.75);
                  }

                  enemy.health -= finalDamage;

                  addFloatingText(
                    `-${finalDamage}`,
                    enemy.position.x,
                    enemy.position.y,
                    "#FF6B6B"
                  );
                });

                // AOE explosion particles at impact point
                addParticles(
                  projectile.targetPosition.x,
                  projectile.targetPosition.y,
                  "#FF8800", // Orange explosion
                  15
                );
              } else {
                // Lookout Post: Single target damage
                const targetEnemy = newState.enemies.find(
                  (e) => e.id === projectile.targetEnemyId
                );

                if (targetEnemy) {
                  // Apply Tank armor (25% damage reduction)
                  let finalDamage = projectile.damage;
                  if (targetEnemy.type === "tank") {
                    finalDamage = Math.floor(projectile.damage * 0.75); // 25% armor
                  }

                  targetEnemy.health -= finalDamage;

                  addFloatingText(
                    `-${finalDamage}`,
                    targetEnemy.position.x,
                    targetEnemy.position.y,
                    "#FF6B6B"
                  );

                  addParticles(
                    targetEnemy.position.x,
                    targetEnemy.position.y,
                    ENEMY_CONFIGS[targetEnemy.type].color,
                    6
                  );
                }
              }

              // Process all dead enemies (works for both AOE and single target)
              const deadEnemies = newState.enemies.filter((e) => e.health <= 0);
              deadEnemies.forEach((deadEnemy) => {
                const enemyConfig = ENEMY_CONFIGS[deadEnemy.type];
                newState.scrap += enemyConfig.scrapReward;
                newState.stats.zombiesKilled += 1;

                addFloatingText(
                  `+${enemyConfig.scrapReward}`,
                  deadEnemy.position.x,
                  deadEnemy.position.y,
                  "#FFD700"
                );

                addParticles(
                  deadEnemy.position.x,
                  deadEnemy.position.y,
                  enemyConfig.color,
                  12
                );

                // Bloater explosion: damages nearby towers
                if (deadEnemy.type === "bloater") {
                  const explosionRadius = 1.5;
                  const explosionDamage = 5;

                  // Find towers in explosion range
                  newState.towers.forEach((tower) => {
                    const distance = getDistance(deadEnemy.position, tower.position);
                    if (distance <= explosionRadius) {
                      // Downgrade tower or destroy if Level 1
                      if (tower.level > 1) {
                        tower.level -= 1;
                        addFloatingText(
                          "EXPLOSION!",
                          tower.position.x,
                          tower.position.y,
                          "#FF4444"
                        );
                      } else {
                        // Level 1 tower destroyed
                        newState.towers = newState.towers.filter((t) => t.id !== tower.id);
                        addFloatingText(
                          "DESTROYED!",
                          tower.position.x,
                          tower.position.y,
                          "#FF0000"
                        );
                      }

                      // Explosion particles
                      addParticles(
                        tower.position.x,
                        tower.position.y,
                        "#8BC34A", // Bloater color (green)
                        20
                      );

                      // Also damage hull integrity
                      newState.hullIntegrity -= explosionDamage;
                    }
                  });
                }
              });

              // Remove all dead enemies
              newState.enemies = newState.enemies.filter((e) => e.health > 0);
              }

              return null;
            }

            const moveDistance = PROJECTILE_CONFIG.SPEED * dt;
            const progress = Math.min(moveDistance / distance, 1.0);

            return {
              ...projectile,
              position: {
                x: projectile.position.x + dx * progress,
                y: projectile.position.y + dy * progress,
              },
            };
          })
          .filter((p): p is Projectile => p !== null);

        if (newState.hullIntegrity <= 0 && newState.phase !== "defeat") {
          newState.phase = "defeat";
          newState.hullIntegrity = 0;
        }

        return newState;
      });
    };

    const intervalId = setInterval(gameLoop, 1000 / 60);

    return () => {
      clearInterval(intervalId);
    };
  }, [setGameState, addFloatingText, addParticles]);
}
