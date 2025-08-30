#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
npm ci

# Build the React app
npm run build

echo "Frontend build completed successfully!"
