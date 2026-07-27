"use server";

import { db } from "@/lib/db";
import { quizzes, quizAttempts, enrollments, courses } from "@/lib/db/schema";
import { eq, and, inArray, desc } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/get-session";

function requireAuth(user: { role: string }) {
  if (!user) throw new Error("Unauthorized");
}

export async function getStudentQuizzes(studentId: string) {
  const user = await getAuthenticatedUser();
  requireAuth(user);

  const enrolled = await db
    .select({ courseId: enrollments.courseId })
    .from(enrollments)
    .where(and(eq(enrollments.studentId, studentId), eq(enrollments.status, "active")));

  const courseIds = enrolled.map(e => e.courseId);
  if (courseIds.length === 0) return [];

  const allQuizzes = await db
    .select()
    .from(quizzes)
    .where(and(eq(quizzes.isPublished, true), inArray(quizzes.courseId, courseIds)))
    .orderBy(desc(quizzes.createdAt));

  const attempts = await db
    .select()
    .from(quizAttempts)
    .where(and(eq(quizAttempts.studentId, studentId), inArray(quizAttempts.quizId, allQuizzes.map(q => q.id))));

  const attemptsMap = new Map(attempts.map(a => [a.quizId, a]));

  return allQuizzes.map(q => ({
    ...q,
    attempt: attemptsMap.get(q.id) ?? null,
    attemptsUsed: attempts.filter(a => a.quizId === q.id).length,
  }));
}