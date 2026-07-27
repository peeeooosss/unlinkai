import { Metadata } from "next";
import { db } from "@/lib/db";
import { students } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/get-session";
import { getStudentQuizzes } from "@/lib/actions/student-quizzes";
import { StudentQuizzesClient } from "./StudentQuizzesClient";

export const metadata: Metadata = {
  title: "Quizzes - Student Portal",
};

interface PageProps {
  searchParams: Promise<{ courseId?: string }>;
}

export default async function QuizzesPage({ searchParams }: PageProps) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "student") throw new Error("Unauthorized");

  const student = await db.select().from(students).where(eq(students.email, user.email)).limit(1);
  if (!student[0]) throw new Error("Student not found");

  const quizzes = await getStudentQuizzes(student[0].id);

  return <StudentQuizzesClient quizzes={quizzes} />;
}