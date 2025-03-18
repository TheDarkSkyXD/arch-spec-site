# ArchSpec Frontend

The frontend for the ArchSpec application, an AI-driven software specification system.

## Tech Stack

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query and Context API
- **UI Components**: Custom components with Tailwind
- **Authentication**: Firebase Authentication
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v20+)
- pnpm package manager

### Setup

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:

```bash
pnpm install
```

4. Create a `.env` file with the following content:

```
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

5. Replace the placeholder values with your actual Firebase configuration.

### Development

Start the development server:

```bash
pnpm dev
```

The application will be available at http://localhost:5173

### Build

Build the application for production:

```bash
pnpm build
```

### Testing

Run tests:

```bash
pnpm test
```

## Deployment

The frontend is deployed to Vercel. Deployment is configured via the `vercel.json` file.

### Deployment Process

1. Connect your GitHub repository to Vercel.
2. Configure environment variables in the Vercel dashboard.
3. Deploy the application.

## Project Structure

```
frontend/
├── public/
│   └── assets/
│       └── images/
├── src/
│   ├── api/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── pages/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── schemas/
│   ├── services/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── .env
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
└── vite.config.ts
```
