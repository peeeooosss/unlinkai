"use client";

import { SessionProvider } from "next-auth/react";
import { StudentSidebar } from "@/components/layout/StudentSidebar";
import { StudentHeader } from "@/components/layout/StudentHeader";
import { useState } from "react";

export default function StudentPortalLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SessionProvider>
      <div className="flex h-screen w-full overflow-hidden bg-slate-50/50">
        <StudentSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 flex flex-col h-screen overflow-hidden w-full min-w-0">
          <StudentHeader onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-6 overflow-y-auto w-full space-y-6">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}