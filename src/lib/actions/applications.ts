"use server";

import { db } from "@/lib/db";
import { applications, activityLogs, STAGE_ORDER, type Stage } from "@/lib/db/schema";
import { eq, desc, count, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getApplications() {
  return db.select().from(applications).orderBy(desc(applications.updatedAt)).all();
}

export async function getApplicationCounts() {
  const total = db.select({ count: count() }).from(applications).get()?.count ?? 0;
  const byStage = db
    .select({ stage: applications.stage, count: count() })
    .from(applications)
    .groupBy(applications.stage)
    .all();
  return { total, byStage };
}

export async function updateApplicationStage(
  applicationId: string,
  newStage: Stage,
  performedBy: string = "Sarah Mitchell"
) {
  const now = new Date().toISOString().split("T")[0];

  const app = db.select().from(applications).where(eq(applications.id, applicationId)).get();
  if (!app) throw new Error("Application not found");

  const oldStage = app.stage as Stage;

  db.update(applications)
    .set({ stage: newStage, updatedAt: now })
    .where(eq(applications.id, applicationId))
    .run();

  db.insert(activityLogs)
    .values({
      id: `act-${Date.now()}`,
      studentId: app.studentId,
      applicationId: applicationId,
      action: "stage_changed",
      note: `Moved from ${oldStage.replace(/_/g, " ")} to ${newStage.replace(/_/g, " ")}`,
      performedBy,
      createdAt: now,
    })
    .run();

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

  db.insert(applications)
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
    })
    .run();

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

  const app = db.select().from(applications).where(eq(applications.id, applicationId)).get();
  if (!app) throw new Error("Application not found");

  const updates: Record<string, string> = { updatedAt: now };
  if (data.university !== undefined) updates.university = data.university;
  if (data.course !== undefined) updates.course = data.course;
  if (data.stage !== undefined) updates.stage = data.stage;
  if (data.accommodation !== undefined) updates.accommodation = data.accommodation;
  if (data.insurance !== undefined) updates.insurance = data.insurance;

  db.update(applications)
    .set(updates)
    .where(eq(applications.id, applicationId))
    .run();

  const changes = [];
  if (data.university && data.university !== app.university) changes.push(`university to ${data.university}`);
  if (data.course && data.course !== app.course) changes.push(`course to ${data.course}`);
  if (data.stage && data.stage !== app.stage) changes.push(`stage to ${data.stage.replace(/_/g, " ")}`);
  if (data.accommodation !== undefined && data.accommodation !== app.accommodation) changes.push(`accommodation to ${data.accommodation}`);
  if (data.insurance !== undefined && data.insurance !== app.insurance) changes.push(`insurance to ${data.insurance}`);

  if (changes.length > 0) {
    db.insert(activityLogs)
      .values({
        id: `act-${Date.now()}`,
        studentId: app.studentId,
        applicationId: applicationId,
        action: "application_updated",
        note: `Updated: ${changes.join(", ")}`,
        performedBy,
        createdAt: now,
      })
      .run();
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

  db.insert(activityLogs)
    .values({
      id: `act-${Date.now()}`,
      studentId,
      applicationId,
      action,
      note,
      performedBy,
      createdAt: now,
    })
    .run();

  revalidatePath("/agent-portal");
  return { success: true };
}

export async function getPendingActionCount() {
  const now = new Date().toISOString().split("T")[0];
  const result = db
    .select({ count: count() })
    .from(applications)
    .where(sql`${applications.stage} != 'visa_approved' AND ${applications.stage} != 'visa_processing'`)
    .get();
  return result?.count ?? 0;
}
