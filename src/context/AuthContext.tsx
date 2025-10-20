// src/context/auth-definitions.ts

import { createContext } from 'react';
import { User } from 'firebase/auth';

// 1. Define the Context Type
export interface AuthContextType {
  currentUser: User | null; // The logged-in Firebase user object
  loading: boolean; // True while checking the initial auth status
}

// 2. Create the Context
// Initial value is undefined, which is why we check for it in the hook
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
