"use client";

import { AgentLayout } from "@/components/layout/AgentLayout";

export default function AgentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AgentLayout>{children}</AgentLayout>;
}
