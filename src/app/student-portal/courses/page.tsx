import { db } from "@/lib/db";
import { students } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getStudentCoursesData } from "@/lib/actions/student-courses";
import { getAuthenticatedUser } from "@/lib/get-session";
import StudentCoursesClient from "./StudentCoursesClient";

export default async function StudentCoursesPage() {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "student") return null;

  const student = await db
    .select()
    .from(students)
    .where(eq(students.email, user.email))
    .limit(1);

  if (!student[0]) return null;

  const courses = await getStudentCoursesData(student[0].id);

  return <StudentCoursesClient courses={courses} />;
}