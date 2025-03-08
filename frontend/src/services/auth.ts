import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  AuthError
} from 'firebase/auth';
import { app } from '../firebase/config';

// Initialize Firebase Auth
const auth = getAuth(app);

// User type definition
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  token?: string;
}

// Convert Firebase user to our User type
const mapFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  const token = await firebaseUser.getIdToken();
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    token
  };
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return await mapFirebaseUser(userCredential.user);
  } catch (error) {
    const authError = error as AuthError;
    console.error('Error signing in with email and password:', authError);
    throw new Error(authError.message || 'Failed to sign in');
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return await mapFirebaseUser(userCredential.user);
  } catch (error) {
    const authError = error as AuthError;
    console.error('Error signing up with email and password:', authError);
    throw new Error(authError.message || 'Failed to sign up');
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return await mapFirebaseUser(userCredential.user);
  } catch (error) {
    const authError = error as AuthError;
    console.error('Error signing in with Google:', authError);
    throw new Error(authError.message || 'Failed to sign in with Google');
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    const authError = error as AuthError;
    console.error('Error signing out:', authError);
    throw new Error(authError.message || 'Failed to sign out');
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    const authError = error as AuthError;
    console.error('Error resetting password:', authError);
    throw new Error(authError.message || 'Failed to reset password');
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const user = await mapFirebaseUser(firebaseUser);
      callback(user);
    } else {
      callback(null);
    }
  });
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      unsubscribe();
      if (firebaseUser) {
        const user = await mapFirebaseUser(firebaseUser);
        resolve(user);
      } else {
        resolve(null);
      }
    });
  });
};

// Get auth token for API requests
export const getAuthToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    return await user.getIdToken();
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};
