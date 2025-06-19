// src/lib/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyARGzNZDpzwQ1ZJDkAEJ2ffkHrpBo8CqJA",
  authDomain: "se-star-56e7a.firebaseapp.com",
  projectId: "se-star-56e7a",
  storageBucket: "se-star-56e7a.firebasestorage.app",
  messagingSenderId: "65879953998",
  appId: "1:65879953998:web:86e2785d7866391b24e91f",
  measurementId: "G-1NNP96Q5S1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };