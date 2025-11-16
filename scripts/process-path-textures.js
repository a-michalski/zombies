#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'images', 'map');
const TARGET_SIZE = 64;

const TEXTURES = [
  { name: 'path-straight-horizontal', sourceDir: 'path-straight-horizontal-source' },
  { name: 'path-straight-vertical', sourceDir: 'path-straight-vertical-source' },
  { name: 'path-corner-top-left', sourceDir: 'path-corner-top-left-source' },
  { name: 'path-corner-top-right', sourceDir: 'path-corner-top-right-source' },
  { name: 'path-corner-bottom-left', sourceDir: 'path-corner-bottom-left-source' },
  { name: 'path-corner-bottom-right', sourceDir: 'path-corner-bottom-right-source' },
];

function resizeImage(sourcePath, targetPath, width, height) {
  try {
    execSync(`sips -z ${height} ${width} "${sourcePath}" --out "${targetPath}" 2>/dev/null`, { stdio: 'ignore' });
    return true;
  } catch (e1) {
    try {
      execSync(`magick convert "${sourcePath}" -resize ${width}x${height}! "${targetPath}" 2>/dev/null`, { stdio: 'ignore' });
      return true;
    } catch (e2) {
      return false;
    }
  }
}

console.log('🔄 Processing path textures...\n');

TEXTURES.forEach(({ name, sourceDir }) => {
  const SOURCE_DIR = path.join(ASSETS_DIR, sourceDir);
  const TARGET_PATH = path.join(ASSETS_DIR, `${name}.png`);

  if (!fs.existsSync(SOURCE_DIR)) {
    console.log(`⚠️  Folder ${sourceDir} does not exist, skipping ${name}`);
    return;
  }

  const files = fs.readdirSync(SOURCE_DIR)
    .filter(f => {
      const ext = path.extname(f).toLowerCase();
      return (ext === '.png' || ext === '.jpg' || ext === '.jpeg');
    });

  if (files.length === 0) {
    console.log(`⚠️  No images found in ${sourceDir}, skipping ${name}`);
    return;
  }

  const sourceFile = files[0];
  const sourcePath = path.join(SOURCE_DIR, sourceFile);

  console.log(`📦 Processing ${name}: ${sourceFile}`);

  if (fs.existsSync(TARGET_PATH)) {
    const backupPath = path.join(ASSETS_DIR, `${name}.png.backup`);
    fs.copyFileSync(TARGET_PATH, backupPath);
    console.log(`   Backed up existing image`);
  }

  if (resizeImage(sourcePath, TARGET_PATH, TARGET_SIZE, TARGET_SIZE)) {
    console.log(`✅ Created ${name}.png (${TARGET_SIZE}x${TARGET_SIZE})`);
  } else {
    console.log(`❌ Failed to process ${sourceFile}`);
  }
  console.log('');
});

console.log('💡 All path textures processed!');

