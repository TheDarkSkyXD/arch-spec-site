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
  const [isDevBypass, setIsDevBypass] = useState(false);

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
    // Check if dev bypass was previously enabled
    const devBypassEnabled = localStorage.getItem("devBypassEnabled");
    if (devBypassEnabled === "true") {
      setIsDevBypass(true);
      setLoading(false);
      return;
    }

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

  // Development bypass function
  const bypassAuthInDev = () => {
    if (import.meta.env.MODE !== "production") {
      // Create a mock user for development
      const mockUser: User = {
        uid: "dev-bypass-user",
        email: "dev@example.com",
        displayName: "Development User",
        photoURL: null,
        profile: {
          _id: "dev-bypass-user",
          email: "dev@example.com",
          display_name: "Development User",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          settings: {}
        }
      };
      
      // Set the user in state
      setCurrentUser(mockUser);
      
      // Set the bypass flag
      setIsDevBypass(true);
      localStorage.setItem("devBypassEnabled", "true");
      
      console.log("🔓 Development authentication bypass enabled");
    } else {
      console.warn("Auth bypass attempted in production mode - not allowed");
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Sign in with Firebase
      await authService.signInWithEmail(email, password);
      
      // Auth state listener will handle setting the user
      
      // Disable dev bypass mode if it was active
      if (isDevBypass) {
        setIsDevBypass(false);
        localStorage.removeItem("devBypassEnabled");
      }
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
      
      // Disable dev bypass mode if it was active
      if (isDevBypass) {
        setIsDevBypass(false);
        localStorage.removeItem("devBypassEnabled");
      }
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
      
      // Also clear dev bypass if active
      if (isDevBypass) {
        setIsDevBypass(false);
        localStorage.removeItem("devBypassEnabled");
      }
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
    bypassAuthInDev,
    isDevBypass
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
