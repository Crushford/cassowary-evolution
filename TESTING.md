# Cassowary Queen — Testing Guide

This document outlines the comprehensive testing strategy for the Cassowary Queen evolution game, covering unit tests, integration tests, and end-to-end (E2E) tests.

## Test Structure

```
tests/
├── unit/                    # Unit tests for individual functions
│   ├── levels.spec.ts      # Level generation and configuration
│   ├── ep.spec.ts          # Evolution Points accounting
│   ├── evolution.spec.ts   # Evolution gating and costs
│   └── boardThresholds.spec.ts # Board transition selection
├── integration/            # Integration tests for component interactions
│   ├── dealEngine.spec.ts  # Deal engine + odds integration
│   └── evolutionModal.spec.ts # Evolution modal functionality
├── e2e/                    # End-to-end Playwright tests
│   ├── helpers.ts          # Test helper functions
│   ├── 01_tutorial_intro_growth.spec.ts
│   ├── 02_ep_milestones_evolution.spec.ts
│   ├── 03_cycle_reset.spec.ts
│   └── 04_a11y_focus.spec.ts
└── storybook/              # Visual regression tests
    ├── button.spec.ts
    └── storybook-visual.spec.ts
```

## Test Commands

### Unit Tests
```bash
# Run all unit tests
yarn test:unit

# Run specific unit test
yarn test tests/unit/levels.spec.ts
```

### Integration Tests
```bash
# Run all integration tests
yarn test:integration

# Run specific integration test
yarn test tests/integration/dealEngine.spec.ts
```

### E2E Tests
```bash
# Run all E2E tests
yarn test:e2e

# Run E2E tests with UI
yarn test:e2e:ui

# Run specific E2E test suites
yarn test:e2e:smoke      # Fast smoke tests
yarn test:e2e:balanced   # Recommended test suite
yarn test:e2e:exhaustive # Full test suite including A11y
```

### All Tests
```bash
# Run all tests (unit + integration + E2E balanced)
yarn test:all

# Run all tests including visual regression
yarn test:all:visual
```

## Test Configuration

### Data Test IDs

The following data-testids are required for E2E tests:

#### Core HUD
- `population` - Current population count
- `round` - Current round number
- `ep-balance` - Evolution Points balance
- `board-card-count` - Current number of cards on board
- `board-scale-label` - Scale label (nest/grove/valley/etc.)

#### Intro Modal
- `intro-modal` - Intro modal container
- `intro-next` - Begin Level 1 button
- `intro-skip` - Skip Tutorial button

#### Board
- `card-{index}` - Individual cards (0..cardCount-1)
- `end-round` - Admire board button
- `continue` - Next season button

#### Toasts
- `toast-board-growth` - Board growth notification
- `toast-ep-gain` - EP gain notification

#### Evolution
- `evolution-open` - Open evolution modal button
- `evolution-modal` - Evolution modal container
- `evolution-node-{id}` - Individual evolution nodes

### Test Mode

Tests use `?testMode=1` to enable:
- Instant animations (no delays)
- Deterministic behavior
- Faster test execution
- Disabled motion for accessibility

### Seeded RNG

Tests use `?seed=SEED` for deterministic behavior:
- `cq-e2e-seed-01` - Tutorial and growth tests
- `cq-e2e-seed-02` - EP and evolution tests
- `cq-e2e-seed-03` - Full cycle tests
- `cq-e2e-seed-04` - A11y tests

## Test Scenarios

### Unit Tests

#### Level Generation (`levels.spec.ts`)
- ✅ First cycle thresholds: [1,10,50,100,200,400] → [5,10,15,20,40,80] cards
- ✅ Next cycle starts at 5 again with cycleIndex = 1
- ✅ Layout matches expectations for each card count
- ✅ Uses fruitConstantL1 odds key
- ✅ Snapshot test for first 18 levels

#### EP Accounting (`ep.spec.ts`)
- ✅ EP increments by exact number of deaths
- ✅ Predator mitigation prevents EP gain
- ✅ EP milestone tier calculation: Math.floor(ep / 10)

#### Evolution Gating (`evolution.spec.ts`)
- ✅ visibleNodes(ep) returns nodes with tier <= floor(ep/10)
- ✅ Node purchase validation (cost, prerequisites)
- ✅ Effects application (popCapIncrease, extraFoodTiles, etc.)

#### Board Thresholds (`boardThresholds.spec.ts`)
- ✅ Correct level selection for population thresholds
- ✅ No downsize on population drop within cycle
- ✅ Proper cycle progression

### Integration Tests

#### Deal Engine (`dealEngine.spec.ts`)
- ✅ Deterministic results with same seed
- ✅ Correct composition with fruitConstantL1 odds
- ✅ Extra food tiles modifier integration
- ✅ Distribution consistency over many deals

#### Evolution Modal (`evolutionModal.spec.ts`)
- ✅ Modal visibility based on EP milestones
- ✅ Node purchase validation and effects
- ✅ Prerequisite handling
- ✅ Branch categorization

### E2E Tests

#### Tutorial Flow (`01_tutorial_intro_growth.spec.ts`)
- ✅ Intro modal appears and can be navigated
- ✅ Correct initial state (population=1, 5 cards)
- ✅ Board growth at population 10 (5→10 cards)
- ✅ Board growth at population 50 (10→15 cards)
- ✅ Toast notifications appear exactly once per threshold

#### EP Milestones (`02_ep_milestones_evolution.spec.ts`)
- ✅ EP accumulation from deaths
- ✅ Evolution modal opens at EP milestone 10
- ✅ Node purchase and EP deduction
- ✅ Prerequisite validation
- ✅ Tier progression (10, 20, 30, 40+ EP)

#### Full Cycle (`03_cycle_reset.spec.ts`)
- ✅ Complete progression: 5→10→15→20→40→80 cards
- ✅ Correct scale labels: nest→grove→glade→valley→region→province
- ✅ Board growth toasts at each threshold
- ✅ Milestone timing recording for regression testing

#### A11y Focus (`04_a11y_focus.spec.ts`)
- ✅ Proper focus order from load
- ✅ Keyboard navigation for cards and modals
- ✅ ARIA labels and roles
- ✅ Screen reader compatibility
- ✅ Reduced motion support

## Test Data and Snapshots

### Snapshot Files
- `first-18-levels.json` - Level configuration snapshot
- `rounds-growth-l1.txt` - Growth timing data
- `cycle-progression.csv` - Board growth progression
- `milestone-timings.csv` - Threshold timing data

### Test Seeds
Each test suite uses specific seeds for deterministic behavior:
- **Seed 01**: Optimized for tutorial flow and basic growth
- **Seed 02**: Includes occasional failures for EP accumulation
- **Seed 03**: Balanced for full cycle progression
- **Seed 04**: Optimized for accessibility testing

## CI/CD Integration

### Pre-test Setup
```bash
# Generate configuration
./scripts/generate-test-config.sh

# Verify configuration
yarn lint
yarn tsc --noEmit
```

### Test Execution Order
1. **Unit Tests** - Fast, isolated function tests
2. **Integration Tests** - Component interaction tests
3. **E2E Tests** - Full user journey tests
4. **Visual Tests** - UI regression tests

### Test Profiles

#### Fast Smoke (CI Quick)
- Unit tests
- Integration tests
- E2E: Tutorial + EP milestones only

#### Balanced (Recommended)
- All unit tests
- All integration tests
- E2E: Tutorial + EP + Full cycle

#### Exhaustive (Full)
- All tests including A11y
- Long-running cycle tests
- Complete regression suite

## Debugging Tests

### Running Individual Tests
```bash
# Unit test
yarn test tests/unit/levels.spec.ts --verbose

# E2E test
yarn test tests/e2e/01_tutorial_intro_growth.spec.ts --headed

# E2E with UI
yarn test:e2e:ui
```

### Test Debugging
- Use `--headed` flag for E2E tests to see browser
- Use `--debug` flag for step-by-step debugging
- Check `playwright-report/` for detailed test results
- Use `yarn test:e2e:ui` for interactive test running

### Common Issues
1. **Flaky tests**: Check for proper waits and deterministic seeds
2. **Timeout errors**: Increase timeout or optimize test logic
3. **Missing data-testids**: Ensure all required test IDs are present
4. **Animation issues**: Verify testMode=1 is working correctly

## Performance Expectations

### Test Execution Times
- **Unit tests**: < 30 seconds
- **Integration tests**: < 1 minute
- **E2E smoke**: < 2 minutes
- **E2E balanced**: < 5 minutes
- **E2E exhaustive**: < 10 minutes

### Memory Usage
- Unit tests: < 100MB
- E2E tests: < 500MB per browser instance
- CI total: < 2GB

## Maintenance

### Adding New Tests
1. Follow existing naming conventions
2. Use appropriate test data and seeds
3. Add required data-testids to components
4. Update this documentation

### Updating Snapshots
```bash
# Update all snapshots
yarn update:snapshots

# Update specific test snapshots
yarn test --updateSnapshot tests/unit/levels.spec.ts
```

### Test Data Management
- Keep test seeds deterministic
- Use meaningful test data
- Document any special test scenarios
- Maintain snapshot files in version control