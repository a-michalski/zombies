#!/usr/bin/env node

/**
 * Script to analyze images and help identify what they are
 * This will create a report that can be used to manually organize images
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'images');
const KNOWN_FILES = ['adaptive-icon.png', 'favicon.png', 'icon.png', 'splash-icon.png'];

function getImageInfo(filePath) {
  try {
    const output = execSync(`sips -g pixelWidth -g pixelHeight -g format "${filePath}" 2>/dev/null`, { encoding: 'utf8' });
    const widthMatch = output.match(/pixelWidth:\s*(\d+)/);
    const heightMatch = output.match(/pixelHeight:\s*(\d+)/);
    const formatMatch = output.match(/format:\s*(\w+)/);
    
    const width = widthMatch ? parseInt(widthMatch[1]) : null;
    const height = heightMatch ? parseInt(heightMatch[1]) : null;
    const format = formatMatch ? formatMatch[1] : null;
    
    // Get file size
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    
    return { width, height, format, sizeKB };
  } catch (e) {
    return { width: null, height: null, format: null, sizeKB: null };
  }
}

function categorizeBySize(width, height) {
  if (!width || !height) return 'unknown';
  
  // Square images
  if (Math.abs(width - height) < 50) {
    if (width >= 60 && width <= 70) return 'tower-small (64x64)';
    if (width >= 40 && width <= 50) return 'enemy-small (48x48)';
    if (width >= 30 && width <= 35) return 'icon (32x32)';
    if (width >= 1000) return 'tower-large (high-res)';
  }
  
  // Rectangular images
  if (height > width * 1.5) {
    if (width <= 20 && height >= 25 && height <= 40) return 'projectile (16x32)';
    return 'vertical';
  }
  
  if (width > height * 1.5) {
    if (width >= 600 && height >= 350) return 'map-background (640x384)';
    if (width >= 180 && width <= 220 && height >= 50 && height <= 70) return 'ui-button (200x60)';
    return 'horizontal';
  }
  
  return 'square';
}

function analyzeImages() {
  console.log('🔍 Analyzing images in assets/images/...\n');
  
  const files = fs.readdirSync(ASSETS_DIR)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg'].includes(ext) && !KNOWN_FILES.includes(file);
    });
  
  if (files.length === 0) {
    console.log('❌ No image files found\n');
    return;
  }
  
  console.log(`📊 Found ${files.length} image(s) to analyze:\n`);
  console.log('='.repeat(80));
  
  const analysis = [];
  
  files.forEach((file, index) => {
    const filePath = path.join(ASSETS_DIR, file);
    const info = getImageInfo(filePath);
    const category = categorizeBySize(info.width, info.height);
    
    analysis.push({
      file,
      ...info,
      category,
      index: index + 1,
    });
    
    console.log(`\n${index + 1}. ${file}`);
    console.log(`   Size: ${info.width || '?'}x${info.height || '?'}px`);
    console.log(`   File size: ${info.sizeKB || '?'} KB`);
    console.log(`   Category: ${category}`);
    console.log(`   Path: ${filePath}`);
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('\n📋 Summary by category:\n');
  
  const byCategory = {};
  analysis.forEach(item => {
    if (!byCategory[item.category]) {
      byCategory[item.category] = [];
    }
    byCategory[item.category].push(item);
  });
  
  Object.entries(byCategory).forEach(([category, items]) => {
    console.log(`${category}: ${items.length} file(s)`);
    items.forEach(item => {
      console.log(`  - ${item.file} (${item.width}x${item.height}px)`);
    });
  });
  
  console.log('\n💡 Next steps:');
  console.log('1. Review the images visually to identify their content');
  console.log('2. Match them to expected files:');
  console.log('   - Towers: lookout-post-level-1/2/3.png (64x64)');
  console.log('   - Enemies: shambler.png, runner.png, brute.png (48/44/64px)');
  console.log('   - Projectiles: arrow.png (16x32)');
  console.log('   - Map: ground-tile.png, path-texture.png, background.png');
  console.log('   - UI: button-bg.png, panel-bg.png, scrap-icon.png');
  console.log('3. Use the organize script or manually move files');
}

analyzeImages();

