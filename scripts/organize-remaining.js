#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'images');
const TARGET_FOLDERS = {
  towers: path.join(ASSETS_DIR, 'towers'),
  enemies: path.join(ASSETS_DIR, 'enemies'),
  projectiles: path.join(ASSETS_DIR, 'projectiles'),
  map: path.join(ASSETS_DIR, 'map'),
  ui: path.join(ASSETS_DIR, 'ui'),
};

function getImageSize(filePath) {
  try {
    const output = execSync(`sips -g pixelWidth -g pixelHeight "${filePath}" 2>/dev/null`, { encoding: 'utf8' });
    const widthMatch = output.match(/pixelWidth:\s*(\d+)/);
    const heightMatch = output.match(/pixelHeight:\s*(\d+)/);
    if (widthMatch && heightMatch) {
      return { width: parseInt(widthMatch[1]), height: parseInt(heightMatch[1]) };
    }
  } catch (e) {}
  return null;
}

function organizeRemaining() {
  const files = fs.readdirSync(ASSETS_DIR)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg'].includes(ext) && 
             !['adaptive-icon.png', 'favicon.png', 'icon.png', 'splash-icon.png'].includes(file);
    })
    .map(file => ({
      file,
      filePath: path.join(ASSETS_DIR, file),
      size: getImageSize(path.join(ASSETS_DIR, file)),
    }))
    .filter(item => item.size); // Only files we can read
  
  console.log(`📦 Organizing ${files.length} remaining images...\n`);
  
  // Group by size
  const wide = files.filter(f => f.size.width === 1536 && f.size.height === 1024);
  const square = files.filter(f => f.size.width === 1024 && f.size.height === 1024);
  const tall = files.filter(f => f.size.width === 1024 && f.size.height === 1536);
  
  // Organize wide images (1536x1024) - map textures or UI
  console.log('📐 Wide images (1536x1024):');
  if (wide.length > 0) {
    // First remaining = ground-tile (but needs to be 64x64, so this might be source)
    if (wide.length >= 1) {
      const item = wide[0];
      const target = path.join(TARGET_FOLDERS.map, 'ground-tile-source.png');
      if (!fs.existsSync(target)) {
        fs.renameSync(item.filePath, target);
        console.log(`  ✅ ${item.file} -> map/ground-tile-source.png`);
      }
    }
    // Second = path-texture source
    if (wide.length >= 2) {
      const item = wide[1];
      const target = path.join(TARGET_FOLDERS.map, 'path-texture-source.png');
      if (!fs.existsSync(target)) {
        fs.renameSync(item.filePath, target);
        console.log(`  ✅ ${item.file} -> map/path-texture-source.png`);
      }
    }
    // Rest = UI panels
    wide.slice(2).forEach((item, index) => {
      const target = path.join(TARGET_FOLDERS.ui, `panel-bg-${index + 2}.png`);
      if (!fs.existsSync(target)) {
        fs.renameSync(item.filePath, target);
        console.log(`  ✅ ${item.file} -> ui/panel-bg-${index + 2}.png`);
      }
    });
  }
  
  // Organize square images (1024x1024) - could be additional towers, enemies, or UI icons
  console.log('\n📐 Square images (1024x1024):');
  if (square.length > 0) {
    // First few = UI elements (button, scrap icon, etc.)
    const uiTargets = ['button-bg.png', 'scrap-icon.png'];
    square.slice(0, Math.min(uiTargets.length, square.length)).forEach((item, index) => {
      const targetName = uiTargets[index];
      const target = path.join(TARGET_FOLDERS.ui, targetName);
      if (!fs.existsSync(target)) {
        fs.renameSync(item.filePath, target);
        console.log(`  ✅ ${item.file} -> ui/${targetName}`);
      }
    });
    
    // Remaining = could be additional towers/enemies or effects
    const remaining = square.slice(uiTargets.length);
    if (remaining.length > 0) {
      console.log(`  ℹ️  ${remaining.length} remaining (storing as extras):`);
      remaining.forEach((item, index) => {
        const target = path.join(ASSETS_DIR, `extra-${index + 1}.png`);
        if (!fs.existsSync(target)) {
          fs.renameSync(item.filePath, target);
          console.log(`     ${item.file} -> extra-${index + 1}.png (needs manual review)`);
        }
      });
    }
  }
  
  // Organize tall images
  console.log('\n📐 Tall images (1024x1536):');
  if (tall.length > 0) {
    tall.forEach((item, index) => {
      const target = path.join(TARGET_FOLDERS.ui, `panel-bg-tall-${index + 1}.png`);
      if (!fs.existsSync(target)) {
        fs.renameSync(item.filePath, target);
        console.log(`  ✅ ${item.file} -> ui/panel-bg-tall-${index + 1}.png`);
      }
    });
  }
  
  console.log('\n✨ Done!');
  console.log('\n💡 Note: High-res images need to be resized to game sizes.');
  console.log('   Run: node scripts/resize-images.js (if available)');
}

organizeRemaining();

