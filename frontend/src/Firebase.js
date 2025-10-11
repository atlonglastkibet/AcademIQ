// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXrWPSSmf4AsqBP7rsIhPPYQVo54OIu0U",
  authDomain: "academiq-4d45b.firebaseapp.com",
  projectId: "academiq-4d45b",
  storageBucket: "academiq-4d45b.firebasestorage.app",
  messagingSenderId: "75358706785",
  appId: "1:75358706785:web:d83d2b65275a46f7b11e20",
  measurementId: "G-W8ZYHCG21M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);