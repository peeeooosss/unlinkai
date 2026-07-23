"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User,
  CheckCircle,
  X,
  ArrowLeft,
  GraduationCap,
  Briefcase,
  Shield,
  ArrowRight,
} from "lucide-react";

type Portal = "select" | "student" | "agent";

export function SignupForm() {
  const router = useRouter();
  const [portal, setPortal] = useState<Portal>("select");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: portal }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setPortal("select");
    setName("");
    setEmail("");
    setPassword("");
    setError("");
    setSuccess(false);
    setShowPassword(false);
  };

  if (portal === "select") {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-600 shadow-lg shadow-blue-700/20 mb-6">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Create Your Account</h1>
          <p className="text-neutral-500 text-lg">Choose your portal to get started</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          <button
            onClick={() => setPortal("student")}
            className="group relative text-left p-6 rounded-2xl border-2 border-neutral-200 bg-white hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors mb-4">
              <GraduationCap className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-1">Student</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Apply to universities and track your applications
            </p>
            <ArrowRight className="absolute right-6 top-6 h-5 w-5 text-neutral-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => setPortal("agent")}
            className="group relative text-left p-6 rounded-2xl border-2 border-neutral-200 bg-white hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-amber-50 group-hover:bg-amber-100 transition-colors mb-4">
              <Briefcase className="h-7 w-7 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-1">Agent</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Manage students and university partnerships
            </p>
            <ArrowRight className="absolute right-6 top-6 h-5 w-5 text-neutral-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        <div className="text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  const isAgent = portal === "agent";

  return (
    <div className="max-w-md mx-auto">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to portal selection
      </button>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl shadow-neutral-200/50 overflow-hidden">
        <div
          className={`h-1.5 ${
            isAgent
              ? "bg-gradient-to-r from-amber-500 to-amber-600"
              : "bg-gradient-to-r from-blue-600 to-blue-700"
          }`}
        />

        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-xl ${
                isAgent ? "bg-amber-50" : "bg-blue-50"
              }`}
            >
              {isAgent ? (
                <Briefcase className="h-6 w-6 text-amber-600" />
              ) : (
                <GraduationCap className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">
                {isAgent ? "Agent Registration" : "Student Registration"}
              </h2>
              <p className="text-sm text-neutral-500">
                {isAgent
                  ? "Create your agent account"
                  : "Create your student account"}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <X className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4 shrink-0" />
              Account created! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-neutral-700">
                Full name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 pl-10 border-neutral-200 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500 focus:ring-blue-500/20 focus:bg-white"
                  disabled={isLoading || success}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-neutral-700">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 pl-10 border-neutral-200 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500 focus:ring-blue-500/20 focus:bg-white"
                  disabled={isLoading || success}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-neutral-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-10 pr-10 border-neutral-200 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500 focus:ring-blue-500/20 focus:bg-white"
                  disabled={isLoading || success}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className={`w-full h-11 font-semibold transition-all duration-200 ${
                isAgent
                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
              }`}
              disabled={isLoading || success}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <Separator className="bg-neutral-100" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-neutral-400">
                or sign up with
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 mt-6">
              <Button
                variant="outline"
                disabled={isLoading}
                className="h-10 gap-2 border-neutral-200 text-neutral-600 hover:bg-neutral-50 text-sm"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
