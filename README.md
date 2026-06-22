# Dream Builder

A life-growth civilization game where real-world progress rebuilds a fractured world.

## Monorepo structure

- `apps/web` — Next.js web app
- `apps/mobile` — Expo React Native mobile app
- `packages/game-core` — shared game logic, data models, and MVP rules

## Run the web app

```bash
npm install
npm run dev:web
```

Open [http://localhost:3000](http://localhost:3000).

## Run the mobile app

```bash
npm install
npm run dev:mobile
```

Then scan the QR code with Expo Go on your phone, or press `a` for Android / `i` for iOS simulator.

## MVP features implemented

- Player onboarding (name, civilization, first dream, district choice)
- Real-life goal board with five pillars and difficulty rewards
- Resource system: Dream Energy, Knowledge, Creativity, Influence
- The Cradle island with MVP buildings from your design docs
- Citizens: Orion, Atlas, Lyra, Mira with quest tracking
- World Tree growth stages
- Dream Journal and Reflection Mode
- Chapter 1 story beats
- Auto-save (web: localStorage, mobile: AsyncStorage)

## Next steps toward full vision

- 3D low-poly Cradle island (Unity or React Three Fiber)
- Ambient audio and citizen dialogue
- Cloud sync so web and mobile share one civilization
- Additional islands from the world map (Knowledge Isles, Forge Archipelago, etc.)
- Dream Mirror yearly summaries
