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
  pathTexture: require("@/assets/images/map/path-texture.png"),
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
} as const;

// Effect images (optional)
export const EFFECT_IMAGES = {
  explosion: require("@/assets/images/effects/explosion-sprite-sheet.png"),
  hitEffect: require("@/assets/images/effects/hit-effect.png"),
} as const;

// Helper functions
export function getTowerImage(towerType: string, level: number): any {
  if (__DEV__) {
    console.log("getTowerImage called:", { towerType, level });
  }
  if (towerType === "tower_lookout_post") {
    switch (level) {
      case 1:
        const img1 = TOWER_IMAGES.lookoutPost.level1;
        if (__DEV__) {
          console.log("Returning level1 image:", img1);
        }
        return img1;
      case 2:
        const img2 = TOWER_IMAGES.lookoutPost.level2;
        if (__DEV__) {
          console.log("Returning level2 image:", img2);
        }
        return img2;
      case 3:
        const img3 = TOWER_IMAGES.lookoutPost.level3;
        if (__DEV__) {
          console.log("Returning level3 image:", img3);
        }
        return img3;
      default:
        const imgDefault = TOWER_IMAGES.lookoutPost.level1;
        if (__DEV__) {
          console.log("Returning default level1 image:", imgDefault);
        }
        return imgDefault;
    }
  }
  const imgFallback = TOWER_IMAGES.lookoutPost.level1;
  if (__DEV__) {
    console.log("Returning fallback level1 image:", imgFallback);
  }
  return imgFallback;
}

export function hasTowerImages(): boolean {
  const hasAll = !!(
    TOWER_IMAGES.lookoutPost.level1 &&
    TOWER_IMAGES.lookoutPost.level2 &&
    TOWER_IMAGES.lookoutPost.level3
  );
  if (__DEV__) {
    console.log("hasTowerImages:", hasAll, {
      level1: !!TOWER_IMAGES.lookoutPost.level1,
      level2: !!TOWER_IMAGES.lookoutPost.level2,
      level3: !!TOWER_IMAGES.lookoutPost.level3,
    });
  }
  return hasAll;
}

export function getEnemyImage(enemyType: string): any {
  if (__DEV__) {
    console.log("getEnemyImage called:", { enemyType });
  }
  switch (enemyType) {
    case "shambler":
      const shamblerImg = ENEMY_IMAGES.shambler;
      if (__DEV__) {
        console.log("Returning shambler image:", shamblerImg);
      }
      return shamblerImg;
    case "runner":
      const runnerImg = ENEMY_IMAGES.runner;
      if (__DEV__) {
        console.log("Returning runner image:", runnerImg);
      }
      return runnerImg;
    case "brute":
      const bruteImg = ENEMY_IMAGES.brute;
      if (__DEV__) {
        console.log("Returning brute image:", bruteImg);
      }
      return bruteImg;
    default:
      const defaultImg = ENEMY_IMAGES.shambler;
      if (__DEV__) {
        console.log("Returning default shambler image:", defaultImg);
      }
      return defaultImg;
  }
}

export function hasEnemyImages(): boolean {
  const hasAll = !!(ENEMY_IMAGES.shambler && ENEMY_IMAGES.runner && ENEMY_IMAGES.brute);
  if (__DEV__) {
    console.log("hasEnemyImages:", hasAll, {
      shambler: !!ENEMY_IMAGES.shambler,
      runner: !!ENEMY_IMAGES.runner,
      brute: !!ENEMY_IMAGES.brute,
    });
  }
  return hasAll;
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
