#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'images');
const ENEMIES_DIR = path.join(ASSETS_DIR, 'enemies');

// Target sizes for enemy images
const ENEMY_SIZES = {
  shambler: 48,
  runner: 44,
  brute: 64,
};

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

function processEnemyImage(enemyType) {
  // Handle shambler/shamber naming inconsistency
  let enemyDir = path.join(ENEMIES_DIR, enemyType);
  if (enemyType === 'shambler' && !fs.existsSync(enemyDir)) {
    enemyDir = path.join(ENEMIES_DIR, 'shamber');
  }
  
  const targetPath = path.join(ENEMIES_DIR, `${enemyType}.png`);
  const size = ENEMY_SIZES[enemyType];
  
  if (!fs.existsSync(enemyDir)) {
    console.log(`⚠️  Folder ${enemyType}/ (or shamber/) does not exist`);
    return false;
  }
  
  if (!size) {
    console.log(`⚠️  Unknown enemy type: ${enemyType}`);
    return false;
  }
  
  // Find first image in the enemy folder
  const files = fs.readdirSync(enemyDir)
    .filter(f => {
      const ext = path.extname(f).toLowerCase();
      return (ext === '.png' || ext === '.jpg' || ext === '.jpeg');
    });
  
  if (files.length === 0) {
    console.log(`⚠️  No images found in ${enemyType}/ folder`);
    return false;
  }
  
  const sourceFile = files[0];
  const sourcePath = path.join(enemyDir, sourceFile);
  
  console.log(`📦 Processing ${enemyType}: ${sourceFile}`);
  
  // Backup existing image
  if (fs.existsSync(targetPath)) {
    const backupPath = path.join(ENEMIES_DIR, `${enemyType}.png.backup`);
    fs.copyFileSync(targetPath, backupPath);
    console.log(`   Backed up existing image`);
  }
  
  // Resize and copy
  if (resizeImage(sourcePath, targetPath, size, size)) {
    console.log(`✅ Created ${enemyType}.png (${size}x${size})`);
    return true;
  } else {
    console.log(`❌ Failed to process ${sourceFile}`);
    return false;
  }
}

console.log('🔄 Processing enemy images from enemy folders...\n');

const enemyTypes = ['shambler', 'runner', 'brute'];
let processed = 0;

enemyTypes.forEach(enemyType => {
  if (processEnemyImage(enemyType)) {
    processed++;
  }
  console.log('');
});

if (processed > 0) {
  console.log(`✨ Done! Processed ${processed} enemy type(s).`);
  console.log('\n💡 Images are ready to use in the game!');
} else {
  console.log('ℹ️  No images were processed.');
  console.log('\n📝 Usage:');
  console.log('   1. Place your enemy images in:');
  console.log('      - assets/images/enemies/shamber/ (or shambler/)');
  console.log('      - assets/images/enemies/runner/');
  console.log('      - assets/images/enemies/brute/');
  console.log('   2. Run this script again to process them');
}

