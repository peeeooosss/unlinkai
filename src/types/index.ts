export type UserRole = "student" | "agent" | "superadmin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
