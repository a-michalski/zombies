# Zombie Fleet Bastion - Storybook Documentation

## 📚 Overview

This project uses **Storybook for React** with **React Native Web** to document and showcase UI components in isolation. All React Native components render in the browser using `react-native-web`.

## 🚀 Quick Start

### Run Storybook

```bash
npm run storybook
```

This will start Storybook at **http://localhost:6006**

### Build Static Storybook

```bash
npm run build-storybook
```

Outputs to `storybook-static/` directory (can be deployed to GitHub Pages, Netlify, etc.)

---

## 📦 Project Structure

```
.storybook/
├── main.ts              # Storybook configuration (webpack, addons)
├── preview.tsx          # Global decorators, theme setup
├── manager.ts           # UI customization (dark theme)
└── mocks/               # Mock data for stories
    ├── levelMocks.ts    # LevelConfig, LevelProgress mocks
    ├── gameMocks.ts     # GameState, Tower, Enemy mocks
    └── contextMocks.tsx # GameContext mock provider

components/
├── campaign/
│   ├── DifficultyBadge.tsx
│   ├── DifficultyBadge.stories.tsx
│   ├── StarRating.tsx
│   ├── StarRating.stories.tsx
│   ├── ProgressBar.tsx
│   ├── ProgressBar.stories.tsx
│   ├── LevelCard.tsx
│   └── LevelCard.stories.tsx
└── game/
    ├── BuildMenu.tsx
    ├── UpgradeMenu.tsx
    ├── PauseMenu.tsx
    └── GameOverScreen.tsx
```

---

## 🎨 Component Library

### Campaign Components

#### 1. **DifficultyBadge**
- **Location:** `components/campaign/DifficultyBadge.stories.tsx`
- **Description:** Colored pill badge showing level difficulty (easy/medium/hard)
- **Stories:** 7 stories (Default, Easy, Medium, Hard, SmallSize, AllDifficulties, Interactive)
- **Props:**
  - `difficulty`: `'easy' | 'medium' | 'hard'`
  - `size`: `'small' | 'medium'`

#### 2. **StarRating**
- **Location:** `components/campaign/StarRating.stories.tsx`
- **Description:** 0-3 star rating system for level completion
- **Stories:** 12 stories (including animated variants, all sizes)
- **Props:**
  - `stars`: `number` (0-3)
  - `size`: `'small' | 'medium' | 'large'`
  - `animated`: `boolean`
  - `showLabel`: `boolean`

#### 3. **ProgressBar**
- **Location:** `components/campaign/ProgressBar.stories.tsx`
- **Description:** Linear progress bar for campaign star collection
- **Stories:** 12 stories (different progress states, heights)
- **Props:**
  - `current`: `number`
  - `total`: `number`
  - `height`: `number`
  - `showLabel`: `boolean`
  - `animated`: `boolean`

#### 4. **LevelCard**
- **Location:** `components/campaign/LevelCard.stories.tsx`
- **Description:** Campaign level selection card (locked/unlocked/completed states)
- **Stories:** 12 stories (all states, difficulties, interactions)
- **Props:**
  - `level`: `LevelConfig`
  - `progress`: `LevelProgress | null`
  - `locked`: `boolean`
  - `isNext`: `boolean`
  - `onPress`: `() => void`
  - `onLongPress`: `() => void`

### Game Components

*Note: Game menu components (BuildMenu, UpgradeMenu, PauseMenu, GameOverScreen) require GameContext integration and will be added in future iterations.*

---

## 🛠️ Technology Stack

### Core Dependencies

- **Storybook:** v8.6.14
  - `@storybook/react`
  - `@storybook/react-webpack5`
  - `@storybook/addon-essentials`
  - `@storybook/addon-links`
  - `@storybook/addon-interactions`

- **React Native Web Support:**
  - `@storybook/addon-react-native-web`
  - `babel-plugin-react-native-web`
  - `react-native-web` (already in project)

### Addons Enabled

- **Essentials:** Controls, Actions, Viewport, Backgrounds, Docs, Toolbars
- **Interactions:** Testing user interactions
- **Links:** Navigation between stories
- **React Native Web:** RN component support

---

## ⚙️ Configuration

### Webpack Configuration

The `.storybook/main.ts` file configures:

1. **Path Aliases:** `@/*` resolves to project root (matches `tsconfig.json`)
2. **Extensions:** Resolves `.web.tsx`, `.tsx`, `.ts`, `.jsx`, `.js`
3. **Babel Plugin:** `react-native-web` for RN component transformation
4. **Static Assets:** Serves `assets/` directory

### Theme Configuration

All stories use the centralized **THEME** system from `constants/ui/theme.ts`:

- **Dark background:** `#0a0a0a`
- **Semantic colors:** success, danger, warning, info
- **Campaign-specific:** difficulty colors, star colors, progression states
- **Typography:** Font sizes, weights, line heights
- **Spacing:** xs, sm, md, lg, xl, xxl
- **Shadows:** sm, md, lg, success, primary

### Global Decorators

All stories are wrapped in a ThemeDecorator (`preview.tsx`) that provides:
- Dark background (`THEME.colors.background.primary`)
- Consistent padding
- Full viewport height

---

## 📝 Writing New Stories

### Basic Story Template

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import YourComponent from './YourComponent';
import { THEME } from '@/constants/ui/theme';

const meta = {
  title: 'Category/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Description of your component.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    propName: {
      control: 'text',
      description: 'Description of prop',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default value' },
      },
    },
  },
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    propName: 'value',
  },
};
```

### Using Mock Data

Import mocks from `.storybook/mocks/`:

```tsx
import {
  MOCK_LEVEL_01,
  MOCK_PROGRESS_THREE_STARS,
} from '@/.storybook/mocks/levelMocks';

export const Example: Story = {
  args: {
    level: MOCK_LEVEL_01,
    progress: MOCK_PROGRESS_THREE_STARS,
  },
};
```

### Naming Conventions

- **Story files:** `ComponentName.stories.tsx` (same directory as component)
- **Story names:** PascalCase (e.g., `AllDifficulties`, `Completed3Stars`)
- **Categories:** `Campaign/`, `Game/`, `Core/`

---

## 🧪 Testing & Validation

### Manual Testing Checklist

1. ✅ **Run Storybook:** `npm run storybook`
2. ✅ **Check all stories load** without errors
3. ✅ **Test Controls panel** - all props editable
4. ✅ **Test Actions panel** - events logged
5. ✅ **Test Viewport addon** - responsive views
6. ✅ **Test Docs tab** - auto-generated documentation

### Known Issues

- **React-docgen warnings:** Harmless warnings about parsing React Native components (can be ignored)
- **Browser-only:** Storybook runs in browser, not on native devices
- **Native APIs:** Components using native-only APIs (Camera, Maps) won't work in Storybook

---

## 🚢 Deployment

### GitHub Pages

1. Build static Storybook:
   ```bash
   npm run build-storybook
   ```

2. Deploy `storybook-static/` directory to GitHub Pages

### Netlify

1. Build command: `npm run build-storybook`
2. Publish directory: `storybook-static`

### Chromatic (Recommended for teams)

```bash
npm install --save-dev chromatic
npx chromatic --project-token=<your-token>
```

Chromatic provides:
- Visual regression testing
- Automatic PR reviews
- Component versioning

---

## 📖 Best Practices

### Do's ✅

- ✅ Use centralized `THEME` for all styling
- ✅ Import mocks from `.storybook/mocks/`
- ✅ Add descriptive `description` in meta and stories
- ✅ Use `tags: ['autodocs']` for auto-generated docs
- ✅ Provide comprehensive `argTypes` documentation
- ✅ Include showcase stories (`AllStates`, `AllSizes`)
- ✅ Add `Interactive` story for playground testing

### Don'ts ❌

- ❌ Don't hardcode colors/spacing (use THEME)
- ❌ Don't create duplicate mock data (reuse from mocks/)
- ❌ Don't skip `argTypes` documentation
- ❌ Don't use native-only APIs in stories
- ❌ Don't modify component code just for Storybook

---

## 🐛 Troubleshooting

### "Module not found" errors

- **Cause:** Webpack path alias not configured
- **Fix:** Check `.storybook/main.ts` has `@` alias

### Stories not loading

- **Cause:** Pattern mismatch in `main.ts`
- **Fix:** Ensure story files match `../components/**/*.stories.@(js|jsx|ts|tsx)`

### React Native components not rendering

- **Cause:** Missing `react-native-web` support
- **Fix:** Ensure `@storybook/addon-react-native-web` is installed and in addons array

### Slow build times

- **Cause:** Large dependency tree
- **Fix:** Use `useSWC: true` in webpack config (already enabled)

---

## 📈 Roadmap

### Phase 1: Campaign Components ✅ (COMPLETE)
- [x] DifficultyBadge
- [x] StarRating
- [x] ProgressBar
- [x] LevelCard

### Phase 2: Game Menu Components (TODO)
- [ ] BuildMenu (requires GameContext decorator)
- [ ] UpgradeMenu (requires GameContext decorator)
- [ ] PauseMenu (requires router mock)
- [ ] GameOverScreen (requires router mock)

### Phase 3: Renderer Components (LOW PRIORITY)
- [ ] TowerRenderer
- [ ] EnemyRenderer
- [ ] ProjectileRenderer

### Phase 4: Testing & CI/CD
- [ ] Visual regression tests (Chromatic)
- [ ] Automated story validation
- [ ] GitHub Actions integration
- [ ] Automated deployment

---

## 🤝 Contributing

### Adding a New Story

1. Create `ComponentName.stories.tsx` next to your component
2. Import mocks if needed
3. Add comprehensive argTypes
4. Include showcase stories (AllStates, AllSizes, Interactive)
5. Test in Storybook locally
6. Commit both component and story files

### Updating Mocks

Mock files are in `.storybook/mocks/`:
- `levelMocks.ts` - Campaign data
- `gameMocks.ts` - Game state data
- `contextMocks.tsx` - Context providers

Add new mocks here rather than in story files.

---

## 📞 Support

- **Documentation:** https://storybook.js.org/docs/react/
- **React Native Web:** https://necolas.github.io/react-native-web/
- **Issues:** Report bugs in GitHub Issues

---

**Built with ❤️ for Zombie Fleet Bastion**

Last updated: 2025-11-17
