# Firebase Auth Integration with MongoDB

This guide explains how the Firebase Authentication has been integrated with MongoDB in the ArchSpec project.

## Overview

The integration follows these principles:

1. **Firebase Auth** handles all authentication (sign-up, sign-in, token management)
2. **MongoDB** stores all user data and profile information
3. **Firebase UID** is used as the link between Firebase Auth and MongoDB user records

## Setup Instructions

### 1. Firebase Setup

1. **Create a Firebase Service Account Key**:
   - Go to your Firebase project console → Project settings → Service accounts
   - Click "Generate new private key"
   - Save the JSON file as `firebase-service-account.json` in the backend directory

2. **Enable Authentication Methods**:
   - In Firebase console, go to Authentication → Sign-in method
   - Enable Email/Password and Google authentication methods

### 2. Backend Configuration

1. **Install Dependencies**:
   ```bash
   cd backend
   uv install firebase-admin email-validator
   ```

2. **Service Account**:
   - Place your `firebase-service-account.json` in the backend directory
   - This file is used by the Firebase Admin SDK to authenticate with Firebase

3. **MongoDB User Collection**:
   - The system will automatically create a `users` collection in your MongoDB database
   - Each user document contains Firebase UID, email, profile info, and settings

### 3. Frontend Configuration

1. **Firebase SDK**:
   - The Firebase SDK is already configured in `frontend/src/firebase/config.ts`
   - This uses the web app configuration from your Firebase project

2. **Authentication Service**:
   - The authentication service is implemented in `frontend/src/services/auth.ts`
   - It provides functions for sign-in, sign-up, sign-out, and password reset

3. **Auth Context**:
   - The authentication context is implemented in `frontend/src/contexts/AuthContext.tsx` and `AuthContextProvider.tsx`
   - This manages the authentication state and provides it to the application

## Usage

### Backend

1. **Protecting API Routes**:
   ```python
   from ...core.firebase_auth import get_current_user
   
   @router.get("/protected-route")
   async def protected_endpoint(current_user = Depends(get_current_user)):
       # current_user contains the MongoDB user document
       return {"message": f"Hello, {current_user['email']}"}
   ```

2. **Accessing Firebase User Data**:
   ```python
   from ...core.firebase_auth import get_firebase_user
   
   @router.get("/firebase-data")
   async def firebase_data_endpoint(firebase_user = Depends(get_firebase_user)):
       # firebase_user contains the decoded Firebase token data
       return {"uid": firebase_user["uid"], "email": firebase_user["email"]}
   ```

### Frontend

1. **Using Authentication in Components**:
   ```tsx
   import { useAuth } from '../contexts/AuthContext';
   
   function MyComponent() {
     const { currentUser, signIn, signOut } = useAuth();
     
     const handleLogin = async () => {
       try {
         await signIn('user@example.com', 'password');
       } catch (error) {
         console.error('Login failed:', error);
       }
     };
     
     return (
       <div>
         {currentUser ? (
           <>
             <p>Welcome, {currentUser.email}</p>
             <button onClick={signOut}>Sign Out</button>
           </>
         ) : (
           <button onClick={handleLogin}>Sign In</button>
         )}
       </div>
     );
   }
   ```

2. **Development Bypass**:
   For local development, you can bypass Firebase authentication:
   ```tsx
   import { useAuth } from '../contexts/AuthContext';
   
   function DevTools() {
     const { bypassAuthInDev, isDevBypass } = useAuth();
     
     return (
       <div>
         <button onClick={bypassAuthInDev} disabled={isDevBypass}>
           Enable Dev Auth Bypass
         </button>
       </div>
     );
   }
   ```

## User Data Structure

### MongoDB User Document

```json
{
  "_id": "ObjectId",
  "firebase_uid": "firebase-user-id",
  "email": "user@example.com",
  "display_name": "User Name",
  "photo_url": "https://example.com/photo.jpg",
  "created_at": "2023-01-01T00:00:00",
  "updated_at": "2023-01-01T00:00:00",
  "last_login": "2023-01-01T00:00:00",
  "is_active": true,
  "settings": {
    "theme": "dark"
  }
}
```

## Security Considerations

1. **Firebase Service Account**:
   - Keep your `firebase-service-account.json` secure and never commit it to version control
   - Consider using environment variables for production deployments

2. **Token Verification**:
   - All Firebase tokens are verified on the backend before granting access
   - Tokens expire after 1 hour by default

3. **User Management**:
   - Users can be disabled in the Firebase console to immediately revoke access
   - The `is_active` flag in MongoDB can be used to soft-delete users

## Troubleshooting

1. **Firebase Admin SDK Initialization**:
   - If you see errors about Firebase Admin SDK initialization, check that your service account file is correctly placed and formatted

2. **CORS Issues**:
   - If you encounter CORS errors, ensure that your frontend origin is added to the CORS settings in the backend

3. **Token Verification Failures**:
   - Check that the clocks on your development and production servers are synchronized
   - Ensure that the Firebase project ID in your service account matches the one in your frontend configuration
