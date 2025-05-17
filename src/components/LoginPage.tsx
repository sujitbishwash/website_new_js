import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginPage: React.FC = () => {
  const handleSignIn = () => {
    // No credential validation is performed.
    // No backend/API calls are made.
    // Immediately route to the "Exam-Goal" page using client-side JavaScript.
    window.location.href = '/exam-goal.html';
  };

  return (
    <Card className="w-full max-w-md bg-card border-border shadow-xl mx-auto my-auto sm:my-8">
      <CardHeader className="text-center px-6 py-8 sm:px-8">
        <CardTitle className="text-3xl sm:text-4xl font-bold text-primary">Welcome Back</CardTitle>
        <CardDescription className="text-muted-foreground pt-2 text-sm sm:text-base">
          Sign in to continue your AI Padhai journey
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-8 sm:px-8">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="bg-input border-border text-foreground placeholder-muted-foreground focus:ring-ring focus:border-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="bg-input border-border text-foreground placeholder-muted-foreground focus:ring-ring focus:border-primary"
          />
        </div>
        <Button
          onClick={handleSignIn}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-primary-foreground font-semibold py-3 text-base"
        >
          Sign In
        </Button>
        <p className="text-xs sm:text-sm text-muted-foreground text-center">
          By continuing, you agree to our{' '}
          <a href="#" className="text-primary underline hover:text-blue-400">
            Privacy Policy
          </a>
        </p>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
