import { Metadata } from "next";
import { db } from "@/lib/db";
import { students } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/get-session";
import { getLessonDetail } from "@/lib/actions/lesson-detail";
import { StudentLessonClient } from "./StudentLessonClient";

export const metadata: Metadata = {
  title: "Lesson - Student Portal",
};

interface PageProps {
  params: Promise<{ courseId: string; moduleId: string; lessonId: string }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { courseId, moduleId, lessonId } = await params;
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "student") throw new Error("Unauthorized");

  const student = await db.select().from(students).where(eq(students.email, user.email)).limit(1);
  if (!student[0]) throw new Error("Student not found");

  const data = await getLessonDetail(courseId, moduleId, lessonId, student[0].id);

  return <StudentLessonClient data={data} studentId={student[0].id} courseId={courseId} moduleId={moduleId} />;
}