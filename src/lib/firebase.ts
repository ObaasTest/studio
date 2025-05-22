// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

if (!apiKey) {
  const errorMessage =
    "Firebase Configuration Error: NEXT_PUBLIC_FIREBASE_API_KEY is not set in environment variables. " +
    "Please create a .env.local file in the root of your project and add all necessary Firebase configuration variables. Example: \n" +
    "NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key\n" +
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain\n" +
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id\n" +
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket\n" +
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id\n" +
    "NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id\n" +
    "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id (optional)";
  console.error(errorMessage); // Log for server-side/build visibility
  throw new Error("Firebase NEXT_PUBLIC_FIREBASE_API_KEY is missing. Check your environment configuration and server logs for details and an example .env.local structure."); // Error for runtime
}

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: apiKey, // Use the checked variable
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
