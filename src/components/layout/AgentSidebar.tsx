"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  FileText,
  IndianRupee,
  GraduationCap,
  BookOpen,
  FileDown,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

const navigationItems = [
  { title: "Dashboard", href: "/agent-portal", icon: LayoutDashboard },
  { title: "Students", href: "/agent-portal/students", icon: Users },
  { title: "Applications", href: "/agent-portal/applications", icon: FileText },
  { title: "Universities", href: "/agent-portal/universities", icon: GraduationCap },
  { title: "Programs", href: "/agent-portal/programs", icon: BookOpen },
  { title: "Brochures", href: "/agent-portal/brochures", icon: FileDown },
  { title: "Commission", href: "/agent-portal/commission", icon: IndianRupee },
];

interface AgentSidebarProps {
  open: boolean;
  onToggle: () => void;
}

export function AgentSidebar({ open, onToggle }: AgentSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <aside
      className="relative flex h-full shrink-0 flex-col bg-white transition-all duration-300 ease-in-out overflow-hidden"
      style={{ width: open ? 256 : 0 }}
    >
      <div className="flex h-full w-64 flex-col">
        <div className="flex h-16 items-center justify-between px-4 border-b border-neutral-200">
          <Link href="/agent-portal" className="flex items-center gap-2" aria-label="Unilinkai Agent Portal">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-amber-600">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            {open && <span className="font-bold text-lg text-neutral-900">Unilinkai</span>}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-neutral-700 hover:bg-neutral-100"
            onClick={onToggle}
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          >
            {open ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.title}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-700"
                }`}
              >
                <item.icon className="h-5 w-5 shrink-0 text-neutral-700" aria-hidden="true" />
                <span>{item.title}</span>
              </Link>
            );
          })}

          <div className="my-4 h-px bg-neutral-200" />

          <Link
            href="/agent-portal/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-colors"
          >
            <Settings className="h-5 w-5 shrink-0 text-neutral-700" aria-hidden="true" />
            <span>Settings</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0 text-neutral-700" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </nav>

        <div className="border-t border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-amber-600">
              {user?.image ? (
                <img src={user.image} alt="" className="h-9 w-9 rounded-full" />
              ) : (
                <span className="text-white font-medium text-sm">
                  {user?.name?.charAt(0) || "U"}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">
                {user?.name || "Agent"}
              </p>
              <p className="text-xs text-neutral-700 truncate capitalize">
                {(user as any)?.role || "agent"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 text-neutral-700 border-neutral-300 hover:bg-neutral-100"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </aside>
  );
}
