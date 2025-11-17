#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'images', 'ui');

function resizeImage(sourcePath, targetPath, width, height) {
  try {
    execSync(`sips -z ${height} ${width} "${sourcePath}" --out "${targetPath}" 2>/dev/null`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function resizeUIImages() {
  console.log('🔄 Resizing UI images...\n');
  
  const files = [
    // panel-bg-2.png and panel-bg-3.png removed - not used in imageAssets.ts
    // Add new UI images here if needed
  ];
  
  files.forEach(({ file, target, width, height }) => {
    const sourcePath = path.join(ASSETS_DIR, file);
    const tempPath = path.join(ASSETS_DIR, `${target}.tmp`);
    
    if (!fs.existsSync(sourcePath)) {
      console.log(`⚠️  ${file} - Not found, skipping`);
      return;
    }
    
    // Check current size
    try {
      const output = execSync(`sips -g pixelWidth -g pixelHeight "${sourcePath}" 2>/dev/null`, { encoding: 'utf8' });
      const widthMatch = output.match(/pixelWidth:\s*(\d+)/);
      const heightMatch = output.match(/pixelHeight:\s*(\d+)/);
      const currentWidth = widthMatch ? parseInt(widthMatch[1]) : null;
      const currentHeight = heightMatch ? parseInt(heightMatch[1]) : null;
      
      if (currentWidth === width && currentHeight === height) {
        console.log(`✅ ${file} - Already correct size (${width}x${height})`);
        return;
      }
      
      if (resizeImage(sourcePath, tempPath, width, height)) {
        fs.renameSync(tempPath, sourcePath);
        console.log(`✅ ${file} - Resized to ${width}x${height}`);
      } else {
        console.log(`❌ ${file} - Failed to resize`);
      }
    } catch (e) {
      console.log(`❌ ${file} - Error: ${e.message}`);
    }
  });
  
  console.log('\n✨ Done!');
}

resizeUIImages();

