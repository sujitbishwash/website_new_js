import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginPage: React.FC = () => {
  return (
    <Card className="w-full max-w-md bg-gray-800 border-gray-700 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-blue-500">Welcome Back</CardTitle>
        <CardDescription className="text-gray-400 pt-2">
          Sign in to continue your AI Padhai journey
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-300">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3">
          Sign In
        </Button>
        <p className="text-xs text-gray-500 text-center">
          By continuing, you agree to our{' '}
          <a href="#" className="text-blue-500 underline hover:text-blue-400">
            Privacy Policy
          </a>
        </p>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
