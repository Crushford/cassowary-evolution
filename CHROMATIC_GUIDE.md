# 🎨 Chromatic Visual Testing Guide

Chromatic is a powerful visual testing platform that integrates with Storybook to provide comprehensive visual regression testing, design system management, and team collaboration tools.

## 🚀 What Chromatic Can Do

### 1. **Visual Regression Testing**

- **Automatic Screenshots**: Captures every story in your Storybook
- **Cross-Browser Testing**: Tests across Chrome, Firefox, Safari, and mobile
- **Responsive Testing**: Multiple viewport sizes automatically
- **Visual Diffs**: Highlights exactly what changed between versions

### 2. **Design System Management**

- **Component Library**: Centralized view of all your components
- **Version History**: Track changes over time
- **Design Tokens**: Manage colors, typography, spacing consistently
- **Accessibility Testing**: Built-in a11y checks

### 3. **Team Collaboration**

- **Review Interface**: Easy approval/rejection of visual changes
- **Comments & Annotations**: Discuss changes directly on screenshots
- **Design Handoff**: Share components with designers and stakeholders
- **Integration**: Works with GitHub, GitLab, Slack, etc.

### 4. **CI/CD Integration**

- **PR Comments**: Automatic visual change summaries in pull requests
- **Build Status**: Block merges if visual tests fail
- **Baseline Management**: Automatic baseline updates
- **Parallel Testing**: Fast feedback on every commit

## 🛠️ Setup Instructions

### Step 1: Get Your Project Token

1. Go to [chromatic.com](https://chromatic.com)
2. Sign up with your GitHub account
3. Create a new project for "evolution"
4. Copy your project token

### Step 2: Add Token to GitHub Secrets

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add new secret: `CHROMATIC_PROJECT_TOKEN`
4. Paste your token value

### Step 3: Update Configuration

Replace `YOUR_CHROMATIC_PROJECT_TOKEN` in `.chromaticrc.json` with your actual token.

## 📸 Visual Snapshot Management

### Automatic Snapshots

Chromatic automatically captures:

- **All Storybook Stories**: Every story in your `.stories.tsx` files
- **Multiple Viewports**: Desktop, tablet, mobile automatically
- **Cross-Browser**: Chrome, Firefox, Safari
- **Interactive States**: Hover, focus, active states

### Manual Snapshot Updates

```bash
# Update all snapshots
yarn chromatic

# Update and auto-accept changes
yarn chromatic:ci

# Update specific stories only
yarn chromatic --only-changed
```

### Viewing Snapshots in GitHub

1. **PR Comments**: Chromatic automatically comments on PRs with visual changes
2. **Build Status**: Check the Actions tab for Chromatic build results
3. **Direct Links**: Click through to Chromatic's web interface for detailed review

## 🎯 Advanced Chromatic Features

### 1. **Story Annotations**

Add visual testing metadata to your stories:

```typescript
export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
  },
  parameters: {
    chromatic: {
      // Skip this story in visual tests
      disable: false,
      // Test specific viewports only
      viewports: [320, 768, 1024],
      // Delay before screenshot
      delay: 1000,
      // Test specific interactions
      modes: {
        hover: { hover: true },
        focus: { focus: true },
      },
    },
  },
};
```

### 2. **Visual Testing Tags**

Organize your visual tests:

```typescript
export const Primary: Story = {
  // ... story config
  tags: ['visual', 'button', 'primary'],
  parameters: {
    chromatic: {
      tags: ['visual', 'critical'], // Only test critical components
    },
  },
};
```

### 3. **Custom Viewports**

Test specific screen sizes:

```typescript
// In .storybook/preview.ts
export const parameters = {
  chromatic: {
    viewports: [
      { name: 'mobile', styles: { width: '375px', height: '667px' } },
      { name: 'tablet', styles: { width: '768px', height: '1024px' } },
      { name: 'desktop', styles: { width: '1024px', height: '768px' } },
      { name: 'wide', styles: { width: '1920px', height: '1080px' } },
    ],
  },
};
```

### 4. **Interaction Testing**

Test user interactions:

```typescript
export const WithInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    // Test hover state
    await userEvent.hover(button);
    await expect(button).toHaveClass('hovered');

    // Test click state
    await userEvent.click(button);
    await expect(button).toHaveClass('clicked');
  },
};
```

## 🔧 GitHub Integration

### PR Comments

Chromatic automatically adds comments like:

```
## 🎨 Visual Changes Detected

| Component | Status | Changes |
|-----------|--------|---------|
| Button/Primary | ✅ Approved | No changes |
| Button/Secondary | ⚠️ Review | Color updated |
| Card/Default | ❌ Failed | Layout shifted |

[View in Chromatic](https://chromatic.com/build/123)
```

### Build Status Checks

- ✅ **Passed**: No visual changes or all approved
- ⚠️ **Review**: Visual changes need approval
- ❌ **Failed**: Visual changes rejected

### Branch Protection

Set up branch protection rules to require Chromatic approval:

1. Go to repository Settings → Branches
2. Add rule for main branch
3. Require status checks: "chromatic"
4. This prevents merging without visual approval

## 📊 Chromatic Dashboard Features

### 1. **Component Library View**

- Browse all components visually
- Filter by tags, status, or changes
- Compare versions side-by-side
- Download component assets

### 2. **Change Management**

- Review all visual changes
- Approve or reject changes
- Add comments and annotations
- Track change history

### 3. **Team Collaboration**

- Assign reviewers
- Get notifications for changes
- Share component links
- Export design assets

### 4. **Analytics & Insights**

- Component usage statistics
- Change frequency analysis
- Performance metrics
- Team activity reports

## 🚀 Best Practices

### 1. **Story Organization**

```typescript
// Group related stories
export default {
  title: 'Components/Button',
  component: Button,
  tags: ['visual', 'component'],
  parameters: {
    chromatic: {
      tags: ['visual'],
    },
  },
};
```

### 2. **Meaningful Story Names**

```typescript
// Good: Descriptive names
export const PrimaryButton = { ... };
export const DisabledButton = { ... };
export const ButtonWithIcon = { ... };

// Bad: Generic names
export const Default = { ... };
export const Test = { ... };
```

### 3. **Test Coverage**

- Test all component variants
- Include edge cases (empty states, loading, errors)
- Test different content lengths
- Include interactive states

### 4. **Performance**

- Use `onlyChanged: true` for faster builds
- Skip non-visual stories with `chromatic: { disable: true }`
- Use tags to organize test runs
- Cache Storybook builds in CI

## 🔍 Troubleshooting

### Common Issues

1. **Storybook Build Fails**

   ```bash
   # Check Storybook configuration
   yarn storybook --debug

   # Verify dependencies
   yarn install
   ```

2. **Snapshots Not Updating**

   ```bash
   # Force update all snapshots
   yarn chromatic --auto-accept-changes
   ```

3. **False Positives**
   - Check for dynamic content (timestamps, random IDs)
   - Use `chromatic: { delay: 1000 }` for animations
   - Mock external dependencies

4. **Missing Stories**
   - Ensure stories are in the correct directory
   - Check Storybook configuration
   - Verify story exports

### Debug Commands

```bash
# Debug Chromatic locally
yarn chromatic --debug

# Test specific stories
yarn chromatic --only-changed

# Skip upload, just build
yarn chromatic --upload-only=false
```

## 📈 Advanced Workflows

### 1. **Design System Publishing**

- Publish component library to Chromatic
- Share with external teams
- Version control design tokens
- Generate style guides

### 2. **Cross-Team Collaboration**

- Share component links with designers
- Get stakeholder approval on changes
- Export assets for design tools
- Integrate with design systems

### 3. **Automated Testing**

- Run visual tests on every commit
- Block merges on visual failures
- Auto-approve non-breaking changes
- Generate visual change reports

This comprehensive setup will give you professional-grade visual testing and design system management! 🎨✨
