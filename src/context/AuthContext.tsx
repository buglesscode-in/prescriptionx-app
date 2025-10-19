// src/context/auth-definitions.ts

import { createContext, useContext } from "react";
import { User } from "firebase/auth";

// 1. Define the Context Type
export interface AuthContextType {
  currentUser: User | null; // The logged-in Firebase user object
  loading: boolean; // True while checking the initial auth status
}

// 2. Create the Context
// Initial value is undefined, which is why we check for it in the hook
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// 3. Custom Hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    // Crucial check to ensure the hook is used inside the AuthProvider
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
