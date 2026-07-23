"use server";

import { db } from "@/lib/db";
import { applications, activityLogs, STAGE_ORDER, type Stage } from "@/lib/db/schema";
import { eq, desc, count, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getApplications() {
  return await db.select().from(applications).orderBy(desc(applications.updatedAt));
}

export async function getApplicationCounts() {
  const totalResult = await db.select({ count: count() }).from(applications);
  const total = totalResult[0]?.count ?? 0;
  const byStage = await db
    .select({ stage: applications.stage, count: count() })
    .from(applications)
    .groupBy(applications.stage);
  return { total, byStage };
}

export async function updateApplicationStage(
  applicationId: string,
  newStage: Stage,
  performedBy: string = "Sarah Mitchell"
) {
  const now = new Date().toISOString().split("T")[0];

  const appResult = await db.select().from(applications).where(eq(applications.id, applicationId));
  const app = appResult[0];
  if (!app) throw new Error("Application not found");

  const oldStage = app.stage as Stage;

  await db.update(applications)
    .set({ stage: newStage, updatedAt: now })
    .where(eq(applications.id, applicationId));

  await db.insert(activityLogs)
    .values({
      id: `act-${Date.now()}`,
      studentId: app.studentId,
      applicationId: applicationId,
      action: "stage_changed",
      note: `Moved from ${oldStage.replace(/_/g, " ")} to ${newStage.replace(/_/g, " ")}`,
      performedBy,
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
  const id = `app-${Date.now()}`;
  const now = new Date().toISOString().split("T")[0];

  await db.insert(applications)
    .values({
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
  data: { university?: string; course?: string; stage?: Stage; accommodation?: string; insurance?: string },
  performedBy: string = "Sarah Mitchell"
) {
  const now = new Date().toISOString().split("T")[0];

  const appResult = await db.select().from(applications).where(eq(applications.id, applicationId));
  const app = appResult[0];
  if (!app) throw new Error("Application not found");

  const updates: Record<string, string> = { updatedAt: now };
  if (data.university !== undefined) updates.university = data.university;
  if (data.course !== undefined) updates.course = data.course;
  if (data.stage !== undefined) updates.stage = data.stage;
  if (data.accommodation !== undefined) updates.accommodation = data.accommodation;
  if (data.insurance !== undefined) updates.insurance = data.insurance;

  await db.update(applications)
    .set(updates)
    .where(eq(applications.id, applicationId));

  const changes = [];
  if (data.university && data.university !== app.university) changes.push(`university to ${data.university}`);
  if (data.course && data.course !== app.course) changes.push(`course to ${data.course}`);
  if (data.stage && data.stage !== app.stage) changes.push(`stage to ${data.stage.replace(/_/g, " ")}`);
  if (data.accommodation !== undefined && data.accommodation !== app.accommodation) changes.push(`accommodation to ${data.accommodation}`);
  if (data.insurance !== undefined && data.insurance !== app.insurance) changes.push(`insurance to ${data.insurance}`);

  if (changes.length > 0) {
    await db.insert(activityLogs)
      .values({
        id: `act-${Date.now()}`,
        studentId: app.studentId,
        applicationId: applicationId,
        action: "application_updated",
        note: `Updated: ${changes.join(", ")}`,
        performedBy,
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
  note: string,
  performedBy: string = "Sarah Mitchell"
) {
  const now = new Date().toISOString().split("T")[0];

  await db.insert(activityLogs)
    .values({
      id: `act-${Date.now()}`,
      studentId,
      applicationId,
      action,
      note,
      performedBy,
      createdAt: now,
    });

  revalidatePath("/agent-portal");
  return { success: true };
}

export async function getPendingActionCount() {
  const now = new Date().toISOString().split("T")[0];
  const result = await db
    .select({ count: count() })
    .from(applications)
    .where(sql`${applications.stage} != 'visa_approved' AND ${applications.stage} != 'visa_processing'`);
  return result[0]?.count ?? 0;
}
