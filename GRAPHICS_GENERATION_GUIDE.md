# 🎨 Graphics Generation Guide - Map Backgrounds

## 📋 Quick Start

**Goal**: Generate 10 map background images (640x384px) for campaign levels

**Source**: All prompts are in `/docs/prompts/map-backgrounds.md`

**Tools You Can Use**:
1. **Midjourney** (Recommended) - Best quality, realistic
2. **DALL-E 3** (OpenAI) - Good balance
3. **Stable Diffusion** - Free, requires local setup
4. **Leonardo.ai** - Free tier available
5. **Any AI image generator** that supports custom prompts

---

## 🚀 Step-by-Step Process

### Option A: Using Midjourney (Discord)

1. **Open Discord** and go to Midjourney server
2. **Copy prompt** from `/docs/prompts/map-backgrounds.md`
3. **In Discord**, type: `/imagine prompt: [PASTE PROMPT HERE]`
4. **Add parameters**: `--ar 5:3 --v 6` (for 640x384 aspect ratio)
5. **Wait for generation** (~1-2 min)
6. **Upscale** the best result (U1, U2, U3, or U4)
7. **Download** the image
8. **Resize** to exactly 640x384px if needed
9. **Optimize** with TinyPNG or similar (<500KB)
10. **Save** as `level-0X-bg.png` in `assets/images/map/backgrounds/`

**Example Full Command**:
```
/imagine prompt: Create a top-down post-apocalyptic game map background, 640x384 pixels... [full prompt] --ar 5:3 --v 6
```

### Option B: Using DALL-E 3 (ChatGPT Plus)

1. **Open ChatGPT** (requires Plus subscription)
2. **Copy prompt** from `/docs/prompts/map-backgrounds.md`
3. **Paste** entire prompt in chat
4. **Request**: "Generate this in 1792x1024px" (closest to 5:3 ratio)
5. **Download** generated image
6. **Resize** to 640x384px using tool like:
   - **Online**: iloveimg.com, resize-image.net
   - **Local**: Photoshop, GIMP, ImageMagick
7. **Optimize** file size (<500KB)
8. **Save** as `level-0X-bg.png`

### Option C: Using Stable Diffusion (Free, Local)

1. **Install Stable Diffusion** (AUTOMATIC1111 or ComfyUI)
2. **Load model**: Realistic Vision or similar
3. **Copy prompt** from `/docs/prompts/map-backgrounds.md`
4. **Set dimensions**: 640x384 in settings
5. **Generate** with settings:
   - Steps: 30-50
   - CFG Scale: 7-9
   - Sampler: DPM++ 2M Karras
6. **Download** best result
7. **Save** as `level-0X-bg.png`

---

## 📝 Quick Prompts (Short Versions)

If your AI tool has character limits, use these condensed versions:

### Level 1: First Contact
```
Top-down isometric (2.5D) post-apocalyptic military bastion, 640x384px. Dark (#2a2a2a base), coastal defense installation with concrete barriers, watchtower ruins, military crates, dark water edges. Uniform ground, decorations at edges/corners only, center clear for gameplay. PNG, <500KB.
```

### Level 2: The Horde Grows
```
Top-down isometric (2.5D) urban street scene, 640x384px. Dark (#2a2a2a base), abandoned cars with open doors at edges, dark streetlights, scattered belongings, building silhouettes. Asphalt surface, uniform ground, center clear. PNG, <500KB.
```

### Level 3: Heavy Infantry
```
Top-down isometric (2.5D) destroyed military checkpoint, 640x384px. Dark (#2a2a2a base), overturned barriers, wrecked military vehicle, torn sandbags, bullet holes, combat debris at edges. Concrete surface, battle damage, center clear. PNG, <500KB.
```

### Level 4: Crossroads
```
Top-down isometric (2.5D) urban intersection, 640x384px. Dark (#2a2a2a base), broken traffic lights, bent road signs, vehicle pileup at edges, storm drains. Asphalt surface, intersection chaos, center clear. PNG, <500KB.
```

### Level 5: The Long March
```
Top-down isometric (2.5D) industrial wasteland, 640x384px. Dark (#2a2a2a base), rusted factory structures at edges, broken machinery, metal debris, toxic puddles, industrial ruins. Concrete surface, heavy decay, center clear. PNG, <500KB.
```

### Level 6: Chokepoint
```
Top-down isometric (2.5D) narrow urban alley, 640x384px. Dark (#2a2a2a base), tall building walls at sides creating corridor, fire escapes, dumpsters, chain-link fences. Alley surface, vertical compression, center clear. PNG, <500KB.
```

### Level 7: Limited Resources
```
Top-down isometric (2.5D) downtown devastation, 640x384px. Dark (#2a2a2a base), collapsed building facades, massive rubble piles at edges, destroyed storefronts, street cracks, heavy destruction. Cracked pavement, apocalypse, center clear. PNG, <500KB.
```

### Level 8: Speed Run
```
Top-down isometric (2.5D) open highway, 640x384px. Dark (#2a2a2a base), highway overpass supports at edges, guardrails, lane dividers (faded), abandoned trucks. Asphalt highway, open feeling, center clear. PNG, <500KB.
```

### Level 9: The Labyrinth
```
Top-down isometric (2.5D) underground parking garage, 640x384px. Dark (#2a2a2a base), concrete pillars, yellow parking lines (faded), abandoned cars, dim emergency lights, ceiling pipes visible. Concrete floor, claustrophobic, center clear. PNG, <500KB.
```

### Level 10: Last Stand
```
Top-down isometric (2.5D) rooftop battlefield, 640x384px. Dark (#2a2a2a base), HVAC units, satellite dishes, rooftop access doors, ventilation shafts, city skyline distant. Rooftop surface, final stand atmosphere, center clear. PNG, <500KB.
```

---

## 🔧 Post-Processing Checklist

After generating each image:

1. **✅ Check Dimensions**: Must be exactly 640x384px
2. **✅ Check File Size**: Must be <500KB (optimize if needed)
3. **✅ Check Format**: Must be PNG
4. **✅ Check Clarity**: Center area clear for gameplay
5. **✅ Check Color**: Dark theme, base ~#2a2a2a
6. **✅ Rename**: `level-01-bg.png` to `level-10-bg.png`
7. **✅ Save**: To `assets/images/map/backgrounds/`

---

## 🛠️ Tools for Optimization

**Resize Images**:
- Online: iloveimg.com/resize-image
- CLI: `convert input.png -resize 640x384! output.png` (ImageMagick)

**Compress Images**:
- Online: tinypng.com
- CLI: `pngquant --quality=80-95 input.png`
- Script: `npm run optimize-images` (if available)

**Batch Process** (for all 10):
```bash
# ImageMagick batch resize
for i in {01..10}; do
  convert level-$i-original.png -resize 640x384! level-$i-bg.png
done

# Optimize all
for i in {01..10}; do
  pngquant --quality=80-95 level-$i-bg.png -o level-$i-bg-optimized.png
done
```

---

## 📊 Progress Tracker

Mark as you complete each level:

- [ ] **Level 1**: First Contact (Coastal military bastion)
- [ ] **Level 2**: The Horde Grows (Urban street)
- [ ] **Level 3**: Heavy Infantry (Destroyed checkpoint)
- [ ] **Level 4**: Crossroads (City intersection)
- [ ] **Level 5**: The Long March (Industrial wasteland)
- [ ] **Level 6**: Chokepoint (Narrow alley)
- [ ] **Level 7**: Limited Resources (Downtown ruins)
- [ ] **Level 8**: Speed Run (Highway)
- [ ] **Level 9**: The Labyrinth (Parking garage)
- [ ] **Level 10**: Last Stand (Rooftop)

---

## 💡 Tips for Best Results

1. **Consistency**: Use same AI tool for all 10 to maintain visual consistency
2. **Iteration**: Generate 2-3 variants per level, pick the best
3. **Negative Prompts** (if supported): "bright colors, cartoonish, unrealistic, text, UI elements, paths drawn on ground"
4. **Style Reference**: Show AI the game's existing graphics for consistency
5. **Batch Generation**: Generate all at once for better coherence
6. **Quality > Speed**: Take time to get good results

---

## ⚠️ Common Issues & Fixes

**Issue**: Image too bright
- **Fix**: Add to prompt: "extremely dark atmosphere, nighttime, minimal lighting"

**Issue**: Paths drawn on background
- **Fix**: Emphasize: "NO paths or roads drawn, uniform ground surface"

**Issue**: File size >500KB
- **Fix**: Use TinyPNG or reduce quality: `pngquant --quality=70-85`

**Issue**: Wrong aspect ratio
- **Fix**: Resize with crop: `convert input.png -resize 640x384^ -gravity center -extent 640x384 output.png`

---

## 🎯 Expected Results

When finished, you should have:
```
assets/images/map/backgrounds/
├── README.md
├── level-01-bg.png  (640x384, <500KB)
├── level-02-bg.png  (640x384, <500KB)
├── level-03-bg.png  (640x384, <500KB)
├── level-04-bg.png  (640x384, <500KB)
├── level-05-bg.png  (640x384, <500KB)
├── level-06-bg.png  (640x384, <500KB)
├── level-07-bg.png  (640x384, <500KB)
├── level-08-bg.png  (640x384, <500KB)
├── level-09-bg.png  (640x384, <500KB)
└── level-10-bg.png  (640x384, <500KB)
```

---

## 🚀 After Generating All Images

1. **Test**: Run the game and check each level loads correctly
2. **Commit**: `git add assets/images/map/backgrounds/`
3. **Push**: `git push origin your-branch`
4. **Enjoy**: Your campaign now has beautiful custom backgrounds!

---

**Need Help?** Check the full detailed prompts in `/docs/prompts/map-backgrounds.md`
