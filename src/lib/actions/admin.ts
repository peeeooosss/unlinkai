"use server";

import { db } from "@/lib/db";
import { users, students, applications, documents, activityLogs, STAGE_ORDER, type Stage } from "@/lib/db/schema";
import { eq, desc, count, sql, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser } from "@/lib/get-session";

function requireSuperadmin(user: { role: string }) {
  if (user.role !== "superadmin") throw new Error("Unauthorized: superadmin only");
}

export async function getAgents() {
  const user = await getAuthenticatedUser();
  requireSuperadmin(user);

  const agents = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.role, "agent"))
    .orderBy(desc(users.createdAt));

  const agentStats = await Promise.all(
    agents.map(async (agent) => {
      const studentCount = await db
        .select({ count: count() })
        .from(students)
        .where(eq(students.agentId, agent.id));

      return {
        ...agent,
        studentCount: studentCount[0]?.count ?? 0,
      };
    })
  );

  return agentStats;
}

export async function getAgentStudentCounts() {
  const user = await getAuthenticatedUser();
  requireSuperadmin(user);

  const result = await db
    .select({
      agentId: students.agentId,
      agentName: users.name,
      count: count(),
    })
    .from(students)
    .leftJoin(users, eq(students.agentId, users.id))
    .groupBy(students.agentId, users.name);

  return result;
}

export async function getAdminStats() {
  const user = await getAuthenticatedUser();
  requireSuperadmin(user);

  const totalStudents = await db.select({ count: count() }).from(students);
  const totalApplications = await db.select({ count: count() }).from(applications);
  const totalAgents = await db.select({ count: count() }).from(users).where(eq(users.role, "agent"));
  const totalDocs = await db.select({ count: count() }).from(documents);

  const byStage = await db
    .select({ stage: applications.stage, count: count() })
    .from(applications)
    .groupBy(applications.stage);

  const verifiedDocs = await db
    .select({ count: count() })
    .from(documents)
    .where(eq(documents.verified, true));

  const draftStudents = await db
    .select({ count: count() })
    .from(students)
    .where(eq(students.status, "draft"));

  const approvedCount = byStage.find((s) => s.stage === "visa_approved")?.count ?? 0;
  const totalApps = totalApplications[0]?.count ?? 0;

  return {
    totalStudents: totalStudents[0]?.count ?? 0,
    totalApplications: totalApps,
    totalAgents: totalAgents[0]?.count ?? 0,
    totalDocs: totalDocs[0]?.count ?? 0,
    verifiedDocs: verifiedDocs[0]?.count ?? 0,
    draftStudents: draftStudents[0]?.count ?? 0,
    byStage,
    approvalRate: totalApps > 0 ? Math.round((approvedCount / totalApps) * 100) : 0,
  };
}

export async function getAllStudentsWithAgent() {
  const user = await getAuthenticatedUser();
  requireSuperadmin(user);

  const result = await db
    .select({
      id: students.id,
      name: students.name,
      email: students.email,
      phone: students.phone,
      nationality: students.nationality,
      educationLevel: students.educationLevel,
      status: students.status,
      createdAt: students.createdAt,
      agentId: students.agentId,
      agentName: users.name,
    })
    .from(students)
    .leftJoin(users, eq(students.agentId, users.id))
    .orderBy(desc(students.createdAt));

  return result;
}

export async function getAdminApplicationCounts() {
  const user = await getAuthenticatedUser();
  requireSuperadmin(user);

  const totalResult = await db.select({ count: count() }).from(applications);
  const total = totalResult[0]?.count ?? 0;

  const byStage = await db
    .select({ stage: applications.stage, count: count() })
    .from(applications)
    .groupBy(applications.stage);

  return { total, byStage };
}
