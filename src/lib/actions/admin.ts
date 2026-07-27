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

export async function getAllApplicationsWithAgent() {
  const user = await getAuthenticatedUser();
  requireSuperadmin(user);

  const result = await db
    .select({
      id: applications.id,
      studentId: applications.studentId,
      studentName: students.name,
      university: applications.university,
      course: applications.course,
      stage: applications.stage,
      status: applications.status,
      submittedAt: applications.submittedAt,
      updatedAt: applications.updatedAt,
      agentId: students.agentId,
      agentName: users.name,
    })
    .from(applications)
    .innerJoin(students, eq(applications.studentId, students.id))
    .leftJoin(users, eq(students.agentId, users.id))
    .orderBy(desc(applications.updatedAt));

  return result;
}

const TUITION_RATES: Record<string, number> = {
  lead: 0,
  application_submitted: 0.08,
  offer_received: 0.10,
  visa_processing: 0.10,
  visa_approved: 0.12,
};

const COMMISSION_BY_EDUCATION: Record<string, number> = {
  "Undergraduate": 0.08,
  "Postgraduate": 0.12,
  "PhD": 0.10,
};

export async function getAdminCommissionStats() {
  const user = await getAuthenticatedUser();
  requireSuperadmin(user);

  const allApps = await db
    .select({
      id: applications.id,
      studentId: applications.studentId,
      studentName: students.name,
      university: applications.university,
      course: applications.course,
      stage: applications.stage,
      educationLevel: students.educationLevel,
      agentId: students.agentId,
      agentName: users.name,
    })
    .from(applications)
    .innerJoin(students, eq(applications.studentId, students.id))
    .leftJoin(users, eq(students.agentId, users.id));

  const TUITION_ESTIMATES: Record<string, number> = {
    "Undergraduate": 25000,
    "Postgraduate": 35000,
    "PhD": 20000,
  };

  let totalExpected = 0;
  let totalReceived = 0;
  const byAgent: Record<string, { name: string; count: number; commission: number }> = {};
  const byStage: Record<string, number> = {};

  for (const app of allApps) {
    const tuition = TUITION_ESTIMATES[app.educationLevel] ?? 30000;
    const rate = COMMISSION_BY_EDUCATION[app.educationLevel] ?? 0.10;
    const commission = Math.round(tuition * rate);

    totalExpected += commission;
    if (app.stage === "visa_approved") {
      totalReceived += commission;
    }

    const agentKey = app.agentId ?? "unassigned";
    if (!byAgent[agentKey]) {
      byAgent[agentKey] = { name: app.agentName ?? "Unassigned", count: 0, commission: 0 };
    }
    byAgent[agentKey].count++;
    byAgent[agentKey].commission += commission;

    byStage[app.stage] = (byStage[app.stage] ?? 0) + commission;
  }

  return {
    totalExpected,
    totalReceived,
    totalPending: totalExpected - totalReceived,
    byAgent: Object.entries(byAgent).map(([id, data]) => ({ id, ...data })),
    byStage: Object.entries(byStage).map(([stage, amount]) => ({ stage, amount })),
    totalApplications: allApps.length,
  };
}
