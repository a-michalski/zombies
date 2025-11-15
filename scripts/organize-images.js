#!/usr/bin/env node

/**
 * Script to automatically organize game graphics into correct folders
 * 
 * Usage: node scripts/organize-images.js
 * 
 * This script will:
 * 1. Scan assets/images for image files
 * 2. Identify them based on filename patterns, sizes, or content
 * 3. Move them to appropriate folders with correct names
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

// Expected file mappings
const EXPECTED_FILES = {
  // Towers
  'lookout-post-level-1.png': 'towers',
  'lookout-post-level-2.png': 'towers',
  'lookout-post-level-3.png': 'towers',
  'tower-level-1.png': 'towers',
  'tower-level-2.png': 'towers',
  'tower-level-3.png': 'towers',
  'tower1.png': 'towers',
  'tower2.png': 'towers',
  'tower3.png': 'towers',
  
  // Enemies
  'shambler.png': 'enemies',
  'runner.png': 'enemies',
  'brute.png': 'enemies',
  'zombie-slow.png': 'enemies',
  'zombie-fast.png': 'enemies',
  'zombie-heavy.png': 'enemies',
  
  // Projectiles
  'arrow.png': 'projectiles',
  'bolt.png': 'projectiles',
  'projectile.png': 'projectiles',
  
  // Map
  'ground-tile.png': 'map',
  'path-texture.png': 'map',
  'background.png': 'map',
  'tile.png': 'map',
  'path.png': 'map',
  
  // UI
  'button-bg.png': 'ui',
  'panel-bg.png': 'ui',
  'scrap-icon.png': 'ui',
  'button.png': 'ui',
  'panel.png': 'ui',
  'icon-scrap.png': 'ui',
};

// Keywords to identify file types
const KEYWORDS = {
  towers: ['tower', 'lookout', 'post', 'bastion', 'defense'],
  enemies: ['enemy', 'zombie', 'shambler', 'runner', 'brute'],
  projectiles: ['arrow', 'bolt', 'projectile', 'missile'],
  map: ['ground', 'tile', 'path', 'background', 'terrain', 'map'],
  ui: ['button', 'panel', 'ui', 'interface', 'scrap', 'icon'],
  effects: ['explosion', 'effect', 'hit', 'spark', 'smoke'],
};

function getImageSize(filePath) {
  try {
    // Try to get dimensions using identify (ImageMagick) or sips (macOS)
    const output = execSync(`sips -g pixelWidth -g pixelHeight "${filePath}" 2>/dev/null || identify "${filePath}" 2>/dev/null || echo ""`, { encoding: 'utf8' });
    
    // Parse sips output (macOS)
    const widthMatch = output.match(/pixelWidth:\s*(\d+)/);
    const heightMatch = output.match(/pixelHeight:\s*(\d+)/);
    
    if (widthMatch && heightMatch) {
      return { width: parseInt(widthMatch[1]), height: parseInt(heightMatch[1]) };
    }
    
    // Parse identify output (ImageMagick)
    const identifyMatch = output.match(/(\d+)x(\d+)/);
    if (identifyMatch) {
      return { width: parseInt(identifyMatch[1]), height: parseInt(identifyMatch[2]) };
    }
  } catch (e) {
    // Ignore errors
  }
  return null;
}

function identifyFile(filename, filePath) {
  const lowerName = filename.toLowerCase();
  
  // Check exact matches first
  for (const [expectedName, folder] of Object.entries(EXPECTED_FILES)) {
    if (lowerName.includes(expectedName.toLowerCase().replace('.png', ''))) {
      return { folder, targetName: expectedName };
    }
  }
  
  // Check by keywords
  for (const [folder, keywords] of Object.entries(KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerName.includes(keyword)) {
        // Try to determine target name
        let targetName = filename;
        
        if (folder === 'towers') {
          if (lowerName.includes('level-1') || lowerName.includes('1') || lowerName.includes('l1')) {
            targetName = 'lookout-post-level-1.png';
          } else if (lowerName.includes('level-2') || lowerName.includes('2') || lowerName.includes('l2')) {
            targetName = 'lookout-post-level-2.png';
          } else if (lowerName.includes('level-3') || lowerName.includes('3') || lowerName.includes('l3')) {
            targetName = 'lookout-post-level-3.png';
          } else {
            targetName = 'lookout-post-level-1.png'; // Default
          }
        } else if (folder === 'enemies') {
          if (lowerName.includes('shambler') || lowerName.includes('slow')) {
            targetName = 'shambler.png';
          } else if (lowerName.includes('runner') || lowerName.includes('fast')) {
            targetName = 'runner.png';
          } else if (lowerName.includes('brute') || lowerName.includes('heavy')) {
            targetName = 'brute.png';
          }
        } else if (folder === 'projectiles') {
          targetName = 'arrow.png';
        } else if (folder === 'map') {
          if (lowerName.includes('ground') || lowerName.includes('tile')) {
            targetName = 'ground-tile.png';
          } else if (lowerName.includes('path')) {
            targetName = 'path-texture.png';
          } else if (lowerName.includes('background') || lowerName.includes('bg')) {
            targetName = 'background.png';
          }
        } else if (folder === 'ui') {
          if (lowerName.includes('button')) {
            targetName = 'button-bg.png';
          } else if (lowerName.includes('panel')) {
            targetName = 'panel-bg.png';
          } else if (lowerName.includes('scrap')) {
            targetName = 'scrap-icon.png';
          }
        }
        
        return { folder, targetName };
      }
    }
  }
  
  // Try to identify by size
  const size = getImageSize(filePath);
  if (size) {
    // Towers: ~64x64
    if (size.width >= 60 && size.width <= 70 && size.height >= 60 && size.height <= 70) {
      return { folder: 'towers', targetName: 'lookout-post-level-1.png' };
    }
    // Enemies: ~48x48 or 44x44 or 64x64
    if ((size.width >= 40 && size.width <= 50 && size.height >= 40 && size.height <= 50) ||
        (size.width >= 60 && size.width <= 70 && size.height >= 60 && size.height <= 70)) {
      return { folder: 'enemies', targetName: 'shambler.png' };
    }
    // Projectiles: ~16x32
    if (size.width <= 20 && size.height >= 25 && size.height <= 40) {
      return { folder: 'projectiles', targetName: 'arrow.png' };
    }
    // Map tiles: 64x64
    if (size.width === 64 && size.height === 64) {
      return { folder: 'map', targetName: 'ground-tile.png' };
    }
    // UI buttons: ~200x60
    if (size.width >= 180 && size.width <= 220 && size.height >= 50 && size.height <= 70) {
      return { folder: 'ui', targetName: 'button-bg.png' };
    }
  }
  
  return null;
}

function organizeImages() {
  console.log('🔍 Scanning for images...\n');
  
  // Ensure target folders exist
  Object.values(TARGET_FOLDERS).forEach(folder => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  });
  
  // Get all image files in assets/images (excluding known app icons)
  const knownFiles = ['adaptive-icon.png', 'favicon.png', 'icon.png', 'splash-icon.png'];
  const files = fs.readdirSync(ASSETS_DIR)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg'].includes(ext) && !knownFiles.includes(file);
    });
  
  if (files.length === 0) {
    console.log('❌ No image files found in assets/images/');
    console.log('💡 Place your generated images in assets/images/ and run this script again.\n');
    return;
  }
  
  console.log(`📦 Found ${files.length} image file(s):\n`);
  
  const moved = [];
  const skipped = [];
  
  files.forEach(file => {
    const filePath = path.join(ASSETS_DIR, file);
    const identification = identifyFile(file, filePath);
    
    if (!identification) {
      console.log(`⚠️  ${file} - Could not identify, skipping`);
      skipped.push(file);
      return;
    }
    
    const { folder, targetName } = identification;
    const targetDir = TARGET_FOLDERS[folder];
    const targetPath = path.join(targetDir, targetName);
    
    // Check if target already exists
    if (fs.existsSync(targetPath)) {
      console.log(`⚠️  ${file} -> ${folder}/${targetName} - Target exists, skipping`);
      skipped.push(file);
      return;
    }
    
    // Move file
    try {
      fs.renameSync(filePath, targetPath);
      console.log(`✅ ${file} -> ${folder}/${targetName}`);
      moved.push({ from: file, to: `${folder}/${targetName}` });
    } catch (error) {
      console.log(`❌ ${file} -> ${folder}/${targetName} - Error: ${error.message}`);
      skipped.push(file);
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Moved: ${moved.length}`);
  console.log(`   ⚠️  Skipped: ${skipped.length}`);
  
  if (moved.length > 0) {
    console.log(`\n✨ Images organized successfully!`);
  }
  
  if (skipped.length > 0) {
    console.log(`\n💡 To manually organize skipped files, check their names/sizes and move them manually.`);
  }
}

// Run the script
organizeImages();

