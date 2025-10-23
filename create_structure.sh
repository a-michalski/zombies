#!/usr/bin/env bash
set -e

# Create directories
mkdir -p app
mkdir -p assets/images
mkdir -p components/game
mkdir -p constants
mkdir -p contexts
mkdir -p hooks
mkdir -p types
mkdir -p utils

# Create empty files in app/
touch app/_layout.tsx
touch app/+not-found.tsx
touch app/game.tsx
touch app/index.tsx

# Create empty asset image files
touch assets/images/adaptive-icon.png
touch assets/images/favicon.png
touch assets/images/icon.png
touch assets/images/splash-icon.png

# Create empty component files
touch components/game/BuildMenu.tsx
touch components/game/EnemyRenderer.tsx
touch components/game/GameMap.tsx
touch components/game/GameOverScreen.tsx
touch components/game/ProjectileRenderer.tsx
touch components/game/TowerRenderer.tsx
touch components/game/UpgradeMenu.tsx
touch components/game/VisualEffects.tsx

# Create empty constants files
touch constants/colors.ts
touch constants/enemies.ts
touch constants/gameConfig.ts
touch constants/towers.ts
touch constants/waves.ts

# Create empty context file
touch contexts/GameContext.tsx

# Create empty hook
touch hooks/useGameEngine.ts

# Create empty type file
touch types/game.ts

# Create empty utility file
touch utils/pathfinding.ts

# Create empty top-level files
touch .gitignore
touch app.json
touch bun.lock
touch eslint.config.js
touch package.json
touch README.md
touch tsconfig.json

echo "Project structure created successfully."

