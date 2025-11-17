# Design System Rules for Figma Integration

**Project:** Zombie Fleet Bastion  
**Framework:** React Native (Expo) with React Native Web  
**Last Updated:** 2025-11-17

This document provides comprehensive rules for integrating Figma designs into the codebase using the Model Context Protocol (MCP). Use this as a reference when converting Figma designs to React Native components.

---

## 1. Design Token Definitions

### Location
**File:** `constants/ui/theme.ts`

### Structure
Design tokens are centralized in a single `THEME` object with nested categories:

```typescript
export const THEME = {
  colors: { ... },
  spacing: { ... },
  borderRadius: { ... },
  typography: { ... },
  shadows: { ... },
  touchTarget: { ... },
  animation: { ... },
} as const;
```

### Token Categories

#### Colors (`THEME.colors`)
- **Backgrounds:** `primary`, `secondary`, `tertiary`, `elevated`
- **Borders:** `default`, `light`, `dark`
- **Text:** `primary`, `secondary`, `tertiary`, `disabled`, `inverse`
- **Semantic:** `success`, `danger`, `warning`, `info`, `primary`
- **Campaign-specific:** `difficulty` (easy/medium/hard), `star` (filled/empty), `progression` (complete/current/locked)
- **Game-specific:** `scrap`, `hull`
- **Overlays:** `dark`, `darker`, `subtle`

**Usage Pattern:**
```typescript
import { THEME } from '@/constants/ui/theme';

backgroundColor: THEME.colors.background.primary
color: THEME.colors.text.primary
borderColor: THEME.colors.border.default
```

#### Spacing (`THEME.spacing`)
- `xs: 4`
- `sm: 8`
- `md: 16`
- `lg: 24`
- `xl: 32`
- `xxl: 48`

**Usage Pattern:**
```typescript
padding: THEME.spacing.md
marginTop: THEME.spacing.lg
gap: THEME.spacing.sm
```

#### Border Radius (`THEME.borderRadius`)
- `sm: 8` - Small buttons, inputs
- `md: 12` - Medium buttons
- `lg: 16` - Large cards, modals
- `xl: 24` - Extra large elements
- `round: 999` - Fully rounded (pills, badges)

#### Typography (`THEME.typography`)
- **Font Sizes:** `xs: 12`, `sm: 14`, `md: 16`, `lg: 18`, `xl: 24`, `xxl: 32`, `huge: 48`
- **Font Weights:** `normal: '400'`, `semibold: '600'`, `bold: '700'`, `extrabold: '800'`, `black: '900'`
- **Line Heights:** `tight: 1.2`, `normal: 1.5`, `relaxed: 1.75`

**Usage Pattern:**
```typescript
fontSize: THEME.typography.fontSize.md
fontWeight: THEME.typography.fontWeight.bold
lineHeight: THEME.typography.lineHeight.normal
```

#### Shadows (`THEME.shadows`)
- `none: {}`
- `sm`, `md`, `lg` - Standard shadows
- `success`, `primary` - Colored shadows for special buttons

**Usage Pattern:**
```typescript
...THEME.shadows.md
...THEME.shadows.success
```

### Token Transformation
- **No transformation system** - tokens are used directly
- All values are **const assertions** (`as const`) for type safety
- Helper functions available:
  - `getDifficultyColor(difficulty: 'easy' | 'medium' | 'hard')`
  - `getStarColor(filled: boolean)`
  - `getProgressionColor(state: 'complete' | 'current' | 'locked')`

### Converting Figma Tokens
1. **Colors:** Extract hex values from Figma → add to `THEME.colors` with semantic naming
2. **Spacing:** Use 4px base unit → map to `xs`, `sm`, `md`, `lg`, `xl`, `xxl`
3. **Typography:** Extract font sizes → map to `THEME.typography.fontSize.*`
4. **Shadows:** Convert Figma shadows to React Native format (shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation)

---

## 2. Component Library

### Location
**Directory:** `components/`

### Structure
```
components/
├── campaign/          # Campaign/UI components
│   ├── DifficultyBadge.tsx
│   ├── DifficultyBadge.stories.tsx
│   ├── LevelCard.tsx
│   ├── LevelCard.stories.tsx
│   ├── ProgressBar.tsx
│   ├── ProgressBar.stories.tsx
│   ├── StarRating.tsx
│   └── StarRating.stories.tsx
└── game/              # Game-specific components
    ├── BuildMenu.tsx
    ├── EnemyRenderer.tsx
    ├── GameMap.tsx
    ├── GameOverScreen.tsx
    ├── PauseMenu.tsx
    ├── ProjectileRenderer.tsx
    ├── TowerRenderer.tsx
    ├── UpgradeMenu.tsx
    └── VisualEffects.tsx
```

### Component Architecture

#### Pattern: Functional Components with TypeScript
```typescript
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { THEME } from '@/constants/ui/theme';

export interface ComponentNameProps {
  // Props definition
  prop1: string;
  prop2?: number;
  style?: ViewStyle;
}

export default function ComponentName({
  prop1,
  prop2,
  style,
}: ComponentNameProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{prop1}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.background.elevated,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
  },
  text: {
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.bold,
  },
});
```

#### Key Patterns
1. **Props Interface:** Always define TypeScript interface for props
2. **StyleSheet.create:** Use `StyleSheet.create()` for all styles (performance optimization)
3. **THEME Usage:** Always use `THEME` tokens instead of hardcoded values
4. **Style Merging:** Use array syntax `[styles.base, styles.variant, style]` for style prop support
5. **File Naming:** PascalCase for component files (`ComponentName.tsx`)

### Component Documentation
- **Storybook:** Components in `components/campaign/` have `.stories.tsx` files
- **Location:** `.storybook/` directory
- **Run:** `npm run storybook`
- **Pattern:** Each component should have stories for all states/variants

### Converting Figma Components
1. **Extract Design Tokens:** Identify colors, spacing, typography from Figma
2. **Map to THEME:** Use existing tokens or add new ones to `THEME`
3. **Create Component:** Follow the pattern above
4. **Add Stories:** Create `.stories.tsx` file for Storybook documentation
5. **Test:** Verify in Storybook and on web/native platforms

---

## 3. Frameworks & Libraries

### UI Framework
- **React:** v19.0.0
- **React Native:** v0.79.1
- **React Native Web:** v0.20.0 (for web support)
- **Expo:** v53.0.4 (framework)

### Styling
- **React Native StyleSheet:** Primary styling method
- **NativeWind:** v4.1.23 (installed but usage unclear - prefer StyleSheet)
- **No CSS-in-JS:** No styled-components, emotion, etc.

### Build System
- **Bundler:** Expo Metro (default)
- **TypeScript:** v5.8.3
- **Babel:** v7.25.2 (with `babel-plugin-react-native-web`)

### Key Dependencies
```json
{
  "react": "19.0.0",
  "react-native": "0.79.1",
  "react-native-web": "^0.20.0",
  "expo": "^53.0.4",
  "expo-router": "~5.0.3",
  "lucide-react-native": "^0.475.0",
  "react-native-svg": "15.11.2"
}
```

### Platform Support
- **iOS:** Native
- **Android:** Native
- **Web:** Via React Native Web

### Converting Figma Designs
- **Use React Native components:** `View`, `Text`, `Image`, `TouchableOpacity`, etc.
- **Avoid web-specific:** No `div`, `span`, `button` - use RN equivalents
- **Responsive:** Use `Dimensions` API or `useWindowDimensions` hook
- **Platform-specific:** Use `Platform.select()` for platform differences

---

## 4. Asset Management

### Location
**Directory:** `assets/images/`

### Structure
```
assets/images/
├── _sources/              # Source files (large, not optimized)
│   ├── ground-tile-source.png
│   └── main-menu-background-original.png
├── effects/               # Visual effects
│   ├── explosion-sprite-sheet.png
│   └── hit-effect.png
├── enemies/               # Enemy sprites
│   ├── brute.png
│   ├── runner.png
│   └── shambler.png
├── icons/                 # Icons (currently empty)
├── map/                   # Map textures
│   ├── background.png
│   ├── construction-spot.png
│   ├── end-waypoint.png
│   ├── ground-tile.png
│   ├── path-*.png (various path textures)
│   ├── start-waypoint.png
│   └── path-texture.png (fallback)
├── projectiles/           # Projectile sprites
│   └── arrow.png
├── towers/                # Tower sprites
│   ├── lookout-post-level-1.png
│   ├── lookout-post-level-2.png
│   └── lookout-post-level-3.png
└── ui/                    # UI elements
    ├── button-bg.png
    ├── main-menu-background.png
    ├── panel-bg.png
    └── scrap-icon.png
```

### Asset Reference System
**File:** `utils/imageAssets.ts`

Assets are exported as constants:
```typescript
export const TOWER_IMAGES = {
  lookoutPost: {
    level1: require("@/assets/images/towers/lookout-post-level-1.png"),
    level2: require("@/assets/images/towers/lookout-post-level-2.png"),
    level3: require("@/assets/images/towers/lookout-post-level-3.png"),
  },
} as const;
```

### Asset Optimization
- **Scripts:** `scripts/optimize-png-images.js`, `scripts/validate-assets.js`
- **Commands:** `npm run optimize-images`, `npm run validate-assets`
- **Format:** PNG for transparency, JPEG/WebP for photos (see `scripts/optimize-main-menu-background.js`)
- **Source Files:** Keep originals in `_sources/` folder

### Asset Usage Pattern
```typescript
import { TOWER_IMAGES, getTowerImage } from '@/utils/imageAssets';
import { Image } from 'react-native';

<Image source={getTowerImage('tower_lookout_post', 1)} />
```

### Converting Figma Assets
1. **Export from Figma:** PNG with transparency, or SVG
2. **Optimize:** Run `npm run optimize-images`
3. **Place in correct folder:** Follow structure above
4. **Add to `imageAssets.ts`:** Export constant
5. **Use in components:** Import and use via `require()` or `imageAssets` helpers

### Asset Naming Convention
- **Format:** `kebab-case.png` (e.g., `lookout-post-level-1.png`)
- **Descriptive:** Include type and variant (e.g., `path-corner-top-left.png`)
- **Consistent:** Use same pattern for similar assets

---

## 5. Icon System

### Library
**Primary:** `lucide-react-native` v0.475.0

### Usage Pattern
```typescript
import { Star, Lock, Play, X } from 'lucide-react-native';

<Star size={24} color={THEME.colors.star.filled} />
<Lock size={20} color={THEME.colors.text.secondary} />
```

### Icon Properties
- `size`: Number (pixels)
- `color`: String (hex color or theme color)
- `strokeWidth`: Number (optional, default varies)

### Icon Naming
- **PascalCase:** Component names (e.g., `Star`, `Lock`, `Play`)
- **From Lucide:** Use exact names from Lucide icon library
- **Consistent Sizing:** Use standard sizes: 16, 20, 24, 32

### Alternative Icon System
- **@expo/vector-icons:** v14.1.0 (installed but not actively used)
- **Location:** `assets/images/icons/` (currently empty)

### Converting Figma Icons
1. **Check Lucide:** First check if icon exists in `lucide-react-native`
2. **Use Lucide:** If available, use Lucide icon
3. **Custom Icons:** If not in Lucide, export as SVG from Figma → place in `assets/images/icons/`
4. **SVG Rendering:** Use `react-native-svg` for custom SVG icons
5. **Naming:** Use descriptive names matching Figma layer names

---

## 6. Styling Approach

### Methodology
**React Native StyleSheet** (no CSS Modules, no Styled Components)

### Pattern
```typescript
import { StyleSheet } from 'react-native';
import { THEME } from '@/constants/ui/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background.primary,
    padding: THEME.spacing.md,
  },
  text: {
    color: THEME.colors.text.primary,
    fontSize: THEME.typography.fontSize.md,
  },
});
```

### Key Principles
1. **Always use StyleSheet.create()** - Performance optimization
2. **Use THEME tokens** - Never hardcode colors/spacing
3. **Style arrays for merging** - `[styles.base, styles.variant, propStyle]`
4. **Flexbox layout** - React Native uses Flexbox by default
5. **Platform-specific styles** - Use `Platform.select()` when needed

### Global Styles
- **No global CSS file** - All styles are component-scoped
- **THEME is global** - Import `THEME` in any component
- **Storybook decorator** - `.storybook/preview.tsx` provides global background

### Responsive Design
```typescript
import { Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const IS_LANDSCAPE = SCREEN_WIDTH > SCREEN_HEIGHT;

// Use in styles
marginBottom: IS_LANDSCAPE ? 40 : 80,
```

### Converting Figma Styles
1. **Layout:** Convert Figma auto-layout to Flexbox (`flexDirection`, `justifyContent`, `alignItems`)
2. **Spacing:** Map Figma padding/margin to `THEME.spacing.*`
3. **Colors:** Map Figma fills to `THEME.colors.*`
4. **Typography:** Map Figma text styles to `THEME.typography.*`
5. **Shadows:** Convert Figma shadows to React Native shadow format
6. **Border Radius:** Map to `THEME.borderRadius.*`

---

## 7. Project Structure

### Overall Organization
```
zombies/
├── app/                  # Expo Router pages (file-based routing)
│   ├── index.tsx         # Main menu
│   ├── game.tsx          # Game screen
│   ├── levels.tsx        # Campaign levels
│   └── ...
├── components/           # Reusable components
│   ├── campaign/         # Campaign/UI components
│   └── game/             # Game-specific components
├── constants/            # Constants and config
│   ├── ui/               # UI constants
│   │   └── theme.ts      # Design tokens
│   ├── colors.ts         # Legacy colors (minimal)
│   ├── towers.ts         # Tower configs
│   ├── enemies.ts        # Enemy configs
│   └── ...
├── contexts/             # React contexts
│   ├── GameContext.tsx
│   └── CampaignContext.tsx
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
│   ├── imageAssets.ts     # Asset management
│   └── ...
├── assets/                # Static assets
│   └── images/           # Image assets
├── data/                  # Game data
│   └── maps/              # Level map configs
├── docs/                  # Documentation
├── scripts/               # Build/optimization scripts
└── .storybook/            # Storybook configuration
```

### Feature Organization
- **File-based routing:** Expo Router uses `app/` directory
- **Component grouping:** By feature area (`campaign/`, `game/`)
- **Shared utilities:** In `utils/` or `constants/`
- **Type definitions:** Centralized in `types/`

### Import Patterns
```typescript
// Absolute imports with @ alias
import { THEME } from '@/constants/ui/theme';
import { getTowerImage } from '@/utils/imageAssets';
import DifficultyBadge from '@/components/campaign/DifficultyBadge';

// Relative imports for same directory
import StarRating from './StarRating';
```

### Path Aliases
**File:** `tsconfig.json`
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Converting Figma Designs - File Placement
1. **New Component:** Place in `components/campaign/` (UI) or `components/game/` (game-specific)
2. **New Page:** Place in `app/` directory (becomes route)
3. **New Asset:** Place in `assets/images/` subfolder
4. **New Token:** Add to `constants/ui/theme.ts`
5. **New Type:** Add to `types/` directory

---

## 8. Figma Integration Workflow

### Step-by-Step Process

#### 1. Analyze Figma Design
- Identify design tokens (colors, spacing, typography)
- Note component structure and hierarchy
- Check for icons (Lucide vs custom)
- Identify assets needed

#### 2. Map to Existing System
- **Colors:** Check `THEME.colors` - add new ones if needed
- **Spacing:** Map to `THEME.spacing.*` scale
- **Typography:** Map to `THEME.typography.*`
- **Components:** Check if similar component exists

#### 3. Extract Assets
- Export images from Figma (PNG with transparency)
- Optimize: `npm run optimize-images`
- Place in correct `assets/images/` subfolder
- Add to `utils/imageAssets.ts`

#### 4. Create Component
- Follow component pattern (see Section 2)
- Use `THEME` tokens exclusively
- Use `StyleSheet.create()`
- Add TypeScript interface for props

#### 5. Add Stories (if UI component)
- Create `.stories.tsx` file
- Document all states/variants
- Test in Storybook: `npm run storybook`

#### 6. Test
- Test on web: `npm run start-web`
- Test on native (if applicable)
- Verify responsive behavior
- Check accessibility

### Common Conversions

#### Figma Auto-Layout → React Native Flexbox
```typescript
// Figma: Auto-layout (horizontal, space-between)
// React Native:
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
```

#### Figma Colors → THEME
```typescript
// Figma: #4CAF50
// React Native:
backgroundColor: THEME.colors.success
// or add to THEME if new semantic color
```

#### Figma Text Styles → THEME Typography
```typescript
// Figma: Body 16px, Bold
// React Native:
fontSize: THEME.typography.fontSize.md,
fontWeight: THEME.typography.fontWeight.bold,
```

#### Figma Shadows → React Native Shadows
```typescript
// Figma: Drop shadow (0, 4, 8, rgba(0,0,0,0.3))
// React Native:
...THEME.shadows.md
// or create custom:
shadowColor: '#000',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.3,
shadowRadius: 8,
elevation: 4, // Android
```

---

## 9. Best Practices

### DO ✅
- ✅ Always use `THEME` tokens (never hardcode values)
- ✅ Use `StyleSheet.create()` for all styles
- ✅ Follow component pattern with TypeScript interfaces
- ✅ Add Storybook stories for UI components
- ✅ Use Lucide icons when available
- ✅ Optimize assets before committing
- ✅ Use absolute imports with `@/` alias
- ✅ Test on both web and native platforms

### DON'T ❌
- ❌ Don't hardcode colors, spacing, or typography
- ❌ Don't use inline styles (use StyleSheet)
- ❌ Don't use web-specific components (`div`, `span`, `button`)
- ❌ Don't skip TypeScript types
- ❌ Don't commit unoptimized assets
- ❌ Don't use relative imports for cross-directory imports
- ❌ Don't create duplicate components (check existing first)

---

## 10. Troubleshooting

### Common Issues

#### Colors don't match Figma
- **Check:** Are you using `THEME.colors.*` or hardcoded values?
- **Fix:** Add new color to `THEME.colors` if it's a new semantic color

#### Spacing looks wrong
- **Check:** Are you using `THEME.spacing.*` scale?
- **Fix:** Map Figma spacing to nearest `THEME.spacing` value

#### Icons not rendering
- **Check:** Is icon name correct in `lucide-react-native`?
- **Fix:** Use exact PascalCase name from Lucide library

#### Styles not applying
- **Check:** Are you using `StyleSheet.create()`?
- **Fix:** Ensure styles are in `StyleSheet.create()` object

#### Assets not loading
- **Check:** Is asset in correct `assets/images/` subfolder?
- **Fix:** Verify path in `require()` matches file location

---

## 11. Resources

### Documentation
- **Storybook:** `README.storybook.md`
- **UI Specs:** `docs/ui-specs.md`
- **Graphics Requirements:** `docs/graphics-requirements.md`

### Commands
```bash
# Run Storybook
npm run storybook

# Optimize images
npm run optimize-images

# Validate assets
npm run validate-assets

# Generate asset report
npm run asset-report

# Start web dev server
npm run start-web
```

### Key Files Reference
- **Design Tokens:** `constants/ui/theme.ts`
- **Asset Management:** `utils/imageAssets.ts`
- **Storybook Config:** `.storybook/main.ts`, `.storybook/preview.tsx`
- **TypeScript Config:** `tsconfig.json`
- **Package Config:** `package.json`

---

**Last Updated:** 2025-11-17  
**Maintained by:** Development Team  
**For Questions:** Refer to this document or check existing component implementations

