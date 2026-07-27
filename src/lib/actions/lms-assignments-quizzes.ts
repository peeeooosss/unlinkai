"use server";

import { db } from "@/lib/db";
import {
  assignments,
  submissions,
  quizzes,
  quizQuestions,
  quizAttempts,
  quizAnswers,
  students,
  courses,
  modules,
  enrollments,
} from "@/lib/db/schema";
import { eq, desc, and, count, inArray, sql } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/get-session";
import { revalidatePath } from "next/cache";

function requireAuth(user: { role: string }) {
  if (!user) throw new Error("Unauthorized");
}

function requireAdminOrAgent(user: { role: string }) {
  if (!["superadmin", "agent"].includes(user.role)) throw new Error("Forbidden");
}

// ==================== Assignments ====================

export async function getStudentAssignments(courseId?: string) {
  const user = await getAuthenticatedUser();
  requireAuth(user);

  if (user.role !== "student") throw new Error("Forbidden");

  const student = await db.select().from(students).where(eq(students.email, user.email)).limit(1);
  if (!student[0]) throw new Error("Student not found");

  const enrolledCourses = await db
    .select({ courseId: enrollments.courseId })
    .from(enrollments)
    .where(and(eq(enrollments.studentId, student[0].id), eq(enrollments.status, "active")));

  const courseIds = enrolledCourses.map((e) => e.courseId);
  if (courseId && !courseIds.includes(courseId)) throw new Error("Not enrolled");

  const allAssignments = await db
    .select()
    .from(assignments)
    .where(and(eq(assignments.isPublished, true), courseId ? eq(assignments.courseId, courseId) : inArray(assignments.courseId, courseIds)))
    .orderBy(assignments.dueAt);

  const studentSubmissions = await db
    .select()
    .from(submissions)
    .where(and(eq(submissions.studentId, student[0].id), inArray(submissions.assignmentId, allAssignments.map((a) => a.id))));

  const submissionMap = new Map(studentSubmissions.map((s) => [s.assignmentId, s]));

  return allAssignments.map((a) => ({
    ...a,
    submission: submissionMap.get(a.id) ?? null,
    isOverdue: a.dueAt ? new Date(a.dueAt) < new Date() : false,
  }));
}

export async function getAssignment(assignmentId: string) {
  const user = await getAuthenticatedUser();
  requireAuth(user);

  const assignment = await db.select().from(assignments).where(eq(assignments.id, assignmentId)).limit(1);
  if (!assignment[0]) throw new Error("Assignment not found");

  return assignment[0];
}

export async function submitAssignment(assignmentId: string, data: { textContent?: string; fileUrls?: string[] }) {
  const user = await getAuthenticatedUser();
  requireAuth(user);

  if (user.role !== "student") throw new Error("Forbidden");

  const student = await db.select().from(students).where(eq(students.email, user.email)).limit(1);
  if (!student[0]) throw new Error("Student not found");

  const assignment = await db.select().from(assignments).where(eq(assignments.id, assignmentId)).limit(1);
  if (!assignment[0]) throw new Error("Assignment not found");
  if (!assignment[0].isPublished) throw new Error("Assignment not available");

  const existing = await db
    .select()
    .from(submissions)
    .where(and(eq(submissions.assignmentId, assignmentId), eq(submissions.studentId, student[0].id)))
    .limit(1);

  const now = new Date().toISOString();

  if (existing[0]) {
    await db
      .update(submissions)
      .set({
        textContent: data.textContent ?? null,
        fileUrls: data.fileUrls ?? [],
        submittedAt: now,
      })
      .where(eq(submissions.id, existing[0].id));
  } else {
    await db.insert(submissions).values({
      id: crypto.randomUUID(),
      assignmentId,
      studentId: student[0].id,
      textContent: data.textContent ?? null,
      fileUrls: data.fileUrls ?? [],
      submittedAt: now,
    });
  }

  revalidatePath("/student-portal/assignments");
  return { success: true };
}

export async function getAssignmentSubmissions(assignmentId: string) {
  const user = await getAuthenticatedUser();
  requireAdminOrAgent(user);

  const allSubmissions = await db
    .select({
      id: submissions.id,
      textContent: submissions.textContent,
      fileUrls: submissions.fileUrls,
      submittedAt: submissions.submittedAt,
      score: submissions.score,
      feedback: submissions.feedback,
      studentName: students.name,
      studentEmail: students.email,
    })
    .from(submissions)
    .innerJoin(students, eq(submissions.studentId, students.id))
    .where(eq(submissions.assignmentId, assignmentId))
    .orderBy(desc(submissions.submittedAt));

  return allSubmissions;
}

export async function gradeSubmission(submissionId: string, data: { score: number; feedback?: string }) {
  const user = await getAuthenticatedUser();
  requireAdminOrAgent(user);

  await db
    .update(submissions)
    .set({ score: data.score, feedback: data.feedback ?? null, gradedAt: new Date().toISOString(), gradedBy: user.id })
    .where(eq(submissions.id, submissionId));

  revalidatePath("/admin/assignments");
  return { success: true };
}

// ==================== Quizzes ====================

export async function getStudentQuizzes(courseId?: string) {
  const user = await getAuthenticatedUser();
  requireAuth(user);

  if (user.role !== "student") throw new Error("Forbidden");

  const student = await db.select().from(students).where(eq(students.email, user.email)).limit(1);
  if (!student[0]) throw new Error("Student not found");

  const enrolledCourses = await db
    .select({ courseId: enrollments.courseId })
    .from(enrollments)
    .where(and(eq(enrollments.studentId, student[0].id), eq(enrollments.status, "active")));

  const courseIds = enrolledCourses.map((e) => e.courseId);
  if (courseId && !courseIds.includes(courseId)) throw new Error("Not enrolled");

  const allQuizzes = await db
    .select()
    .from(quizzes)
    .where(and(eq(quizzes.isPublished, true), courseId ? eq(quizzes.courseId, courseId) : inArray(quizzes.courseId, courseIds)))
    .orderBy(quizzes.createdAt);

  const attempts = await db
    .select()
    .from(quizAttempts)
    .where(and(eq(quizAttempts.studentId, student[0].id), inArray(quizAttempts.quizId, allQuizzes.map((q) => q.id))));

  const attemptsMap = new Map(attempts.map((a) => [a.quizId, a]));

  return allQuizzes.map((q) => ({
    ...q,
    attempt: attemptsMap.get(q.id) ?? null,
    attemptsUsed: attempts.filter((a) => a.quizId === q.id).length,
  }));
}

export async function getQuizWithQuestions(quizId: string) {
  const user = await getAuthenticatedUser();
  requireAuth(user);

  const quiz = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
  if (!quiz[0]) throw new Error("Quiz not found");
  if (!quiz[0].isPublished && user.role === "student") throw new Error("Quiz not available");

  const questions = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.quizId, quizId))
    .orderBy(quizQuestions.orderIndex);

  return { quiz: quiz[0], questions };
}

export async function startQuizAttempt(quizId: string) {
  const user = await getAuthenticatedUser();
  requireAuth(user);

  if (user.role !== "student") throw new Error("Forbidden");

  const student = await db.select().from(students).where(eq(students.email, user.email)).limit(1);
  if (!student[0]) throw new Error("Student not found");

  const quiz = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
  if (!quiz[0]) throw new Error("Quiz not found");

  const existingAttempts = await db
    .select()
    .from(quizAttempts)
    .where(and(eq(quizAttempts.quizId, quizId), eq(quizAttempts.studentId, student[0].id)));

  if (existingAttempts.length >= quiz[0].maxAttempts) throw new Error("Max attempts reached");

  const attempt = await db
    .insert(quizAttempts)
    .values({
      id: crypto.randomUUID(),
      quizId,
      studentId: student[0].id,
      score: 0,
      maxScore: 0,
      passed: false,
      startedAt: new Date().toISOString(),
    })
    .returning();

  return attempt[0];
}

export async function submitQuizAttempt(attemptId: string, answers: { questionId: string; answer: string }[]) {
  const user = await getAuthenticatedUser();
  requireAuth(user);

  if (user.role !== "student") throw new Error("Forbidden");

  const attempt = await db.select().from(quizAttempts).where(eq(quizAttempts.id, attemptId)).limit(1);
  if (!attempt[0]) throw new Error("Attempt not found");
  if (attempt[0].completedAt) throw new Error("Already submitted");

  const quiz = await db.select().from(quizzes).where(eq(quizzes.id, attempt[0].quizId)).limit(1);
  if (!quiz[0]) throw new Error("Quiz not found");

  const questions = await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quiz[0].id));

  let totalScore = 0;
  let maxScore = 0;
  let earnedPoints = 0;

  for (const q of questions) {
    maxScore += q.points;
    const studentAnswer = answers.find((a) => a.questionId === q.id);
    const isCorrect = studentAnswer?.answer?.toString().trim().toLowerCase() === q.correctAnswer?.toString().trim().toLowerCase();
    const points = isCorrect ? q.points : 0;
    totalScore += points;
    earnedPoints += points;

    await db.insert(quizAnswers).values({
      id: crypto.randomUUID(),
      attemptId,
      questionId: q.id,
      answer: studentAnswer?.answer ?? "",
      isCorrect,
      pointsEarned: points,
    });
  }

  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const passed = percentage >= quiz[0].passingScore;

  await db
    .update(quizAttempts)
    .set({
      score: totalScore,
      maxScore,
      passed,
      completedAt: new Date().toISOString(),
      timeSpentSeconds: Math.floor((new Date().getTime() - new Date(attempt[0].startedAt).getTime()) / 1000),
    })
    .where(eq(quizAttempts.id, attemptId));

  revalidatePath("/student-portal/quizzes");
  return { score: totalScore, maxScore, percentage, passed };
}

export async function getQuizAttempt(attemptId: string) {
  const user = await getAuthenticatedUser();
  requireAuth(user);

  const attempt = await db.select().from(quizAttempts).where(eq(quizAttempts.id, attemptId)).limit(1);
  if (!attempt[0]) throw new Error("Attempt not found");

  const answers = await db
    .select({
      id: quizAnswers.id,
      questionId: quizAnswers.questionId,
      answer: quizAnswers.answer,
      isCorrect: quizAnswers.isCorrect,
      pointsEarned: quizAnswers.pointsEarned,
      question: quizQuestions.question,
      questionType: quizQuestions.questionType,
      options: quizQuestions.options,
      correctAnswer: quizQuestions.correctAnswer,
      explanation: quizQuestions.explanation,
      points: quizQuestions.points,
    })
    .from(quizAnswers)
    .innerJoin(quizQuestions, eq(quizAnswers.questionId, quizQuestions.id))
    .where(eq(quizAnswers.attemptId, attemptId));

  return { attempt: attempt[0], answers };
}