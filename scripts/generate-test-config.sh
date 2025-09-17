#!/bin/bash

# Run linting and type checking before tests
echo "Running linting and type checking..."
yarn lint
yarn tsc --noEmit

echo "✅ Test configuration complete"
