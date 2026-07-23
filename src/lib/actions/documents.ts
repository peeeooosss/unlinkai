"use server";

import { db } from "@/lib/db";
import { documents } from "@/lib/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getDocumentsByStudent(studentId: string) {
  return db
    .select()
    .from(documents)
    .where(eq(documents.studentId, studentId))
    .orderBy(desc(documents.uploadedAt))
    .all();
}

export async function addDocument(data: {
  studentId: string;
  applicationId?: string;
  type: string;
  fileName: string;
}) {
  const id = `doc-${Date.now()}`;
  const now = new Date().toISOString().split("T")[0];

  db.insert(documents)
    .values({
      id,
      studentId: data.studentId,
      applicationId: data.applicationId || null,
      type: data.type,
      fileName: data.fileName,
      uploadedAt: now,
      verified: false,
    })
    .run();

  revalidatePath("/agent-portal");
  return id;
}

export async function verifyDocument(documentId: string) {
  db.update(documents)
    .set({ verified: true })
    .where(eq(documents.id, documentId))
    .run();

  revalidatePath("/agent-portal");
  return { success: true };
}

export async function getVerifiedDocCount(studentId: string) {
  const result = db
    .select({ count: count() })
    .from(documents)
    .where(eq(documents.studentId, studentId))
    .get();
  return result?.count ?? 0;
}
