"use server";

import { db } from "@/lib/db";
import {
  students,
  enrollments,
  courses,
  modules,
  lessons,
  assignments,
  submissions,
  quizzes,
  quizAttempts,
  announcements,
  attendance,
  moduleProgress,
  semesters,
  courseSemesters,
  schedules,
  grades,
  notifications,
} from "@/lib/db/schema";
import { eq, and, gte, lte, desc, count, sql } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/get-session";

export async function getDashboardData() {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "student") throw new Error("Unauthorized");

  const student = await db.select().from(students).where(eq(students.email, user.email)).limit(1);
  if (!student[0]) throw new Error("Student not found");

  const studentId = student[0].id;
  const now = new Date().toISOString();

  // Get enrollments with course data
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
    .where(and(eq(enrollments.studentId, studentId), eq(courses.status, "published")));

  // Get module counts per course
  for (const enrollment of studentEnrollments) {
    const moduleCount = await db
      .select({ count: count() })
      .from(modules)
      .where(eq(modules.courseId, enrollment.courseId));

    const lessonCount = await db
      .select({ count: count() })
      .from(lessons)
      .innerJoin(modules, eq(lessons.moduleId, modules.id))
      .where(and(eq(modules.courseId, enrollment.courseId), eq(lessons.isPublished, true)));

    (enrollment as any).moduleCount = moduleCount[0]?.count || 0;
    (enrollment as any).lessonCount = lessonCount[0]?.count || 0;
  }

  // Get upcoming assignments (next 7 days)
  const upcomingAssignments = await db
    .select({
      id: assignments.id,
      title: assignments.title,
      dueAt: assignments.dueAt,
      courseId: assignments.courseId,
      maxPoints: assignments.maxPoints,
      courseTitle: courses.title,
    })
    .from(assignments)
    .innerJoin(courses, eq(assignments.courseId, courses.id))
    .innerJoin(enrollments, eq(enrollments.courseId, courses.id))
    .where(
      and(
        eq(enrollments.studentId, studentId),
        eq(assignments.isPublished, true),
        gte(assignments.dueAt, now)
      )
    )
    .orderBy(assignments.dueAt)
    .limit(5);

  // Get upcoming quizzes
  const upcomingQuizzes = await db
    .select({
      id: quizzes.id,
      title: quizzes.title,
      courseId: quizzes.courseId,
      courseTitle: courses.title,
      timeLimitMinutes: quizzes.timeLimitMinutes,
      maxAttempts: quizzes.maxAttempts,
    })
    .from(quizzes)
    .innerJoin(courses, eq(quizzes.courseId, courses.id))
    .innerJoin(enrollments, eq(enrollments.courseId, courses.id))
    .where(and(eq(enrollments.studentId, studentId), eq(quizzes.isPublished, true)))
    .limit(5);

  // Get recent announcements
  const recentAnnouncements = await db
    .select()
    .from(announcements)
    .where(eq(announcements.isPublished, true))
    .orderBy(desc(announcements.publishedAt))
    .limit(5);

  // Get today's attendance
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const todayAttendance = await db
    .select()
    .from(attendance)
    .where(
      and(
        eq(attendance.studentId, studentId),
        gte(attendance.date, todayStart.toISOString()),
        lte(attendance.date, todayEnd.toISOString())
      )
    );

  // Get today's schedule
  const dayOfWeek = new Date().getDay();
  const todaySchedule = await db
    .select()
    .from(schedules)
    .innerJoin(courses, eq(schedules.courseId, courses.id))
    .innerJoin(enrollments, eq(enrollments.courseId, courses.id))
    .where(
      and(
        eq(enrollments.studentId, studentId),
        eq(schedules.dayOfWeek, dayOfWeek),
        eq(schedules.isActive, true)
      )
    )
    .orderBy(schedules.startTime);

  // Get recent grades
  const recentGrades = await db
    .select()
    .from(grades)
    .where(eq(grades.studentId, studentId))
    .orderBy(desc(grades.gradedAt))
    .limit(5);

  // Calculate GPA
  const allGrades = await db
    .select()
    .from(grades)
    .where(eq(grades.studentId, studentId));

  let totalWeightedScore = 0;
  let totalWeight = 0;
  for (const grade of allGrades) {
    const percentage = (grade.score / grade.maxScore) * 100;
    totalWeightedScore += percentage * grade.weight;
    totalWeight += grade.weight;
  }
  const gpa = totalWeight > 0 ? Math.round((totalWeightedScore / totalWeight) * 10) / 10 : 0;

  // Get unread notifications count
  const unreadNotifications = await db
    .select({ count: count() })
    .from(notifications)
    .where(and(eq(notifications.userId, user.id), eq(notifications.isRead, false)));

  // Get active semester
  const activeSemester = await db
    .select()
    .from(semesters)
    .where(eq(semesters.isActive, true))
    .limit(1);

  // Calculate days remaining in semester
  let daysRemaining = 0;
  if (activeSemester[0]) {
    const endDate = new Date(activeSemester[0].endDate);
    const today = new Date();
    daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  }

  // Count completed lessons
  const completedLessons = await db
    .select({ count: count() })
    .from(moduleProgress)
    .where(and(eq(moduleProgress.studentId, studentId), eq(moduleProgress.status, "completed")));

  // Total lessons across enrolled courses
  let totalLessons = 0;
  for (const enrollment of studentEnrollments) {
    totalLessons += (enrollment as any).lessonCount || 0;
  }

  return {
    student: student[0],
    enrollments: studentEnrollments,
    upcomingAssignments,
    upcomingQuizzes,
    recentAnnouncements,
    todaySchedule,
    todayAttendance,
    recentGrades,
    gpa,
    unreadNotifications: unreadNotifications[0]?.count || 0,
    activeSemester: activeSemester[0] || null,
    daysRemaining,
    completedLessons: completedLessons[0]?.count || 0,
    totalLessons,
    stats: {
      totalCourses: studentEnrollments.length,
      totalAssignmentsDue: upcomingAssignments.length,
      totalQuizzesDue: upcomingQuizzes.length,
      averageProgress: studentEnrollments.length > 0
        ? Math.round(studentEnrollments.reduce((acc, e) => acc + e.progress, 0) / studentEnrollments.length)
        : 0,
    },
  };
}
