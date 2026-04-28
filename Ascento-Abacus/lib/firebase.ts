// import { initializeApp, getApps } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getAnalytics, isSupported } from "firebase/analytics";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAZjKKLfWUyI2NHnr0IcDz_pYrKe6SIov0",
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "acento-abacus.firebaseapp.com",
//   databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://acento-abacus-default-rtdb.firebaseio.com",
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "acento-abacus",
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "acento-abacus.firebasestorage.app",
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1005535318576",
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1005535318576:web:3d1ff136c5d54e268a53f5",
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-5QPYKNZ9E4"
// };

// if (typeof window !== "undefined") {
//   console.log("🔥 Initializing Firebase with project:", firebaseConfig.projectId);
// }

// // Initialize Firebase (SSR Safe)
// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
// const auth = getAuth(app);
// const db = getFirestore(app);
// const googleProvider = new GoogleAuthProvider();

// // Initialize Analytics selectively
// if (typeof window !== "undefined") {
//     isSupported().then(yes => {
//         if (yes) getAnalytics(app);
//     });
// }

// export { app, auth, db, googleProvider };

import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Init (safe for SSR)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Analytics + debug (client only)
if (typeof window !== "undefined") {
  console.log("🔥 Firebase Project:", firebaseConfig.projectId);
  isSupported().then((yes) => {
    if (yes) getAnalytics(app);
  });
}

export default app;