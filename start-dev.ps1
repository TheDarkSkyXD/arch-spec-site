#!/usr/bin/env pwsh
# Cross-platform development environment startup script

# Define paths using platform-agnostic Join-Path
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

# Function to check if node_modules exists in a directory
function Test-NodeModulesExists {
    param (
        [string]$Directory
    )
    
    $nodeModulesPath = Join-Path $Directory "node_modules"
    return Test-Path $nodeModulesPath
}

# Function to check if virtual environment exists
function Test-VirtualEnvExists {
    param (
        [string]$Directory
    )
    
    if ($isWindowsOS) {
        $venvPath = Join-Path $Directory ".venv\Scripts\activate.ps1"
    } else {
        $venvPath = Join-Path $Directory ".venv/bin/activate"
    }
    
    return Test-Path $venvPath
}

# Detect OS platform
$isWindowsOS = $PSVersionTable.Platform -eq 'Win32NT' -or [string]::IsNullOrEmpty($PSVersionTable.Platform)
$isLinuxOS = $PSVersionTable.Platform -eq 'Unix' -and $PSVersionTable.OS -like '*Linux*'
$isMacOSX = $PSVersionTable.Platform -eq 'Unix' -and $PSVersionTable.OS -like '*Darwin*'

if ($null -eq $PSVersionTable.Platform) {
    # Old PowerShell on Windows doesn't have Platform property
    $isWindowsOS = $true
}

Write-ColorOutput "🚀 Starting development environment..." "Cyan"
Write-ColorOutput "💻 Detected Platform: $(if($isWindowsOS){'Windows'}elseif($isMacOSX){'macOS'}elseif($isLinuxOS){'Linux'}else{'Unknown'})" "Cyan"
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

# Check for Python virtual environment and create if missing
Write-ColorOutput "🐍 Checking Python virtual environment..." "Yellow"
if (-not (Test-VirtualEnvExists -Directory $backendDir)) {
    Write-ColorOutput "  ⚠️ Virtual environment not found, creating new Python 3.12 environment..." "Yellow"
    # Check for requirements.txt or pyproject.toml
    $requirementsPath = Join-Path $backendDir "requirements.txt"
    $pyprojectPath = Join-Path $backendDir "pyproject.toml"
    
    if (Test-Path $pyprojectPath) {
        # Use uv with pyproject.toml
        Write-ColorOutput "  📄 Found pyproject.toml, creating Python 3.12 venv with uv..." "Yellow"
        uv venv --python=3.12
        if ($LASTEXITCODE -ne 0) {
            Write-ColorOutput "  ❌ Failed to create virtual environment with uv" "Red"
            Pop-Location
            exit 1
        }
        uv pip install -e .
        if ($LASTEXITCODE -ne 0) {
            Write-ColorOutput "  ❌ Failed to install packages with uv" "Red"
            Pop-Location
            exit 1
        }
    } elseif (Test-Path $requirementsPath) {
        # Use uv with requirements.txt
        Write-ColorOutput "  📄 Found requirements.txt, creating Python 3.12 venv with uv..." "Yellow"
        uv venv --python=3.12
        if ($LASTEXITCODE -ne 0) {
            Write-ColorOutput "  ❌ Failed to create virtual environment with uv" "Red"
            Pop-Location
            exit 1
        }
        uv pip install -r requirements.txt
        if ($LASTEXITCODE -ne 0) {
            Write-ColorOutput "  ❌ Failed to install packages with uv" "Red"
            Pop-Location
            exit 1
        }
    } else {
        # No requirements files found
        Write-ColorOutput "  ⚠️ No requirements.txt or pyproject.toml found, creating empty Python 3.12 venv..." "Yellow"
        uv venv --python=3.12
        if ($LASTEXITCODE -ne 0) {
            Write-ColorOutput "  ❌ Failed to create virtual environment with uv" "Red"
            Pop-Location
            exit 1
        }
    }
    Write-ColorOutput "  ✅ Python 3.12 virtual environment created successfully" "Green"
} else {
    Write-ColorOutput "  ✅ Virtual environment already exists" "Green"
}

# Activate virtual environment based on platform
Write-ColorOutput "🐍 Activating Python virtual environment..." "Yellow"
if ($isWindowsOS) {
    $venvActivatePath = Join-Path $backendDir ".venv\Scripts\Activate.ps1"
    if (Test-Path $venvActivatePath) {
        & $venvActivatePath
        Write-ColorOutput "  ✅ Virtual environment activated" "Green"
    } else {
        Write-ColorOutput "  ⚠️ Virtual environment not found at $venvActivatePath" "Yellow"
    }
} else {
    # Unix-based systems (macOS/Linux)
    $venvActivatePath = Join-Path $backendDir ".venv/bin/Activate.ps1"
    if (Test-Path $venvActivatePath) {
        & $venvActivatePath
        Write-ColorOutput "  ✅ Virtual environment activated" "Green"
    } else {
        # Try the bash activation file for PowerShell Core's bash compatibility
        $venvBashActivatePath = Join-Path $backendDir ".venv/bin/activate"
        if (Test-Path $venvBashActivatePath) {
            Write-ColorOutput "  ℹ️ Using bash activate script for PowerShell Core" "Blue"
            # For PowerShell Core on Unix, we can use the shell to source the activation script
            $activateCommand = "source '$venvBashActivatePath' 2>/dev/null || echo 'Activation failed'"
            Invoke-Expression "bash -c '$activateCommand'"
            Write-ColorOutput "  ✅ Virtual environment activated via bash" "Green"
        } else {
            Write-ColorOutput "  ⚠️ Virtual environment activation script not found" "Yellow"
        }
    }
}

# Start Backend Server (async) in platform-specific way
Write-ColorOutput "🌐 Starting backend server..." "Yellow"
if ($isWindowsOS) {
    Start-Process -FilePath "pwsh" -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; if (Test-Path .venv\Scripts\Activate.ps1) { .\.venv\Scripts\Activate.ps1 }; python -m uvicorn app.main:app --reload" -WindowStyle Normal
} else {
    # On Unix systems, we use bash to ensure proper activation
    if ($isMacOSX) {
        Start-Process -FilePath "pwsh" -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; if (Test-Path .venv/bin/activate) { bash -c 'source .venv/bin/activate && python -m uvicorn app.main:app --reload' } else { python -m uvicorn app.main:app --reload }"
    } else {
        Start-Process -FilePath "pwsh" -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; if (Test-Path .venv/bin/activate) { bash -c 'source .venv/bin/activate && python -m uvicorn app.main:app --reload' } else { python -m uvicorn app.main:app --reload }"
    }
}

# Return to root directory
Pop-Location

# Check and install frontend dependencies if needed
Write-ColorOutput "📦 Checking frontend dependencies..." "Yellow"
Push-Location $frontendDir
if (-not (Test-NodeModulesExists -Directory $frontendDir)) {
    Write-ColorOutput "  ⚠️ Node modules not found, installing dependencies..." "Yellow"
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "  ❌ Failed to install frontend dependencies" "Red"
        Pop-Location
        exit 1
    }
    Write-ColorOutput "  ✅ Frontend dependencies installed" "Green"
} else {
    Write-ColorOutput "  ✅ Frontend dependencies already installed" "Green"
}

# Start Frontend Development Server
Write-ColorOutput "⚛️ Starting frontend development server..." "Yellow"
if ($isWindowsOS) {
    Start-Process -FilePath "pwsh" -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; pnpm run dev" -WindowStyle Normal
} else {
    # On Unix systems, we need a different approach for background processes
    Start-Process -FilePath "pwsh" -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; pnpm run dev"
}
Pop-Location

Write-ColorOutput "✨ Development environment is ready!" "Green"
Write-ColorOutput "   Backend is running at http://localhost:8000" "Cyan"
Write-ColorOutput "   Frontend is running at http://localhost:5173" "Cyan"
Write-ColorOutput "   MongoDB is running on port 27017" "Cyan"
Write-ColorOutput "   Press Ctrl+C in each terminal window to stop the services." "DarkYellow"