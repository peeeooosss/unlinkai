import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname;

      // Public routes
      if (
        path === "/" ||
        path === "/login" ||
        path === "/hq-secure-access" ||
        path.startsWith("/api/auth")
      ) {
        return true;
      }

      // Require auth for everything else
      if (!token) return false;

      // Role-based protection
      const role = (token as any).role as string | undefined;

      if (path.startsWith("/agent-portal")) {
        return role === "agent" || role === "superadmin";
      }

      if (path.startsWith("/hq-secure-access")) {
        return role === "superadmin";
      }

      return true;
    },
  },
});

export const config = {
  matcher: ["/agent-portal/:path*"],
};
