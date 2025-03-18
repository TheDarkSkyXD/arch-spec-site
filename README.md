<p align="center">
  <img src="frontend/public/assets/images/arch-spec-logo-horizontal.png" alt="ArchSpec Logo" width="500"/>
</p>

# ArchSpec

ArchSpec is an AI-powered software specification system that transforms the software development process by creating comprehensive, implementation-ready specifications before any code is written.

## Core Principles

- **Complete Specification**: Define all aspects of software before implementation
- **Implementation Independence**: Provide sufficient detail for any competent developer
- **Testability By Design**: Integrate testing strategy from the beginning
- **Architectural Integrity**: Adhere to proven software patterns and principles
- **Contextual Continuity**: Allow development to pause/resume without context loss

## System Architecture

ArchSpec consists of four primary subsystems:

1. **User Interface Layer**: Structured input collection with wizard-like progression
2. **AI Processing Core**: Specification generation and refinement engine
3. **Specification Repository**: Storage and version control for artifacts
4. **Export & Integration System**: Format specifications for development tools

## Technology Stack

- **Frontend**: React with TypeScript
- **Backend**: Python FastAPI
- **AI Integration**: OpenAI GPT or equivalent LLM
- **Database**: MongoDB
- **Diagramming**: Mermaid.js
- **Version Control**: Git-based approach

## Specification Domains

- Requirements Management
- Architecture Specification
- Data Design
- API Design
- User Interface Design
- Testing Framework
- Implementation Planning

## Getting Started

### Prerequisites

- Node.js (v20+) with pnpm for frontend development
- Python 3.12+ with uv for backend development
- MongoDB (local instance or containerized for development)
- Firebase project with Authentication configured

### Development Setup

See [dev-scripts-README.md](dev-scripts-README.md) for detailed development setup instructions.

### Authentication

This project uses Firebase Authentication. For authentication setup details, see [README-firebase-auth.md](README-firebase-auth.md).

### Deployment

The application is deployed using:

- **Database**: MongoDB Atlas
- **Backend**: fly.io
- **Frontend**: Vercel

For local development, a Docker Compose file is provided for running MongoDB.

_Additional implementation details to be added as the project progresses._
