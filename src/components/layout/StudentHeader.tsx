"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, ChevronRight, Bell, User } from "lucide-react";

export function StudentHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
      <div className="flex h-full items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-neutral-700 hover:bg-neutral-100"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-neutral-900 hidden sm:block">
            Student Portal
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button className="flex items-center gap-2 p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          <div className="relative">
            <button className="flex items-center gap-2 p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-700 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                {user?.name?.charAt(0) || "S"}
              </div>
            </button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-neutral-700 hover:bg-neutral-100"
            onClick={() => signOut({ callbackUrl: "/login" })}
            aria-label="Sign out"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}