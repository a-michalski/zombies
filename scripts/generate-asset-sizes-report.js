#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'images');

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

function getAllFiles(dir, relativePath = '', fileList = []) {
  const entries = fs.readdirSync(dir);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const relPath = relativePath ? path.join(relativePath, entry) : entry;
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      getAllFiles(fullPath, relPath, fileList);
    } else if (entry.endsWith('.png')) {
      fileList.push({
        path: relPath,
        size: stat.size,
      });
    }
  }

  return fileList;
}

function generateReport() {
  console.log('📊 Asset Sizes Report\n');
  console.log('Generated: ' + new Date().toISOString());
  console.log('='.repeat(80) + '\n');

  const allFiles = getAllFiles(ASSETS_DIR);

  // Group by category
  const categories = {
    towers: [],
    enemies: [],
    projectiles: [],
    effects: [],
    map: [],
    ui: [],
    _sources: [],
    other: [],
  };

  allFiles.forEach(file => {
    const category = file.path.split(path.sep)[0];
    if (categories[category]) {
      categories[category].push(file);
    } else {
      categories.other.push(file);
    }
  });

  let grandTotal = 0;

  // Print by category
  for (const [category, files] of Object.entries(categories)) {
    if (files.length === 0) continue;

    const categoryTotal = files.reduce((sum, file) => sum + file.size, 0);
    grandTotal += categoryTotal;

    console.log(`\n📁 ${category.toUpperCase()}`);
    console.log('-'.repeat(80));

    // Sort by size (largest first)
    files.sort((a, b) => b.size - a.size);

    files.forEach(file => {
      const percentage = ((file.size / categoryTotal) * 100).toFixed(1);
      console.log(`  ${formatBytes(file.size).padEnd(12)} ${percentage.padStart(5)}%  ${file.path}`);
    });

    console.log('-'.repeat(80));
    console.log(`  TOTAL: ${formatBytes(categoryTotal)} (${files.length} files)`);
  }

  console.log('\n' + '='.repeat(80));
  console.log(`\n🎯 GRAND TOTAL: ${formatBytes(grandTotal)} across ${allFiles.length} PNG files\n`);
  console.log('='.repeat(80));

  // Size breakdown by category (excluding _sources)
  console.log('\n📊 Category Distribution (excluding _sources):\n');

  const productionCategories = Object.entries(categories)
    .filter(([cat]) => cat !== '_sources' && cat !== 'other')
    .map(([cat, files]) => ({
      name: cat,
      size: files.reduce((sum, file) => sum + file.size, 0),
      count: files.length,
    }))
    .sort((a, b) => b.size - a.size);

  const productionTotal = productionCategories.reduce((sum, cat) => sum + cat.size, 0);

  productionCategories.forEach(cat => {
    const percentage = ((cat.size / productionTotal) * 100).toFixed(1);
    const bar = '█'.repeat(Math.floor(percentage / 2));
    console.log(`  ${cat.name.padEnd(12)} ${formatBytes(cat.size).padEnd(12)} ${percentage.padStart(5)}% ${bar}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log(`\n📦 Production Bundle Size (game assets): ${formatBytes(productionTotal)}`);
  console.log(`📦 Source Files (not in bundle): ${formatBytes(categories._sources.reduce((sum, file) => sum + file.size, 0))}`);
  console.log(`📦 Other Files (app icons, etc): ${formatBytes(categories.other.reduce((sum, file) => sum + file.size, 0))}`);
  console.log('\n' + '='.repeat(80));

  // Top 10 largest files
  console.log('\n🏆 Top 10 Largest Files:\n');

  const sortedFiles = [...allFiles].sort((a, b) => b.size - a.size).slice(0, 10);

  sortedFiles.forEach((file, index) => {
    console.log(`  ${(index + 1).toString().padStart(2)}. ${formatBytes(file.size).padEnd(12)} ${file.path}`);
  });

  console.log('\n' + '='.repeat(80));
}

generateReport();
