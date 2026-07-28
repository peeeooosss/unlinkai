"use server";

import { db } from "@/lib/db";
import { resources, courses, enrollments, students, modules } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/get-session";

export async function getResources(courseId?: string) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "student") throw new Error("Unauthorized");

  const student = await db.select().from(students).where(eq(students.email, user.email)).limit(1);
  if (!student[0]) throw new Error("Student not found");

  const studentEnrollments = await db
    .select({ courseId: enrollments.courseId })
    .from(enrollments)
    .where(eq(enrollments.studentId, student[0].id));

  const courseIds = studentEnrollments.map((e) => e.courseId);

  const whereCondition = courseId
    ? and(eq(resources.courseId, courseId))
    : undefined;

  const allResources = await db
    .select()
    .from(resources)
    .where(whereCondition)
    .orderBy(resources.orderIndex);

  // Filter to enrolled courses
  const filteredResources = courseId
    ? allResources
    : allResources.filter((r) => courseIds.includes(r.courseId));

  // Get course names
  const allCourses = await db.select().from(courses);
  const courseMap = new Map(allCourses.map((c) => [c.id, c.title]));

  // Get module names
  const allModules = await db.select().from(modules);
  const moduleMap = new Map(allModules.map((m) => [m.id, m.title]));

  return filteredResources.map((r) => ({
    ...r,
    courseTitle: courseMap.get(r.courseId) || "Unknown Course",
    moduleTitle: r.moduleId ? moduleMap.get(r.moduleId) || null : null,
  }));
}
