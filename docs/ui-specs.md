# UI Component Specifications - Campaign System

**Project:** Zombie Fleet Bastion
**Phase:** PHASE-003-UI-DESIGN
**Date:** 2025-11-16
**Status:** Design Specifications

---

## Design System Reference

All components use the centralized theme from `constants/ui/theme.ts`.

**Key Principles:**
- ✅ Dark theme consistent with existing game UI
- ✅ Touch targets ≥44px (iOS) or 48px recommended
- ✅ StyleSheet.create() only - NO styled-components
- ✅ Landscape-only design (portrait not supported)
- ✅ High contrast for accessibility
- ✅ Lucide React Native icons only

---

## 1. LevelCard Component

**File:** `components/campaign/LevelCard.tsx`

### Purpose
Displays individual campaign level information in a grid layout. Users tap to view details or start level.

### Visual Specifications

**Dimensions:**
- Width: 160px
- Height: 200px
- Border radius: 12px (THEME.borderRadius.md)
- Border: 2px solid THEME.colors.border.light (#444444)

**Layout Structure (top to bottom):**
```
┌─────────────────────────┐
│   Thumbnail (160x100)   │ ← Level preview image
│    [Difficulty Badge]   │ ← Positioned absolute top-right
├─────────────────────────┤
│   Level Title (bold)    │ ← 1 line, ellipsis overflow
│   Description (2 lines) │ ← Secondary text, smaller
│   ⭐⭐⭐ (StarRating)    │ ← 0-3 stars shown
├─────────────────────────┤
│   [Play Button - 48px]  │ ← Primary action
└─────────────────────────┘
```

### States

**1. Locked State**
- Background: THEME.colors.background.elevated (#2a2a2a)
- Thumbnail: Grayscale filter + opacity 0.4
- Overlay: Lock icon (32px) centered on thumbnail
- Title color: THEME.colors.text.disabled (#666666)
- Description color: THEME.colors.text.disabled (#666666)
- Button: "Locked" text, disabled appearance
- Border color: THEME.colors.progression.locked (#666666)
- Not tappable (except for info modal)

**2. Unlocked/Available State**
- Background: THEME.colors.background.elevated (#2a2a2a)
- Thumbnail: Full color, no filter
- Title color: THEME.colors.text.primary (#FFFFFF)
- Description color: THEME.colors.text.tertiary (#AAAAAA)
- Stars: Empty (gray #444444)
- Button: "Play" text, primary blue background
- Border color: THEME.colors.border.light (#444444)
- Border glow: Optional subtle blue glow for "next" level

**3. Completed State**
- Background: THEME.colors.background.elevated (#2a2a2a)
- Thumbnail: Full color
- Title color: THEME.colors.text.primary (#FFFFFF)
- Description color: THEME.colors.text.tertiary (#AAAAAA)
- Stars: 1-3 filled gold stars based on performance
- Button: "Replay" text, secondary appearance
- Border color: THEME.colors.success (#4CAF50) if 3 stars
- Checkmark badge: Small checkmark in top-left if completed

### Typography

**Title:**
- Font size: 16px (THEME.typography.fontSize.md)
- Font weight: '700' (THEME.typography.fontWeight.bold)
- Color: THEME.colors.text.primary or disabled
- Max lines: 1 (ellipsis)

**Description:**
- Font size: 12px (THEME.typography.fontSize.xs)
- Font weight: '400' (THEME.typography.fontWeight.normal)
- Color: THEME.colors.text.tertiary (#AAAAAA)
- Max lines: 2 (ellipsis)
- Line height: 16px

### Content Section

**Padding:** 12px all sides
**Spacing between elements:** 8px (THEME.spacing.sm)

### Play/Replay Button

**Dimensions:**
- Height: 48px (THEME.touchTarget.recommended)
- Width: 100% of card width minus padding
- Border radius: 8px (THEME.borderRadius.sm)

**Unlocked/Available:**
- Background: THEME.colors.primary (#4A90E2)
- Text: "Play"
- Icon: Play icon (lucide-react-native)
- Text color: THEME.colors.text.primary (#FFFFFF)

**Locked:**
- Background: THEME.colors.border.default (#333333)
- Text: "Locked"
- Icon: Lock icon
- Text color: THEME.colors.text.disabled (#666666)
- Opacity: 0.5

**Completed:**
- Background: THEME.colors.border.light (#444444)
- Text: "Replay"
- Icon: RotateCcw icon
- Text color: THEME.colors.text.primary (#FFFFFF)

### Interactions

**Whole card tap:** Shows LevelDetailsModal
**Play button tap:** Starts level directly (if unlocked)
**Locked card tap:** Shows "Complete previous level" toast

### Thumbnail

**Dimensions:** 160x100px
**Source:** Level preview image (map overview)
**Fallback:** Dark gradient with level number
**Resize mode:** 'cover'

---

## 2. StarRating Component

**File:** `components/campaign/StarRating.tsx`

### Purpose
Displays 0-3 stars to show level completion rating.

### Visual Specifications

**Layout:**
- Horizontal row of 3 star icons
- Fixed spacing: 4px between stars (THEME.spacing.xs)
- Center aligned

### Size Variants

**Small (for compact displays):**
- Star size: 16px
- Total width: ~56px (16 + 4 + 16 + 4 + 16)
- Use case: Level cards, small badges

**Medium (default):**
- Star size: 24px
- Total width: ~80px
- Use case: Level details modal, headers

**Large (for victory screens):**
- Star size: 32px
- Total width: ~104px
- Use case: Victory modal, achievements

### Colors

**Filled Star:**
- Color: THEME.colors.star.filled (#FFD700) - gold
- Icon: Star from lucide-react-native with fill="#FFD700"

**Empty Star:**
- Color: THEME.colors.star.empty (#444444) - dark gray
- Icon: Star from lucide-react-native (outline only)
- Stroke color: #444444

### Props Interface

```typescript
interface StarRatingProps {
  stars: number;           // 0-3
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;      // For victory screen reveals
  showLabel?: boolean;     // "X/3 Stars"
}
```

### Animation (Optional)

When `animated={true}`:
- Stars appear sequentially left to right
- Delay: 500ms between each star (THEME.animation.victory)
- Animation: Scale from 0 to 1 with bounce effect
- Use case: Victory screen star reveal

### Label (Optional)

When `showLabel={true}`:
- Text: "X/3 Stars" or "X/3"
- Position: Below stars, centered
- Font size: 12px (THEME.typography.fontSize.xs)
- Font weight: '600' (THEME.typography.fontWeight.semibold)
- Color: THEME.colors.text.secondary (#CCCCCC)

---

## 3. DifficultyBadge Component

**File:** `components/campaign/DifficultyBadge.tsx`

### Purpose
Shows level difficulty rating with color-coded pill badge.

### Visual Specifications

**Dimensions:**
- Width: Auto (fit content, min 60px)
- Height: 24px
- Border radius: 12px (pill shape - THEME.borderRadius.md)
- Padding horizontal: 12px
- Padding vertical: 4px

### Difficulty Variants

**Easy:**
- Background: THEME.colors.difficulty.easy (#4CAF50)
- Text: "EASY"
- Text color: THEME.colors.text.primary (#FFFFFF)
- Optional icon: CheckCircle (16px)

**Medium:**
- Background: THEME.colors.difficulty.medium (#FFA500)
- Text: "MEDIUM"
- Text color: THEME.colors.text.primary (#FFFFFF)
- Optional icon: AlertCircle (16px)

**Hard:**
- Background: THEME.colors.difficulty.hard (#FF4444)
- Text: "HARD"
- Text color: THEME.colors.text.primary (#FFFFFF)
- Optional icon: AlertTriangle (16px)

### Typography

- Font size: 10px
- Font weight: '700' (THEME.typography.fontWeight.bold)
- Letter spacing: 0.5px
- Text transform: UPPERCASE
- Color: Always white (#FFFFFF)

### Positioning

**On LevelCard:**
- Position: absolute
- Top: 8px
- Right: 8px
- Shadow: THEME.shadows.sm (for contrast on thumbnails)

**In LevelDetailsModal:**
- Position: Inline with title or below
- Margin left: 8px (if inline)

### Props Interface

```typescript
interface DifficultyBadgeProps {
  difficulty: 'easy' | 'medium' | 'hard';
  showIcon?: boolean;
  size?: 'small' | 'medium';  // Small for cards, medium for modals
}
```

---

## 4. ProgressBar Component

**File:** `components/campaign/ProgressBar.tsx`

### Purpose
Shows overall campaign progress (total stars earned out of possible stars).

### Visual Specifications

**Dimensions:**
- Width: 100% of container (responsive)
- Height: 8px
- Border radius: 4px

**Container (background):**
- Background: THEME.colors.border.default (#333333)
- Border: 1px solid THEME.colors.border.dark (#222222)
- Border radius: 4px
- Overflow: hidden (for fill animation)

**Fill (progress):**
- Background: Linear gradient (green to gold)
  - Start: THEME.colors.success (#4CAF50)
  - End: THEME.colors.star.filled (#FFD700)
- Border radius: 4px (matches container)
- Width: `(currentStars / totalStars) * 100%`
- Transition: Animated width change over 500ms

### Label

**Position:** Above or to the right of bar

**Text format:** "X / Y Stars" or "X/Y ⭐"
- X = current stars earned
- Y = total possible stars (usually level_count * 3)

**Typography:**
- Font size: 14px (THEME.typography.fontSize.sm)
- Font weight: '600' (THEME.typography.fontWeight.semibold)
- Color: THEME.colors.text.primary (#FFFFFF)

### Variants

**Compact (for headers):**
- Height: 6px
- Label: "X/Y ⭐" (compact format)
- Positioned: Top-right of screen

**Full (for campaign screen header):**
- Height: 8px
- Label: "X / Y Stars" (full format)
- Positioned: Below campaign title
- Width: Full screen width minus padding

### Props Interface

```typescript
interface ProgressBarProps {
  currentStars: number;
  totalStars: number;
  variant?: 'compact' | 'full';
  showLabel?: boolean;
  animated?: boolean;  // Animate on mount
}
```

### Animation

When `animated={true}`:
- Fill animates from 0 to current width over 500ms
- Easing: ease-out
- Delay: 200ms (after screen mount)

---

## 5. LevelSelectScreen

**File:** `app/campaign.tsx` (or `app/campaign/index.tsx`)

### Purpose
Main campaign screen showing all available levels in a scrollable grid.

### Layout Structure

```
┌─────────────────────────────────────────┐
│ Header (fixed)                          │
│   Campaign Title                        │
│   Progress Bar (X/30 Stars)            │
│   [Back Button]                         │
├─────────────────────────────────────────┤
│                                         │
│ ScrollView Content:                     │
│                                         │
│  ┌──────┐  ┌──────┐                   │
│  │ L1   │  │ L2   │                   │
│  │ Card │  │ Card │                   │
│  └──────┘  └──────┘                   │
│                                         │
│  ┌──────┐  ┌──────┐                   │
│  │ L3   │  │ L4   │                   │
│  │ Card │  │ Card │                   │
│  └──────┘  └──────┘                   │
│                                         │
│  ... (10 levels total, 2 columns)      │
│                                         │
└─────────────────────────────────────────┘
```

### Header Section

**Background:** THEME.colors.background.tertiary (#222222)
**Border bottom:** 2px solid THEME.colors.border.default (#333333)
**Padding:** 16px horizontal, 12px vertical (plus safe area insets)

**Campaign Title:**
- Text: "Campaign: The Bastion"
- Font size: 24px (THEME.typography.fontSize.xl)
- Font weight: '800' (THEME.typography.fontWeight.extrabold)
- Color: THEME.colors.text.primary (#FFFFFF)
- Margin bottom: 12px

**Progress Bar:**
- Component: ProgressBar (full variant)
- Shows: X/30 stars (10 levels × 3 stars)
- Margin bottom: 8px

**Back Button:**
- Position: Absolute top-left (with safe area)
- Icon: ArrowLeft (24px)
- Size: 44×44px touch target
- Background: THEME.colors.border.default (#333333)
- Border radius: 8px

### Content Section (ScrollView)

**Background:** THEME.colors.background.secondary (#1a1a1a)

**Padding:** 16px all sides

**Grid Layout:**
- 2 columns
- Column gap: 16px (THEME.spacing.md)
- Row gap: 16px (THEME.spacing.md)
- Use FlatList with numColumns={2} for performance

**Content container:**
- Padding bottom: 32px (extra space at bottom)
- Shows vertical scroll indicator

### Level Ordering

**Progression:**
1. Level 1: Always unlocked
2. Levels 2-10: Unlocked by completing previous level
3. Current level: Subtle blue glow on border
4. Future levels: Locked appearance

### Empty State

**If no levels loaded:**
- Centered message: "No campaign levels available"
- Font size: 16px
- Color: THEME.colors.text.tertiary (#AAAAAA)
- Icon: AlertCircle (48px above text)

### Performance Optimizations

- ✅ Use FlatList instead of ScrollView + map
- ✅ Implement keyExtractor for stable keys
- ✅ Avoid shadows on ScrollView items (use border instead)
- ✅ Memoize LevelCard components
- ✅ Use getItemLayout for FlatList optimization

---

## 6. VictoryScreenEnhanced Component

**File:** `components/campaign/VictoryScreenEnhanced.tsx`

### Purpose
Displays victory screen after level completion with animated star reveal and campaign progression.

### Visual Specifications

**Modal Overlay:**
- Background: THEME.colors.overlay.darker (rgba(0,0,0,0.9))
- Full screen coverage
- Prevents interaction with background

**Content Panel:**
- Background: THEME.colors.background.elevated (#2a2a2a)
- Width: 90% of screen width (max 500px)
- Border radius: 16px (THEME.borderRadius.lg)
- Border: 2px solid THEME.colors.success (#4CAF50)
- Shadow: THEME.shadows.lg
- Padding: 32px

### Layout Structure

```
┌─────────────────────────────────────┐
│                                     │
│         ⭐ VICTORY! ⭐              │ ← Title with icons
│                                     │
│       ⭐  ⭐  ⭐                     │ ← Animated stars (large)
│                                     │
│  ┌─────────────────────────────┐  │
│  │ Stats Panel                 │  │ ← Performance stats
│  │ • Zombies Killed: 247       │  │
│  │ • Waves Survived: 10/10     │  │
│  │ • Scrap Earned: 350 🔩      │  │
│  │ • Time: 8:34                │  │
│  └─────────────────────────────┘  │
│                                     │
│  [  Next Level  ]  [  Replay  ]   │ ← Action buttons
│  [  Back to Campaign  ]            │ ← Secondary action
│                                     │
└─────────────────────────────────────┘
```

### Title Section

**Text:** "VICTORY!"
- Font size: 32px (THEME.typography.fontSize.xxl)
- Font weight: '900' (THEME.typography.fontWeight.black)
- Color: THEME.colors.success (#4CAF50)
- Text align: center
- Margin bottom: 24px

**Trophy Icons:**
- Icon: Trophy from lucide-react-native
- Size: 32px
- Color: THEME.colors.star.filled (#FFD700)
- Position: Left and right of title

### Star Rating Section

**Component:** StarRating (large size, animated)
- Size: 32px per star
- Animated: true
- Sequential reveal: 500ms delay between stars
- Animation: Scale from 0 to 1.2 to 1 with bounce
- Margin bottom: 32px

### Stats Panel

**Container:**
- Background: THEME.colors.background.secondary (#1a1a1a)
- Border radius: 12px (THEME.borderRadius.md)
- Padding: 20px
- Margin bottom: 24px

**Stats Layout:**
- Vertical list of stat rows
- Each row: Icon + Label + Value
- Gap between rows: 12px (THEME.spacing.md)

**Stat Row Format:**
```
[Icon] Label: Value
```

**Typography:**
- Font size: 16px (THEME.typography.fontSize.md)
- Font weight: '600' (THEME.typography.fontWeight.semibold)
- Label color: THEME.colors.text.secondary (#CCCCCC)
- Value color: THEME.colors.text.primary (#FFFFFF)

**Stats to Display:**
1. Zombies Killed: [number] (Skull icon, red)
2. Waves Survived: X/10 (CheckCircle icon, green)
3. Scrap Earned: [number] 🔩 (gold color)
4. Time: MM:SS (Clock icon)

### Action Buttons

**Primary Button (Next Level):**
- Background: THEME.colors.primary (#4A90E2)
- Height: 48px
- Border radius: 12px (THEME.borderRadius.md)
- Shadow: THEME.shadows.primary
- Text: "Next Level"
- Icon: ChevronRight (20px)
- Full width minus horizontal padding

**Secondary Button (Replay):**
- Background: THEME.colors.border.light (#444444)
- Height: 48px
- Border radius: 12px
- Text: "Replay Level"
- Icon: RotateCcw (20px)
- Width: 48% (two buttons side-by-side)

**Tertiary Button (Back to Campaign):**
- Background: transparent
- Border: 1px solid THEME.colors.border.light (#444444)
- Height: 48px
- Border radius: 12px
- Text: "Back to Campaign"
- Icon: ArrowLeft (20px)
- Full width minus horizontal padding

**Button Layout:**
- Next Level: Full width, margin bottom 12px
- Replay + Share: Side-by-side (if both shown)
- Back to Campaign: Full width, margin top 12px

### Star Award Logic

**1 Star:** Complete level (reach final wave)
**2 Stars:** Complete + Don't lose >50% hull integrity
**3 Stars:** Complete + Don't lose >20% hull + Earn 80%+ possible scrap

**Display in Panel:**
- Show star thresholds if <3 stars earned
- "Complete all waves: ✓"
- "Hull >50%: ✓ or ✗"
- "Scrap >80%: ✓ or ✗"

### Animation Sequence

1. **Modal fades in:** 300ms
2. **Title appears:** Scale animation, 200ms
3. **Stars reveal:** Sequential, 500ms delay each
4. **Stats fade in:** 300ms after stars complete
5. **Buttons slide up:** 200ms after stats

### Props Interface

```typescript
interface VictoryScreenProps {
  visible: boolean;
  levelId: string;
  starsEarned: number;        // 0-3
  stats: {
    zombiesKilled: number;
    wavesCompleted: number;
    scrapEarned: number;
    timeSeconds: number;
  };
  isLastLevel: boolean;        // Hide "Next Level" if true
  onNextLevel: () => void;
  onReplay: () => void;
  onBackToCampaign: () => void;
}
```

---

## 7. LevelDetailsModal Component

**File:** `components/campaign/LevelDetailsModal.tsx`

### Purpose
Shows detailed level information before starting. Includes objectives, difficulty, star requirements, and map preview.

### Visual Specifications

**Modal Overlay:**
- Background: THEME.colors.overlay.dark (rgba(0,0,0,0.7))
- Full screen coverage
- Dismissible by tapping outside

**Content Panel:**
- Background: THEME.colors.background.elevated (#2a2a2a)
- Width: 90% of screen width (max 600px)
- Max height: 80% of screen height
- Border radius: 16px (THEME.borderRadius.lg)
- Border: 2px solid THEME.colors.border.light (#444444)
- Shadow: THEME.shadows.lg
- Padding: 24px

### Layout Structure

```
┌───────────────────────────────────────┐
│ [X] Close                             │ ← Header with close
│                                       │
│ Level 3: Harbor Defense               │ ← Title + number
│ [MEDIUM] Difficulty Badge             │
│                                       │
│ The zombies are attacking the         │ ← Description
│ harbor. Defend the supply ships!      │
│                                       │
│ ┌─────────────────────────────────┐  │
│ │                                 │  │ ← Map preview
│ │    [Mini-map visualization]     │  │   (optional)
│ │                                 │  │
│ └─────────────────────────────────┘  │
│                                       │
│ Objectives:                           │ ← Star requirements
│ ⭐ Complete all waves                │
│ ⭐ Keep hull above 50%               │
│ ⭐ Earn 400+ scrap                   │
│                                       │
│ Level Stats:                          │
│ • Waves: 10                           │
│ • Starting Scrap: 100 🔩              │
│ • Recommended Towers: 4-6             │
│                                       │
│ [        Start Level        ]         │ ← Primary action
│ [          Cancel           ]         │ ← Secondary action
│                                       │
└───────────────────────────────────────┘
```

### Header Section

**Close Button:**
- Position: Absolute top-right
- Icon: X (24px)
- Size: 44×44px touch target
- Color: THEME.colors.text.secondary (#CCCCCC)

### Title Section

**Level Title:**
- Format: "Level [N]: [Name]"
- Font size: 24px (THEME.typography.fontSize.xl)
- Font weight: '800' (THEME.typography.fontWeight.extrabold)
- Color: THEME.colors.text.primary (#FFFFFF)
- Margin bottom: 8px

**Difficulty Badge:**
- Component: DifficultyBadge (medium size)
- Positioned: Below title
- Margin bottom: 16px

### Description Section

**Text:**
- Font size: 14px (THEME.typography.fontSize.sm)
- Font weight: '400' (THEME.typography.fontWeight.normal)
- Color: THEME.colors.text.tertiary (#AAAAAA)
- Line height: 20px
- Margin bottom: 20px

### Map Preview (Optional)

**Container:**
- Height: 200px
- Background: THEME.colors.background.secondary (#1a1a1a)
- Border radius: 12px (THEME.borderRadius.md)
- Border: 1px solid THEME.colors.border.default (#333333)
- Margin bottom: 20px

**Content:**
- Miniature version of GameMap
- Shows waypoints and construction spots
- Non-interactive (preview only)
- Scale: Fit to container

### Objectives Section

**Title:**
- Text: "Star Requirements:"
- Font size: 16px (THEME.typography.fontSize.md)
- Font weight: '700' (THEME.typography.fontWeight.bold)
- Color: THEME.colors.text.primary (#FFFFFF)
- Margin bottom: 12px

**Objective Rows:**
- Layout: Icon + Text
- Icon: Star (16px, gold or gray)
- Text font size: 14px
- Text color: THEME.colors.text.secondary (#CCCCCC)
- Gap between rows: 8px
- Margin bottom: 20px

**Format:**
```
⭐ Complete all waves (1 star)
⭐ Keep hull above 50% (2 stars)
⭐ Earn 400+ scrap (3 stars)
```

### Level Stats Section

**Title:**
- Text: "Level Info:"
- Font size: 16px
- Font weight: '700'
- Color: THEME.colors.text.primary (#FFFFFF)
- Margin bottom: 12px

**Stats Rows:**
- Format: "• Label: Value"
- Font size: 14px
- Color: THEME.colors.text.secondary (#CCCCCC)
- Gap between rows: 6px
- Margin bottom: 24px

**Stats to Show:**
- Total waves: [number]
- Starting scrap: [number] 🔩
- Recommended towers: [range]
- Map type: [name] (optional)

### Action Buttons

**Start Level Button:**
- Background: THEME.colors.success (#4CAF50)
- Height: 48px
- Border radius: 12px (THEME.borderRadius.md)
- Shadow: THEME.shadows.success
- Text: "Start Level"
- Icon: Play (20px, left)
- Full width
- Margin bottom: 12px

**Cancel Button:**
- Background: transparent
- Border: 1px solid THEME.colors.border.light (#444444)
- Height: 48px
- Border radius: 12px
- Text: "Cancel"
- Full width

### Locked State

**If level is locked:**
- Start button disabled
- Background: THEME.colors.border.default (#333333)
- Text: "Complete Previous Level"
- Icon: Lock (20px)
- Text color: THEME.colors.text.disabled (#666666)

### Props Interface

```typescript
interface LevelDetailsModalProps {
  visible: boolean;
  level: LevelConfig | null;
  playerProgress: LevelProgress | null;  // null if not completed
  isUnlocked: boolean;
  onStart: () => void;
  onClose: () => void;
}
```

---

## Accessibility Guidelines

All components must follow these accessibility standards:

### Touch Targets
- ✅ Minimum 44×44px (iOS guideline)
- ✅ Recommended 48×48px for primary actions
- ✅ Sufficient spacing between interactive elements (8px minimum)

### Color Contrast
- ✅ Text on background: Minimum 4.5:1 ratio
- ✅ White (#FFFFFF) on dark backgrounds meets WCAG AA
- ✅ Use THEME.colors.text.primary for important text
- ✅ Avoid light gray on gray backgrounds

### Focus States
- ✅ Visual feedback on press (activeOpacity: 0.7)
- ✅ Disabled states clearly indicated (opacity: 0.5)
- ✅ Border/shadow changes for selected elements

### Screen Readers (Future Enhancement)
- Add accessibilityLabel to all interactive elements
- Add accessibilityRole to buttons, headers
- Add accessibilityHint for complex interactions

---

## Performance Considerations

### Rendering Optimization
- ✅ Use FlatList for level grids (virtualization)
- ✅ Memoize expensive components (React.memo)
- ✅ Avoid inline styles and functions in render
- ✅ Use StyleSheet.create() for all styles

### Animation Performance
- ✅ Use native driver for transforms/opacity
- ✅ Avoid animating layout properties (width/height)
- ✅ Keep animations under 500ms for responsiveness
- ✅ Use LayoutAnimation for simple transitions

### Shadow Performance
- ⚠️ Shadows are expensive on Android
- ✅ Use shadows sparingly (buttons, modals only)
- ✅ Avoid shadows on ScrollView items
- ✅ Consider borders instead of shadows for cards

### Image Optimization
- ✅ Use appropriate image sizes (no larger than needed)
- ✅ Implement lazy loading for thumbnails
- ✅ Cache images aggressively
- ✅ Provide fallback backgrounds

---

## Implementation Priority

### Phase 1 (Foundation)
1. ✅ Theme constants (THEME object)
2. StarRating component
3. DifficultyBadge component
4. ProgressBar component

### Phase 2 (Core UI)
5. LevelCard component (all states)
6. LevelSelectScreen layout
7. Basic navigation

### Phase 3 (Enhanced)
8. LevelDetailsModal
9. VictoryScreenEnhanced
10. Animations and polish

---

## Testing Checklist

### Visual Testing
- [ ] All colors match THEME constants
- [ ] Typography consistent across components
- [ ] Spacing uses THEME.spacing values
- [ ] Border radius uses THEME.borderRadius values
- [ ] Shadows match THEME.shadows specifications

### Interaction Testing
- [ ] All buttons have 44×44px touch targets minimum
- [ ] Disabled states prevent interaction
- [ ] Modal overlays dismiss correctly
- [ ] Locked levels show appropriate feedback
- [ ] Animations run smoothly at 60fps

### Data Testing
- [ ] 0 stars displays correctly
- [ ] 1-3 stars display correctly
- [ ] Locked/unlocked states render properly
- [ ] Progress bar calculates correctly
- [ ] Victory screen shows accurate stats

### Edge Cases
- [ ] Very long level names (ellipsis)
- [ ] No levels available (empty state)
- [ ] Last level completed (no "Next" button)
- [ ] All levels completed (congratulations state)

---

**End of Specifications**

Next Phase: PHASE-004-COMPONENT-IMPLEMENTATION
