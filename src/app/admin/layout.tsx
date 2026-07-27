"use client";

import { SessionProvider } from "next-auth/react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-neutral-50">
        <AdminSidebar />
        <main className="lg:ml-64 p-6">{children}</main>
      </div>
    </SessionProvider>
  );
}
