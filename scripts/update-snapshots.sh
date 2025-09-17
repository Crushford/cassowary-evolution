#!/bin/bash

# Script to update visual snapshots and add them to git staging
echo "📸 Updating visual snapshots..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: Please run this script from the project root directory"
  exit 1
fi

# Try to build Storybook if it doesn't exist
if [ ! -d "storybook-static" ]; then
  echo "📚 Building Storybook..."
  if yarn build-storybook > /dev/null 2>&1; then
    echo "✅ Storybook built successfully"
  else
    echo "⚠️ Storybook build failed, skipping visual snapshots"
    exit 0
  fi
fi

# Update visual snapshots
echo "🔄 Updating visual snapshots..."
if yarn test:visual --update-snapshots > /dev/null 2>&1; then
  echo "✅ Visual snapshots updated successfully"
else
  echo "⚠️ Visual snapshot update failed, but continuing..."
fi

# Add any existing snapshots to git staging
if [ -d "tests/storybook/button.spec.ts-snapshots" ]; then
  echo "📷 Adding existing snapshots to git staging..."
  git add tests/storybook/button.spec.ts-snapshots/
  echo "✅ Snapshots added to staging area"
else
  echo "ℹ️ No snapshot directory found - snapshots will be created on first visual test run"
fi

echo "📸 Snapshot update complete!"
