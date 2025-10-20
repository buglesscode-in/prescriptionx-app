// src/firebase/auth.ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut, // 👈 IMPORT THE signOut FUNCTION
} from 'firebase/auth';
import { auth } from './config';

// --- 1. SIGN IN (NO CHANGE) ---
export const loginUser = async (email: string, password: string): Promise<void> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    let errorMessage = 'Login failed. Please check your credentials.';
    if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email format.';
    } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      errorMessage = 'Invalid email or password.';
    }
    console.error('Firebase Login Error:', error.message);
    throw new Error(errorMessage);
  }
};

// --- 2. SIGN UP (NO CHANGE) ---
export const registerUser = async (email: string, password: string): Promise<void> => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    let errorMessage = 'Registration failed.';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already registered.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters.';
    }
    console.error('Firebase Registration Error:', error.message);
    throw new Error(errorMessage);
  }
};

// --- 3. LOG OUT (NEW FUNCTION) ---
export const logoutUser = async (): Promise<void> => {
  try {
    // Call the imported signOut function, passing the Firebase auth instance
    await signOut(auth);
  } catch (error) {
    console.error('Firebase Sign Out Error:', error);
    throw new Error('Failed to log out.');
  }
};
