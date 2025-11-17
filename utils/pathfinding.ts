import { WAYPOINTS } from "@/constants/gameConfig";
import { Position } from "@/types/game";

/**
 * Calculate overall progress along the path (0.0 to 1.0)
 * @param waypointIndex - Current waypoint index
 * @param position - Current position
 * @param waypoints - Optional waypoints array (defaults to WAYPOINTS constant)
 */
export function calculatePathProgress(
  waypointIndex: number,
  position: Position,
  waypoints: readonly Position[] = WAYPOINTS
): number {
  if (waypointIndex >= waypoints.length - 1) {
    return 1.0;
  }

  const currentWaypoint = waypoints[waypointIndex];
  const nextWaypoint = waypoints[waypointIndex + 1];

  const segmentStartX = currentWaypoint.x;
  const segmentStartY = currentWaypoint.y;
  const segmentEndX = nextWaypoint.x;
  const segmentEndY = nextWaypoint.y;

  const segmentLength = Math.sqrt(
    Math.pow(segmentEndX - segmentStartX, 2) + Math.pow(segmentEndY - segmentStartY, 2)
  );

  const distanceInSegment = Math.sqrt(
    Math.pow(position.x - segmentStartX, 2) + Math.pow(position.y - segmentStartY, 2)
  );

  const segmentProgress = Math.min(distanceInSegment / segmentLength, 1.0);

  let totalPathLength = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const wp1 = waypoints[i];
    const wp2 = waypoints[i + 1];
    totalPathLength += Math.sqrt(
      Math.pow(wp2.x - wp1.x, 2) + Math.pow(wp2.y - wp1.y, 2)
    );
  }

  let distanceTraveled = 0;
  for (let i = 0; i < waypointIndex; i++) {
    const wp1 = waypoints[i];
    const wp2 = waypoints[i + 1];
    distanceTraveled += Math.sqrt(
      Math.pow(wp2.x - wp1.x, 2) + Math.pow(wp2.y - wp1.y, 2)
    );
  }

  distanceTraveled += segmentProgress * segmentLength;

  return distanceTraveled / totalPathLength;
}

/**
 * Move an entity along the path
 * @param currentPosition - Current position
 * @param waypointIndex - Current waypoint index
 * @param speed - Movement speed
 * @param deltaTime - Time delta
 * @param waypoints - Optional waypoints array (defaults to WAYPOINTS constant)
 */
export function moveAlongPath(
  currentPosition: Position,
  waypointIndex: number,
  speed: number,
  deltaTime: number,
  waypoints: readonly Position[] = WAYPOINTS
): { newPosition: Position; newWaypointIndex: number; reachedEnd: boolean } {
  if (waypointIndex >= waypoints.length - 1) {
    return {
      newPosition: currentPosition,
      newWaypointIndex: waypointIndex,
      reachedEnd: true,
    };
  }

  const targetWaypoint = waypoints[waypointIndex + 1];
  const dx = targetWaypoint.x - currentPosition.x;
  const dy = targetWaypoint.y - currentPosition.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const moveDistance = speed * deltaTime;

  if (moveDistance >= distance) {
    const remainingDistance = moveDistance - distance;
    const nextWaypointIndex = waypointIndex + 1;

    if (nextWaypointIndex >= waypoints.length - 1) {
      return {
        newPosition: { x: targetWaypoint.x, y: targetWaypoint.y },
        newWaypointIndex: nextWaypointIndex,
        reachedEnd: true,
      };
    }

    const nextTarget = waypoints[nextWaypointIndex + 1];
    const nextDx = nextTarget.x - targetWaypoint.x;
    const nextDy = nextTarget.y - targetWaypoint.y;
    const nextDistance = Math.sqrt(nextDx * nextDx + nextDy * nextDy);

    const nextProgress = Math.min(remainingDistance / nextDistance, 1.0);

    return {
      newPosition: {
        x: targetWaypoint.x + nextDx * nextProgress,
        y: targetWaypoint.y + nextDy * nextProgress,
      },
      newWaypointIndex: nextWaypointIndex,
      reachedEnd: false,
    };
  }

  const progress = moveDistance / distance;

  return {
    newPosition: {
      x: currentPosition.x + dx * progress,
      y: currentPosition.y + dy * progress,
    },
    newWaypointIndex: waypointIndex,
    reachedEnd: false,
  };
}

export function getDistance(pos1: Position, pos2: Position): number {
  return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
}
