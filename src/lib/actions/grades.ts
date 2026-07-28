"use server";

import { db } from "@/lib/db";
import { grades, students, courses, enrollments, semesters, courseSemesters, modules } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/get-session";

export async function getStudentGrades() {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "student") throw new Error("Unauthorized");

  const student = await db.select().from(students).where(eq(students.email, user.email)).limit(1);
  if (!student[0]) throw new Error("Student not found");

  const studentGrades = await db
    .select({
      id: grades.id,
      courseId: grades.courseId,
      moduleId: grades.moduleId,
      type: grades.type,
      title: grades.title,
      score: grades.score,
      maxScore: grades.maxScore,
      weight: grades.weight,
      letterGrade: grades.letterGrade,
      comments: grades.comments,
      gradedAt: grades.gradedAt,
      courseTitle: courses.title,
      moduleTitle: modules.title,
    })
    .from(grades)
    .innerJoin(courses, eq(grades.courseId, courses.id))
    .leftJoin(modules, eq(grades.moduleId, modules.id))
    .where(eq(grades.studentId, student[0].id))
    .orderBy(desc(grades.gradedAt));

  // Group by course
  const courseGrades: Record<string, {
    courseTitle: string;
    courseId: string;
    grades: typeof studentGrades;
    avgScore: number;
    letterGrade: string;
  }> = {};

  for (const grade of studentGrades) {
    if (!courseGrades[grade.courseId]) {
      courseGrades[grade.courseId] = {
        courseTitle: grade.courseTitle,
        courseId: grade.courseId,
        grades: [],
        avgScore: 0,
        letterGrade: "",
      };
    }
    courseGrades[grade.courseId].grades.push(grade);
  }

  // Calculate averages
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const courseId of Object.keys(courseGrades)) {
    const courseGradeList = courseGrades[courseId].grades;
    let weightedSum = 0;
    let weightSum = 0;

    for (const g of courseGradeList) {
      const pct = (g.score / g.maxScore) * 100;
      weightedSum += pct * g.weight;
      weightSum += g.weight;
    }

    const avg = weightSum > 0 ? weightedSum / weightSum : 0;
    courseGrades[courseId].avgScore = Math.round(avg * 10) / 10;
    courseGrades[courseId].letterGrade = getLetterGrade(avg);

    totalWeightedScore += weightedSum;
    totalWeight += weightSum;
  }

  const gpa = totalWeight > 0 ? Math.round((totalWeightedScore / totalWeight) * 10) / 10 : 0;

  // Get enrolled courses for credit info
  const enrolledCourses = await db
    .select({
      courseId: enrollments.courseId,
      courseTitle: courses.title,
    })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(eq(enrollments.studentId, student[0].id));

  // Get active semester
  const activeSemester = await db
    .select()
    .from(semesters)
    .where(eq(semesters.isActive, true))
    .limit(1);

  return {
    courseGrades: Object.values(courseGrades),
    gpa,
    totalCourses: enrolledCourses.length,
    activeSemester: activeSemester[0] || null,
    allGrades: studentGrades,
  };
}

function getLetterGrade(percentage: number): string {
  if (percentage >= 93) return "A";
  if (percentage >= 90) return "A-";
  if (percentage >= 87) return "B+";
  if (percentage >= 83) return "B";
  if (percentage >= 80) return "B-";
  if (percentage >= 77) return "C+";
  if (percentage >= 73) return "C";
  if (percentage >= 70) return "C-";
  if (percentage >= 67) return "D+";
  if (percentage >= 60) return "D";
  return "F";
}
