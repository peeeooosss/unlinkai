"use server";

import { db } from "@/lib/db";
import { documents } from "@/lib/db/schema";
import { eq, desc, count, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getDocumentsByStudent(studentId: string) {
  return await db
    .select()
    .from(documents)
    .where(eq(documents.studentId, studentId))
    .orderBy(desc(documents.uploadedAt));
}

export async function getDocumentsByStudents(studentIds: string[]) {
  if (studentIds.length === 0) return [];
  return await db
    .select()
    .from(documents)
    .where(inArray(documents.studentId, studentIds))
    .orderBy(desc(documents.uploadedAt));
}

export async function addDocument(data: {
  studentId: string;
  applicationId?: string;
  type: string;
  fileName: string;
}) {
  const id = `doc-${Date.now()}`;
  const now = new Date().toISOString().split("T")[0];

  await db.insert(documents)
    .values({
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
  await db.update(documents)
    .set({ verified: true })
    .where(eq(documents.id, documentId));

  revalidatePath("/agent-portal");
  return { success: true };
}

export async function getVerifiedDocCount(studentId: string) {
  const result = await db
    .select({ count: count() })
    .from(documents)
    .where(eq(documents.studentId, studentId));
  return result[0]?.count ?? 0;
}
