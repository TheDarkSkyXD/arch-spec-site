import { ReactNode, useState, useEffect } from "react";
import * as authService from "../services/auth";
import { userApi } from "../api/userApi";
import { AuthContext } from "./AuthContextDefinition";
import { User } from "./AuthTypes";

// Props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// Custom logger function that only logs in development
const logMessage = (message: string, isError = false) => {
  if (import.meta.env.DEV) {
    if (isError) {
      console.error(message);
    } else {
      console.log(message);
    }
  }
};

// AuthProvider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  // Load user profile from backend
  const loadUserProfile = async (user: User) => {
    try {
      const profile = await userApi.getCurrentUser();
      return { ...user, profile };
    } catch (error) {
      logMessage(
        `Error loading user profile: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        true
      );
      return user;
    }
  };

  // Set up Firebase auth state listener
  useEffect(() => {
    let mounted = true;

    const handleAuthStateChange = async (user: User | null) => {
      try {
        if (user && mounted) {
          // User is signed in, load their profile
          const userWithProfile = await loadUserProfile(user);
          if (mounted) {
            setCurrentUser(userWithProfile);
          }
        } else if (mounted) {
          // User is signed out
          setCurrentUser(null);
        }
      } catch (error) {
        logMessage(
          `Auth state change error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          true
        );
        if (mounted) {
          setCurrentUser(user); // Set basic user info even if profile load fails
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setInitializing(false);
        }
      }
    };

    // Set up auth state listener
    const unsubscribe = authService.onAuthStateChange(handleAuthStateChange);

    // Clean up subscription and prevent state updates after unmount
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    if (loading && !initializing) return; // Prevent multiple concurrent sign-in attempts
    setLoading(true);

    try {
      // Sign in with Firebase
      const user = await authService.signInWithEmail(email, password);

      // Load user profile immediately after sign in
      try {
        const profile = await userApi.getCurrentUser();
        setCurrentUser({ ...user, profile });
      } catch (error) {
        logMessage(
          `Error loading profile after sign in: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          true
        );
        setCurrentUser(user); // Set basic user info even if profile load fails
      }
    } catch (error) {
      logMessage(
        `Sign in error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        true
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (loading && !initializing) return; // Prevent multiple concurrent sign-in attempts
    setLoading(true);

    try {
      // Sign in with Google via Firebase
      const user = await authService.signInWithGoogle();

      // Load user profile immediately after sign in
      try {
        const profile = await userApi.getCurrentUser();
        setCurrentUser({ ...user, profile });
      } catch (error) {
        logMessage(
          `Error loading profile after Google sign-in: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          true
        );
        setCurrentUser(user); // Set basic user info even if profile load fails
      }
    } catch (error) {
      logMessage(
        `Google sign in error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        true
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    if (loading && !initializing) return; // Prevent multiple concurrent sign-up attempts
    setLoading(true);

    try {
      // Create user with Firebase
      const user = await authService.signUpWithEmail(email, password);

      // Load user profile immediately after sign up
      try {
        const profile = await userApi.getCurrentUser();
        setCurrentUser({ ...user, profile });
      } catch (error) {
        logMessage(
          `Error loading profile after sign up: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          true
        );
        setCurrentUser(user); // Set basic user info even if profile load fails
      }
    } catch (error) {
      logMessage(
        `Sign up error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        true
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    if (loading && !initializing) return; // Prevent multiple concurrent sign-out attempts
    setLoading(true);

    try {
      await authService.signOut();
      setCurrentUser(null);
    } catch (error) {
      logMessage(
        `Sign out error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        true
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Send password reset email
  const sendPasswordResetEmail = async (email: string) => {
    return authService.resetPassword(email);
  };

  // Provide the auth context value
  const value = {
    currentUser,
    loading: loading || initializing,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    sendPasswordResetEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
