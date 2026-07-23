"use client";

import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

function LoginContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-amber-50" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="relative z-10 w-full max-w-4xl">
          <LoginForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
