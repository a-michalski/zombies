#!/usr/bin/env node

/**
 * Manual image organization script
 * This will help identify and organize images based on analysis
 */

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
  effects: path.join(ASSETS_DIR, 'effects'),
  icons: path.join(ASSETS_DIR, 'icons'),
};

const KNOWN_FILES = ['adaptive-icon.png', 'favicon.png', 'icon.png', 'splash-icon.png'];

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

// Smart identification based on patterns
function identifyImage(filename, filePath, width, height) {
  const lowerName = filename.toLowerCase();
  const size = width && height ? `${width}x${height}` : 'unknown';
  
  // High-res square images (1024x1024) - likely towers or enemies
  if (width === 1024 && height === 1024) {
    // These need visual inspection, but we can make educated guesses
    // Based on file size and order, we'll organize them
    return { type: 'needs_inspection', category: 'square_1024', size };
  }
  
  // Wide images (1536x1024) - likely map backgrounds or UI panels
  if (width === 1536 && height === 1024) {
    return { type: 'map_or_ui', category: 'wide', size, suggestion: 'map/background.png or ui/panel-bg.png' };
  }
  
  // Tall images (1024x1536) - might be UI elements
  if (width === 1024 && height === 1536) {
    return { type: 'ui_or_map', category: 'tall', size, suggestion: 'ui/panel-bg.png or map/background.png' };
  }
  
  return { type: 'unknown', category: 'other', size };
}

function organizeImages() {
  console.log('🔍 Analyzing and organizing images...\n');
  
  // Ensure folders exist
  Object.values(TARGET_FOLDERS).forEach(folder => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  });
  
  const files = fs.readdirSync(ASSETS_DIR)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg'].includes(ext) && !KNOWN_FILES.includes(file);
    })
    .sort(); // Sort for consistent ordering
  
  if (files.length === 0) {
    console.log('❌ No images found\n');
    return;
  }
  
  console.log(`📦 Found ${files.length} image(s)\n`);
  console.log('='.repeat(80));
  
  // Group by size for better organization
  const bySize = {};
  files.forEach(file => {
    const filePath = path.join(ASSETS_DIR, file);
    const size = getImageSize(filePath);
    const key = size ? `${size.width}x${size.height}` : 'unknown';
    if (!bySize[key]) bySize[key] = [];
    bySize[key].push({ file, filePath, size });
  });
  
  // Organize 1024x1024 images (likely towers or enemies)
  // We'll assign them in order: 3 towers (level 1, 2, 3), then 3 enemies
  if (bySize['1024x1024']) {
    const square1024 = bySize['1024x1024'];
    console.log(`\n📐 Organizing ${square1024.length} square 1024x1024 images...`);
    
    // First 3 = towers (level 1, 2, 3)
    const towers = square1024.slice(0, 3);
    towers.forEach((item, index) => {
      const targetName = `lookout-post-level-${index + 1}.png`;
      const targetPath = path.join(TARGET_FOLDERS.towers, targetName);
      
      if (!fs.existsSync(targetPath)) {
        try {
          fs.renameSync(item.filePath, targetPath);
          console.log(`  ✅ ${item.file} -> towers/${targetName}`);
        } catch (e) {
          console.log(`  ❌ ${item.file} -> Error: ${e.message}`);
        }
      } else {
        console.log(`  ⚠️  ${item.file} -> towers/${targetName} (target exists, skipping)`);
      }
    });
    
    // Next 3 = enemies (shambler, runner, brute)
    const enemies = square1024.slice(3, 6);
    const enemyNames = ['shambler.png', 'runner.png', 'brute.png'];
    enemies.forEach((item, index) => {
      if (index < enemyNames.length) {
        const targetName = enemyNames[index];
        const targetPath = path.join(TARGET_FOLDERS.enemies, targetName);
        
        if (!fs.existsSync(targetPath)) {
          try {
            fs.renameSync(item.filePath, targetPath);
            console.log(`  ✅ ${item.file} -> enemies/${targetName}`);
          } catch (e) {
            console.log(`  ❌ ${item.file} -> Error: ${e.message}`);
          }
        } else {
          console.log(`  ⚠️  ${item.file} -> enemies/${targetName} (target exists, skipping)`);
        }
      }
    });
    
    // Remaining square images - could be more towers, enemies, or other
    const remaining = square1024.slice(6);
    if (remaining.length > 0) {
      console.log(`\n  ℹ️  ${remaining.length} remaining square images (may need manual review):`);
      remaining.forEach(item => {
        console.log(`     - ${item.file}`);
      });
    }
  }
  
  // Organize wide images (1536x1024) - likely map backgrounds
  if (bySize['1536x1024']) {
    const wide = bySize['1536x1024'];
    console.log(`\n📐 Organizing ${wide.length} wide 1536x1024 images...`);
    
    // First one = map background
    if (wide.length > 0) {
      const item = wide[0];
      const targetPath = path.join(TARGET_FOLDERS.map, 'background.png');
      
      if (!fs.existsSync(targetPath)) {
        try {
          fs.renameSync(item.filePath, targetPath);
          console.log(`  ✅ ${item.file} -> map/background.png`);
        } catch (e) {
          console.log(`  ❌ ${item.file} -> Error: ${e.message}`);
        }
      } else {
        console.log(`  ⚠️  ${item.file} -> map/background.png (target exists, skipping)`);
      }
    }
    
    // Remaining wide images
    const remaining = wide.slice(1);
    if (remaining.length > 0) {
      console.log(`  ℹ️  ${remaining.length} remaining wide images (may need manual review):`);
      remaining.forEach((item, index) => {
        console.log(`     - ${item.file} (could be ui/panel-bg.png or map texture)`);
      });
    }
  }
  
  // Organize tall images (1024x1536)
  if (bySize['1024x1536']) {
    const tall = bySize['1024x1536'];
    console.log(`\n📐 Organizing ${tall.length} tall 1024x1536 images...`);
    
    tall.forEach((item, index) => {
      // Could be UI panel or map background
      const targetName = index === 0 ? 'panel-bg.png' : `panel-bg-${index + 1}.png`;
      const targetPath = path.join(TARGET_FOLDERS.ui, targetName);
      
      if (!fs.existsSync(targetPath)) {
        try {
          fs.renameSync(item.filePath, targetPath);
          console.log(`  ✅ ${item.file} -> ui/${targetName}`);
        } catch (e) {
          console.log(`  ❌ ${item.file} -> Error: ${e.message}`);
        }
      } else {
        console.log(`  ⚠️  ${item.file} -> ui/${targetName} (target exists, skipping)`);
      }
    });
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\n✨ Organization complete!');
  console.log('\n💡 Note: High-res images (1024x1024) will need to be resized to game sizes:');
  console.log('   - Towers: 64x64px');
  console.log('   - Enemies: 48x48px, 44x44px, 64x64px');
  console.log('   - Map background: 640x384px');
  console.log('\n📝 You may need to manually review and adjust some assignments.');
}

organizeImages();

