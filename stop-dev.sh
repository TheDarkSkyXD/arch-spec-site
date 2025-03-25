#!/usr/bin/env bash
# Cross-platform development environment shutdown script (Bash version)

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Define paths
ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$ROOT_DIR/backend"

# Function to print colored output
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Detect operating system
OS="unknown"
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="Linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macOS"
elif [[ "$OSTYPE" == "cygwin" || "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    OS="Windows"
fi

print_message "$CYAN" "🛑 Stopping development environment..."
print_message "$CYAN" "💻 Detected Platform: $OS"

# Function to stop processes by pattern
stop_process() {
    local process_name=$1
    local pattern=$2
    local friendly_name=$3
    
    print_message "$YELLOW" "🔍 Finding and stopping $friendly_name..."
    
    # Find PIDs matching the pattern
    local pids=$(pgrep -f "$pattern" 2>/dev/null)
    
    if [ -n "$pids" ]; then
        # Kill each process
        for pid in $pids; do
            # Ensure it's numeric for safety
            if [[ "$pid" =~ ^[0-9]+$ ]]; then
                kill -9 "$pid" 2>/dev/null || true
            fi
        done
        print_message "$GREEN" "  ✅ $friendly_name stopped"
    else
        print_message "$BLUE" "  ℹ️ No $friendly_name process found"
    fi
}

# Stop the backend server (uvicorn)
stop_process "python" "uvicorn.*app.main:app" "Backend server"

# Stop the frontend server (vite)
stop_process "node" "vite" "Frontend server"

# Stop ngrok for LemonSqueezy webhook
stop_process "ngrok" "ngrok http --url=camel-square-airedale.ngrok-free.app" "ngrok webhook tunnel"

# Stop MongoDB container
print_message "$YELLOW" "📦 Stopping MongoDB container..."
cd "$BACKEND_DIR"
docker compose down
cd "$ROOT_DIR"
print_message "$GREEN" "  ✅ MongoDB container stopped"

print_message "$GREEN" "✨ Development environment shutdown complete!"