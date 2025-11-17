#!/usr/bin/env node

/**
 * Resize high-resolution images to game sizes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'images');

// Resize targets
const RESIZE_TARGETS = {
  // Towers: 1024x1024 -> 64x64
  'towers/lookout-post-level-1.png': { width: 64, height: 64 },
  'towers/lookout-post-level-2.png': { width: 64, height: 64 },
  'towers/lookout-post-level-3.png': { width: 64, height: 64 },
  
  // Enemies: 1024x1024 -> appropriate sizes
  'enemies/shambler.png': { width: 48, height: 48 },
  'enemies/runner.png': { width: 44, height: 44 },
  'enemies/brute.png': { width: 64, height: 64 },
  
  // Map: 1536x1024 -> 640x384 (background)
  'map/background.png': { width: 640, height: 384 },
  
  // Map textures: need to be created from sources (64x64)
  // 'map/ground-tile.png': { width: 64, height: 64 },
  // 'map/path-texture.png': { width: 64, height: 64 },
  
  // UI: various sizes
  'ui/button-bg.png': { width: 200, height: 60 },
  'ui/panel-bg.png': { width: 400, height: 300 },
  'ui/scrap-icon.png': { width: 32, height: 32 },
};

function resizeImage(sourcePath, targetPath, width, height) {
  try {
    // Use sips (macOS) to resize
    execSync(`sips -z ${height} ${width} "${sourcePath}" --out "${targetPath}" 2>/dev/null`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    // Fallback: try ImageMagick if available
    try {
      execSync(`convert "${sourcePath}" -resize ${width}x${height} "${targetPath}" 2>/dev/null`, { stdio: 'ignore' });
      return true;
    } catch (e2) {
      return false;
    }
  }
}

function resizeImages() {
  console.log('🔄 Resizing images to game sizes...\n');
  
  let success = 0;
  let failed = 0;
  
  Object.entries(RESIZE_TARGETS).forEach(([relativePath, size]) => {
    const sourcePath = path.join(ASSETS_DIR, relativePath);
    const targetPath = path.join(ASSETS_DIR, relativePath.replace('.png', '-resized.png'));
    
    if (!fs.existsSync(sourcePath)) {
      console.log(`⚠️  ${relativePath} - Source not found, skipping`);
      return;
    }
    
    // Check current size
    try {
      const output = execSync(`sips -g pixelWidth -g pixelHeight "${sourcePath}" 2>/dev/null`, { encoding: 'utf8' });
      const widthMatch = output.match(/pixelWidth:\s*(\d+)/);
      const heightMatch = output.match(/pixelHeight:\s*(\d+)/);
      const currentWidth = widthMatch ? parseInt(widthMatch[1]) : null;
      const currentHeight = heightMatch ? parseInt(heightMatch[1]) : null;
      
      if (currentWidth === size.width && currentHeight === size.height) {
        console.log(`✅ ${relativePath} - Already correct size (${size.width}x${size.height})`);
        return;
      }
      
      if (resizeImage(sourcePath, targetPath, size.width, size.height)) {
        // Replace original with resized
        fs.renameSync(targetPath, sourcePath);
        console.log(`✅ ${relativePath} - Resized to ${size.width}x${size.height}`);
        success++;
      } else {
        console.log(`❌ ${relativePath} - Failed to resize`);
        failed++;
      }
    } catch (e) {
      console.log(`❌ ${relativePath} - Error: ${e.message}`);
      failed++;
    }
  });
  
  // Handle map texture sources (now in _sources/ folder)
  const groundTileSource = path.join(ASSETS_DIR, '_sources/ground-tile-source.png');
  const pathTextureSource = path.join(ASSETS_DIR, '_sources/path-texture-source.png');
  
  if (fs.existsSync(groundTileSource)) {
    const target = path.join(ASSETS_DIR, 'map/ground-tile.png');
    if (resizeImage(groundTileSource, target, 64, 64)) {
      console.log(`✅ map/ground-tile.png - Created from source (64x64)`);
      success++;
    }
  }
  
  if (fs.existsSync(pathTextureSource)) {
    const target = path.join(ASSETS_DIR, 'map/path-texture.png');
    if (resizeImage(pathTextureSource, target, 64, 64)) {
      console.log(`✅ map/path-texture.png - Created from source (64x64)`);
      success++;
    }
  }
  
  console.log(`\n📊 Summary: ${success} resized, ${failed} failed`);
  
  if (failed > 0) {
    console.log('\n💡 Tip: Install ImageMagick for better compatibility: brew install imagemagick');
  }
}

resizeImages();

