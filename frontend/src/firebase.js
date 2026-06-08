// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDp2oTTBaNgw4IS7yqJLCHRooVjwicBzsw",
  authDomain: "biowinagro.firebaseapp.com",
  projectId: "biowinagro",
  storageBucket: "biowinagro.firebasestorage.app",
  messagingSenderId: "4623260905",
  appId: "1:4623260905:web:89472651927847f7d02478",
  measurementId: "G-ZC340TW678"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;
