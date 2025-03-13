#!/usr/bin/env bash
# Cross-platform development environment startup script (Bash version)

# Enable exiting on error
set -e

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
FRONTEND_DIR="$ROOT_DIR/frontend"

# Function to print colored output
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to check if MongoDB is running
is_mongodb_running() {
    docker ps --filter "name=mongodb" --format "{{.Names}}" | grep -q mongodb
    return $?
}

# Function to check if node_modules exists
check_node_modules() {
    local dir=$1
    if [ -d "$dir/node_modules" ]; then
        return 0  # exists
    else
        return 1  # does not exist
    fi
}

# Function to check if virtual environment exists
check_venv() {
    local dir=$1
    if [ -f "$dir/.venv/bin/activate" ]; then
        return 0  # exists
    else
        return 1  # does not exist
    fi
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

print_message "$CYAN" "🚀 Starting development environment..."
print_message "$CYAN" "💻 Detected Platform: $OS"
print_message "$YELLOW" "📦 Starting MongoDB container..."

# Change to backend directory
cd "$BACKEND_DIR"

# Start MongoDB if not running
if is_mongodb_running; then
    print_message "$GREEN" "  ✅ MongoDB is already running"
else
    # Start MongoDB container
    docker compose up -d mongo
    if [ $? -ne 0 ]; then
        print_message "$RED" "  ❌ Failed to start MongoDB container"
        exit 1
    fi
    print_message "$GREEN" "  ✅ MongoDB container started"
fi

# Check for Python virtual environment and create if missing
print_message "$YELLOW" "🐍 Checking Python virtual environment..."
if ! check_venv "$BACKEND_DIR"; then
    print_message "$YELLOW" "  ⚠️ Virtual environment not found, creating new Python 3.12 environment..."
    # Check for requirements.txt or pyproject.toml
    if [ -f "$BACKEND_DIR/pyproject.toml" ]; then
        # Use uv with pyproject.toml
        print_message "$YELLOW" "  📄 Found pyproject.toml, creating Python 3.12 venv with uv..."
        cd "$BACKEND_DIR"
        uv venv --python=3.12
        if [ $? -ne 0 ]; then
            print_message "$RED" "  ❌ Failed to create virtual environment with uv"
            exit 1
        fi
        uv pip install -e .
        if [ $? -ne 0 ]; then
            print_message "$RED" "  ❌ Failed to install packages with uv"
            exit 1
        fi
    elif [ -f "$BACKEND_DIR/requirements.txt" ]; then
        # Use uv with requirements.txt
        print_message "$YELLOW" "  📄 Found requirements.txt, creating Python 3.12 venv with uv..."
        cd "$BACKEND_DIR"
        uv venv --python=3.12
        if [ $? -ne 0 ]; then
            print_message "$RED" "  ❌ Failed to create virtual environment with uv"
            exit 1
        fi
        uv pip install -r requirements.txt
        if [ $? -ne 0 ]; then
            print_message "$RED" "  ❌ Failed to install packages with uv"
            exit 1
        fi
    else
        # No requirements files found
        print_message "$YELLOW" "  ⚠️ No requirements.txt or pyproject.toml found, creating empty Python 3.12 venv..."
        cd "$BACKEND_DIR"
        uv venv --python=3.12
        if [ $? -ne 0 ]; then
            print_message "$RED" "  ❌ Failed to create virtual environment with uv"
            exit 1
        fi
    fi
    print_message "$GREEN" "  ✅ Python 3.12 virtual environment created successfully"
else
    print_message "$GREEN" "  ✅ Virtual environment already exists"
fi

# Activate virtual environment
print_message "$YELLOW" "🐍 Activating Python virtual environment..."
VENV_PATH="$BACKEND_DIR/.venv"
if [ -f "$VENV_PATH/bin/activate" ]; then
    source "$VENV_PATH/bin/activate"
    print_message "$GREEN" "  ✅ Virtual environment activated"
else
    print_message "$YELLOW" "  ⚠️ Virtual environment not found at $VENV_PATH/bin/activate"
fi

# Start Backend Server (in a new terminal)
print_message "$YELLOW" "🌐 Starting backend server..."
if [[ "$OS" == "macOS" ]]; then
    # macOS terminal
    osascript -e "tell application \"Terminal\" to do script \"cd '$BACKEND_DIR' && source '$VENV_PATH/bin/activate' 2>/dev/null || echo 'Activation failed' && python -m uvicorn app.main:app --reload\""
elif [[ "$OS" == "Linux" ]]; then
    # Try to detect and use available terminal emulator
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "cd '$BACKEND_DIR' && source '$VENV_PATH/bin/activate' 2>/dev/null || echo 'Activation failed' && python -m uvicorn app.main:app --reload; exec bash"
    elif command -v xterm &> /dev/null; then
        xterm -e "cd '$BACKEND_DIR' && source '$VENV_PATH/bin/activate' 2>/dev/null || echo 'Activation failed' && python -m uvicorn app.main:app --reload" &
    else
        # Fallback to background process
        print_message "$YELLOW" "  ⚠️ No terminal emulator found, running backend in background"
        (cd "$BACKEND_DIR" && source "$VENV_PATH/bin/activate" 2>/dev/null && python -m uvicorn app.main:app --reload > backend.log 2>&1) &
    fi
else
    # Fallback for other platforms
    print_message "$YELLOW" "  ⚠️ Unsupported OS for terminal spawning, running backend in background"
    (cd "$BACKEND_DIR" && source "$VENV_PATH/bin/activate" 2>/dev/null && python -m uvicorn app.main:app --reload > backend.log 2>&1) &
fi

# Return to root directory
cd "$ROOT_DIR"

# Check and install frontend dependencies if needed
print_message "$YELLOW" "📦 Checking frontend dependencies..."
cd "$FRONTEND_DIR"
if ! check_node_modules "$FRONTEND_DIR"; then
    print_message "$YELLOW" "  ⚠️ Node modules not found, installing dependencies..."
    pnpm install
    if [ $? -ne 0 ]; then
        print_message "$RED" "  ❌ Failed to install frontend dependencies"
        exit 1
    fi
    print_message "$GREEN" "  ✅ Frontend dependencies installed"
else
    print_message "$GREEN" "  ✅ Frontend dependencies already installed"
fi

# Start Frontend Development Server (in a new terminal)
print_message "$YELLOW" "⚛️ Starting frontend development server..."
if [[ "$OS" == "macOS" ]]; then
    # macOS terminal
    osascript -e "tell application \"Terminal\" to do script \"cd '$FRONTEND_DIR' && pnpm run dev\""
elif [[ "$OS" == "Linux" ]]; then
    # Try to detect and use available terminal emulator
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "cd '$FRONTEND_DIR' && pnpm run dev; exec bash"
    elif command -v xterm &> /dev/null; then
        xterm -e "cd '$FRONTEND_DIR' && pnpm run dev" &
    else
        # Fallback to background process
        print_message "$YELLOW" "  ⚠️ No terminal emulator found, running frontend in background"
        cd "$FRONTEND_DIR" && pnpm run dev > frontend.log 2>&1 &
    fi
else
    # Fallback for other platforms
    print_message "$YELLOW" "  ⚠️ Unsupported OS for terminal spawning, running frontend in background"
    cd "$FRONTEND_DIR" && pnpm run dev > frontend.log 2>&1 &
fi

# Return to root directory
cd "$ROOT_DIR"

print_message "$GREEN" "✨ Development environment is ready!"
print_message "$CYAN" "   Backend is running at http://localhost:8000"
print_message "$CYAN" "   Frontend is running at http://localhost:5173"
print_message "$CYAN" "   MongoDB is running on port 27017"
print_message "$YELLOW" "   Press Ctrl+C in each terminal window to stop the services." 