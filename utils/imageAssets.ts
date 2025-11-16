/**
 * Image asset paths for game graphics
 * 
 * Place your generated images in the corresponding folders:
 * - assets/images/towers/ - tower sprites
 * - assets/images/enemies/ - enemy sprites
 * - assets/images/projectiles/ - projectile sprites
 * - assets/images/map/ - map textures
 * - assets/images/ui/ - UI elements
 * - assets/images/effects/ - visual effects
 * - assets/images/icons/ - icons
 * 
 * If images don't exist, the code will fallback to SVG rendering.
 */

// Tower images
export const TOWER_IMAGES = {
  lookoutPost: {
    level1: require("@/assets/images/towers/lookout-post-level-1.png"),
    level2: require("@/assets/images/towers/lookout-post-level-2.png"),
    level3: require("@/assets/images/towers/lookout-post-level-3.png"),
  },
} as const;

// Enemy images
export const ENEMY_IMAGES = {
  shambler: require("@/assets/images/enemies/shambler.png"),
  runner: require("@/assets/images/enemies/runner.png"),
  brute: require("@/assets/images/enemies/brute.png"),
} as const;

// Projectile images
export const PROJECTILE_IMAGES = {
  arrow: require("@/assets/images/projectiles/arrow.png"),
} as const;

// Map images
export const MAP_IMAGES = {
  groundTile: require("@/assets/images/map/ground-tile.png"),
  pathTexture: require("@/assets/images/map/path-texture.png"), // Fallback
  pathStraightHorizontal: require("@/assets/images/map/path-straight-horizontal.png"),
  pathStraightVertical: require("@/assets/images/map/path-straight-vertical.png"),
  pathCornerTopLeft: require("@/assets/images/map/path-corner-top-left.png"),
  pathCornerTopRight: require("@/assets/images/map/path-corner-top-right.png"),
  pathCornerBottomLeft: require("@/assets/images/map/path-corner-bottom-left.png"),
  pathCornerBottomRight: require("@/assets/images/map/path-corner-bottom-right.png"),
  background: require("@/assets/images/map/background.png"),
  constructionSpot: require("@/assets/images/map/construction-spot.png"),
  startWaypoint: require("@/assets/images/map/start-waypoint.png"),
  endWaypoint: require("@/assets/images/map/end-waypoint.png"),
} as const;

// UI images
export const UI_IMAGES = {
  buttonBg: require("@/assets/images/ui/button-bg.png"),
  panelBg: require("@/assets/images/ui/panel-bg.png"),
  scrapIcon: require("@/assets/images/ui/scrap-icon.png"),
  mainMenuBackground: require("@/assets/images/ui/main-menu-background.png"),
} as const;

// Effect images (optional)
export const EFFECT_IMAGES = {
  explosion: require("@/assets/images/effects/explosion-sprite-sheet.png"),
  hitEffect: require("@/assets/images/effects/hit-effect.png"),
} as const;

// Helper functions
export function getTowerImage(towerType: string, level: number): any {
  if (towerType === "tower_lookout_post") {
    switch (level) {
      case 1:
        return TOWER_IMAGES.lookoutPost.level1;
      case 2:
        return TOWER_IMAGES.lookoutPost.level2;
      case 3:
        return TOWER_IMAGES.lookoutPost.level3;
      default:
        return TOWER_IMAGES.lookoutPost.level1;
    }
  }
  return TOWER_IMAGES.lookoutPost.level1;
}

export function hasTowerImages(): boolean {
  return !!(
    TOWER_IMAGES.lookoutPost.level1 &&
    TOWER_IMAGES.lookoutPost.level2 &&
    TOWER_IMAGES.lookoutPost.level3
  );
}

export function getEnemyImage(enemyType: string): any {
  switch (enemyType) {
    case "shambler":
      return ENEMY_IMAGES.shambler;
    case "runner":
      return ENEMY_IMAGES.runner;
    case "brute":
      return ENEMY_IMAGES.brute;
    default:
      return ENEMY_IMAGES.shambler;
  }
}

export function hasEnemyImages(): boolean {
  return !!(ENEMY_IMAGES.shambler && ENEMY_IMAGES.runner && ENEMY_IMAGES.brute);
}

export function getProjectileImage(): any {
  return PROJECTILE_IMAGES.arrow;
}

export function hasProjectileImage(): boolean {
  return !!PROJECTILE_IMAGES.arrow;
}

export function hasMapImages(): boolean {
  return !!(
    MAP_IMAGES.groundTile &&
    MAP_IMAGES.pathTexture &&
    MAP_IMAGES.background
  );
}

export function hasConstructionSpotImage(): boolean {
  return !!MAP_IMAGES.constructionSpot;
}

export function hasWaypointImages(): boolean {
  return !!(MAP_IMAGES.startWaypoint && MAP_IMAGES.endWaypoint);
}

export function hasPathTextures(): boolean {
  return !!(
    MAP_IMAGES.pathStraightHorizontal &&
    MAP_IMAGES.pathStraightVertical &&
    MAP_IMAGES.pathCornerTopLeft &&
    MAP_IMAGES.pathCornerTopRight &&
    MAP_IMAGES.pathCornerBottomLeft &&
    MAP_IMAGES.pathCornerBottomRight
  );
}

export function getPathTexture(
  prevWaypoint: { x: number; y: number } | null,
  currentWaypoint: { x: number; y: number },
  nextWaypoint: { x: number; y: number } | null
): any {
  // If we don't have specialized textures, use fallback
  if (!hasPathTextures()) {
    return MAP_IMAGES.pathTexture;
  }

  // If no previous or next waypoint, use straight texture
  if (!prevWaypoint || !nextWaypoint) {
    const dx = nextWaypoint ? nextWaypoint.x - currentWaypoint.x : (prevWaypoint ? currentWaypoint.x - prevWaypoint.x : 0);
    const dy = nextWaypoint ? nextWaypoint.y - currentWaypoint.y : (prevWaypoint ? currentWaypoint.y - prevWaypoint.y : 0);
    
    // Determine if horizontal or vertical
    if (Math.abs(dx) > Math.abs(dy)) {
      return MAP_IMAGES.pathStraightHorizontal;
    } else {
      return MAP_IMAGES.pathStraightVertical;
    }
  }

  // Calculate directions
  const prevDx = currentWaypoint.x - prevWaypoint.x;
  const prevDy = currentWaypoint.y - prevWaypoint.y;
  const nextDx = nextWaypoint.x - currentWaypoint.x;
  const nextDy = nextWaypoint.y - currentWaypoint.y;

  // Check if it's a corner (change in direction)
  // Improved logic: check if previous movement was purely horizontal/vertical and next is purely vertical/horizontal
  const isPrevHorizontal = Math.abs(prevDx) > Math.abs(prevDy);
  const isNextHorizontal = Math.abs(nextDx) > Math.abs(nextDy);
  const isCorner = isPrevHorizontal !== isNextHorizontal;

  if (!isCorner) {
    // Straight segment - determine horizontal or vertical
    if (Math.abs(nextDx) > Math.abs(nextDy)) {
      return MAP_IMAGES.pathStraightHorizontal;
    } else {
      return MAP_IMAGES.pathStraightVertical;
    }
  }

  // It's a corner - determine which type
  // Previous direction: up (dy < 0), down (dy > 0), left (dx < 0), right (dx > 0)
  // Next direction: up (dy < 0), down (dy > 0), left (dx < 0), right (dx > 0)
  
  if (prevDy < 0 && nextDx < 0) {
    // Coming from top, turning left
    return MAP_IMAGES.pathCornerTopLeft;
  } else if (prevDy < 0 && nextDx > 0) {
    // Coming from top, turning right
    return MAP_IMAGES.pathCornerTopRight;
  } else if (prevDy > 0 && nextDx < 0) {
    // Coming from bottom, turning left
    return MAP_IMAGES.pathCornerBottomLeft;
  } else if (prevDy > 0 && nextDx > 0) {
    // Coming from bottom, turning right
    return MAP_IMAGES.pathCornerBottomRight;
  } else if (prevDx < 0 && nextDy < 0) {
    // Coming from left, turning up
    return MAP_IMAGES.pathCornerTopLeft;
  } else if (prevDx < 0 && nextDy > 0) {
    // Coming from left, turning down
    return MAP_IMAGES.pathCornerBottomLeft;
  } else if (prevDx > 0 && nextDy < 0) {
    // Coming from right, turning up
    return MAP_IMAGES.pathCornerTopRight;
  } else if (prevDx > 0 && nextDy > 0) {
    // Coming from right, turning down
    return MAP_IMAGES.pathCornerBottomRight;
  }

  // Fallback to straight horizontal
  return MAP_IMAGES.pathStraightHorizontal;
}

export function hasMainMenuBackground(): boolean {
  return !!UI_IMAGES.mainMenuBackground;
}
