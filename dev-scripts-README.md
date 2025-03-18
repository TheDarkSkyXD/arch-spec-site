# Development Scripts Guide

This guide explains how to use the provided PowerShell scripts to automate your development environment setup and teardown.

## Requirements

- Windows with PowerShell 7+ (comes with Windows 10/11)
- Docker installed and running
- Backend requirements:
  - Python 3.12+
  - uv package manager
  - Python virtual environment set up in `backend/.venv/`
  - MongoDB (handled by Docker Compose)
- Frontend requirements:
  - Node.js v20+
  - pnpm package manager

## Scripts

### `start-dev.ps1`

This script automates all steps needed to start your development environment:

1. Starts MongoDB using Docker Compose
2. Activates the Python virtual environment
3. Starts the backend server with uvicorn
4. Starts the frontend development server with pnpm

#### Usage

```powershell
.\start-dev.ps1
```

After running, you'll have:

- Backend running at: http://localhost:8000
- Frontend running at: http://localhost:5173
- MongoDB running on port 27017

The script will open two PowerShell windows:

- One running the backend server
- One running the frontend development server

### `stop-dev.ps1`

This script gracefully stops all development services:

1. Stops the backend server (uvicorn process)
2. Stops the frontend development server (node process)
3. Stops and removes the MongoDB container

#### Usage

```powershell
.\stop-dev.ps1
```

## Deployment Information

The application uses the following deployment strategy:

- **Database**: MongoDB Atlas
- **Backend**: fly.io
- **Frontend**: Vercel

For local development, only MongoDB is containerized. The backend and frontend run directly on your machine.

## Troubleshooting

### Script Execution Policy

If you encounter an error about running scripts being disabled, you may need to change your PowerShell execution policy. Run this in an Administrator PowerShell:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### MongoDB Already Running

If MongoDB is already running on port 27017 from another source, the Docker container might fail to start. Stop any existing MongoDB instances or change the port in your Docker Compose file.

### Process Detection

The stop script attempts to detect running processes based on command-line arguments. If it fails to find and stop processes, you may need to manually close the PowerShell windows or use Task Manager to end the processes.

## Customization

You can modify the scripts to fit your workflow:

- Change ports
- Add environment variables
- Add more services
- Customize window positions or styles

Enjoy your streamlined development workflow!
