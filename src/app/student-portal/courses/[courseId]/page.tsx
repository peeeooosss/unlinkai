import { Metadata } from "next";
import { db } from "@/lib/db";
import { students } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/get-session";
import { getCourseDetailData } from "@/lib/actions/course-detail";
import { StudentCourseDetailClient } from "./StudentCourseDetailClient";

export const metadata: Metadata = {
  title: "Course Details - Student Portal",
};

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { courseId } = await params;
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "student") throw new Error("Unauthorized");

  const student = await db.select().from(students).where(eq(students.email, user.email)).limit(1);
  if (!student[0]) throw new Error("Student not found");

  const data = await getCourseDetailData(courseId, student[0].id);

  return <StudentCourseDetailClient data={data} studentId={student[0].id} />;
}