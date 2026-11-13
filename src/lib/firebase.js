import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Firebase Web settings are public client configuration; env vars override them for staging.
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDcHUvbVTM_noiIQd5GZKYX6DEarMQCfBc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "master-40cd2.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "master-40cd2",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "master-40cd2.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "668388767870",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:668388767870:android:65fd7cd456f554dbcc802f",
};

export const firebaseReady = Object.values(config).every(Boolean);
const app = firebaseReady ? (getApps().length ? getApp() : initializeApp(config)) : null;
export const firebaseAuth = app ? getAuth(app) : null;

export async function signInWithFirebaseGoogle() {
  if (!firebaseAuth) throw new Error("إعدادات Firebase غير مكتملة");
  const result = await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
  return { user: result.user, token: await result.user.getIdToken() };
}

export async function logoutFromFirebase() {
  if (firebaseAuth) await signOut(firebaseAuth);
}
