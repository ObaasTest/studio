
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Hardcoded Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbJOYx_u_pmNtb7wn6yD2t4mTIAqV1TEk",
  authDomain: "dbhands-abf35.firebaseapp.com",
  projectId: "dbhands-abf35",
  storageBucket: "dbhands-abf35.firebasestorage.app", // Ensure this is the correct format, often it's project-id.appspot.com
  messagingSenderId: "982811244523",
  appId: "1:982811244523:web:eb84b6adeddc60bd6d4bae",
  // measurementId: "YOUR_MEASUREMENT_ID" // Add if you have one, otherwise it's optional
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
