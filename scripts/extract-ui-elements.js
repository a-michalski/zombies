/**
 * UI Elements Extraction Script
 * 
 * Extracts UI elements from mockup images with precise coordinates.
 * Source images are 2976x1440 pixels.
 * 
 * Elements:
 * - PLAY button (cyan normal / dark pressed)
 * - Toggle (campaign active / endless active)
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SOURCE_DIR = path.join(__dirname, '../assets/images/_sources');
const OUTPUT_DIR = path.join(__dirname, '../assets/images/ui');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Extract and save an element in multiple sizes
 */
async function extractElement(sourceFile, outputBaseName, crop, targetWidth, targetHeight) {
  const inputPath = path.join(SOURCE_DIR, sourceFile);
  
  console.log(`\nExtracting: ${outputBaseName}`);
  console.log(`  Source: ${sourceFile}`);
  console.log(`  Crop: left=${crop.left}, top=${crop.top}, width=${crop.width}, height=${crop.height}`);
  
  // Extract the region
  const extracted = sharp(inputPath).extract(crop);
  
  // Get extracted buffer for processing
  const buffer = await extracted.toBuffer();
  
  // Process with transparency (remove white/near-white background)
  const processed = sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  const { data, info } = await processed;
  
  // Create new buffer with transparency for white pixels
  const newData = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // If pixel is white or near-white, make transparent
    if (r > 240 && g > 240 && b > 240) {
      newData[i] = 0;
      newData[i + 1] = 0;
      newData[i + 2] = 0;
      newData[i + 3] = 0; // Transparent
    } else {
      newData[i] = r;
      newData[i + 1] = g;
      newData[i + 2] = b;
      newData[i + 3] = 255; // Opaque
    }
  }
  
  // Create image with transparency
  const transparentImage = sharp(newData, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  });
  
  // Save @1x
  await transparentImage.clone()
    .resize(targetWidth, targetHeight, { fit: 'fill' })
    .png()
    .toFile(path.join(OUTPUT_DIR, `${outputBaseName}.png`));
  console.log(`  ✓ ${outputBaseName}.png (${targetWidth}x${targetHeight})`);
  
  // Save @2x
  await transparentImage.clone()
    .resize(targetWidth * 2, targetHeight * 2, { fit: 'fill' })
    .png()
    .toFile(path.join(OUTPUT_DIR, `${outputBaseName}@2x.png`));
  console.log(`  ✓ ${outputBaseName}@2x.png (${targetWidth * 2}x${targetHeight * 2})`);
  
  // Save @3x
  await transparentImage.clone()
    .resize(targetWidth * 3, targetHeight * 3, { fit: 'fill' })
    .png()
    .toFile(path.join(OUTPUT_DIR, `${outputBaseName}@3x.png`));
  console.log(`  ✓ ${outputBaseName}@3x.png (${targetWidth * 3}x${targetHeight * 3})`);
}

async function main() {
  console.log('='.repeat(50));
  console.log('UI Elements Extraction');
  console.log('='.repeat(50));
  
  // Source image dimensions: 2976 x 1440
  // 
  // Looking at the images:
  // - PLAY button is centered, starts around y=95, ends around y=375
  // - Toggle is below, starts around y=400, ends around y=540
  
  // PLAY button (normal - cyan) from ui-buttons-1.png
  // Full button with metallic frame
  await extractElement(
    'ui-buttons-1.png',
    'play-button-normal',
    { left: 820, top: 85, width: 1340, height: 300 },
    335, // @1x width
    75   // @1x height
  );
  
  // PLAY button (pressed - dark) from ui-buttons-2.png
  await extractElement(
    'ui-buttons-2.png',
    'play-button-pressed',
    { left: 820, top: 85, width: 1340, height: 300 },
    335,
    75
  );
  
  // Toggle (campaign active - left cyan) from ui-buttons-1.png
  // Toggle is the lower element with left/right sections
  // Increased crop area even more to show full outer (front) frame with rust
  await extractElement(
    'ui-buttons-1.png',
    'toggle-campaign-active',
    { left: 690, top: 375, width: 1600, height: 290 },
    400, // @1x width (increased by 5px more to show more frame)
    73   // @1x height (increased by 3px more to show more frame)
  );
  
  // Toggle (endless active - right cyan) from ui-buttons-2.png
  await extractElement(
    'ui-buttons-2.png',
    'toggle-endless-active',
    { left: 690, top: 375, width: 1600, height: 290 },
    400,
    73
  );
  
  console.log('\n' + '='.repeat(50));
  console.log('Extraction complete!');
  console.log('='.repeat(50));
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
