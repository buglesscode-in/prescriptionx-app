// src/components/SignOutButton.tsx

import { Button } from '@/components/ui/button';
import { logoutUser } from '@/firebase/auth'; // Ensure this path is correct
import { LogOut } from 'lucide-react';

export default function SignOutButton() {
  const handleSignOut = async () => {
    try {
      await logoutUser();
      // The ProtectedRoute logic will automatically redirect to /login
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  return (
    <Button
      variant="destructive" // Use the red color variant for a clear action
      size="sm"
      onClick={handleSignOut}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  );
}
