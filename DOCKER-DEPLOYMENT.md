# Docker Deployment Guide for ArchSpec

This guide explains how to deploy the ArchSpec application (both frontend and backend) using Docker and GitHub Actions for continuous deployment.

## Architecture Overview

The application consists of three main services:

1. **Frontend**: A React application built with Vite, served via Nginx
2. **Backend**: A Python FastAPI application with Firebase Authentication
3. **MongoDB**: Database for the application

## Local Development with Docker

### Prerequisites

- Docker and Docker Compose installed
- Git
- Firebase project with Authentication enabled

### Running Locally

1. Clone the repository:

   ```
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Create a `.env` file in the root directory with the required environment variables:

   ```
   # MongoDB credentials
   MONGO_ROOT_USERNAME=admin
   MONGO_ROOT_PASSWORD=secure_password

   # API keys
   ANTHROPIC_API_KEY=your_api_key
   ANTHROPIC_MODEL=claude-3-7-sonnet-20250219
   ANTHROPIC_MAX_TOKENS=20000
   ANTHROPIC_TEMPERATURE=0.7

   # Frontend configuration
   # This environment variable will be used to set VITE_API_URL during frontend build
   # For local development, we need a URL that's accessible from your browser
   BACKEND_API_URL=http://localhost:8000

   # Firebase credentials
   FIREBASE_TYPE=service_account
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY_ID=your-private-key-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key content\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-example@your-project-id.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID=your-client-id
   FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
   FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
   FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
   FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-example%40your-project-id.iam.gserviceaccount.com
   FIREBASE_UNIVERSE_DOMAIN=googleapis.com

   # Add other environment variables as needed
   ```

   > **Note**: To get these Firebase credentials, go to Firebase Console > Project Settings > Service Accounts, click "Generate new private key", and use the values from the downloaded JSON file as environment variables.

3. Build and start the containers:

   ```
   docker compose up -d
   ```

4. Access the application:

   - Frontend: http://localhost:80
   - Backend API: http://localhost:8000

5. Stop the containers:
   ```
   docker compose down
   ```

## Digital Ocean Deployment

### Prerequisites

1. A Digital Ocean Droplet with Docker and Docker Compose installed
2. SSH access to the Droplet
3. GitHub repository for your project
4. Firebase project with Authentication enabled

### Manual Deployment

1. SSH into your Digital Ocean Droplet:

   ```
   ssh user@your-droplet-ip
   ```

2. Create a directory for the project and clone the repository:

   ```
   mkdir -p /path/to/project
   cd /path/to/project
   git clone <repository-url> .
   ```

3. Create a `.env` file with your environment variables as shown in the "Running Locally" section.

4. For production deployment, make sure to set the `BACKEND_API_URL` to your actual backend URL that will be accessible from users' browsers:

   ```
   # Production backend URL (replace with your actual domain or IP)
   # This will be passed to the frontend build as VITE_API_URL
   # Must be a URL that is accessible from users' browsers, not a Docker network alias
   BACKEND_API_URL=https://api.yourdomain.com
   # or if using the same server without a domain but exposing the API publicly
   # BACKEND_API_URL=http://your-server-public-ip:8000
   ```

   > **Important**: The URL provided here must be accessible from your users' browsers, not just within your server. Docker network aliases like "backend" won't work because browsers can't resolve these names.

5. Start the application using the production docker-compose file:
   ```
   docker compose -f docker-compose.prod.yml up -d
   ```

### Setting Up GitHub Actions for Continuous Deployment

1. In your GitHub repository, go to Settings > Secrets and create the following secrets:

   - `SSH_PRIVATE_KEY`: Your private SSH key for accessing the droplet
   - `SSH_KNOWN_HOSTS`: Output of `ssh-keyscan your-droplet-ip`
   - `DROPLET_HOST`: Your Digital Ocean droplet IP or hostname
   - `DROPLET_USER`: SSH username for the droplet
   - `PROJECT_PATH`: Path to the project directory on the droplet
   - `BACKEND_API_URL`: The URL where your backend API will be accessible to users' browsers (e.g., `https://api.yourdomain.com` or `http://your-server-public-ip:8000`) - this will be passed to the frontend build as VITE_API_URL
   - `ENV_FILE`: The contents of your `.env` file with all environment variables, including Firebase credentials

2. Ensure the `.github/workflows/deploy.yml` file exists in your repository (it's already included in this project).

3. Push changes to the `main` branch to trigger automatic deployment, or manually trigger the workflow from the Actions tab.

## Container Structure

- **Frontend Container**:

  - Base image: Node.js for build, Nginx for serving
  - Port: 80
  - Custom Nginx configuration for SPA routing

- **Backend Container**:

  - Base image: Python 3.12
  - Port: 8000
  - Runs with a non-root user for security
  - Volumes for persistent storage

- **MongoDB Container**:
  - Base image: MongoDB 6
  - Port: 27017
  - Authentication enabled
  - Persistent volume for data

## Monitoring and Maintenance

### Viewing Logs

```
docker compose logs -f [service_name]
```

### Updating the Application

```
git pull
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Backing Up MongoDB Data

```
docker exec -it <mongo_container_id> mongodump --out /dump
docker cp <mongo_container_id>:/dump ./backup
```

## Troubleshooting

### Container Not Starting

Check logs for errors:

```
docker compose logs [service_name]
```

### Network Issues

Ensure all containers are on the same network:

```
docker network ls
docker network inspect archspec-network
```

### Persistent Storage Problems

Check volume permissions:

```
docker volume ls
docker volume inspect [volume_name]
```
