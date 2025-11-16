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

function processTowerImage(sourceFile, level) {
  const sourcePath = path.join(ASSETS_DIR, sourceFile);
  const targetPath = path.join(TOWERS_DIR, `lookout-post-level-${level}.png`);
  
  if (!fs.existsSync(sourcePath)) {
    console.log(`⚠️  ${sourceFile} - Not found`);
    return false;
  }
  
  // Backup existing image
  if (fs.existsSync(targetPath)) {
    const backupPath = path.join(TOWERS_DIR, `lookout-post-level-${level}.png.backup`);
    fs.copyFileSync(targetPath, backupPath);
    console.log(`📦 Backed up existing level ${level} image`);
  }
  
  // Resize and copy
  if (resizeImage(sourcePath, targetPath, TOWER_SIZE, TOWER_SIZE)) {
    console.log(`✅ Processed level ${level} image: ${sourceFile} -> lookout-post-level-${level}.png (${TOWER_SIZE}x${TOWER_SIZE})`);
    return true;
  } else {
    console.log(`❌ Failed to process ${sourceFile}`);
    return false;
  }
}

// Check for new images in the main assets/images folder
function findNewTowerImages() {
  const files = fs.readdirSync(ASSETS_DIR)
    .filter(f => {
      const ext = path.extname(f).toLowerCase();
      return (ext === '.png' || ext === '.jpg' || ext === '.jpeg') && 
             !f.startsWith('.') &&
             !fs.statSync(path.join(ASSETS_DIR, f)).isDirectory();
    });
  
  return files;
}

console.log('🔍 Looking for new tower images...\n');

const newImages = findNewTowerImages();

if (newImages.length === 0) {
  console.log('ℹ️  No new images found in assets/images/');
  console.log('\n📝 Usage:');
  console.log('   1. Place your tower image files in assets/images/');
  console.log('   2. Name them: tower-level-1.png, tower-level-2.png, tower-level-3.png');
  console.log('   3. Or run: node scripts/process-tower-images.js <level1> <level2> <level3>');
  console.log('\n   Example: node scripts/process-tower-images.js new-tower-1.png new-tower-2.png new-tower-3.png');
} else {
  console.log(`Found ${newImages.length} image(s):`);
  newImages.forEach(f => console.log(`  - ${f}`));
  console.log('\n💡 If these are tower images, rename them to:');
  console.log('   tower-level-1.png, tower-level-2.png, tower-level-3.png');
  console.log('   Then run this script again, or use:');
  console.log('   node scripts/process-tower-images.js <level1> <level2> <level3>');
}

// Process command line arguments if provided
const args = process.argv.slice(2);
if (args.length > 0) {
  console.log('\n🔄 Processing provided images...\n');
  args.forEach((file, index) => {
    const level = index + 1;
    if (level <= 3) {
      processTowerImage(file, level);
    }
  });
  console.log('\n✨ Done!');
}

