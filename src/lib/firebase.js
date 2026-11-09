import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

export const firebaseReady = Object.values(config).every(Boolean);
const app = firebaseReady ? (getApps().length ? getApp() : initializeApp(config)) : null;
export const firebaseAuth = app ? getAuth(app) : null;
export const firebaseStorage = app ? getStorage(app) : null;

export async function signInWithFirebaseGoogle() {
  if (!firebaseAuth) throw new Error("إعدادات Firebase غير مكتملة");
  const result = await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
  return { user: result.user, token: await result.user.getIdToken() };
}

export async function logoutFromFirebase() {
  if (firebaseAuth) await signOut(firebaseAuth);
}

export async function uploadTeacherImage(uid, dataUrl, fileName) {
  if (!firebaseStorage || !dataUrl) return "";
  const imageRef = ref(firebaseStorage, `teachers/${uid}/${fileName}`);
  await uploadString(imageRef, dataUrl, "data_url");
  return getDownloadURL(imageRef);
}
