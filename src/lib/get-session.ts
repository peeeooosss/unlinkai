import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  return {
    id: (session.user as any).id as string,
    role: (session.user as any).role as string,
    name: session.user.name ?? "Agent",
    email: session.user.email ?? "",
  };
}