# Cassowary Panchino MVP

A turn-based Pachinko game prototype with deterministic simulation and comprehensive testing.

## Features

- **Pure TypeScript Core**: Deterministic game logic with seedable RNG
- **React UI**: Minimal Storybook interface for visual testing
- **Comprehensive Testing**: Jest unit tests + Playwright interaction tests
- **Visual Regression**: Chromatic integration for UI snapshots

## Game Rules

- 6 rows of pegs, 7 bottom slots (indexed 0-6)
- Egg starts at center slot (3) and drops one row per turn
- Each step: 50% chance to move left (-1) or right (+1)
- Final column is clamped to 0-6 range
- Center slot (3) yields 1-3 chicks; all others yield 0
- One round = 3 drops, sum total chicks

## Quick Start

```bash
# Install dependencies
yarn install

# Run core simulation
yarn start --seed=42

# Run unit tests
yarn test

# Start Storybook
yarn storybook

# Run Playwright tests
yarn test-storybook
```

## Project Structure

```
panchino/
├── src/
│   ├── types.ts              # TypeScript interfaces
│   ├── rng.ts                # Deterministic RNG
│   ├── panchino.ts           # Core game logic
│   ├── run.ts                # CLI driver
│   └── ui/
│       ├── PanchinoBoard.tsx # React component
│       ├── state/
│       │   └── usePanchino.ts # State management hook
│       └── stories/
│           ├── PanchinoBoard.stories.tsx
│           └── PanchinoBoard.playwright.spec.ts
├── tests/                    # Jest unit tests
├── .storybook/              # Storybook config
└── dist/                    # Compiled output
```

## Testing Strategy

### Unit Tests (Jest)
- RNG determinism and distribution
- Game logic correctness
- Edge case handling
- Mathematical properties

### Visual Tests (Chromatic)
- UI state snapshots
- Deterministic visual regression
- Cross-browser compatibility

### Interaction Tests (Playwright)
- Turn-based stepping flow
- Edge clamping behavior
- Accessibility compliance
- Layout stability

## CLI Usage

```bash
# Basic run with default seed
yarn start

# Custom seed and drop count
yarn start --seed=123 --drops=5

# Example output:
# Seed: 123
# Drop 1: path L R R L L R -> slot 2 -> chicks 0
# Drop 2: path R R L R R R -> slot 6 -> chicks 0
# Drop 3: path L L R L R L -> slot 1 -> chicks 0
# Total chicks: 0
```

## Storybook Stories

- **BaseIdle**: Initial state
- **MidThreeSteps**: Mid-game state
- **EndCenterLanded**: Center slot success
- **EndLeftEdgeLanded**: Left edge landing
- **EndRightEdgeLanded**: Right edge landing
- **RoundThreeDropsSummary**: Complete round view

## Development

The codebase follows a pure functional approach:

1. **Core Logic**: No side effects, easy to test
2. **Deterministic**: Same seed = same results
3. **Modular**: Clear separation of concerns
4. **Type Safe**: Full TypeScript coverage

## Next Steps

This MVP provides a solid foundation for:
- Nudges (player agency)
- Slot weights (evolution mechanics)
- Predator tiles (risk/reward)
- Meta-progression systems

## License

MIT
