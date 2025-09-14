# 🦚 Cassowary Queen - Evolution Game

A strategic evolution simulation game built with React, TypeScript, and Tailwind CSS.

## 🎮 How to Play

You are the Cassowary Queen, leading your dynasty through evolutionary epochs. Place your male partners on the 9×9 grid to find safe nesting grounds and earn nectar-chips.

### Gameplay

- **Select 3 tiles** each round to place your partners
- **Food tiles** 🍎 give you nectar-chips
- **Barren tiles** 🌱 give nothing
- **Predator tiles** 🦅 are dangerous but can be survived with upgrades
- The center tile (Q) is your Queen's nest and cannot be selected

### Evolution

- Spend nectar-chips on **upgrades** to improve your chances
- **Claws** give you a 50% chance to survive predators
- **Add Partners** to place more males each round
- **Scout Instinct** reveals safe tiles before selection

### Prestige

When you reach the era's chip cap, you can **prestige** to advance to the next era. This resets your chips but keeps permanent traits and makes the game harder with bigger rewards.

## 🚀 Development

### Prerequisites

- Node.js 20+
- Yarn package manager

### Local Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
# or
yarn start
```

Open [http://localhost:3000](http://localhost:3000) to view the game.

### Testing

```bash
# Run unit tests
yarn test

# Run E2E tests (requires build first)
yarn build && yarn test:e2e

# Run visual regression tests
yarn test:visual

# Run all tests
yarn test:all:visual
```

### Production Preview

```bash
# Build and preview production build locally
yarn build && yarn preview
```

## 🌐 Deployments (Vercel)

We deploy with **Vercel**.

- **Preview**: every PR gets a unique URL (see the PR checks)
- **Production**: merges to `main` auto-deploy

### Environment Variables

Set in Vercel project settings (Development/Preview/Production):

- `REACT_APP_DEFAULT_SEED` – default RNG seed
- `REACT_APP_ENABLE_SFX` – `true|false`
- `REACT_APP_ANALYTICS` – `off|vercel|plausible|...`

### SPA Routing (Create React App)

We use `vercel.json` to rewrite all routes to `index.html` for client-side routing.

### CI

GitHub Actions runs linting, unit tests, build, and E2E tests on PRs.

## 🎯 Game Features

### Tutorial System

- 3x3 tutorial mode for new players
- URL parameters for testing: `?seed=...`, `?testMode=1`, `?fastPeek=1`

### Accessibility

- Full keyboard navigation support
- Screen reader compatible
- ARIA labels and roles
- High contrast design

### Testing

- Comprehensive Playwright E2E tests
- Visual regression testing with Storybook
- Accessibility testing
- Keyboard-only gameplay testing

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS (utility-first)
- **Testing**: Playwright, Jest, Testing Library
- **Build**: Create React App
- **Deployment**: Vercel
- **Package Manager**: Yarn

## 📁 Project Structure

```
src/
├── components/          # React components
├── game/               # Game logic and reducers
├── types/              # TypeScript definitions
├── lib/                # Utilities (RNG)
├── config/             # Game configuration
└── styles/             # Global styles and colors
```

## 🎲 Randomness & Reproducibility

The game uses seeded random number generation for reproducible gameplay:

- Default seed: `cassowary-default-seed`
- URL parameter: `?seed=your-seed-here`
- Uses `seedrandom` library for consistent results

---

_Built with ❤️ for strategic evolution simulation enthusiasts_
