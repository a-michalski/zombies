#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'images');

// Maximum file sizes for different asset types (in bytes)
const SIZE_LIMITS = {
  towers: 50 * 1024,      // 50KB per tower
  enemies: 20 * 1024,     // 20KB per enemy
  projectiles: 5 * 1024,  // 5KB per projectile
  effects: 10 * 1024,     // 10KB per effect
  ui: 500 * 1024,         // 500KB per UI element
  'ui/main-menu-background.png': 1 * 1024 * 1024, // 1MB for background (special case)
  map: 1 * 1024 * 1024,   // 1MB for map elements
};

// Required assets from imageAssets.ts
const REQUIRED_ASSETS = {
  towers: [
    'towers/lookout-post-level-1.png',
    'towers/lookout-post-level-2.png',
    'towers/lookout-post-level-3.png',
  ],
  enemies: [
    'enemies/shambler.png',
    'enemies/runner.png',
    'enemies/brute.png',
  ],
  projectiles: [
    'projectiles/arrow.png',
  ],
  map: [
    'map/ground-tile.png',
    'map/path-texture.png',
    'map/path-straight-horizontal.png',
    'map/path-straight-vertical.png',
    'map/path-corner-top-left.png',
    'map/path-corner-top-right.png',
    'map/path-corner-bottom-left.png',
    'map/path-corner-bottom-right.png',
    'map/background.png',
    'map/construction-spot.png',
    'map/start-waypoint.png',
    'map/end-waypoint.png',
  ],
  ui: [
    'ui/button-bg.png',
    'ui/panel-bg.png',
    'ui/scrap-icon.png',
    'ui/main-menu-background.png',
  ],
  effects: [
    'effects/explosion-sprite-sheet.png',
    'effects/hit-effect.png',
  ],
};

// Known non-asset files (exclude from unused files check)
const KNOWN_FILES = [
  'favicon.png',
  'icon.png',
  'splash-icon.png',
  'adaptive-icon.png',
];

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

function getMaxSize(relativePath) {
  // Check for specific file override
  if (SIZE_LIMITS[relativePath]) {
    return SIZE_LIMITS[relativePath];
  }

  // Check category
  for (const [category, limit] of Object.entries(SIZE_LIMITS)) {
    if (relativePath.startsWith(category + '/')) {
      return limit;
    }
  }

  return null;
}

function validateAssets() {
  console.log('🔍 Asset Validation Tool\n');
  console.log('='.repeat(60));

  let issues = 0;
  let warnings = 0;

  // 1. Check required assets exist
  console.log('\n📋 Checking required assets...\n');

  const allRequiredAssets = [];
  for (const [category, assets] of Object.entries(REQUIRED_ASSETS)) {
    for (const asset of assets) {
      allRequiredAssets.push(asset);
      const assetPath = path.join(ASSETS_DIR, asset);

      if (!fs.existsSync(assetPath)) {
        console.log(`❌ MISSING: ${asset}`);
        issues++;
      } else {
        const stats = fs.statSync(assetPath);
        const maxSize = getMaxSize(asset);

        if (maxSize && stats.size > maxSize) {
          console.log(`⚠️  TOO LARGE: ${asset} (${formatBytes(stats.size)} > ${formatBytes(maxSize)})`);
          warnings++;
        } else {
          console.log(`✅ ${asset} (${formatBytes(stats.size)})`);
        }
      }
    }
  }

  // 2. Check for unused files
  console.log('\n🗑️  Checking for unused files...\n');

  function findAllPNGs(dir, relativePath = '') {
    const files = [];
    const entries = fs.readdirSync(dir);

    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const relPath = relativePath ? path.join(relativePath, entry) : entry;
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip _sources directory
        if (entry === '_sources') continue;
        files.push(...findAllPNGs(fullPath, relPath));
      } else if (entry.endsWith('.png')) {
        files.push(relPath);
      }
    }

    return files;
  }

  const allPNGs = findAllPNGs(ASSETS_DIR);
  const unusedFiles = allPNGs.filter(file => {
    // Check if it's a required asset
    if (allRequiredAssets.includes(file)) return false;
    // Check if it's a known file
    if (KNOWN_FILES.includes(file)) return false;
    return true;
  });

  if (unusedFiles.length > 0) {
    console.log(`Found ${unusedFiles.length} potentially unused files:\n`);
    unusedFiles.forEach(file => {
      const stats = fs.statSync(path.join(ASSETS_DIR, file));
      console.log(`⚠️  ${file} (${formatBytes(stats.size)})`);
      warnings++;
    });
  } else {
    console.log('✅ No unused files found');
  }

  // 3. Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Validation Summary\n');

  const totalAssets = allRequiredAssets.length;
  const existingAssets = totalAssets - issues;

  console.log(`Total required assets: ${totalAssets}`);
  console.log(`  ✅ Present: ${existingAssets}`);
  console.log(`  ❌ Missing: ${issues}`);
  console.log('');
  console.log(`Issues found: ${issues}`);
  console.log(`Warnings: ${warnings}`);
  console.log('='.repeat(60));

  if (issues > 0) {
    console.log('\n❌ Validation failed with critical issues');
    process.exit(1);
  } else if (warnings > 0) {
    console.log('\n⚠️  Validation passed with warnings');
    process.exit(0);
  } else {
    console.log('\n✅ All validations passed!');
    process.exit(0);
  }
}

validateAssets();
