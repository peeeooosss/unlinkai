"use server";

import { db } from "@/lib/db";
import { courses, enrollments, modules, lessons, students } from "@/lib/db/schema";
import { eq, and, inArray, count } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/get-session";
import { revalidatePath } from "next/cache";

function requireAuth(user: { role: string }) {
  if (!user) throw new Error("Unauthorized");
}

export async function getStudentCoursesData(studentId: string) {
  const user = await getAuthenticatedUser();
  requireAuth(user);

  const result = await db
    .select({
      id: courses.id,
      title: courses.title,
      description: courses.description,
      thumbnailUrl: courses.thumbnailUrl,
      duration: courses.duration,
      status: courses.status,
      enrolledAt: enrollments.enrolledAt,
      progress: enrollments.progress,
      enrollmentStatus: enrollments.status,
      enrollmentId: enrollments.id,
    })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(and(eq(enrollments.studentId, studentId), eq(courses.status, "published")));

  for (const course of result) {
    const moduleCount = await db
      .select({ count: count() })
      .from(modules)
      .where(eq(modules.courseId, course.id));
    
    const lessonCount = await db
      .select({ count: count() })
      .from(lessons)
      .innerJoin(modules, eq(lessons.moduleId, modules.id))
      .where(and(eq(modules.courseId, course.id), eq(lessons.isPublished, true)));

    (course as any).moduleCount = moduleCount[0]?.count || 0;
    (course as any).lessonCount = lessonCount[0]?.count || 0;
  }

  return result;
}