#!/usr/bin/env pwsh
# Development environment shutdown script

# Define paths
$rootDir = $PSScriptRoot
$backendDir = Join-Path $rootDir "backend"

# Output with colors for better visibility
function Write-ColorOutput {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Message,
        
        [Parameter(Mandatory=$false)]
        [string]$ForegroundColor = "White"
    )
    
    Write-Host $Message -ForegroundColor $ForegroundColor
}

Write-ColorOutput "🛑 Stopping development environment..." "Cyan"

# Stop any running Python/Node.js processes related to our dev servers
Write-ColorOutput "🔍 Stopping development servers..." "Yellow"

# Find and stop uvicorn process
$uvicornProcess = Get-Process -Name python -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*uvicorn*app.main:app*" }
if ($uvicornProcess) {
    $uvicornProcess | Stop-Process -Force
    Write-ColorOutput "  ✅ Backend server stopped" "Green"
} else {
    Write-ColorOutput "  ℹ️ No backend server process found" "Blue"
}

# Find and stop Node.js process for frontend
$nodeProcess = Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*vite*" }
if ($nodeProcess) {
    $nodeProcess | Stop-Process -Force
    Write-ColorOutput "  ✅ Frontend server stopped" "Green"
} else {
    Write-ColorOutput "  ℹ️ No frontend server process found" "Blue"
}

# Stop MongoDB container
Write-ColorOutput "📦 Stopping MongoDB container..." "Yellow"
Push-Location $backendDir
docker compose down
Pop-Location
Write-ColorOutput "  ✅ MongoDB container stopped" "Green"

Write-ColorOutput "✨ Development environment shutdown complete!" "Green" 