#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'images', 'ui');
const SOURCES_DIR = path.join(__dirname, '..', 'assets', 'images', '_sources');
const sourceFile = path.join(ASSETS_DIR, 'main-menu-background.png');
const backupFile = path.join(SOURCES_DIR, 'main-menu-background-original.png');
const tempFile = path.join(ASSETS_DIR, 'main-menu-background-optimized.png');

async function optimizeMainMenuBackground() {
  console.log('🎨 Optimizing main-menu-background.png...\n');

  // Check if source file exists
  if (!fs.existsSync(sourceFile)) {
    console.error('❌ Error: main-menu-background.png not found!');
    process.exit(1);
  }

  // Get original file size
  const originalStats = fs.statSync(sourceFile);
  const originalSizeMB = (originalStats.size / 1024 / 1024).toFixed(2);
  console.log(`📊 Original size: ${originalSizeMB} MB`);

  // Backup original if not already backed up
  if (!fs.existsSync(backupFile)) {
    console.log(`💾 Creating backup: _sources/main-menu-background-original.png`);
    fs.copyFileSync(sourceFile, backupFile);
  } else {
    console.log(`✅ Backup already exists`);
  }

  try {
    // Get image metadata
    const metadata = await sharp(sourceFile).metadata();
    console.log(`📐 Image dimensions: ${metadata.width}x${metadata.height}`);
    console.log(`🎨 Has alpha channel: ${metadata.hasAlpha ? 'Yes' : 'No'}\n`);

    // Optimize PNG with compression
    console.log('🔧 Optimizing PNG with compression...');
    await sharp(sourceFile)
      .png({
        quality: 85,
        compressionLevel: 9,
        palette: true, // Use palette-based PNG if possible
      })
      .toFile(tempFile);

    // Check new file size
    const optimizedStats = fs.statSync(tempFile);
    const optimizedSizeMB = (optimizedStats.size / 1024 / 1024).toFixed(2);
    const savings = originalStats.size - optimizedStats.size;
    const savingsPercent = ((savings / originalStats.size) * 100).toFixed(1);

    console.log(`\n📊 Optimized size: ${optimizedSizeMB} MB`);
    console.log(`💰 Savings: ${(savings / 1024 / 1024).toFixed(2)} MB (${savingsPercent}%)`);

    // Replace original with optimized version
    if (savings > 0) {
      fs.renameSync(tempFile, sourceFile);
      console.log(`\n✅ Successfully optimized main-menu-background.png!`);

      // Check if we met the 50% goal
      if (parseFloat(savingsPercent) >= 50) {
        console.log(`🎉 Goal achieved: ${savingsPercent}% reduction (target: 50%)`);
      } else {
        console.log(`⚠️  Reduction ${savingsPercent}% is less than 50% target`);
        console.log(`💡 Consider converting to JPEG if no transparency is needed`);
      }
    } else {
      console.log(`\n⚠️  No size reduction achieved, keeping original`);
      fs.unlinkSync(tempFile);
    }

  } catch (error) {
    console.error(`\n❌ Error during optimization: ${error.message}`);
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
    process.exit(1);
  }
}

optimizeMainMenuBackground();
