# What project are you most proud of building with Claude Code?

A mobile tower defense game called **Zombie Fleet Bastion** -- a full-blown React Native / Expo game with 17 hand-crafted campaign levels, an endless survival mode with procedural wave generation, 8 enemy archetypes (from basic Shamblers to a 950 HP Hive Queen boss), upgradeable towers, strategic power-ups like nuclear strikes and time freezes, and a complete freemium monetization system. The whole thing runs cross-platform on iOS, Android, and web.

What I'm most proud of is the scope -- it's not a toy demo. It has a real game engine with delta-time physics, waypoint pathfinding, a star-rating progression system, persistent save state, and even Storybook for visual component testing. The entire codebase is ~86 TypeScript files with clean architecture: Zustand for state management, SVG-based rendering, and a fully data-driven level system where each level is its own config with unique maps, enemy compositions, and win conditions.

Building it with Claude Code meant I could iterate incredibly fast -- from balancing enemy stats to wiring up the campaign unlock chain to designing the procedural endless mode that dynamically scales difficulty across 6 tiers. It went from idea to a production-ready app with proper IAP scaffolding, privacy policy, and EAS deployment config.

---

# What do you want to build for this hackathon?

I want to take what I learned building Zombie Fleet Bastion and go further -- build a **collaborative real-time level editor** for the game, powered by Claude. The idea is: you describe a level in natural language ("a narrow canyon with two chokepoints, heavy on Brutes, with a surprise Runner wave at the end") and Claude generates a fully playable level config -- waypoints, construction spots, wave compositions, star requirements, all of it. Then you can playtest it immediately in the app and tweak it conversationally ("make the third wave harder, add a Hive Queen at the end").

The game already has a completely data-driven level system -- each level is just a TypeScript object with grid layout, enemy waves, and scoring rules. That's the perfect foundation. The hackathon project would wire Claude's API into a level design interface where the AI understands game balance (enemy HP/speed/damage curves, tower DPS calculations, resource economy) and generates levels that are actually fun to play, not just syntactically valid.

The stretch goal would be letting players share AI-generated levels with each other -- basically a community map workshop powered by natural language.
