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
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=archspec
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-3-sonnet-20240229
```

7. Replace `your_anthropic_api_key_here` with your actual Anthropic API key.

### Running with Docker

1. Start the application and MongoDB with Docker Compose:

```bash
docker-compose up
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
