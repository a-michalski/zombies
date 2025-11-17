#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'images');
const SOURCES_DIR = path.join(ASSETS_DIR, '_sources');

// Directories to exclude from optimization
const EXCLUDE_DIRS = ['_sources', 'icons'];

// Maximum file sizes for different asset types (in bytes)
const SIZE_LIMITS = {
  towers: 50 * 1024,      // 50KB
  enemies: 20 * 1024,     // 20KB
  projectiles: 5 * 1024,  // 5KB
  effects: 10 * 1024,     // 10KB
  ui: 500 * 1024,         // 500KB
  map: 500 * 1024,        // 500KB
};

async function findPNGFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      const dirName = path.basename(filePath);
      if (!EXCLUDE_DIRS.includes(dirName)) {
        await findPNGFiles(filePath, fileList);
      }
    } else if (file.endsWith('.png')) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

async function optimizePNG(filePath) {
  const originalStats = fs.statSync(filePath);
  const originalSize = originalStats.size;
  const tempPath = filePath + '.tmp';

  try {
    // Get image metadata
    const metadata = await sharp(filePath).metadata();

    // Optimize PNG with compression
    await sharp(filePath)
      .png({
        quality: 85,
        compressionLevel: 9,
        palette: metadata.channels <= 3, // Use palette for non-alpha images
      })
      .toFile(tempPath);

    // Check new file size
    const optimizedStats = fs.statSync(tempPath);
    const optimizedSize = optimizedStats.size;
    const savings = originalSize - optimizedSize;
    const savingsPercent = ((savings / originalSize) * 100).toFixed(1);

    // Only replace if we achieved savings
    if (savings > 0) {
      fs.renameSync(tempPath, filePath);
      return {
        success: true,
        originalSize,
        optimizedSize,
        savings,
        savingsPercent,
      };
    } else {
      fs.unlinkSync(tempPath);
      return {
        success: false,
        originalSize,
        optimizedSize: originalSize,
        savings: 0,
        savingsPercent: 0,
      };
    }
  } catch (error) {
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    return {
      success: false,
      error: error.message,
      originalSize,
      optimizedSize: originalSize,
      savings: 0,
      savingsPercent: 0,
    };
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

async function optimizeAllPNGs() {
  console.log('🎨 PNG Optimization Tool\n');
  console.log('📂 Searching for PNG files...\n');

  const pngFiles = await findPNGFiles(ASSETS_DIR);
  console.log(`Found ${pngFiles.length} PNG files\n`);

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let successCount = 0;
  let failedCount = 0;
  let skippedCount = 0;

  for (const filePath of pngFiles) {
    const relativePath = path.relative(ASSETS_DIR, filePath);
    const stats = fs.statSync(filePath);

    totalOriginalSize += stats.size;

    process.stdout.write(`🔧 ${relativePath} (${formatBytes(stats.size)})... `);

    const result = await optimizePNG(filePath);

    if (result.error) {
      console.log(`❌ Error: ${result.error}`);
      failedCount++;
      totalOptimizedSize += result.originalSize;
    } else if (result.savings > 0) {
      console.log(`✅ Saved ${formatBytes(result.savings)} (${result.savingsPercent}%)`);
      successCount++;
      totalOptimizedSize += result.optimizedSize;
    } else {
      console.log(`⚪ Already optimized`);
      skippedCount++;
      totalOptimizedSize += result.originalSize;
    }
  }

  const totalSavings = totalOriginalSize - totalOptimizedSize;
  const totalSavingsPercent = ((totalSavings / totalOriginalSize) * 100).toFixed(1);

  console.log('\n' + '='.repeat(60));
  console.log('📊 Optimization Summary\n');
  console.log(`Total files processed: ${pngFiles.length}`);
  console.log(`  ✅ Optimized: ${successCount}`);
  console.log(`  ⚪ Already optimal: ${skippedCount}`);
  console.log(`  ❌ Failed: ${failedCount}`);
  console.log('');
  console.log(`Original total size: ${formatBytes(totalOriginalSize)}`);
  console.log(`Optimized total size: ${formatBytes(totalOptimizedSize)}`);
  console.log(`Total savings: ${formatBytes(totalSavings)} (${totalSavingsPercent}%)`);
  console.log('='.repeat(60));
}

optimizeAllPNGs().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
