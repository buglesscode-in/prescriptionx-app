// src/context/authContextDefinition.ts

import { createContext, useContext } from 'react';
import { User } from 'firebase/auth';

// 1. Define the Context Type (Same as before)
export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

// 2. Create the Context (Same as before)
// We use 'undefined' as the initial value, which is checked in the hook
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Custom Hook for easy access (This can stay here or move to the provider file)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
