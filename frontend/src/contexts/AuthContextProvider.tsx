import { ReactNode, useState, useEffect } from "react";
import * as authService from '../services/auth';
import { userApi } from '../api/userApi';
import { AuthContext } from './AuthContextDefinition';
import { User } from './AuthTypes';

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
      const profile = await userApi.getCurrentUser();
      return { ...user, profile };
    } catch (error) {
      console.error('Error loading user profile:', error);
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
    sendPasswordResetEmail
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
