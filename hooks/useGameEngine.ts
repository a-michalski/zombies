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
   * Generate procedural wave for endless mode
   * Difficulty increases every wave with more enemies and advanced types
   */
  const generateEndlessWave = (waveNumber: number) => {
    // Base difficulty increases with wave number
    const baseCount = Math.floor(3 + waveNumber * 0.8); // 3, 4, 5, 6... enemies per wave
    const spawnDelay = Math.max(0.5, 1.5 - waveNumber * 0.05); // Faster spawns over time

    const enemies: { type: string; count: number }[] = [];

    // Wave 1-3: Only shamblers
    if (waveNumber <= 3) {
      enemies.push({ type: 'shambler', count: baseCount });
    }
    // Wave 4-7: Shamblers + Runners
    else if (waveNumber <= 7) {
      const runnerCount = Math.floor(baseCount * 0.3);
      enemies.push({ type: 'shambler', count: baseCount - runnerCount });
      enemies.push({ type: 'runner', count: runnerCount });
    }
    // Wave 8-12: Add Brutes
    else if (waveNumber <= 12) {
      const runnerCount = Math.floor(baseCount * 0.4);
      const bruteCount = Math.floor(baseCount * 0.2);
      const shamblerCount = baseCount - runnerCount - bruteCount;
      if (shamblerCount > 0) enemies.push({ type: 'shambler', count: shamblerCount });
      enemies.push({ type: 'runner', count: runnerCount });
      enemies.push({ type: 'brute', count: bruteCount });
    }
    // Wave 13-20: Add Spitters and Crawlers
    else if (waveNumber <= 20) {
      const advancedCount = Math.floor(baseCount * 0.6);
      const basicCount = baseCount - advancedCount;
      enemies.push({ type: 'shambler', count: Math.floor(basicCount * 0.5) });
      enemies.push({ type: 'runner', count: Math.ceil(basicCount * 0.5) });
      enemies.push({ type: 'brute', count: Math.floor(advancedCount * 0.3) });
      enemies.push({ type: 'spitter', count: Math.floor(advancedCount * 0.4) });
      enemies.push({ type: 'crawler', count: Math.ceil(advancedCount * 0.3) });
    }
    // Wave 21-30: Add Bloaters
    else if (waveNumber <= 30) {
      const advancedCount = Math.floor(baseCount * 0.7);
      const basicCount = baseCount - advancedCount;
      enemies.push({ type: 'runner', count: basicCount });
      enemies.push({ type: 'brute', count: Math.floor(advancedCount * 0.2) });
      enemies.push({ type: 'spitter', count: Math.floor(advancedCount * 0.3) });
      enemies.push({ type: 'crawler', count: Math.floor(advancedCount * 0.3) });
      enemies.push({ type: 'bloater', count: Math.ceil(advancedCount * 0.2) });
    }
    // Wave 31+: Add Tanks and Hive Queens
    else {
      const bossCount = Math.floor(waveNumber / 10); // 1 boss per 10 waves
      const eliteCount = Math.floor(baseCount * 0.8);
      const basicCount = baseCount - eliteCount - bossCount;

      if (basicCount > 0) enemies.push({ type: 'runner', count: basicCount });
      enemies.push({ type: 'spitter', count: Math.floor(eliteCount * 0.3) });
      enemies.push({ type: 'crawler', count: Math.floor(eliteCount * 0.3) });
      enemies.push({ type: 'bloater', count: Math.floor(eliteCount * 0.2) });
      enemies.push({ type: 'tank', count: Math.ceil(eliteCount * 0.2) });

      // Add Hive Queen every 10 waves
      if (waveNumber % 10 === 0) {
        enemies.push({ type: 'hiveQueen', count: 1 });
      }
    }

    return {
      wave: waveNumber,
      enemies: enemies.filter(e => e.count > 0), // Remove 0-count entries
      spawnDelay,
    };
  };

  /**
   * Get wave configuration based on current game mode
   * Campaign mode uses level's waves, classic mode uses hardcoded waves, endless mode generates procedurally
   */
  const getWaveConfig = (waveNumber: number, gameState: any) => {
    // If campaign mode with a level
    if (gameState.sessionConfig?.mode === 'campaign' && gameState.sessionConfig?.currentLevel) {
      const currentLevel = gameState.sessionConfig.currentLevel;

      // Check if this is endless mode
      if (currentLevel.id === 'endless') {
        return generateEndlessWave(waveNumber);
      }

      // Regular campaign level
      return currentLevel.mapConfig.waves.find((w: any) => w.wave === waveNumber);
    }

    // Otherwise use classic mode (hardcoded waves)
    return WAVE_CONFIGS.find(w => w.wave === waveNumber);
  };

  /**
   * Get total number of waves based on current game mode
   */
  const getTotalWaves = (gameState: any) => {
    if (gameState.sessionConfig?.mode === 'campaign' && gameState.sessionConfig?.currentLevel) {
      const currentLevel = gameState.sessionConfig.currentLevel;

      // Endless mode never ends
      if (currentLevel.id === 'endless') {
        return Infinity;
      }

      return currentLevel.mapConfig.waves.length;
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

          // Check if time freeze is active
          const isTimeFrozen = newState.activeEffects.some(effect => effect.type === 'timeFreeze');

          newState.enemies = newState.enemies.map((enemy: Enemy) => {
            const enemyConfig = ENEMY_CONFIGS[enemy.type];

            // Hive Queen regeneration (3 HP/sec) - works even when frozen
            if (enemy.type === "hiveQueen" && enemy.health < enemy.maxHealth) {
              enemy.health = Math.min(enemy.health + (3 * dt), enemy.maxHealth);
            }

            // If time is frozen, enemies don't move
            if (isTimeFrozen) {
              return enemy; // Return unchanged
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
