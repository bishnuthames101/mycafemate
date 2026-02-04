"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Detect if this is super admin domain and check for inactivity logout
  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.host;
      setIsSuperAdmin(host.startsWith("admin."));

      const params = new URLSearchParams(window.location.search);
      if (params.get("reason") === "inactivity") {
        setError("You were logged out due to inactivity.");
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Sign in without any redirect - we'll handle it manually
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      if (!result?.ok) {
        setError("Login failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Authentication successful - redirect based on subdomain
      const currentHost = window.location.host;
      const isSuperAdminDomain = currentHost.startsWith("admin.");

      let redirectPath;
      if (isSuperAdminDomain) {
        redirectPath = "/super-admin";
      } else {
        // For tenant users, we'll redirect to /admin by default
        // The middleware will redirect them based on their actual role
        redirectPath = "/admin";
      }

      // Use window.location.href for full page navigation
      const redirectUrl = `${window.location.protocol}//${currentHost}${redirectPath}`;
      console.log("Redirecting to:", redirectUrl);
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isSuperAdmin
        ? "bg-gradient-to-br from-slate-50 to-slate-100"
        : "bg-cream-gradient"
    }`}>
      <Card className={`w-full max-w-md ${
        isSuperAdmin
          ? "shadow-xl border-slate-200"
          : "shadow-cafe-lg"
      }`}>
        <CardHeader className="space-y-3 text-center">
          {isSuperAdmin ? (
            // Super Admin - Minimal Professional Style
            <>
              <div className="mx-auto w-16 h-16 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center mb-2">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <CardTitle className="text-2xl font-semibold text-slate-900">
                System Administration
              </CardTitle>
              <CardDescription className="text-slate-600 text-sm">
                My-CafeMate Super Admin Portal
              </CardDescription>
            </>
          ) : (
            // Tenant - Warm Cafe Style
            <>
              <div className="mx-auto w-20 h-20 rounded-full bg-cafe-gradient flex items-center justify-center mb-2">
                <span className="text-3xl text-white font-bold">M</span>
              </div>
              <CardTitle className="text-3xl font-bold text-coffee-700">My-CafeMate</CardTitle>
              <CardDescription className="text-coffee-600">
                Complete Cafe Management System
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@mycafemate.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="off"
              />
            </div>
            {error && (
              <div className={`p-3 rounded-md text-sm ${
                error.includes("Too many") || error.includes("locked")
                  ? "bg-orange-50 border border-orange-300 text-orange-800"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}>
                {error.includes("Too many") || error.includes("locked") ? (
                  <div className="flex items-start gap-2">
                    <span className="text-lg">⏱️</span>
                    <div>
                      <p className="font-semibold">Rate Limit Exceeded</p>
                      <p className="mt-1">{error}</p>
                    </div>
                  </div>
                ) : (
                  error
                )}
              </div>
            )}
            <Button
              type="submit"
              className={`w-full ${
                isSuperAdmin
                  ? "bg-slate-900 hover:bg-slate-800"
                  : ""
              }`}
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
