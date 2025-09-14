# Testing Setup

This project includes comprehensive testing setup with Playwright E2E tests, Storybook visual regression testing, and Chromatic integration.

## Test Types

### 1. Unit Tests
- **Command**: `yarn test`
- **Framework**: Jest + React Testing Library
- **Location**: `src/**/*.test.tsx`

### 2. End-to-End Tests
- **Command**: `yarn test:e2e`
- **Framework**: Playwright
- **Location**: `tests/*.spec.ts`
- **Config**: `playwright.config.ts`

### 3. Visual Regression Tests
- **Command**: `yarn test:visual`
- **Framework**: Playwright + Storybook
- **Location**: `tests/storybook/*.spec.ts`
- **Config**: `playwright-storybook.config.ts`

### 4. Chromatic Visual Testing
- **Command**: `yarn chromatic`
- **Service**: Chromatic
- **Config**: `.chromaticrc.json`

## Running Tests

### Local Development
```bash
# Run all tests
yarn test:all:visual

# Run specific test types
yarn test                    # Unit tests
yarn test:e2e               # E2E tests
yarn test:visual            # Visual tests
yarn chromatic              # Chromatic tests

# Interactive mode
yarn test:e2e:ui            # E2E tests with UI
yarn test:visual:ui         # Visual tests with UI
```

### CI/CD Pipeline
The GitHub Actions pipeline automatically runs:
1. **Install dependencies** and cache them
2. **Build** the application and Storybook
3. **Unit tests** with coverage reporting
4. **E2E tests** with Playwright
5. **Visual regression tests** against Storybook
6. **Chromatic tests** for visual changes

**Workflows:**
- `ci.yml`: Full CI pipeline for main/develop branches
- `pr-checks.yml`: Quick validation for pull requests

## Git Hooks

### Pre-commit Hook
Runs on every commit:
- ESLint checks
- Prettier formatting check
- TypeScript type checking
- Unit tests
- Build verification

### Pre-push Hook
Runs before pushing:
- All unit tests
- E2E tests
- Visual regression tests (if Storybook is built)

## Visual Testing

### Storybook Stories
All components should have corresponding Storybook stories in `src/**/*.stories.tsx`.

### Visual Snapshots
Visual snapshots are stored in `test-results/` and include:
- Desktop, tablet, and mobile viewports
- All story variations
- Accessibility checks

### Updating Snapshots
When visual changes are intentional:
```bash
# Update Playwright snapshots
yarn test:visual --update-snapshots

# Update Chromatic snapshots
yarn chromatic --auto-accept-changes
```

## Configuration

### Playwright
- **Main config**: `playwright.config.ts` (E2E tests)
- **Storybook config**: `playwright-storybook.config.ts` (Visual tests)
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari

### Storybook
- **Config**: `.storybook/main.ts`
- **Preview**: `.storybook/preview.ts`
- **Addons**: Essentials, Interactions, A11y, Viewport

### Chromatic
- **Config**: `.chromaticrc.json`
- **Setup**: Requires project token from Chromatic
- **Integration**: Automatic on merge requests

## Troubleshooting

### Common Issues

1. **Visual tests failing**
   - Check if Storybook is running: `yarn storybook`
   - Verify viewport sizes match expected snapshots
   - Update snapshots if changes are intentional

2. **Chromatic tests failing**
   - Ensure project token is set in `.chromaticrc.json`
   - Check if Storybook build is successful
   - Verify network connectivity

3. **E2E tests timing out**
   - Increase timeout in `playwright.config.ts`
   - Check if application is running on correct port
   - Verify test selectors are correct

### Debug Mode
```bash
# Run tests in debug mode
yarn test:visual --debug
yarn test:e2e --debug

# Run specific test
yarn test:visual --grep "Button Component"
```

## Best Practices

1. **Write comprehensive stories** for all components
2. **Test multiple viewports** for responsive design
3. **Update snapshots** when making intentional visual changes
4. **Keep tests fast** by using appropriate timeouts
5. **Use meaningful test names** and descriptions
6. **Test accessibility** with proper ARIA attributes
7. **Mock external dependencies** in tests
8. **Clean up test data** after each test

## CI/CD Integration

The testing setup is fully integrated with GitHub Actions:
- Runs on every pull request and push to main/develop
- Provides detailed test reports and PR comments
- Stores artifacts for debugging
- Supports parallel execution
- Includes coverage reporting
- Two workflow types:
  - **Full CI**: Comprehensive testing on main/develop branches
  - **PR Checks**: Quick validation for pull requests

### Required Secrets
Add these secrets to your GitHub repository:
- `CHROMATIC_PROJECT_TOKEN`: Your Chromatic project token for visual testing
