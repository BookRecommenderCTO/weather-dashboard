#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Starting build process...');

// Read the template JavaScript file
const scriptPath = path.join(__dirname, 'js', 'script.js');
let scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Get environment variables
const openaiOrg = process.env.OPENAI_ORG;
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiOrg || !openaiApiKey) {
    console.error('❌ Error: Missing environment variables');
    console.error('   Required: OPENAI_ORG, OPENAI_API_KEY');
    process.exit(1);
}

console.log('✅ Environment variables found');
console.log(`   OPENAI_ORG: ${openaiOrg.substring(0, 8)}...`);
console.log(`   OPENAI_API_KEY: ${openaiApiKey.substring(0, 8)}...`);

// Replace placeholders with actual values
scriptContent = scriptContent.replace(
    'const OPENAI_ORG = "INSERT_OPENAI_ORG_HERE";',
    `const OPENAI_ORG = "${openaiOrg}";`
);

scriptContent = scriptContent.replace(
    'const OPENAI_API_KEY = "INSERT_OPENAI_API_KEY_HERE";',
    `const OPENAI_API_KEY = "${openaiApiKey}";`
);

// Write the updated script to the build directory
const buildDir = path.join(__dirname, 'dist');
const jsBuildDir = path.join(buildDir, 'js');

// Create build directories
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
}
if (!fs.existsSync(jsBuildDir)) {
    fs.mkdirSync(jsBuildDir);
}

// Copy all files to build directory
console.log('📁 Copying files to build directory...');

// Copy HTML file
fs.copyFileSync('index.html', path.join(buildDir, 'index.html'));

// Copy CSS directory
const cssSourceDir = path.join(__dirname, 'css');
const cssBuildDir = path.join(buildDir, 'css');
if (!fs.existsSync(cssBuildDir)) {
    fs.mkdirSync(cssBuildDir);
}
fs.copyFileSync(path.join(cssSourceDir, 'style.css'), path.join(cssBuildDir, 'style.css'));

// Write the processed JavaScript file
fs.writeFileSync(path.join(jsBuildDir, 'script.js'), scriptContent);

// Copy other files if they exist
const filesToCopy = ['README.md', '.gitignore'];
filesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(buildDir, file));
    }
});

console.log('✅ Build completed successfully!');
console.log('📂 Build output: dist/');
console.log('🚀 Ready for deployment');
