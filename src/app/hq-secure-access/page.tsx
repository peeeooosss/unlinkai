"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Shield, AlertTriangle } from "lucide-react";

export default function HQSecureAccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30 mb-4">
              <Shield className="h-8 w-8 text-red-600 dark:text-red-400" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              HQ Secure Access
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Restricted area for super administrators only
            </p>
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span>All access is logged and monitored</span>
            </div>
          </div>
          <LoginForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
