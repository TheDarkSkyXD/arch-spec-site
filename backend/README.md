# ArchSpec Backend

This is the backend for the ArchSpec application, an AI-driven software specification system that creates detailed implementation plans before writing any code.

## Tech Stack

- **Framework**: FastAPI
- **Database**: MongoDB
- **AI Integration**: Anthropic Claude API

## Getting Started

### Prerequisites

- Python 3.12 or higher
- Docker and Docker Compose (for running MongoDB)

### Setup

1. Clone the repository
2. Navigate to the backend directory
3. Create a virtual environment:

```bash
python -m venv .venv
```

4. Activate the virtual environment:

```bash
# On Windows
.venv\Scripts\activate

# On macOS/Linux
source .venv/bin/activate
```

5. Install dependencies:

```bash
pip install -r requirements.txt
```

6. Create a `.env` file with the following content:

```
# MongoDB credentials
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=archspec

# Anthropic API credentials
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-3-7-sonnet-20250219
ANTHROPIC_MAX_TOKENS=20000
ANTHROPIC_TEMPERATURE=0.7

# Firebase credentials (required for authentication)
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_client_email@example.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your_client_x509_cert_url
FIREBASE_UNIVERSE_DOMAIN=googleapis.com
```

7. Replace the placeholder values with your actual API keys and Firebase credentials. You can obtain Firebase credentials from the Firebase console:
   - Go to Project Settings > Service accounts
   - Click "Generate new private key"
   - Use the values from the downloaded JSON file to populate the environment variables

### Running with Docker

1. Start the application and MongoDB with Docker Compose:

```bash
docker compose up
```

2. The API will be available at http://localhost:8000

### Running Locally

1. Start MongoDB with Docker:

```bash
docker run -d -p 27017:27017 --name mongodb mongo:6
```

2. Start the FastAPI application:

```bash
uvicorn app.main:app --reload
```

3. The API will be available at http://localhost:8000

## API Documentation

Once the application is running, you can access the API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── projects.py
│   │   │   ├── specifications.py
│   │   │   └── export.py
│   │   └── api.py
│   ├── core/
│   │   └── config.py
│   ├── db/
│   │   └── base.py
│   ├── schemas/
│   │   ├── project.py
│   │   ├── specification.py
│   │   └── artifact.py
│   ├── services/
│   │   ├── ai_service.py
│   │   ├── generator_service.py
│   │   └── export_service.py
│   └── main.py
├── tests/
│   ├── api/
│   └── services/
├── .env
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```
