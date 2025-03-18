<p align="center">
  <img src="frontend/public/assets/images/arch-spec-logo-horizontal.png" alt="ArchSpec Logo" width="500"/>
</p>

# ArchSpec - Early Access / Open Source Release

ArchSpec is an AI-powered software specification system that transforms the software development process by creating comprehensive, implementation-ready specifications before any code is written.

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repo-blue)](https://github.com/mamertofabian/arch-spec)
[![Website](https://img.shields.io/badge/Website-archspec.dev-green)](https://archspec.dev)
[![Development Status](https://img.shields.io/badge/Status-Early%20Access-orange)](https://archspec.dev)

## Project Status

ArchSpec is currently in **early access**. The core functionality is working, while more advanced features are under active development.

### What's Working Now

- ✅ User signup and authentication
- ✅ Project management (create/update/delete)
- ✅ All major specification sections:
  - Requirements
  - Features
  - Pages/UI
  - Data Model
  - API Endpoints
  - Test Cases
- ✅ Preview and file export (markdown) of each specs section
- ✅ Download All (zip) of complete specifications
- ✅ One project template (more coming soon)
- ✅ Manual data entry for all specification sections

### In Development

- ⏳ LemonSqueezy payment integration
- ⏳ AI credit-based enhancement plans
- ⏳ Optimized AI calls (batching) for efficiency and error handling
- ⏳ Intelligent knowledge graphs for "gaps" detection
- ⏳ Implementation sequence generator
- ⏳ Additional project templates
- ⏳ UI polishing and bug fixes

## Try ArchSpec

There are two ways to use ArchSpec:

### 1. Hosted Early Access

[Sign up at archspec.dev](https://archspec.dev/register) to use the hosted version without any setup.

- Basic features available for free
- AI features require payment to cover API costs
- Contact us after signup for AI feature access
- Be among the first to try new features

### 2. Self-Hosted Open Source

Clone and self-host the application with complete control over your data.

- Full customization options
- Unlimited projects and specifications
- Requires your own AI API keys for AI features
- Self-hosting instructions available below

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

## Self-Hosting Setup

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

## Contact

For questions about the hosted early access version or to provide feedback, please reach out:

- GitHub Issues: [Open an issue](https://github.com/mamertofabian/arch-spec/issues)
- YouTube: [@aidrivencoder](https://youtube.com/@aidrivencoder)

_The application is under active development. Contributors welcome!_
