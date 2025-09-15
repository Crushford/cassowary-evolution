#!/bin/bash

# Run Playwright tests with Chromatic import
echo "Running Playwright tests with Chromatic integration..."
yarn playwright test tests/chromatic/ --config=playwright-chromatic.config.ts --reporter=line

# Run Chromatic with Playwright flag
echo "Running Chromatic with Playwright integration..."
npx chromatic --playwright --project-token=chpt_fa6d3a835b2121d
