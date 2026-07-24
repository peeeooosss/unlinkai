"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
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
  CheckCircle,
  X,
  ArrowLeft,
  GraduationCap,
  Briefcase,
  Shield,
  ArrowRight,
} from "lucide-react";

type Portal = "select" | "student" | "agent";

export function LoginForm({ initialRole }: { initialRole?: string } = {}) {
  const router = useRouter();
  const [portal, setPortal] = useState<Portal>(
    initialRole === "superadmin" ? "agent" : "select"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          if (portal === "student") {
            window.location.href = "/";
          } else {
            window.location.href = "/agent-portal";
          }
        }, 1000);
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const DEMO_CREDENTIALS = {
    student: { email: "student@unilinkai.com", password: "password" },
    agent: { email: "agent@unilinkai.com", password: "password" },
  };

  const handleBack = () => {
    setPortal("select");
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Welcome to UniLinkAI</h1>
          <p className="text-neutral-500 text-lg">Choose your portal to continue</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          <button
            onClick={() => setPortal("student")}
            className="group relative text-left p-6 rounded-2xl border-2 border-neutral-200 bg-white hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors mb-4">
              <GraduationCap className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-1">Student Portal</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Track your applications, documents, and visa status
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
            <h3 className="text-lg font-bold text-neutral-900 mb-1">Agent Portal</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Manage students, applications, and commissions
            </p>
            <ArrowRight className="absolute right-6 top-6 h-5 w-5 text-neutral-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-neutral-400">
          <Shield className="h-4 w-4" />
          <span>Secured with 256-bit encryption</span>
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
                {isAgent ? "Agent Portal" : "Student Portal"}
              </h2>
              <p className="text-sm text-neutral-500">
                {isAgent
                  ? "Sign in to manage your student portfolio"
                  : "Sign in to track your applications"}
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
              Login successful! Redirecting...
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
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
              <p className="text-xs text-neutral-400">
                Demo:{" "}
                <button
                  type="button"
                  onClick={() => setEmail(DEMO_CREDENTIALS[portal].email)}
                  className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  {DEMO_CREDENTIALS[portal].email}
                </button>
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-neutral-700">
                  Password
                </Label>
                <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-700">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-10 pr-10 border-neutral-200 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500 focus:ring-blue-500/20 focus:bg-white"
                  disabled={isLoading || success}
                  required
                  autoComplete="current-password"
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
              <p className="text-xs text-neutral-400">
                Demo:{" "}
                <button
                  type="button"
                  onClick={() => setPassword(DEMO_CREDENTIALS[portal].password)}
                  className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  {DEMO_CREDENTIALS[portal].password}
                </button>
              </p>
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
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <Separator className="bg-neutral-100" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-neutral-400">
                or continue with
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <Button
                variant="outline"
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="h-10 gap-2 border-neutral-200 text-neutral-600 hover:bg-neutral-50 text-sm"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
