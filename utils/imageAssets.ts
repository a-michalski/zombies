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

// Helper to safely require images (returns null if doesn't exist)
function safeRequire(path: string): any {
  try {
    return require(path);
  } catch {
    return null;
  }
}

// Tower images
export const TOWER_IMAGES = {
  lookoutPost: {
    level1: safeRequire("@/assets/images/towers/lookout-post-level-1.png"),
    level2: safeRequire("@/assets/images/towers/lookout-post-level-2.png"),
    level3: safeRequire("@/assets/images/towers/lookout-post-level-3.png"),
  },
} as const;

// Enemy images
export const ENEMY_IMAGES = {
  shambler: safeRequire("@/assets/images/enemies/shambler.png"),
  runner: safeRequire("@/assets/images/enemies/runner.png"),
  brute: safeRequire("@/assets/images/enemies/brute.png"),
} as const;

// Projectile images
export const PROJECTILE_IMAGES = {
  arrow: safeRequire("@/assets/images/projectiles/arrow.png"),
} as const;

// Map images
export const MAP_IMAGES = {
  groundTile: safeRequire("@/assets/images/map/ground-tile.png"),
  pathTexture: safeRequire("@/assets/images/map/path-texture.png"),
  background: safeRequire("@/assets/images/map/background.png"),
} as const;

// UI images
export const UI_IMAGES = {
  buttonBg: safeRequire("@/assets/images/ui/button-bg.png"),
  panelBg: safeRequire("@/assets/images/ui/panel-bg.png"),
  scrapIcon: safeRequire("@/assets/images/ui/scrap-icon.png"),
} as const;

// Effect images (optional)
export const EFFECT_IMAGES = {
  explosion: safeRequire("@/assets/images/effects/explosion-sprite-sheet.png"),
  hitEffect: safeRequire("@/assets/images/effects/hit-effect.png"),
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
