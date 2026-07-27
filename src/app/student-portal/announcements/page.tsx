import { Metadata } from "next";
import { db } from "@/lib/db";
import { students } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/get-session";
import { getStudentAnnouncements } from "@/lib/actions/lms-courses";
import { AnnouncementsClient } from "./AnnouncementsClient";

export const metadata: Metadata = {
  title: "Announcements - Student Portal",
};

export default async function AnnouncementsPage() {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "student") throw new Error("Unauthorized");

  const student = await db.select().from(students).where(eq(students.email, user.email)).limit(1);
  if (!student[0]) throw new Error("Student not found");

  const announcements = await getStudentAnnouncements(student[0].id);

  return <AnnouncementsClient announcements={announcements} />;
}
