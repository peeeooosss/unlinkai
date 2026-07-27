"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PanelLeftClose, PanelLeftOpen, LogOut, User } from "lucide-react";

interface AgentHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function AgentHeader({ sidebarOpen, onToggleSidebar }: AgentHeaderProps) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b border-neutral-200 bg-white/95 px-4 backdrop-blur-sm">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-neutral-700 hover:bg-neutral-100"
        onClick={onToggleSidebar}
        aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
      </Button>

      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-neutral-900">
            Agent Portal
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-700 to-amber-600 text-white font-medium">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "Agent"}</p>
                  <p className="text-xs leading-none text-muted-foreground capitalize">{(user as any)?.role || "agent"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })} className="text-red-600 focus:text-red-600 flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
