# Quick Render CLI Setup
Write-Host "Setting up Render CLI..." -ForegroundColor Cyan

# Navigate to project directory
Set-Location "C:\Users\BookR\OneDrive\Documents\weather-dashboard"

# Set HOME environment variable
$env:HOME = $env:USERPROFILE
Write-Host "HOME set to: $env:HOME" -ForegroundColor Green

# Download Render CLI if not present
if (!(Test-Path ".\render.exe")) {
    Write-Host "Downloading Render CLI..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri "https://github.com/render-oss/render-cli-deprecated/releases/download/v0.1.11/render-windows-x86_64.exe" -OutFile "render.exe" -UseBasicParsing
    Write-Host "Render CLI downloaded!" -ForegroundColor Green
}

# Test Render CLI
$version = .\render.exe version
Write-Host "Render CLI version: $version" -ForegroundColor Green

# Check services
Write-Host "`nServices:" -ForegroundColor Cyan
.\render.exe services list

Write-Host "`nRender CLI is ready!" -ForegroundColor Green
