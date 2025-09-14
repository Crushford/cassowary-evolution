#!/bin/bash

# Setup script for Chromatic visual testing
echo "🎨 Setting up Chromatic visual testing..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if Chromatic is installed
if ! yarn list chromatic > /dev/null 2>&1; then
    echo "📦 Installing Chromatic..."
    yarn add -D chromatic
fi

# Check if .chromaticrc.json exists
if [ ! -f ".chromaticrc.json" ]; then
    echo "❌ Error: .chromaticrc.json not found"
    exit 1
fi

# Check if project token is set
if grep -q "YOUR_CHROMATIC_PROJECT_TOKEN" .chromaticrc.json; then
    echo "⚠️  Warning: Please update .chromaticrc.json with your actual Chromatic project token"
    echo "   1. Go to https://chromatic.com"
    echo "   2. Create a new project"
    echo "   3. Copy your project token"
    echo "   4. Replace 'YOUR_CHROMATIC_PROJECT_TOKEN' in .chromaticrc.json"
    echo ""
    echo "   Also add the token to your GitHub repository secrets:"
    echo "   - Go to your repo → Settings → Secrets and variables → Actions"
    echo "   - Add secret: CHROMATIC_PROJECT_TOKEN"
    echo "   - Paste your token value"
    echo ""
fi

# Build Storybook
echo "📚 Building Storybook..."
if yarn build-storybook; then
    echo "✅ Storybook built successfully"
else
    echo "❌ Storybook build failed"
    exit 1
fi

# Test Chromatic connection
echo "🔗 Testing Chromatic connection..."
if yarn chromatic --dry-run > /dev/null 2>&1; then
    echo "✅ Chromatic connection successful"
else
    echo "⚠️  Chromatic connection failed - check your project token"
fi

echo ""
echo "🎉 Chromatic setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .chromaticrc.json with your project token"
echo "2. Add CHROMATIC_PROJECT_TOKEN to GitHub secrets"
echo "3. Push your changes to trigger Chromatic tests"
echo ""
echo "🔧 Available commands:"
echo "  yarn chromatic              # Run visual tests"
echo "  yarn chromatic:ci           # Run with auto-accept"
echo "  yarn storybook              # Start Storybook dev server"
echo ""
echo "📖 See CHROMATIC_GUIDE.md for detailed usage instructions"
