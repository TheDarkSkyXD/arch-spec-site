// Auth error handler utility
// Maps Firebase authentication error codes to user-friendly messages

import { AuthError } from 'firebase/auth';

// Map of Firebase error codes to user-friendly messages
const errorMessages: Record<string, string> = {
  'auth/invalid-credential': 'Invalid email or password. Please try again.',
  'auth/user-not-found': 'No account found with this email address.',
  'auth/wrong-password': 'Invalid email or password. Please try again.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/account-exists-with-different-credential':
    'An account already exists with the same email address but different sign-in credentials.',
  'auth/user-disabled': 'This account has been disabled. Please contact support.',
  'auth/too-many-requests': 'Too many unsuccessful login attempts. Please try again later.',
  'auth/operation-not-allowed': 'This login method is not enabled. Please contact support.',
  'auth/network-request-failed': 'Network error. Please check your connection and try again.',
  'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
  'auth/requires-recent-login': 'This operation requires a recent login. Please sign in again.',
  'auth/quota-exceeded': 'Service temporarily unavailable. Please try again later.',
  'auth/timeout': 'Request timeout. Please try again later.',
};

/**
 * Returns a user-friendly error message for Firebase authentication errors
 * @param error - Error object from Firebase Auth
 * @returns Formatted error message string
 */
export const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    // For Firebase auth errors, extract the error code and look up the friendly message
    const authError = error as AuthError;
    const errorCode = authError.code;

    if (errorCode && errorMessages[errorCode]) {
      return errorMessages[errorCode];
    }

    // If we don't have a specific message for this error code, use a generic message
    // but don't expose the raw Firebase error
    return 'Authentication failed. Please try again.';
  }

  // For non-Error objects, return a generic message
  return 'An unexpected error occurred. Please try again.';
};
