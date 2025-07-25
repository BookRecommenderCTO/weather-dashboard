# Render CLI Quick Setup Script
# Run this at the start of any session to ensure Render CLI is ready

Write-Host "🚀 Setting up Render CLI Environment..." -ForegroundColor Cyan
Write-Host ("=" * 50)

# 1. Navigate to project directory
$projectPath = "C:\Users\BookR\OneDrive\Documents\weather-dashboard"
if (!(Test-Path $projectPath)) {
    Write-Host "❌ Project directory not found: $projectPath" -ForegroundColor Red
    exit 1
}

Set-Location $projectPath
Write-Host "📁 Working directory: $((Get-Location).Path)" -ForegroundColor Green

# 2. Set HOME environment variable (required for Render CLI on Windows)
$env:HOME = $env:USERPROFILE
Write-Host "🏠 HOME environment variable set to: $env:HOME" -ForegroundColor Green

# 3. Check if Render CLI exists, download if missing
$renderPath = ".\render.exe"
if (!(Test-Path $renderPath)) {
    Write-Host "📥 Render CLI not found. Downloading..." -ForegroundColor Yellow
    try {
        # Fallback to known working version
        Write-Host "Downloading Render CLI..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri "https://github.com/render-oss/render-cli-deprecated/releases/download/v0.1.11/render-windows-x86_64.exe" -OutFile "render.exe" -UseBasicParsing
        Write-Host "✅ Render CLI downloaded successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to download Render CLI: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Render CLI found" -ForegroundColor Green
}

# 4. Verify Render CLI works
try {
    $version = & $renderPath version
    Write-Host "✅ Render CLI version: $version" -ForegroundColor Green
} catch {
    Write-Host "❌ Render CLI not working properly: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 5. Check if config exists
$configPath = "$env:HOME\.render\config.yaml"
if (!(Test-Path $configPath)) {
    Write-Host "⚠️  Render CLI not configured. Run '.\render.exe config init' to set up." -ForegroundColor Yellow
} else {
    Write-Host "✅ Render CLI configuration found" -ForegroundColor Green
}

Write-Host "`n🔍 Checking services..." -ForegroundColor Cyan
try {
    & $renderPath services list
    Write-Host "`n✅ Services retrieved successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Could not retrieve services. You may need to run '.\render.exe config init'" -ForegroundColor Red
}

Write-Host "`n🌐 Checking live sites..." -ForegroundColor Cyan

# Check main site
try {
    $response = Invoke-WebRequest -Uri "https://weather-dashboard-app-p0vz.onrender.com" -TimeoutSec 10
    Write-Host "✅ Main Dashboard: HTTP $($response.StatusCode) (Length: $($response.Content.Length) chars)" -ForegroundColor Green
} catch {
    Write-Host "❌ Main Dashboard: $($_.Exception.Message)" -ForegroundColor Red
}

# Check performance dashboard
try {
    $response = Invoke-WebRequest -Uri "https://weather-dashboard-app-p0vz.onrender.com/performance" -TimeoutSec 10
    Write-Host "✅ Performance Dashboard: HTTP $($response.StatusCode) (Length: $($response.Content.Length) chars)" -ForegroundColor Green
} catch {
    Write-Host "❌ Performance Dashboard: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n$("=" * 50)"
Write-Host "🎉 Render CLI Environment Ready!" -ForegroundColor Green
Write-Host "`n📋 Quick Commands:" -ForegroundColor Cyan
Write-Host "  .\render.exe services list" -ForegroundColor Gray
Write-Host "  .\render.exe deploys list --service-id srv-d20i38fdiees739ij7eg" -ForegroundColor Gray
Write-Host "  .\render.exe services show --id srv-d20i38fdiees739ij7eg" -ForegroundColor Gray

Write-Host "`n🌐 Live URLs:" -ForegroundColor Cyan
Write-Host "  Main: https://weather-dashboard-app-p0vz.onrender.com" -ForegroundColor Gray
Write-Host "  Performance: https://weather-dashboard-app-p0vz.onrender.com/performance" -ForegroundColor Gray

Write-Host "`n💡 Remember to always set \$env:HOME = \$env:USERPROFILE before running Render CLI commands!" -ForegroundColor Yellow
