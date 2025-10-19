// src/pages/LoginScreen.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { loginUser, registerUser } from "@/firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContextDefinition";
import { ThemeToggle } from "@/components/ThemeToggle"; // 👈 IMPORT THE THEME TOGGLER

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();

  // 1. Redirect if user is already logged in (NO CHANGE)
  useEffect(() => {
    if (!authLoading && currentUser) {
      navigate("/", { replace: true });
    }
  }, [currentUser, authLoading, navigate]);

  // 💥 AUTH SUBMISSION HANDLER (NO CHANGE) 💥
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        await registerUser(email, password);
      } else {
        await loginUser(email, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // If we are checking the session or are already logged in, show nothing
  if (authLoading || currentUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Redirecting...</p>
      </div>
    );
  }

  // Determine button/title text based on mode (NO CHANGE)
  const title = isSignUp ? "Create Account" : "Sign In";
  const description = isSignUp
    ? "Enter your details to create a new prescription account."
    : "Enter your email and password to access PrescriptionX.";
  const submitText = isSignUp ? "Sign Up" : "Sign In";
  const toggleText = isSignUp
    ? "Already have an account? Sign In"
    : "Don't have an account? Sign Up";

  return (
    // 💥 WRAPPER DIV MODIFIED FOR THEME TOGGLER POSITIONING 💥
    <div className="relative flex h-screen items-center justify-center bg-background">
      {/* Position the Theme Toggler in the top right corner */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuthSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="doctor@hospital.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : submitText}
            </Button>

            <Button
              variant="link"
              type="button"
              onClick={() => {
                setIsSignUp((prev) => !prev);
                setError(null);
              }}
              className="text-center text-sm"
            >
              {toggleText}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
