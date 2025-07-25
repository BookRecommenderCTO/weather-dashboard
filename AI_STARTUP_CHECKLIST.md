# AI Assistant Startup Checklist for Render CLI

## 🚀 MANDATORY STARTUP SEQUENCE
**Run these commands at the START of EVERY session before attempting any Render CLI operations:**

### 1. Navigate to Project Directory
```powershell
cd "C:\Users\BookR\OneDrive\Documents\weather-dashboard"
```

### 2. Set HOME Environment Variable (CRITICAL for Windows)
```powershell
$env:HOME = $env:USERPROFILE
```

### 3. Verify/Download Render CLI
```powershell
if (!(Test-Path ".\render.exe")) {
    Write-Host "Downloading Render CLI..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri "https://github.com/render-oss/render-cli-deprecated/releases/download/v0.1.11/render-windows-x86_64.exe" -OutFile "render.exe" -UseBasicParsing
    Write-Host "Render CLI downloaded!" -ForegroundColor Green
}
```

### 4. Test Render CLI Access
```powershell
.\render.exe services list
```

## ⚡ ONE-LINE STARTUP COMMAND
**Copy and run this FIRST in every session:**
```powershell
cd "C:\Users\BookR\OneDrive\Documents\weather-dashboard"; $env:HOME = $env:USERPROFILE; if (!(Test-Path ".\render.exe")) { Invoke-WebRequest -Uri "https://github.com/render-oss/render-cli-deprecated/releases/download/v0.1.11/render-windows-x86_64.exe" -OutFile "render.exe" -UseBasicParsing }; .\render.exe services list
```

## 🎯 SERVICE INFORMATION (Always Available After Startup)
- **Main Service ID**: `srv-d20i38fdiees739ij7eg`
- **Service Name**: `weather-dashboard-app`
- **Live URL**: https://weather-dashboard-app-p0vz.onrender.com
- **Performance URL**: https://weather-dashboard-app-p0vz.onrender.com/performance
- **Render Dashboard**: https://dashboard.render.com/web/srv-d20i38fdiees739ij7eg

## 📋 COMMON COMMANDS (Use After Startup)
```powershell
# List all services
.\render.exe services list

# Show main service details
.\render.exe services show --id srv-d20i38fdiees739ij7eg

# List recent deployments
.\render.exe deploys list --service-id srv-d20i38fdiees739ij7eg

# View service logs
.\render.exe services tail --service-id srv-d20i38fdiees739ij7eg
```

## 🔍 VERIFICATION COMMANDS
```powershell
# Check if config exists
Test-Path "$env:HOME\.render\config.yaml"

# Verify CLI version
.\render.exe version

# Test live site
try { $response = Invoke-WebRequest -Uri "https://weather-dashboard-app-p0vz.onrender.com" -TimeoutSec 10; Write-Host "✅ Site: HTTP $($response.StatusCode)" } catch { Write-Host "❌ Site error: $($_.Exception.Message)" }
```

## ⚠️ CRITICAL NOTES
1. **ALWAYS set `$env:HOME = $env:USERPROFILE` before ANY Render CLI command**
2. **Config file exists at**: `C:\Users\BookR\.render\config.yaml`
3. **API key is already configured** - no re-authentication needed
4. **CLI must be in project directory**: `C:\Users\BookR\OneDrive\Documents\weather-dashboard\render.exe`

## 🚨 IF STARTUP FAILS
1. Check if in correct directory: `Get-Location`
2. Verify HOME variable: `$env:HOME`
3. Check if CLI exists: `Test-Path ".\render.exe"`
4. Check config exists: `Test-Path "$env:HOME\.render\config.yaml"`
5. If config missing, run: `.\render.exe config init`

## ✅ SUCCESS INDICATORS
- ✅ Services list displays without errors
- ✅ Shows `srv-d20i38fdiees739ij7eg weather-dashboard-app`
- ✅ No authentication errors
- ✅ CLI version shows: `v0.1.11-gha (x86_64-pc-windows-msvc)`

---
**REMEMBER: Run the one-line startup command FIRST in every session!**
