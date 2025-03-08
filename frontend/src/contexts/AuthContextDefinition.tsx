import { createContext, useContext } from "react";
import { AuthContextType } from './AuthTypes';

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  sendPasswordResetEmail: async () => {},
  bypassAuthInDev: () => {}, // Default implementation
  isDevBypass: false, // Default value
});

// Create a hook for using the auth context
export const useAuth = () => useContext(AuthContext);
