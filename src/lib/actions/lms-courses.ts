"use server";

import { db } from "@/lib/db";
import {
  courses,
  modules,
  lessons,
  enrollments,
  moduleProgress,
  students,
  announcements,
  attendance,
  assignments,
  quizzes,
} from "@/lib/db/schema";
import { eq, desc, and, count, inArray, or, sql, isNull } from "drizzle-orm";
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

  const course = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
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
      .where(and(eq(lessons.moduleId, mod.id)))
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
    .where(eq(lessons.moduleId, moduleId))
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
    .where(and(eq(moduleProgress.studentId, studentId), inArray(moduleProgress.moduleId, 
      (await db.select({ id: modules.id }).from(modules).where(eq(modules.courseId, courseId))).map(m => m.id)
    )));

  return { enrollment: enrollment[0], moduleProgress: progress };
}

export async function updateModuleProgress(studentId: string, moduleId: string, status: string) {
  const user = await getAuthenticatedUser();
  requireAuth(user, ["student"]);

  const mod = await db.select().from(modules).where(eq(modules.id, moduleId)).limit(1);
  if (!mod[0]) throw new Error("Module not found");

  const enrollment = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.studentId, studentId), eq(enrollments.courseId, mod[0].courseId)))
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
      .set({
        status,
        startedAt: status === "in_progress" && !existing[0].startedAt ? now : existing[0].startedAt,
        completedAt: status === "completed" ? now : existing[0].completedAt,
      })
      .where(eq(moduleProgress.id, existing[0].id));
  } else {
    await db.insert(moduleProgress).values({
      id: crypto.randomUUID(),
      enrollmentId: enrollment[0].id,
      studentId,
      moduleId,
      status,
      startedAt: status === "in_progress" ? now : null,
      completedAt: status === "completed" ? now : null,
    });
  }

  revalidatePath("/student-portal");
  return { success: true };
}

export async function getStudentAnnouncements(studentId: string) {
  const user = await getAuthenticatedUser();
  requireAuth(user, ["student", "agent", "superadmin"]);

  const studentEnrollments = await db
    .select({ courseId: enrollments.courseId })
    .from(enrollments)
    .where(eq(enrollments.studentId, studentId));

  const courseIds = studentEnrollments.map((e) => e.courseId);

  let whereClause;
  if (courseIds.length > 0) {
    whereClause = and(
      eq(announcements.isPublished, true),
      or(isNull(announcements.courseId), inArray(announcements.courseId, courseIds)),
    );
  } else {
    whereClause = and(
      eq(announcements.isPublished, true),
      isNull(announcements.courseId),
    );
  }

  const result = await db
    .select()
    .from(announcements)
    .where(whereClause)
    .orderBy(desc(announcements.publishedAt));

  return result;
}

export async function getStudentAttendance(studentId: string, courseId?: string) {
  const user = await getAuthenticatedUser();
  requireAuth(user, ["student", "agent", "superadmin"]);

  const whereClause = courseId
    ? and(eq(attendance.studentId, studentId), eq(attendance.courseId, courseId))
    : eq(attendance.studentId, studentId);

  return db.select().from(attendance).where(whereClause).orderBy(desc(attendance.date));
}

export async function getAttendanceStats(studentId: string, courseId: string) {
  const records = await db
    .select()
    .from(attendance)
    .where(and(eq(attendance.studentId, studentId), eq(attendance.courseId, courseId)));

  const total = records.length;
  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const late = records.filter((r) => r.status === "late").length;
  const excused = records.filter((r) => r.status === "excused").length;

  return {
    total,
    present,
    absent,
    late,
    excused,
    percentage: total > 0 ? Math.round((present / total) * 100) : 0,
  };
}

export async function getStudentDashboardData(studentId: string) {
  const user = await getAuthenticatedUser();
  requireAuth(user, ["student", "agent", "superadmin"]);

  const studentEnrollments = await db
    .select({
      enrollmentId: enrollments.id,
      courseId: enrollments.courseId,
      progress: enrollments.progress,
      enrolledAt: enrollments.enrolledAt,
      courseTitle: courses.title,
      courseDescription: courses.description,
      courseThumbnail: courses.thumbnailUrl,
      courseDuration: courses.duration,
    })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(and(eq(enrollments.studentId, studentId), eq(enrollments.status, "active"), eq(courses.status, "published")));

  const courseIds = studentEnrollments.map((e) => e.courseId);

  const upcomingAssignments = await db
    .select({
      id: assignments.id,
      title: assignments.title,
      dueAt: assignments.dueAt,
      courseTitle: courses.title,
      courseId: courses.id,
    })
    .from(assignments)
    .innerJoin(courses, eq(assignments.courseId, courses.id))
    .where(
      and(
        eq(assignments.isPublished, true),
        sql`${assignments.dueAt} > ${new Date().toISOString()}`,
        courseIds.length > 0 ? inArray(assignments.courseId, courseIds) : isNull(assignments.courseId),
      ),
    )
    .orderBy(assignments.dueAt)
    .limit(5);

  const recentAnnouncements = await db
    .select()
    .from(announcements)
    .where(
      and(
        eq(announcements.isPublished, true),
        or(isNull(announcements.courseId), courseIds.length > 0 ? inArray(announcements.courseId, courseIds) : isNull(announcements.courseId)),
      ),
    )
    .orderBy(desc(announcements.publishedAt))
    .limit(5);

  const upcomingQuizzes = await db
    .select({
      id: quizzes.id,
      title: quizzes.title,
      courseTitle: courses.title,
      courseId: courses.id,
    })
    .from(quizzes)
    .innerJoin(courses, eq(quizzes.courseId, courses.id))
    .where(
      and(
        eq(quizzes.isPublished, true),
        courseIds.length > 0 ? inArray(quizzes.courseId, courseIds) : isNull(quizzes.courseId),
      ),
    )
    .orderBy(desc(quizzes.createdAt))
    .limit(5);

  return {
    enrollments: studentEnrollments,
    upcomingAssignments,
    recentAnnouncements,
    upcomingQuizzes,
  };
}