"use client";

import { SessionProvider } from "next-auth/react";
import { StudentSidebar } from "@/components/layout/StudentSidebar";
import { StudentHeader } from "@/components/layout/StudentHeader";
import { useState } from "react";

export default function StudentPortalLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SessionProvider>
      <div className="min-h-screen bg-neutral-50">
        <StudentSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-col flex-1 lg:ml-64">
          <StudentHeader onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}