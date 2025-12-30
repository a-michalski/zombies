# Map Editor - Proposal for Separate Application

## Overview

Proposal for a standalone WYSIWYG map editor application for creating tower defense maps. This would be a separate repository from the main game, allowing independent development and distribution.

## Purpose

Create a visual editor that allows game designers to:
- Visually design maps without writing code
- Place waypoints (enemy path) by clicking on the grid
- Place construction spots (tower locations) visually
- Export maps in the exact format used by the game
- Import and edit existing maps

## Technical Stack

### Recommended Technologies
- **Framework**: React + TypeScript (web-based)
- **Rendering**: Canvas API or SVG for map visualization
- **State Management**: React Context or Zustand
- **UI Library**: Tailwind CSS or styled-components
- **Build Tool**: Vite or Next.js
- **Export**: Generate TypeScript files matching `LevelConfig` format

### Alternative: Desktop Application
- **Electron** + React (cross-platform desktop app)
- Better for offline use
- Can save files directly to game's `data/maps/` folder

## Application Structure

```
map-editor/
├── src/
│   ├── components/
│   │   ├── MapCanvas.tsx          # Main map rendering
│   │   ├── Toolbar.tsx            # Top toolbar (Save, Export, Import)
│   │   ├── ToolPanel.tsx           # Left side - tools selection
│   │   ├── PropertiesPanel.tsx    # Right side - selected element properties
│   │   ├── GridOverlay.tsx       # Grid visualization
│   │   ├── WaypointRenderer.tsx  # Waypoint visualization
│   │   └── ConstructionSpotRenderer.tsx
│   ├── types/
│   │   └── editor.ts              # Editor-specific types
│   ├── utils/
│   │   ├── export.ts              # Export to LevelConfig format
│   │   ├── import.ts              # Import from LevelConfig
│   │   └── validation.ts          # Map validation
│   ├── hooks/
│   │   ├── useMapEditor.ts        # Main editor logic
│   │   └── useDragAndDrop.ts      # Drag & drop functionality
│   └── App.tsx
├── package.json
└── README.md
```

## UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [Save] [Export TS] [Import] [New Map] [Validate]          │ ← Toolbar
├──────────┬──────────────────────────────────────┬───────────┤
│          │                                      │           │
│  TOOLS   │         MAP CANVAS (20x12 grid)     │ PROPERTIES│
│          │                                      │           │
│  [Waypoint]                                     │ Selected: │
│  [Construction]                                 │ Type:     │
│  [Delete]                                       │ X:        │
│  [Move]                                         │ Y:        │
│                                                 │ ID:       │
│  Current Tool:                                  │           │
│  Waypoint                                       │           │
│                                                 │           │
│  MAP INFO:                                      │           │
│  Waypoints: 4                                   │           │
│  Spots: 5                                       │           │
└──────────┴──────────────────────────────────────┴───────────┘
```

## Core Features

### 1. Map Canvas
- **Grid Overlay**: 20x12 tile grid (640x384px at 32px/tile)
- **Zoom**: Optional zoom in/out for detailed editing
- **Pan**: Drag to move around large maps
- **Snap to Grid**: Elements snap to grid intersections
- **Visual Feedback**: Highlight hovered tile, selected element

### 2. Waypoint Tool
- **Add Waypoint**: Click on grid to add waypoint
- **Auto-numbering**: Waypoints numbered 1, 2, 3... in order
- **Path Visualization**: Lines connecting waypoints
- **Start/End Markers**: Visual distinction (red start, blue end)
- **Reorder**: Drag waypoints to reorder path
- **Delete**: Right-click or Delete key to remove

### 3. Construction Spot Tool
- **Add Spot**: Click on grid to add construction spot
- **Auto-naming**: Spots named CS-01, CS-02, CS-03...
- **Visual Indicator**: Different color/shape from waypoints
- **Move**: Drag to reposition
- **Delete**: Right-click or Delete key

### 4. Properties Panel
- **Selected Element Info**:
  - Type (Waypoint/Construction Spot)
  - Position (X, Y in tile coordinates)
  - ID/Name
  - For waypoints: Order number
- **Editable Fields**: Direct input for position, ID
- **Validation**: Prevent invalid positions (out of bounds)

### 5. Export/Import
- **Export to TypeScript**: Generate `LevelConfig` file
- **Export Format**: Matches existing `data/maps/level-XX.ts` structure
- **Import**: Load existing map files
- **Copy to Clipboard**: Quick copy of generated code

### 6. Validation
- **Required Elements**:
  - At least 2 waypoints (start and end)
  - At least 1 construction spot
- **Bounds Check**: All elements within 0-20 (x) and 0-12 (y)
- **Path Check**: Waypoints form valid path
- **Warnings**: Highlight issues before export

## Data Model

### Editor State
```typescript
interface EditorState {
  waypoints: Array<{
    id: string;
    x: number;
    y: number;
    order: number;
  }>;
  constructionSpots: Array<{
    id: string;
    x: number;
    y: number;
  }>;
  selectedTool: 'waypoint' | 'construction' | 'delete' | 'move';
  selectedElement: {
    type: 'waypoint' | 'construction';
    id: string;
  } | null;
  gridSize: { width: 20; height: 12; tileSize: 32 };
}
```

### Export Format
Exports to exact `LevelConfig` format:
```typescript
export const LEVEL_XX: LevelConfig = {
  id: 'level-XX',
  mapConfig: {
    grid: { width: 20, height: 12, tileSize: 32 },
    waypoints: [...],
    constructionSpots: [...],
    // ... rest of config
  }
}
```

## Advanced Features (Future)

### Phase 2
- **Wave Editor**: Visual editor for enemy waves
- **Resource Configuration**: UI for starting scrap/hull
- **Star Requirements**: Configure star rating requirements
- **Background Preview**: Show map background image
- **Path Preview**: Animate enemy movement along path

### Phase 3
- **Template System**: Save/load map templates
- **Undo/Redo**: Full history support
- **Multi-select**: Select multiple elements
- **Copy/Paste**: Duplicate elements
- **Grid Presets**: Different grid sizes

## Integration with Game

### Export Options
1. **Copy to Clipboard**: Paste directly into game's `data/maps/`
2. **Download File**: Download `.ts` file
3. **Direct Integration**: If in monorepo, write directly to game folder

### Import Options
1. **File Upload**: Upload existing `level-XX.ts` file
2. **Paste Code**: Paste TypeScript code
3. **URL Import**: Import from GitHub/file server

## Development Phases

### Phase 1: MVP (Core Editor)
- [ ] Basic grid rendering
- [ ] Add/remove waypoints
- [ ] Add/remove construction spots
- [ ] Export to TypeScript
- [ ] Import from TypeScript

### Phase 2: Enhanced UX
- [ ] Drag & drop for moving elements
- [ ] Visual path rendering
- [ ] Properties panel
- [ ] Validation system
- [ ] Undo/redo

### Phase 3: Advanced Features
- [ ] Wave editor
- [ ] Resource configuration
- [ ] Star requirements UI
- [ ] Template system

## Repository Structure

```
zombie-map-editor/  (separate repo)
├── src/
├── public/
├── package.json
├── README.md
└── docs/
    └── INTEGRATION.md  # How to use exported maps in game
```

## Benefits

1. **No Code Required**: Designers can create maps without coding
2. **Visual Feedback**: See map layout immediately
3. **Faster Iteration**: Quick changes without file editing
4. **Error Prevention**: Validation prevents invalid maps
5. **Reusability**: Can be used for other tower defense games
6. **Standalone**: Independent development and deployment

## Technical Considerations

### Performance
- Canvas rendering for smooth interaction
- Efficient re-rendering (only update changed elements)
- Virtual scrolling for large maps (if needed)

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- No IE11 support needed
- Responsive design (but desktop-focused)

### File Format
- Export: TypeScript files (matches game format)
- Import: TypeScript or JSON (JSON for easier parsing)

## Example Workflow

1. **Open Editor**: Load application in browser
2. **Create New Map**: Click "New Map"
3. **Add Waypoints**: 
   - Select "Waypoint" tool
   - Click on grid to place start point
   - Click to add intermediate points
   - Click to place end point
4. **Add Construction Spots**:
   - Select "Construction Spot" tool
   - Click on grid to place spots
5. **Adjust**: Drag elements to fine-tune positions
6. **Validate**: Click "Validate" to check for issues
7. **Export**: Click "Export TS" to generate code
8. **Copy**: Copy generated code to game's `data/maps/level-XX.ts`

## Next Steps

1. Create separate repository: `zombie-map-editor`
2. Set up React + TypeScript project
3. Implement Phase 1 features
4. Test with existing maps (import/export)
5. Add to game's documentation as recommended tool

## Questions to Resolve

- [ ] Web app or Electron desktop app?
- [ ] Should it support editing waves/resources, or just map layout?
- [ ] Integration method: Copy-paste or direct file write?
- [ ] Should it be open-source or internal tool?




