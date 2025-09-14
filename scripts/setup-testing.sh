#!/bin/bash

# Setup script for Evolution testing environment
echo "🚀 Setting up Evolution testing environment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

# Install Playwright browsers
echo "🎭 Installing Playwright browsers..."
yarn playwright install --with-deps

# Build Storybook for visual testing
echo "📚 Building Storybook..."
yarn build-storybook

# Run initial tests to generate snapshots
echo "🧪 Running initial visual tests to generate snapshots..."
yarn test:visual --update-snapshots

echo "✅ Testing environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Get your Chromatic project token from https://www.chromatic.com"
echo "2. Add CHROMATIC_PROJECT_TOKEN to your GitHub repository secrets"
echo "3. Update .chromaticrc.json with your project token"
echo "4. Push your changes to trigger the CI pipeline"
echo ""
echo "🔧 Available commands:"
echo "  yarn test:all:visual  - Run all tests including visual"
echo "  yarn test:visual:ui   - Run visual tests with UI"
echo "  yarn chromatic        - Run Chromatic visual tests"
echo "  yarn storybook        - Start Storybook development server"
