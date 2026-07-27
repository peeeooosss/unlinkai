import { Metadata } from "next";
import { db } from "@/lib/db";
import { students } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/get-session";
import { getStudentAssignments } from "@/lib/actions/student-assignments";
import { StudentAssignmentsClient } from "./StudentAssignmentsClient";

export const metadata: Metadata = {
  title: "Assignments - Student Portal",
};

interface PageProps {
  searchParams: Promise<{ courseId?: string }>;
}

export default async function AssignmentsPage({ searchParams }: PageProps) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "student") throw new Error("Unauthorized");

  const student = await db.select().from(students).where(eq(students.email, user.email)).limit(1);
  if (!student[0]) throw new Error("Student not found");

  const assignments = await getStudentAssignments(student[0].id);

  return <StudentAssignmentsClient assignments={assignments} studentId={student[0].id} />;
}