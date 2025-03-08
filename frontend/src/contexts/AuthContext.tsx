import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the User type
export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
}

// Define the context type
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  bypassAuthInDev: () => void; // New function for development bypass
  isDevBypass: boolean; // Flag to indicate if dev bypass is active
}

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  sendPasswordResetEmail: async () => {},
  resetPassword: async () => {},
  bypassAuthInDev: () => {}, // Default implementation
  isDevBypass: false, // Default value
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
  const [isDevBypass, setIsDevBypass] = useState(false);

  // Simulate loading the user session (this would typically check local storage or a token)
  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    
    // Check if dev bypass was previously enabled
    const devBypassEnabled = localStorage.getItem("devBypassEnabled");
    if (devBypassEnabled === "true") {
      setIsDevBypass(true);
    }
    
    setLoading(false);

    // In a real implementation, we would also set up a subscription to auth state changes
    // e.g., firebase.auth().onAuthStateChanged()
  }, []);

  // Development bypass function
  const bypassAuthInDev = () => {
    if (import.meta.env.MODE !== "production") {
      // Create a mock user for development
      const mockUser: User = {
        id: "dev-bypass-user",
        email: "dev@example.com",
        name: "Development User",
        role: "admin" // Give admin role for full access
      };
      
      // Set the user in state and localStorage
      setCurrentUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      
      // Set the bypass flag
      setIsDevBypass(true);
      localStorage.setItem("devBypassEnabled", "true");
      
      console.log("🔓 Development authentication bypass enabled");
    } else {
      console.warn("Auth bypass attempted in production mode - not allowed");
    }
  };

  // Mock sign in function for development
  const signIn = async (email: string, password: string) => {
    // This is just a placeholder - in a real app this would make an API call
    // or use Firebase authentication
    setLoading(true);
    
    try {
      // Simulating an API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For demo purposes, just create a mock user
      const mockUser: User = {
        id: "mock-user-123",
        email,
        name: email.split("@")[0],
        role: "user"
      };
      
      // Save the user to local storage for persistence
      localStorage.setItem("user", JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      
      // Disable dev bypass mode if it was active
      if (isDevBypass) {
        setIsDevBypass(false);
        localStorage.removeItem("devBypassEnabled");
      }
      
    } catch (error) {
      console.error("Error during sign in:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock sign up function for development
  const signUp = async (name: string, email: string, password: string) => {
    // This is just a placeholder - in a real app this would make an API call
    // or use Firebase authentication
    setLoading(true);
    
    try {
      // Simulating an API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For demo purposes, we don't actually create a user here
      // just simulate a successful registration
      
      // In a real app, we might automatically sign the user in after registration
      // or require email verification first
      
    } catch (error) {
      console.error("Error during sign up:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock sign out function for development
  const signOut = async () => {
    // This is just a placeholder - in a real app this would call your auth provider
    setLoading(true);
    
    try {
      // Simulating an API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Clear user from state and local storage
      localStorage.removeItem("user");
      setCurrentUser(null);
      
      // Also clear dev bypass if active
      if (isDevBypass) {
        setIsDevBypass(false);
        localStorage.removeItem("devBypassEnabled");
      }
      
    } catch (error) {
      console.error("Error during sign out:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock password reset functions for development
  const sendPasswordResetEmail = async (email: string) => {
    // This is just a placeholder
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // In a real implementation, this would send a reset email via your auth provider
  };

  const resetPassword = async (token: string, password: string) => {
    // This is just a placeholder
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // In a real implementation, this would verify the token and update the password
  };

  const value = {
    currentUser,
    loading,
    signIn,
    signUp,
    signOut,
    sendPasswordResetEmail,
    resetPassword,
    bypassAuthInDev,
    isDevBypass,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};