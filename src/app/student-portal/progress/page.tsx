import { Metadata } from "next";
import { db } from "@/lib/db";
import { students, enrollments, courses, moduleProgress, assignments, submissions, quizzes, quizAttempts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/get-session";
import { ProgressClient } from "./ProgressClient";

export const metadata: Metadata = {
  title: "Progress - Student Portal",
};

export default async function ProgressPage() {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "student") throw new Error("Unauthorized");

  const student = await db.select().from(students).where(eq(students.email, user.email)).limit(1);
  if (!student[0]) throw new Error("Student not found");

  const studentEnrollments = await db
    .select({
      id: enrollments.id,
      courseId: enrollments.courseId,
      progress: enrollments.progress,
      status: enrollments.status,
      enrolledAt: enrollments.enrolledAt,
      courseTitle: courses.title,
      courseDescription: courses.description,
      courseDuration: courses.duration,
    })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(eq(enrollments.studentId, student[0].id));

  const courseProgress = [];
  for (const enrollment of studentEnrollments) {
    const moduleProgressRecords = await db
      .select()
      .from(moduleProgress)
      .where(eq(moduleProgress.enrollmentId, enrollment.id));

    const totalModules = moduleProgressRecords.length;
    const completedModules = moduleProgressRecords.filter(m => m.status === "completed").length;

    const courseAssignments = await db
      .select({ id: assignments.id })
      .from(assignments)
      .where(eq(assignments.courseId, enrollment.courseId));

    const assignmentIds = courseAssignments.map(a => a.id);
    const submissionsCount = assignmentIds.length > 0 ? await db
      .select()
      .from(submissions)
      .where(and(eq(submissions.studentId, student[0].id), eq(submissions.assignmentId, assignmentIds[0]))) : [];

    const courseQuizzes = await db
      .select({ id: quizzes.id })
      .from(quizzes)
      .where(eq(quizzes.courseId, enrollment.courseId));

    const quizIds = courseQuizzes.map(q => q.id);
    const quizAttemptsRecords = quizIds.length > 0 ? await db
      .select()
      .from(quizAttempts)
      .where(eq(quizAttempts.studentId, student[0].id)) : [];

    courseProgress.push({
      ...enrollment,
      totalModules,
      completedModules,
      totalAssignments: courseAssignments.length,
      submissionsCount: submissionsCount.length,
      totalQuizzes: courseQuizzes.length,
      quizzesAttempted: quizAttemptsRecords.filter(a => quizIds.includes(a.quizId)).length,
      quizzesPassed: quizAttemptsRecords.filter(a => a.passed && quizIds.includes(a.quizId)).length,
    });
  }

  const totalAssignmentsSubmitted = courseProgress.reduce((acc, c) => acc + c.submissionsCount, 0);
  const totalQuizzesPassed = courseProgress.reduce((acc, c) => acc + c.quizzesPassed, 0);
  const totalModulesCompleted = courseProgress.reduce((acc, c) => acc + c.completedModules, 0);
  const averageProgress = courseProgress.length > 0 ? Math.round(courseProgress.reduce((acc, c) => acc + c.progress, 0) / courseProgress.length) : 0;

  return <ProgressClient
    courses={courseProgress}
    stats={{
      totalCourses: courseProgress.length,
      averageProgress,
      totalModulesCompleted,
      totalAssignmentsSubmitted,
      totalQuizzesPassed,
    }}
  />;
}
