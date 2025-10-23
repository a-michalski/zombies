import { useEffect, useRef } from "react";

import { ENEMY_CONFIGS } from "@/constants/enemies";
import { GAME_CONFIG, WAYPOINTS } from "@/constants/gameConfig";
import { LOOKOUT_POST, PROJECTILE_CONFIG } from "@/constants/towers";
import { WAVE_CONFIGS } from "@/constants/waves";
import { useGame } from "@/contexts/GameContext";
import { Enemy, Projectile } from "@/types/game";
import { calculatePathProgress, getDistance, moveAlongPath } from "@/utils/pathfinding";

export function useGameEngine() {
  const { setGameState, addFloatingText, addParticles } = useGame();
  
  const spawnTimerRef = useRef<number>(0);
  const enemyQueueRef = useRef<{ type: string; spawnTime: number }[]>([]);
  const lastUpdateRef = useRef<number>(Date.now());

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
          const waveConfig = WAVE_CONFIGS[newState.currentWave - 1];

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

            const newEnemy: Enemy = {
              id: `enemy_${now}_${Math.random()}`,
              type: enemyToSpawn.type as any,
              health: enemyConfig.health,
              maxHealth: enemyConfig.health,
              position: { x: WAYPOINTS[0].x, y: WAYPOINTS[0].y },
              pathProgress: 0,
              waypointIndex: 0,
            };

            newState.enemies.push(newEnemy);
          }

          newState.enemies = newState.enemies.map((enemy: Enemy) => {
            const enemyConfig = ENEMY_CONFIGS[enemy.type];
            const moveResult = moveAlongPath(
              enemy.position,
              enemy.waypointIndex,
              enemyConfig.speed,
              dt
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
              moveResult.newPosition
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

            if (newState.currentWave >= GAME_CONFIG.TOTAL_WAVES) {
              newState.phase = "victory";
            } else {
              newState.currentWave += 1;
              newState.phase = "between_waves";
              newState.waveCountdown = GAME_CONFIG.AUTO_START_DELAY;
            }
          }
        }

        newState.towers.forEach((tower) => {
          const towerStats = LOOKOUT_POST.levels[tower.level - 1];
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
              const targetEnemy = newState.enemies.find(
                (e) => e.id === projectile.targetEnemyId
              );

              if (targetEnemy) {
                targetEnemy.health -= projectile.damage;

                addFloatingText(
                  `-${projectile.damage}`,
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

                if (targetEnemy.health <= 0) {
                  const enemyConfig = ENEMY_CONFIGS[targetEnemy.type];
                  newState.scrap += enemyConfig.scrapReward;
                  newState.stats.zombiesKilled += 1;

                  addFloatingText(
                    `+${enemyConfig.scrapReward}`,
                    targetEnemy.position.x,
                    targetEnemy.position.y,
                    "#FFD700"
                  );

                  addParticles(
                    targetEnemy.position.x,
                    targetEnemy.position.y,
                    enemyConfig.color,
                    12
                  );

                  newState.enemies = newState.enemies.filter(
                    (e) => e.id !== targetEnemy.id
                  );
                }
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
