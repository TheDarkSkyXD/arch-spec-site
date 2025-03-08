// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNvK6QEkihzsgrZz2_4ZoYVA6XxYK-FMU",
  authDomain: "arch-spec.firebaseapp.com",
  projectId: "arch-spec",
  storageBucket: "arch-spec.firebasestorage.app",
  messagingSenderId: "1091684649033",
  appId: "1:1091684649033:web:2b0ad4433215dacb5f1798",
  measurementId: "G-DMSY9S9QNZ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export let analytics;
export let auth;

// Custom logger function that only logs in development mode
const logMessage = (message: string, isError = false) => {
  if (import.meta.env.DEV) {
    if (isError) {
      // In development, we may want to see errors, but we can control this
      console.error(message);
    } else {
      console.log(message);
    }
  }
  // In production, don't log anything
};

try {
  analytics = getAnalytics(app);
  // Initialize Firebase Auth
  auth = getAuth(app);

  logMessage("Firebase initialized successfully!");

  // Connect to Auth Emulator if in development
  if (import.meta.env.DEV) {
    // Uncomment the following line if you want to use the Auth Emulator
    // connectAuthEmulator(auth, "http://localhost:9099");
    logMessage("Firebase auth running in development mode");
  }
} catch (error) {
  // Only log initialization errors in development, not in production
  logMessage(
    `Firebase initialization error: ${
      error instanceof Error ? error.message : "Unknown error"
    }`,
    true
  );
}
