#!/bin/bash

# Generate test configuration before running tests
echo "Generating test configuration..."

# Generate the level config
yarn tsx tools/generateLevelConfig.ts > config/levels.json

# Verify the config was generated
if [ -f "config/levels.json" ]; then
    echo "✅ Level configuration generated successfully"
    echo "📊 Config size: $(wc -l < config/levels.json) lines"
else
    echo "❌ Failed to generate level configuration"
    exit 1
fi

# Run linting and type checking
echo "Running linting and type checking..."
yarn lint
yarn tsc --noEmit

echo "✅ Test configuration complete"
