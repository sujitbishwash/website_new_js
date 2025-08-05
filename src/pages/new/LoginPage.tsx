import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // const response = await authApi.login(email, password);

      // Store the token in localStorage
      // localStorage.setItem("authToken", response.data.access_token);

      // Navigate to exam goal page using React Router
      console.log("Navigating to exam goal page");
      navigate("/exam-goal");
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-card border-border shadow-xl mx-auto my-auto sm:my-8">
      <CardHeader className="text-center px-6 py-8 sm:px-8">
        <CardTitle className="text-3xl sm:text-4xl font-bold text-primary">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-muted-foreground pt-2 text-sm sm:text-base">
          Sign in to continue your AI Padhai journey
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-8 sm:px-8">
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-input border-border text-foreground placeholder-muted-foreground focus:ring-ring focus:border-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-input border-border text-foreground placeholder-muted-foreground focus:ring-ring focus:border-primary"
          />
        </div>
        <Button
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-primary-foreground font-semibold py-3 text-base"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
        <p className="text-xs sm:text-sm text-muted-foreground text-center">
          By continuing, you agree to our{" "}
          <a href="#" className="text-primary underline hover:text-blue-400">
            Privacy Policy
          </a>
        </p>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
