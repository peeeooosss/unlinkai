"use server";

import { db } from "@/lib/db";
import { schedules, courses, enrollments, students } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/get-session";

export async function getStudentSchedule() {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "student") throw new Error("Unauthorized");

  const student = await db.select().from(students).where(eq(students.email, user.email)).limit(1);
  if (!student[0]) throw new Error("Student not found");

  const studentEnrollments = await db
    .select({ courseId: enrollments.courseId })
    .from(enrollments)
    .where(eq(enrollments.studentId, student[0].id));

  const courseIds = studentEnrollments.map((e) => e.courseId);

  const scheduleData = await db
    .select()
    .from(schedules)
    .innerJoin(courses, eq(schedules.courseId, courses.id))
    .where(and(eq(schedules.isActive, true)));

  return scheduleData.filter((item) => courseIds.includes(item.schedules.courseId));
}
