"use client";

import { useSession } from "next-auth/react";
import { User, AuthState, UserRole } from "@/types";

export function useAuth(): AuthState & { user: User | null } {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  const user: User | null = session?.user
    ? {
        id: (session.user as any).id || "",
        email: session.user.email || "",
        name: session.user.name || "",
        role: ((session.user as any).role as UserRole) || "student",
        image: session.user.image,
      }
    : null;

  return { user, isAuthenticated, isLoading };
}
