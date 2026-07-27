"use server";

import { db } from "@/lib/db";
import { courses, modules, lessons, enrollments, moduleProgress } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/get-session";

function requireAuth(user: { role: string }) {
  if (!user) throw new Error("Unauthorized");
}

export async function getCourseDetailData(courseId: string, studentId: string) {
  const user = await getAuthenticatedUser();
  requireAuth(user);

  const enrollment = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.studentId, studentId), eq(enrollments.courseId, courseId)))
    .limit(1);

  if (!enrollment[0]) throw new Error("Not enrolled in this course");

  const course = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  if (!course[0]) throw new Error("Course not found");

  const courseModules = await db
    .select()
    .from(modules)
    .where(eq(modules.courseId, courseId))
    .orderBy(modules.orderIndex);

  for (const mod of courseModules) {
    const modLessons = await db
      .select()
      .from(lessons)
      .where(and(eq(lessons.moduleId, mod.id), eq(lessons.isPublished, true)))
      .orderBy(lessons.orderIndex);

    const progress = await db
      .select()
      .from(moduleProgress)
      .where(and(eq(moduleProgress.studentId, studentId), eq(moduleProgress.moduleId, mod.id)))
      .limit(1);

    (mod as any).lessons = modLessons;
    (mod as any).progress = progress[0] || null;
  }

  return { course: course[0], modules: courseModules, enrollment: enrollment[0] };
}