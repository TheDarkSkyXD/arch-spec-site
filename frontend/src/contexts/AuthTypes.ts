import { UserProfile } from '../api/userApi';

// Define the User type
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  token?: string;
  profile?: UserProfile;
}

// Define the context type
export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  bypassAuthInDev: () => void; // For development bypass
  isDevBypass: boolean; // Flag to indicate if dev bypass is active
}
