// src/components/SignOutButton.tsx

import { Button } from '@/components/ui/button';
import { logoutUser } from '@/firebase/auth'; // Ensure this path is correct
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignOutButtonProps {
  className?: string;
}

export default function SignOutButton({ className }: SignOutButtonProps) {
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
      variant="ghost"
      size="sm"
      onClick={handleSignOut}
      className={cn('text-muted-foreground hover:text-foreground', className)}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  );
}
