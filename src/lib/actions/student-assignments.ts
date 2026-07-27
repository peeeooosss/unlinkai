"use server";

import { db } from "@/lib/db";
import { assignments, submissions, enrollments, courses } from "@/lib/db/schema";
import { eq, and, inArray, desc, sql } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/get-session";

function requireAuth(user: { role: string }) {
  if (!user) throw new Error("Unauthorized");
}

export async function getStudentAssignments(studentId: string, courseId?: string) {
  const user = await getAuthenticatedUser();
  requireAuth(user);

  const enrolled = await db
    .select({ courseId: enrollments.courseId })
    .from(enrollments)
    .where(and(eq(enrollments.studentId, studentId), eq(enrollments.status, "active")));

  const courseIds = enrolled.map(e => e.courseId);
  if (courseIds.length === 0) return [];

  const allAssignments = await db
    .select()
    .from(assignments)
    .where(and(
      eq(assignments.isPublished, true),
      courseId ? eq(assignments.courseId, courseId) : inArray(assignments.courseId, courseIds)
    ))
    .orderBy(desc(assignments.dueAt));

  const studentSubmissions = await db
    .select()
    .from(submissions)
    .where(and(eq(submissions.studentId, studentId), inArray(submissions.assignmentId, allAssignments.map(a => a.id))));

  const submissionMap = new Map(studentSubmissions.map(s => [s.assignmentId, s]));

  return allAssignments.map(a => ({
    ...a,
    submission: submissionMap.get(a.id) ?? null,
    isOverdue: a.dueAt ? new Date(a.dueAt) < new Date() : false,
  }));
}