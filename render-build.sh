#!/bin/bash

echo "🔧 Starting static site build process..."

# Create dist directory
mkdir -p dist/css dist/js

# Copy static files
cp index.html dist/
cp css/style.css dist/css/
cp README.md dist/ 2>/dev/null || true

echo "✅ Static files copied"

# Process JavaScript file with environment variables
echo "🔄 Processing JavaScript with environment variables..."

if [ -z "$OPENAI_ORG" ] || [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ Error: Missing environment variables"
    echo "   Required: OPENAI_ORG, OPENAI_API_KEY"
    exit 1
fi

echo "✅ Environment variables found"
echo "   OPENAI_ORG: ${OPENAI_ORG:0:8}..."
echo "   OPENAI_API_KEY: ${OPENAI_API_KEY:0:8}..."

# Replace placeholders in JavaScript
sed "s/INSERT_OPENAI_ORG_HERE/$OPENAI_ORG/g; s/INSERT_OPENAI_API_KEY_HERE/$OPENAI_API_KEY/g" js/script.js > dist/js/script.js

echo "✅ Build completed successfully!"
echo "📂 Build output: dist/"
echo "🚀 Ready for static site deployment"
