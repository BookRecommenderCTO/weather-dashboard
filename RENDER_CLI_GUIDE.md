# Render CLI Setup & Usage Guide

## 🚀 Quick Start for Future Sessions

### **Essential Setup Commands (Run These First)**
```powershell
# 1. Set HOME environment variable (required for Render CLI on Windows)
$env:HOME = $env:USERPROFILE

# 2. Check if Render CLI exists
if (Test-Path ".\render.exe") {
    Write-Host "✅ Render CLI found"
    .\render.exe version
} else {
    Write-Host "❌ Render CLI not found - need to download"
}
```

## 📥 Render CLI Installation

### **Download and Install (If Not Present)**
```powershell
# Download the latest Render CLI for Windows
$latestRelease = Invoke-WebRequest -Uri "https://api.github.com/repos/render-oss/render-cli/releases/latest" -UseBasicParsing | ConvertFrom-Json
$windowsAsset = $latestRelease.assets | Where-Object { $_.name -like "*windows*" }
$downloadUrl = $windowsAsset.browser_download_url

Write-Host "Downloading Render CLI from: $downloadUrl"
Invoke-WebRequest -Uri $downloadUrl -OutFile "render.exe" -UseBasicParsing

# Verify installation
.\render.exe version
```

### **Alternative Download (Fallback)**
```powershell
# If above fails, use direct URL to latest known version
Invoke-WebRequest -Uri "https://github.com/render-oss/render-cli-deprecated/releases/download/v0.1.11/render-windows-x86_64.exe" -OutFile "render.exe" -UseBasicParsing
```

## ⚙️ Configuration

### **Initial Setup (If Config Doesn't Exist)**
```powershell
# Set HOME variable and initialize config
$env:HOME = $env:USERPROFILE
.\render.exe config init
```

**During setup, you'll be prompted for:**
- Default region: `oregon` (recommended)
- API key: Get from https://dashboard.render.com/account/api-keys
- SSH pinning: `Yes` (recommended)

### **Check Current Config**
```powershell
$env:HOME = $env:USERPROFILE
.\render.exe config show
```

## 🔧 Essential Commands

### **Service Management**
```powershell
# Always set HOME first
$env:HOME = $env:USERPROFILE

# List all services
.\render.exe services list

# Show specific service details
.\render.exe services show --id srv-d20i38fdiees739ij7eg

# Get service logs
.\render.exe services tail --service-id srv-d20i38fdiees739ij7eg
```

### **Deployment Management**
```powershell
# List deployments for a service
.\render.exe deploys list --service-id srv-d20i38fdiees739ij7eg

# Get deployment details (replace with actual deploy ID)
.\render.exe deploys show --deploy-id dep-XXXXXXXXXXXXXXXXX
```

### **Quick Status Check**
```powershell
# Complete status check script
$env:HOME = $env:USERPROFILE

Write-Host "=== Render Services Status ===" -ForegroundColor Green
.\render.exe services list

Write-Host "`n=== Recent Deployments ===" -ForegroundColor Green  
.\render.exe deploys list --service-id srv-d20i38fdiees739ij7eg | Select-Object -First 5

Write-Host "`n=== Live Site Check ===" -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "https://weather-dashboard-app-p0vz.onrender.com" -TimeoutSec 10
    Write-Host "✅ Main site: HTTP $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Main site: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $response = Invoke-WebRequest -Uri "https://weather-dashboard-app-p0vz.onrender.com/performance" -TimeoutSec 10
    Write-Host "✅ Performance dashboard: HTTP $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Performance dashboard: $($_.Exception.Message)" -ForegroundColor Red
}
```

## 📊 Project-Specific Information

### **Weather Dashboard Services**
```
Main Service:
- ID: srv-d20i38fdiees739ij7eg
- Name: weather-dashboard-app
- URL: https://weather-dashboard-app-p0vz.onrender.com
- Type: web_service (Node.js)

Static Service:
- ID: srv-d1uehcqdbo4c73egks7g  
- Name: weather-dashboard
- Slug: weather-dashboard-jf7c
- Type: static_site
```

### **Key URLs**
- **Main Dashboard**: https://weather-dashboard-app-p0vz.onrender.com
- **Performance Dashboard**: https://weather-dashboard-app-p0vz.onrender.com/performance
- **Render Dashboard**: https://dashboard.render.com/web/srv-d20i38fdiees739ij7eg

## 🛠️ Troubleshooting

### **Common Issues & Solutions**

#### **HOME Environment Variable Error**
```powershell
# Error: "No $HOME env var set"
# Solution: Always set HOME before running commands
$env:HOME = $env:USERPROFILE
```

#### **CLI Not Found**
```powershell
# Check if render.exe exists in current directory
if (!(Test-Path ".\render.exe")) {
    Write-Host "Downloading Render CLI..."
    # Use installation commands above
}
```

#### **Authentication Issues**
```powershell
# Reconfigure if auth fails
$env:HOME = $env:USERPROFILE
.\render.exe config init --force
```

#### **Service ID Not Found**
```powershell
# Get current service IDs
$env:HOME = $env:USERPROFILE
.\render.exe services list
```

## 🚀 Quick Deployment Commands

### **Manual Deploy Trigger**
```powershell
# Auto-deploy is enabled, but to manually trigger:
# 1. Push to GitHub main branch
git push origin main

# 2. Check deployment status
$env:HOME = $env:USERPROFILE
.\render.exe deploys list --service-id srv-d20i38fdiees739ij7eg
```

### **Environment Variables**
```powershell
# View service environment (requires dashboard access)
# Go to: https://dashboard.render.com/web/srv-d20i38fdiees739ij7eg
# Check: Environment variables section
```

## 📝 Session Startup Checklist

### **Always Run These Commands First:**
```powershell
# 1. Navigate to project directory
cd "C:\Users\BookR\OneDrive\Documents\weather-dashboard"

# 2. Set HOME environment variable
$env:HOME = $env:USERPROFILE

# 3. Verify Render CLI exists and works
if (Test-Path ".\render.exe") {
    .\render.exe version
    Write-Host "✅ Render CLI ready"
} else {
    Write-Host "❌ Need to download Render CLI"
    # Run installation commands
}

# 4. Quick status check
.\render.exe services list
```

## 🔐 Security Notes

- **API Key**: Stored in `C:\Users\BookR\.render\config.yaml`
- **File Permissions**: On Windows, secure the config file manually if needed
- **SSH Keys**: Stored in known_hosts for Render services

## 📚 Reference Commands

### **Help & Documentation**
```powershell
$env:HOME = $env:USERPROFILE

# General help
.\render.exe --help

# Command-specific help
.\render.exe services --help
.\render.exe deploys --help

# List all available commands
.\render.exe commands
```

### **Useful Flags**
- `--verbose` or `-v`: Detailed output
- `--pretty-json`: Formatted JSON output
- `--non-interactive`: Bypass prompts

## 🌐 External Resources

- **Render Dashboard**: https://dashboard.render.com
- **Render Docs**: https://render.com/docs
- **API Keys**: https://dashboard.render.com/account/api-keys
- **CLI GitHub**: https://github.com/render-oss/render-cli

---

## ⚡ One-Line Setup for Future Sessions

```powershell
cd "C:\Users\BookR\OneDrive\Documents\weather-dashboard"; $env:HOME = $env:USERPROFILE; if (!(Test-Path ".\render.exe")) { Invoke-WebRequest -Uri "https://github.com/render-oss/render-cli-deprecated/releases/download/v0.1.11/render-windows-x86_64.exe" -OutFile "render.exe" -UseBasicParsing }; .\render.exe services list
```

This command will:
1. Navigate to the project directory
2. Set the HOME environment variable
3. Download Render CLI if missing
4. List your services

**Copy and paste this at the start of any session for instant Render CLI access!**
