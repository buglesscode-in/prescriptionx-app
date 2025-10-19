// src/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAJ4WhjlzcFrIb9gsOKkiZuMPYOPmfJIWI",
  authDomain: "prescriptionx-bff.firebaseapp.com",
  projectId: "prescriptionx-bff",
  storageBucket: "prescriptionx-bff.firebasestorage.app",
  messagingSenderId: "771871957527",
  appId: "1:771871957527:web:446793660b6010c40bb252",
  measurementId: "G-73G9JQJP2Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);
