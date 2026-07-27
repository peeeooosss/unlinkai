import { Metadata } from "next";
import { db } from "@/lib/db";
import { students, documents } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/get-session";
import { DocumentsClient } from "./DocumentsClient";

export const metadata: Metadata = {
  title: "Documents - Student Portal",
};

export default async function DocumentsPage() {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "student") throw new Error("Unauthorized");

  const student = await db.select().from(students).where(eq(students.email, user.email)).limit(1);
  if (!student[0]) throw new Error("Student not found");

  const studentDocuments = await db
    .select()
    .from(documents)
    .where(eq(documents.studentId, student[0].id))
    .orderBy(desc(documents.uploadedAt));

  return <DocumentsClient documents={studentDocuments} student={student[0]} />;
}
