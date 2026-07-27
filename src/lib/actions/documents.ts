"use server";

import { db } from "@/lib/db";
import { documents, students } from "@/lib/db/schema";
import { eq, desc, count, inArray, and, SQL, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser } from "@/lib/get-session";

async function getAgentStudents(user: { id: string; role: string }) {
  if (user.role === "superadmin") return [];
  const result = await db.select({ id: students.id }).from(students).where(eq(students.agentId, user.id));
  return result.map(r => r.id);
}

function agentStudentFilter(user: { id: string; role: string }, studentIds: string[]): SQL | undefined {
  if (user.role === "superadmin") return undefined;
  if (studentIds.length === 0) return sql`1=0`;
  return inArray(students.id, studentIds);
}

function buildWhere(...conditions: (SQL | undefined)[]): SQL | undefined {
  const valid = conditions.filter((c): c is SQL => c !== undefined);
  return valid.length === 0 ? undefined : valid.length === 1 ? valid[0] : and(...valid);
}

export async function getDocumentsByStudent(studentId: string) {
  const user = await getAuthenticatedUser();
  const studentIds = await getAgentStudents(user);
  const filter = agentStudentFilter(user, studentIds);

  const studentCheck = await db.select().from(students).where(buildWhere(eq(students.id, studentId), filter));
  if (!studentCheck[0]) throw new Error("Student not found or access denied");

  return await db.select().from(documents).where(eq(documents.studentId, studentId)).orderBy(desc(documents.uploadedAt));
}

export async function getDocumentsByStudents(studentIds: string[]) {
  if (studentIds.length === 0) return [];
  const user = await getAuthenticatedUser();
  const agentStudentIds = await getAgentStudents(user);
  const filter = agentStudentFilter(user, agentStudentIds);

  const studentCheck = await db.select({ id: students.id }).from(students).where(buildWhere(inArray(students.id, studentIds), filter));
  const allowedIds = studentCheck.map(s => s.id);

  if (allowedIds.length === 0) return [];

  return await db.select().from(documents).where(inArray(documents.studentId, allowedIds)).orderBy(desc(documents.uploadedAt));
}

export async function addDocument(data: {
  studentId: string;
  applicationId?: string;
  type: string;
  fileName: string;
}) {
  const user = await getAuthenticatedUser();
  const studentIds = await getAgentStudents(user);
  const filter = agentStudentFilter(user, studentIds);

  const studentCheck = await db.select().from(students).where(buildWhere(eq(students.id, data.studentId), filter));
  if (!studentCheck[0]) throw new Error("Student not found or access denied");

  const id = `doc-${Date.now()}`;
  const now = new Date().toISOString().split("T")[0];

  await db.insert(documents).values({
    id,
    studentId: data.studentId,
    applicationId: data.applicationId || null,
    type: data.type,
    fileName: data.fileName,
    uploadedAt: now,
    verified: false,
  });

  revalidatePath("/agent-portal");
  return id;
}

export async function verifyDocument(documentId: string) {
  const user = await getAuthenticatedUser();
  const studentIds = await getAgentStudents(user);
  const filter = agentStudentFilter(user, studentIds);

  const docResult = await db.select().from(documents).where(eq(documents.id, documentId));
  const doc = docResult[0];
  if (!doc) throw new Error("Document not found");

  const studentCheck = await db.select().from(students).where(buildWhere(eq(students.id, doc.studentId), filter));
  if (!studentCheck[0]) throw new Error("Access denied");

  await db.update(documents).set({ verified: true }).where(eq(documents.id, documentId));

  revalidatePath("/agent-portal");
  return { success: true };
}

export async function getVerifiedDocCount(studentId: string) {
  const user = await getAuthenticatedUser();
  const studentIds = await getAgentStudents(user);
  const filter = agentStudentFilter(user, studentIds);

  const studentCheck = await db.select().from(students).where(buildWhere(eq(students.id, studentId), filter));
  if (!studentCheck[0]) throw new Error("Student not found or access denied");

  const result = await db.select({ count: count() }).from(documents).where(eq(documents.studentId, studentId));
  return result[0]?.count ?? 0;
}