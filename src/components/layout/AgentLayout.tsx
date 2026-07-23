"use client";

import * as React from "react";
import { AgentSidebar } from "./AgentSidebar";
import { AgentHeader } from "./AgentHeader";

interface AgentLayoutProps {
  children: React.ReactNode;
}

const SIDEBAR_WIDTH = 256;
const SIDEBAR_COLLAPSED_WIDTH = 0;

export function AgentLayout({ children }: AgentLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-neutral-50">
      <AgentSidebar open={sidebarOpen} onToggle={() => setSidebarOpen((p) => !p)} />
      <div className="flex flex-1 flex-col min-w-0 transition-all duration-300 ease-in-out">
        <AgentHeader sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((p) => !p)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
