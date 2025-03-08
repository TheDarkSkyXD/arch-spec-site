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

try {
  analytics = getAnalytics(app);
  // Initialize Firebase Auth
  auth = getAuth(app);

  console.log("Firebase initialized successfully!");

  // Connect to Auth Emulator if in development
  if (import.meta.env.DEV) {
    // Uncomment the following line if you want to use the Auth Emulator
    // connectAuthEmulator(auth, "http://localhost:9099");
    console.log("Firebase auth running in development mode");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}
