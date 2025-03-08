// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNvK6QEkihzsgrZz2_4ZoYVA6XxYK-FMU",
  authDomain: "arch-spec.firebaseapp.com",
  projectId: "arch-spec",
  storageBucket: "arch-spec.firebasestorage.app",
  messagingSenderId: "1091684649033",
  appId: "1:1091684649033:web:2b0ad4433215dacb5f1798",
  measurementId: "G-DMSY9S9QNZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
