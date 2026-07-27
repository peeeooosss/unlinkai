"use server";

import { db } from "@/lib/db";
import { courses, modules, lessons, enrollments, moduleProgress } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/get-session";

function requireAuth(user: { role: string }) {
  if (!user) throw new Error("Unauthorized");
}

export async function getLessonDetail(courseId: string, moduleId: string, lessonId: string, studentId: string) {
  const user = await getAuthenticatedUser();
  requireAuth(user);

  const enrollment = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.studentId, studentId), eq(enrollments.courseId, courseId)))
    .limit(1);

  if (!enrollment[0]) throw new Error("Not enrolled in this course");

  const course = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  const module = await db.select().from(modules).where(eq(modules.id, moduleId)).limit(1);
  const lesson = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);

  if (!course[0] || !module[0] || !lesson[0]) throw new Error("Course/Module/Lesson not found");

  const moduleLessons = await db
    .select()
    .from(lessons)
    .where(and(eq(lessons.moduleId, moduleId), eq(lessons.isPublished, true)))
    .orderBy(lessons.orderIndex);

  const progress = await db
    .select()
    .from(moduleProgress)
    .where(and(eq(moduleProgress.studentId, studentId), eq(moduleProgress.moduleId, moduleId)))
    .limit(1);

  return {
    course: { id: course[0].id, title: course[0].title },
    module: { id: module[0].id, title: module[0].title, orderIndex: module[0].orderIndex },
    lesson: {
      id: lesson[0].id,
      title: lesson[0].title,
      contentType: lesson[0].contentType,
      content: lesson[0].content,
      contentUrl: lesson[0].contentUrl,
      durationMinutes: lesson[0].durationMinutes,
      isFree: lesson[0].isFree,
    },
    lessons: moduleLessons.map(l => ({
      id: l.id,
      title: l.title,
      orderIndex: l.orderIndex,
      isFree: l.isFree,
      isPublished: l.isPublished,
    })),
    progress: progress[0] ? { status: progress[0].status, startedAt: progress[0].startedAt } : null,
  };
}

export async function markLessonComplete(studentId: string, moduleId: string, lessonId: string) {
  const user = await getAuthenticatedUser();
  requireAuth(user);

  if (user.role !== "student" || user.id !== studentId) throw new Error("Forbidden");

  const enrollment = await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.studentId, studentId))
    .limit(1);

  if (!enrollment[0]) throw new Error("Not enrolled");

  const existing = await db
    .select()
    .from(moduleProgress)
    .where(and(eq(moduleProgress.studentId, studentId), eq(moduleProgress.moduleId, moduleId)))
    .limit(1);

  const now = new Date().toISOString();

  if (existing[0]) {
    await db
      .update(moduleProgress)
      .set({ status: "completed", completedAt: now })
      .where(eq(moduleProgress.id, existing[0].id));
  } else {
    await db.insert(moduleProgress).values({
      id: crypto.randomUUID(),
      enrollmentId: enrollment[0].id,
      studentId,
      moduleId,
      status: "completed",
      completedAt: now,
      startedAt: now,
    });
  }

  return { success: true };
}