"use server";

import { db } from "@/lib/db";
import { courses, modules, lessons, enrollments, moduleProgress, students, users } from "@/lib/db/schema";
import { eq, desc, and, count, inArray } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/get-session";
import { revalidatePath } from "next/cache";

function requireAuth(user: { role: string }, allowedRoles: string[] = ["student", "agent", "superadmin"]) {
  if (!allowedRoles.includes(user.role)) throw new Error("Unauthorized");
}

export async function getStudentCourses(studentId: string) {
  const user = await getAuthenticatedUser();
  requireAuth(user, ["student", "agent", "superadmin"]);

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
    })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(and(eq(enrollments.studentId, studentId), eq(courses.status, "published")));

  return result;
}

export async function getCourseWithModules(courseId: string) {
  const user = await getAuthenticatedUser();
  requireAuth(user);

  const course = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);

  if (!course[0]) return null;

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
    (mod as any).lessons = modLessons;
  }

  return { ...course[0], modules: courseModules };
}

export async function getModuleWithLessons(moduleId: string) {
  const user = await getAuthenticatedUser();
  requireAuth(user);

  const mod = await db.select().from(modules).where(eq(modules.id, moduleId)).limit(1);
  if (!mod[0]) return null;

  const modLessons = await db
    .select()
    .from(lessons)
    .where(and(eq(lessons.moduleId, moduleId), eq(lessons.isPublished, true)))
    .orderBy(lessons.orderIndex);

  return { ...mod[0], lessons: modLessons };
}

export async function getLesson(lessonId: string) {
  const user = await getAuthenticatedUser();
  requireAuth(user);

  const lesson = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
  return lesson[0] ?? null;
}

export async function getStudentProgress(studentId: string, courseId: string) {
  const user = await getAuthenticatedUser();
  requireAuth(user, ["student", "agent", "superadmin"]);

  const enrollment = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.studentId, studentId), eq(enrollments.courseId, courseId)))
    .limit(1);

  if (!enrollment[0]) return null;

  const progress = await db
    .select()
    .from(moduleProgress)
    .where(eq(moduleProgress.enrollmentId, enrollment[0].id));

  return { enrollment: enrollment[0], moduleProgress: progress };
}

export async function updateModuleProgress(enrollmentId: string, moduleId: string, status: string) {
  const user = await getAuthenticatedUser();
  requireAuth(user, ["student"]);

  const enrollment = await db.select().from(enrollments).where(eq(enrollments.id, enrollmentId)).limit(1);
  if (!enrollment[0]) throw new Error("Enrollment not found");

  const existing = await db
    .select()
    .from(moduleProgress)
    .where(and(eq(moduleProgress.enrollmentId, enrollmentId), eq(moduleProgress.moduleId, moduleId)))
    .limit(1);

  const now = new Date().toISOString();

  if (existing[0]) {
    await db
      .update(moduleProgress)
      .set({
        status,
        startedAt: status === "in_progress" && !existing[0].startedAt ? now : existing[0].startedAt,
        completedAt: status === "completed" ? now : existing[0].completedAt,
      })
      .where(eq(moduleProgress.id, existing[0].id));
  } else {
    await db.insert(moduleProgress).values({
      id: crypto.randomUUID(),
      enrollmentId,
      studentId: enrollment[0].studentId,
      moduleId,
      status,
      startedAt: status === "in_progress" ? now : null,
      completedAt: status === "completed" ? now : null,
    });
  }

  revalidatePath(`/student-portal`);
  return { success: true };
}