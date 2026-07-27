"use server";

import { db } from "@/lib/db";
import { applications, activityLogs, STAGE_ORDER, type Stage, students } from "@/lib/db/schema";
import { eq, desc, count, sql, and, inArray, SQL } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser } from "@/lib/get-session";

async function getAgentStudents(user: { id: string; role: string }) {
  if (user.role === "superadmin") return [];
  const result = await db.select({ id: students.id }).from(students).where(eq(students.agentId, user.id));
  return result.map(r => r.id);
}

function agentApplicationFilter(user: { id: string; role: string }, studentIds: string[]): SQL | undefined {
  if (user.role === "superadmin") return undefined;
  if (studentIds.length === 0) return sql`1=0`;
  return inArray(applications.studentId, studentIds);
}

function buildWhere(...conditions: (SQL | undefined)[]): SQL | undefined {
  const valid = conditions.filter((c): c is SQL => c !== undefined);
  return valid.length === 0 ? undefined : valid.length === 1 ? valid[0] : and(...valid);
}

export async function getApplications() {
  const user = await getAuthenticatedUser();
  const studentIds = await getAgentStudents(user);
  const filter = agentApplicationFilter(user, studentIds);

  return filter
    ? await db.select().from(applications).where(filter).orderBy(desc(applications.updatedAt))
    : await db.select().from(applications).orderBy(desc(applications.updatedAt));
}

export async function getApplicationCounts() {
  const user = await getAuthenticatedUser();
  const studentIds = await getAgentStudents(user);
  const filter = agentApplicationFilter(user, studentIds);

  const totalResult = filter
    ? await db.select({ count: count() }).from(applications).where(filter)
    : await db.select({ count: count() }).from(applications);
  const total = totalResult[0]?.count ?? 0;

  const byStage = filter
    ? await db.select({ stage: applications.stage, count: count() }).from(applications).where(filter).groupBy(applications.stage)
    : await db.select({ stage: applications.stage, count: count() }).from(applications).groupBy(applications.stage);

  return { total, byStage };
}

export async function updateApplicationStage(
  applicationId: string,
  newStage: Stage
) {
  const user = await getAuthenticatedUser();
  const studentIds = await getAgentStudents(user);
  const filter = agentApplicationFilter(user, studentIds);

  const now = new Date().toISOString().split("T")[0];

  const appResult = await db.select().from(applications).where(buildWhere(eq(applications.id, applicationId), filter));
  const app = appResult[0];
  if (!app) throw new Error("Application not found or access denied");

  const oldStage = app.stage as Stage;

  await db.update(applications).set({ stage: newStage, updatedAt: now }).where(buildWhere(eq(applications.id, applicationId), filter));

  await db.insert(activityLogs).values({
    id: `act-${Date.now()}`,
    studentId: app.studentId,
    applicationId: applicationId,
    action: "stage_changed",
    note: `Moved from ${oldStage.replace(/_/g, " ")} to ${newStage.replace(/_/g, " ")}`,
    performedBy: user.name,
    createdAt: now,
  });

  revalidatePath("/agent-portal");
  revalidatePath("/agent-portal/applications");
  return { success: true };
}

export async function createApplication(data: {
  studentId: string;
  university: string;
  course: string;
  accommodation?: string;
  insurance?: string;
}) {
  const user = await getAuthenticatedUser();
  const studentIds = await getAgentStudents(user);
  const filter = agentApplicationFilter(user, studentIds);

  const studentCheck = await db.select().from(students).where(buildWhere(eq(students.id, data.studentId), filter));
  if (!studentCheck[0]) throw new Error("Student not found or access denied");

  const id = `app-${Date.now()}`;
  const now = new Date().toISOString().split("T")[0];

  await db.insert(applications).values({
    id,
    studentId: data.studentId,
    university: data.university,
    course: data.course,
    stage: "lead",
    status: "active",
    accommodation: data.accommodation || null,
    insurance: data.insurance || null,
    submittedAt: now,
    updatedAt: now,
  });

  revalidatePath("/agent-portal");
  revalidatePath("/agent-portal/applications");
  return id;
}

export async function updateApplication(
  applicationId: string,
  data: { university?: string; course?: string; stage?: Stage; accommodation?: string; insurance?: string }
) {
  const user = await getAuthenticatedUser();
  const studentIds = await getAgentStudents(user);
  const filter = agentApplicationFilter(user, studentIds);

  const now = new Date().toISOString().split("T")[0];

  const appResult = await db.select().from(applications).where(buildWhere(eq(applications.id, applicationId), filter));
  const app = appResult[0];
  if (!app) throw new Error("Application not found or access denied");

  const updates: Record<string, string> = { updatedAt: now };
  if (data.university !== undefined) updates.university = data.university;
  if (data.course !== undefined) updates.course = data.course;
  if (data.stage !== undefined) updates.stage = data.stage;
  if (data.accommodation !== undefined) updates.accommodation = data.accommodation;
  if (data.insurance !== undefined) updates.insurance = data.insurance;

  await db.update(applications).set(updates).where(buildWhere(eq(applications.id, applicationId), filter));

  const changes = [];
  if (data.university && data.university !== app.university) changes.push(`university to ${data.university}`);
  if (data.course && data.course !== app.course) changes.push(`course to ${data.course}`);
  if (data.stage && data.stage !== app.stage) changes.push(`stage to ${data.stage.replace(/_/g, " ")}`);
  if (data.accommodation !== undefined && data.accommodation !== app.accommodation) changes.push(`accommodation to ${data.accommodation}`);
  if (data.insurance !== undefined && data.insurance !== app.insurance) changes.push(`insurance to ${data.insurance}`);

  if (changes.length > 0) {
    await db.insert(activityLogs).values({
      id: `act-${Date.now()}`,
      studentId: app.studentId,
      applicationId: applicationId,
      action: "application_updated",
      note: `Updated: ${changes.join(", ")}`,
      performedBy: user.name,
      createdAt: now,
    });
  }

  revalidatePath("/agent-portal");
  revalidatePath("/agent-portal/applications");
  return { success: true };
}

export async function addActivityNote(
  studentId: string,
  applicationId: string | null,
  action: string,
  note: string
) {
  const user = await getAuthenticatedUser();
  const studentIds = await getAgentStudents(user);
  const filter = agentApplicationFilter(user, studentIds);

  const now = new Date().toISOString().split("T")[0];

  const studentCheck = await db.select().from(students).where(buildWhere(eq(students.id, studentId), filter));
  if (!studentCheck[0]) throw new Error("Student not found or access denied");

  await db.insert(activityLogs).values({
    id: `act-${Date.now()}`,
    studentId,
    applicationId,
    action,
    note,
    performedBy: user.name,
    createdAt: now,
  });

  revalidatePath("/agent-portal");
  return { success: true };
}

export async function getPendingActionCount() {
  const user = await getAuthenticatedUser();
  const studentIds = await getAgentStudents(user);
  const filter = agentApplicationFilter(user, studentIds);

  const now = new Date().toISOString().split("T")[0];
  const result = filter
    ? await db.select({ count: count() }).from(applications).where(and(filter, sql`${applications.stage} != 'visa_approved' AND ${applications.stage} != 'visa_processing'`))
    : await db.select({ count: count() }).from(applications).where(sql`${applications.stage} != 'visa_approved' AND ${applications.stage} != 'visa_processing'`);
  return result[0]?.count ?? 0;
}