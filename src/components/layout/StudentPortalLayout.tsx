"use client";

import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { StudentSidebar } from "@/components/layout/StudentSidebar";

export function StudentPortalLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <SessionProvider>
      <div className="min-h-screen bg-neutral-50">
        <StudentSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex-1 lg:pl-0 transition-all duration-300">
          <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-neutral-200">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex h-full items-center px-4"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </header>

          <main className="pt-16 lg:pt-0 pb-8">
            <div className="lg:pl-64">
              {children}
            </div>
          </main>
        </div>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </SessionProvider>
  );
}