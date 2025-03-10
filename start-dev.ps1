#!/usr/bin/env pwsh
# Development environment startup script

# Define paths
$rootDir = $PSScriptRoot
$backendDir = Join-Path $rootDir "backend"
$frontendDir = Join-Path $rootDir "frontend"

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

# Function to check if MongoDB is already running
function Test-MongoDBRunning {
    $mongoContainer = docker ps --filter "name=mongodb" --format "{{.Names}}"
    return ![string]::IsNullOrEmpty($mongoContainer)
}

# Start MongoDB
Write-ColorOutput "🚀 Starting development environment..." "Cyan"
Write-ColorOutput "📦 Starting MongoDB container..." "Yellow"

# Change to backend directory
Push-Location $backendDir

if (Test-MongoDBRunning) {
    Write-ColorOutput "  ✅ MongoDB is already running" "Green"
} else {
    # Start MongoDB container
    docker compose up -d mongo
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "  ❌ Failed to start MongoDB container" "Red"
        Pop-Location
        exit 1
    }
    Write-ColorOutput "  ✅ MongoDB container started" "Green"
}

# Activate virtual environment
Write-ColorOutput "🐍 Activating Python virtual environment..." "Yellow"
& "$backendDir\.venv\Scripts\activate.ps1"

# Start Backend Server (async)
Write-ColorOutput "🌐 Starting backend server..." "Yellow"
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; python -m uvicorn app.main:app --reload" -WindowStyle Normal

# Return to root directory
Pop-Location

# Start Frontend Development Server
Write-ColorOutput "⚛️ Starting frontend development server..." "Yellow"
Push-Location $frontendDir
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; pnpm run dev" -WindowStyle Normal
Pop-Location

Write-ColorOutput "✨ Development environment is ready!" "Green"
Write-ColorOutput "   Backend is running at http://localhost:8000" "Cyan"
Write-ColorOutput "   Frontend is running at http://localhost:5173" "Cyan"
Write-ColorOutput "   MongoDB is running on port 27017" "Cyan"
Write-ColorOutput "   Press Ctrl+C in each terminal window to stop the services." "DarkYellow" 