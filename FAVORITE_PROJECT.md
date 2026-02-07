# What project are you most proud of building with Claude Code?

A mobile tower defense game called **Zombie Fleet Bastion** -- a full-blown React Native / Expo game with 17 hand-crafted campaign levels, an endless survival mode with procedural wave generation, 8 enemy archetypes (from basic Shamblers to a 950 HP Hive Queen boss), upgradeable towers, strategic power-ups like nuclear strikes and time freezes, and a complete freemium monetization system. The whole thing runs cross-platform on iOS, Android, and web.

What I'm most proud of is the scope -- it's not a toy demo. It has a real game engine with delta-time physics, waypoint pathfinding, a star-rating progression system, persistent save state, and even Storybook for visual component testing. The entire codebase is ~86 TypeScript files with clean architecture: Zustand for state management, SVG-based rendering, and a fully data-driven level system where each level is its own config with unique maps, enemy compositions, and win conditions.

Building it with Claude Code meant I could iterate incredibly fast -- from balancing enemy stats to wiring up the campaign unlock chain to designing the procedural endless mode that dynamically scales difficulty across 6 tiers. It went from idea to a production-ready app with proper IAP scaffolding, privacy policy, and EAS deployment config.
