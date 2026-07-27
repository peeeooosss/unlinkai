"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Shield, LayoutDashboard, Users, GraduationCap, LogOut, Menu, X, ChevronDown } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Agents", href: "/admin/agents", icon: Users },
  { label: "All Students", href: "/admin/students", icon: GraduationCap },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-neutral-200 shadow-sm"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/20"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-neutral-200 flex flex-col transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2 px-6 py-4 border-b border-neutral-200">
          <Shield className="h-6 w-6 text-red-600" />
          <span className="text-lg font-bold text-neutral-900">UniLinkAI Admin</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "text-neutral-700 hover:bg-neutral-100 border border-transparent"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-neutral-200 p-3">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-xs">
                {session?.user?.name?.[0] ?? "S"}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">{session?.user?.name ?? "Superadmin"}</p>
                <p className="text-[10px] text-neutral-500">Superadmin</p>
              </div>
              <ChevronDown className="h-4 w-4 text-neutral-500" />
            </button>
            {dropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-neutral-200 rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
