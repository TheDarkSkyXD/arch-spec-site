# Cross-Platform Development Scripts

This directory contains cross-platform scripts for starting and stopping the development environment. These scripts work on Windows, macOS, and Linux systems.

## Prerequisites

- **Docker**: Required for running MongoDB
- **Python 3.12**: For the backend (will be used to create a virtual environment)
- **Node.js**: For the frontend
- **pnpm**: Package manager for the frontend
- **uv**: Package manager for the backend (Python)

For PowerShell scripts:
- Windows: PowerShell 5.1+ (built into Windows 10/11)
- macOS/Linux: PowerShell Core 7.0+ (install via package manager)

For Bash scripts:
- Windows: Git Bash, WSL, or Cygwin
- macOS/Linux: Bash shell (built-in)

## Available Scripts

### PowerShell Scripts (Windows, macOS, Linux with PowerShell Core)

- **start-dev.ps1**: Starts the development environment
- **stop-dev.ps1**: Stops the development environment 

### Bash Scripts (macOS, Linux, Windows with Git Bash/WSL)

- **start-dev.sh**: Starts the development environment 
- **stop-dev.sh**: Stops the development environment

## How to Use

### On Windows

1. Open PowerShell
2. Navigate to the project directory
3. Run the start script:
   ```powershell
   .\start-dev.ps1
   ```
4. To stop the environment, run:
   ```powershell
   .\stop-dev.ps1
   ```

### On macOS/Linux

#### Using PowerShell Core

1. Open a terminal
2. Navigate to the project directory
3. Run the start script:
   ```bash
   pwsh ./start-dev.ps1
   ```
4. To stop the environment, run:
   ```bash
   pwsh ./stop-dev.ps1
   ```

#### Using Bash

1. Open a terminal
2. Navigate to the project directory
3. Make the scripts executable (first time only):
   ```bash
   chmod +x ./start-dev.sh ./stop-dev.sh
   ```
4. Run the start script:
   ```bash
   ./start-dev.sh
   ```
5. To stop the environment, run:
   ```bash
   ./stop-dev.sh
   ```

## What the Scripts Do

### Start Scripts

1. Start a MongoDB container using Docker Compose
2. **Check and create Python 3.12 virtual environment if not already present**
3. Activate the Python virtual environment in the backend directory
4. Start the backend server (FastAPI with Uvicorn)
5. Check and install frontend dependencies if not already installed
6. Start the frontend development server (Vite)

The scripts include automatic environment setup:
- If the Python virtual environment doesn't exist, it will be created using `uv venv --python=3.12`
- If a `pyproject.toml` or `requirements.txt` file exists, dependencies will be installed
- If `node_modules` is missing in the frontend directory, the scripts will run `pnpm install` to install the dependencies

### Stop Scripts

1. Stop the backend server process
2. Stop the frontend server process
3. Stop and remove the MongoDB container

## Troubleshooting

### Common Issues

- **"Permission Denied" error when running Bash scripts**: Make the scripts executable with `chmod +x ./start-dev.sh ./stop-dev.sh`
- **Docker Compose command not found**: Ensure Docker is installed and in your PATH
- **Virtual environment not found**: The scripts now automatically create a Python 3.12 virtual environment if missing
- **"vite: command not found" error**: The scripts now automatically install frontend dependencies, but if you still see this error, manually run `pnpm install` in the frontend directory
- **"source: no such file or directory: .venv/bin/activate"**: If you see this error, the scripts will automatically create the virtual environment for you
- **`uv` command not found**: Make sure `uv` is installed. Install it with: `pip install uv`
- **Python 3.12 not found**: Make sure Python 3.12 is installed on your system. The scripts specifically create a Python 3.12 virtual environment.

### Platform-Specific Notes

#### Windows

- If PowerShell execution policy prevents running scripts, change it with:
  ```powershell
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  ```
- Install Python 3.12 from the [official Python website](https://www.python.org/downloads/)

#### macOS

- PowerShell Core can be installed via Homebrew:
  ```bash
  brew install --cask powershell
  ```
- Install `uv` if needed:
  ```bash
  pip install uv
  ```
- Install Python 3.12 via Homebrew:
  ```bash
  brew install python@3.12
  ```

#### Linux

- PowerShell Core can be installed via package manager or direct download:
  ```bash
  # Ubuntu/Debian
  sudo apt-get install -y powershell

  # RHEL/CentOS
  sudo yum install -y powershell
  ```
- Install `uv` if needed:
  ```bash
  pip install uv
  ```
- Install Python 3.12:
  ```bash
  # Ubuntu/Debian
  sudo apt-get install python3.12
  
  # RHEL/CentOS
  sudo yum install python3.12
  ```

## Adding New Services

If you need to add new services to the development environment:

1. Update the Docker Compose configuration in the backend directory
2. Modify the start and stop scripts to include the new services
3. Test the changes on all target platforms 