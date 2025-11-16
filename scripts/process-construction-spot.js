#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'images');
const SOURCE_DIR = path.join(ASSETS_DIR, 'map', 'construction-spot');
const TARGET_PATH = path.join(ASSETS_DIR, 'map', 'construction-spot.png');

const TARGET_SIZE = 32;

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

console.log('🔄 Processing construction spot sprite...\n');

if (!fs.existsSync(SOURCE_DIR)) {
  console.log(`⚠️  Folder ${SOURCE_DIR} does not exist`);
  console.log('📝 Create the folder and place your image there first');
  process.exit(1);
}

// Find first image in the source folder
const files = fs.readdirSync(SOURCE_DIR)
  .filter(f => {
    const ext = path.extname(f).toLowerCase();
    return (ext === '.png' || ext === '.jpg' || ext === '.jpeg');
  });

if (files.length === 0) {
  console.log(`⚠️  No images found in ${SOURCE_DIR}`);
  console.log('📝 Place your construction spot image in the folder first');
  process.exit(1);
}

const sourceFile = files[0];
const sourcePath = path.join(SOURCE_DIR, sourceFile);

console.log(`📦 Processing: ${sourceFile}`);

// Backup existing image
if (fs.existsSync(TARGET_PATH)) {
  const backupPath = path.join(ASSETS_DIR, 'map', 'construction-spot.png.backup');
  fs.copyFileSync(TARGET_PATH, backupPath);
  console.log(`   Backed up existing image`);
}

// Resize and copy
if (resizeImage(sourcePath, TARGET_PATH, TARGET_SIZE, TARGET_SIZE)) {
  console.log(`✅ Created construction-spot.png (${TARGET_SIZE}x${TARGET_SIZE})`);
  console.log('\n💡 Image is ready to use in the game!');
} else {
  console.log(`❌ Failed to process ${sourceFile}`);
  console.log('💡 Make sure you have sips (macOS) or ImageMagick installed');
  process.exit(1);
}

