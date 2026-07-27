import { Metadata } from "next";
import { db } from "@/lib/db";
import { students } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/get-session";
import { getStudentAttendance, getAttendanceStats } from "@/lib/actions/lms-courses";
import { AttendanceClient } from "./AttendanceClient";

export const metadata: Metadata = {
  title: "Attendance - Student Portal",
};

interface PageProps {
  searchParams: Promise<{ courseId?: string }>;
}

export default async function AttendancePage({ searchParams }: PageProps) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "student") throw new Error("Unauthorized");

  const student = await db.select().from(students).where(eq(students.email, user.email)).limit(1);
  if (!student[0]) throw new Error("Student not found");

  const { courseId } = await searchParams;
  const records = await getStudentAttendance(student[0].id, courseId);
  const stats = courseId ? await getAttendanceStats(student[0].id, courseId) : null;

  return <AttendanceClient records={records} stats={stats} />;
}
