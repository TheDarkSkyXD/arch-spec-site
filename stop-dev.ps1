#!/usr/bin/env pwsh
# Cross-platform development environment shutdown script

# Define paths using platform-agnostic Join-Path
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

# Detect OS platform
$isPlatformWindows = $PSVersionTable.Platform -eq 'Win32NT' -or [string]::IsNullOrEmpty($PSVersionTable.Platform)
$isPlatformLinux = $PSVersionTable.Platform -eq 'Unix' -and $PSVersionTable.OS -like '*Linux*'
$isPlatformMacOS = $PSVersionTable.Platform -eq 'Unix' -and $PSVersionTable.OS -like '*Darwin*'

if ($null -eq $PSVersionTable.Platform) {
    # Old PowerShell on Windows doesn't have Platform property
    $isPlatformWindows = $true
}

Write-ColorOutput "🛑 Stopping development environment..." "Cyan"
Write-ColorOutput "💻 Detected Platform: $(if($isPlatformWindows){'Windows'}elseif($isPlatformMacOS){'macOS'}elseif($isPlatformLinux){'Linux'}else{'Unknown'})" "Cyan"

# Cross-platform function to stop processes
function Stop-DevProcess {
    param (
        [string]$ProcessName,
        [string]$ProcessPattern,
        [string]$FriendlyName
    )
    
    Write-ColorOutput "🔍 Finding and stopping $FriendlyName..." "Yellow"
    
    if ($isPlatformWindows) {
        $process = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue | 
                   Where-Object { $_.CommandLine -like "*$ProcessPattern*" }
        if ($process) {
            $process | Stop-Process -Force
            Write-ColorOutput "  ✅ $FriendlyName stopped" "Green"
            return $true
        }
    } else {
        # Unix-based systems use different approach
        $pidCommand = if ($isPlatformMacOS) {
            "pgrep -f '$ProcessPattern'"
        } else {
            "pgrep -f '$ProcessPattern'"
        }
        
        $pids = Invoke-Expression $pidCommand
        
        if ($pids) {
            foreach ($pid in $pids) {
                if ($pid -match '^\d+$') {
                    # Only process numeric PIDs for safety
                    try {
                        Invoke-Expression "kill -9 $pid"
                    } catch {
                        Write-ColorOutput "  ⚠️ Failed to kill process $pid`: ${_}" "Yellow"
                    }
                }
            }
            Write-ColorOutput "  ✅ $FriendlyName stopped" "Green"
            return $true
        }
    }
    
    Write-ColorOutput "  ℹ️ No $FriendlyName process found" "Blue"
    return $false
}

# Stop backend and frontend servers
Stop-DevProcess -ProcessName "python" -ProcessPattern "uvicorn*app.main:app" -FriendlyName "Backend server"
Stop-DevProcess -ProcessName "node" -ProcessPattern "vite" -FriendlyName "Frontend server"

# Stop MongoDB container
Write-ColorOutput "📦 Stopping MongoDB container..." "Yellow"
Push-Location $backendDir
docker compose down
Pop-Location
Write-ColorOutput "  ✅ MongoDB container stopped" "Green"

Write-ColorOutput "✨ Development environment shutdown complete!" "Green" 