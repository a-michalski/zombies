#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'images');
const TOWERS_DIR = path.join(ASSETS_DIR, 'towers');

// Target size for tower images
const TOWER_SIZE = 64;

function resizeImage(sourcePath, targetPath, width, height) {
  try {
    // Try sips first (macOS)
    execSync(`sips -z ${height} ${width} "${sourcePath}" --out "${targetPath}" 2>/dev/null`, { stdio: 'ignore' });
    return true;
  } catch (e1) {
    try {
      // Try ImageMagick
      execSync(`magick convert "${sourcePath}" -resize ${width}x${height}! "${targetPath}" 2>/dev/null`, { stdio: 'ignore' });
      return true;
    } catch (e2) {
      return false;
    }
  }
}

function processTowerLevel(level) {
  const levelDir = path.join(TOWERS_DIR, `level-${level}`);
  const targetPath = path.join(TOWERS_DIR, `lookout-post-level-${level}.png`);
  
  if (!fs.existsSync(levelDir)) {
    console.log(`⚠️  Folder level-${level} does not exist`);
    return false;
  }
  
  // Find first image in the level folder
  const files = fs.readdirSync(levelDir)
    .filter(f => {
      const ext = path.extname(f).toLowerCase();
      return (ext === '.png' || ext === '.jpg' || ext === '.jpeg');
    });
  
  if (files.length === 0) {
    console.log(`⚠️  No images found in level-${level}/ folder`);
    return false;
  }
  
  const sourceFile = files[0];
  const sourcePath = path.join(levelDir, sourceFile);
  
  console.log(`📦 Processing level ${level}: ${sourceFile}`);
  
  // Backup existing image
  if (fs.existsSync(targetPath)) {
    const backupPath = path.join(TOWERS_DIR, `lookout-post-level-${level}.png.backup`);
    fs.copyFileSync(targetPath, backupPath);
    console.log(`   Backed up existing image`);
  }
  
  // Resize and copy
  if (resizeImage(sourcePath, targetPath, TOWER_SIZE, TOWER_SIZE)) {
    console.log(`✅ Created lookout-post-level-${level}.png (${TOWER_SIZE}x${TOWER_SIZE})`);
    return true;
  } else {
    console.log(`❌ Failed to process ${sourceFile}`);
    return false;
  }
}

console.log('🔄 Processing tower images from level folders...\n');

let processed = 0;
for (let level = 1; level <= 3; level++) {
  if (processTowerLevel(level)) {
    processed++;
  }
  console.log('');
}

if (processed > 0) {
  console.log(`✨ Done! Processed ${processed} level(s).`);
  console.log('\n💡 Images are ready to use in the game!');
} else {
  console.log('ℹ️  No images were processed.');
  console.log('\n📝 Usage:');
  console.log('   1. Place your tower images in:');
  console.log('      - assets/images/towers/level-1/');
  console.log('      - assets/images/towers/level-2/');
  console.log('      - assets/images/towers/level-3/');
  console.log('   2. Run this script again to process them');
}

