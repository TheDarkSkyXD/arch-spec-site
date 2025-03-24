import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UserProfile } from "../api/userApi";
import * as authService from "../services/auth";
import { userApi } from "../api/userApi";

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
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
}

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  sendPasswordResetEmail: async () => {},
});

// Create a hook for using the auth context
export const useAuth = () => useContext(AuthContext);

// Props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile from backend
  const loadUserProfile = async (user: User) => {
    try {
      const profile = await userApi.getCurrentUserProfile();
      return { ...user, profile };
    } catch (error) {
      console.error("Error loading user profile:", error);
      return user;
    }
  };

  // Set up Firebase auth state listener
  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = authService.onAuthStateChange(async (user) => {
      if (user) {
        // User is signed in
        const userWithProfile = await loadUserProfile(user);
        setCurrentUser(userWithProfile);
      } else {
        // User is signed out
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setLoading(true);

    try {
      // Sign in with Firebase
      await authService.signInWithEmail(email, password);

      // Auth state listener will handle setting the user
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    setLoading(true);

    try {
      // Sign in with Google via Firebase
      await authService.signInWithGoogle();

      // Auth state listener will handle setting the user
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    setLoading(true);

    try {
      // Create user with Firebase
      await authService.signUpWithEmail(email, password);

      // Auth state listener will handle setting the user
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    setLoading(true);

    try {
      // Sign out from Firebase
      await authService.signOut();

      // Auth state listener will handle clearing the user
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Send password reset email
  const sendPasswordResetEmail = async (email: string) => {
    await authService.resetPassword(email);
  };

  // Provide the auth context value
  const value = {
    currentUser,
    loading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    sendPasswordResetEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
