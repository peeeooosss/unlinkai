import { getAuthenticatedUser } from "@/lib/get-session";
import { getStudentDashboardData } from "@/lib/actions/lms-courses";
import { StudentPortalDashboard } from "./StudentPortalDashboard";

export default async function StudentPortalPage() {
  const user = await getAuthenticatedUser();
  
  let dashboardData: Awaited<ReturnType<typeof getStudentDashboardData>> = {
    enrollments: [],
    upcomingAssignments: [],
    recentAnnouncements: [],
    upcomingQuizzes: [],
  };
  
  if (user?.role === "student") {
    try {
      const student = await getStudentByEmail(user.email);
      if (student) {
        dashboardData = await getStudentDashboardData(student.id);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  }

  return (
    <StudentPortalDashboard 
      dashboardData={dashboardData}
      user={{ name: user?.name ?? "Student", email: user?.email ?? "" }}
    />
  );
}

async function getStudentByEmail(email: string) {
  const { db } = await import("@/lib/db");
  const { students } = await import("@/lib/db/schema");
  const { eq } = await import("drizzle-orm");
  
  const result = await db.select().from(students).where(eq(students.email, email)).limit(1);
  return result[0] ?? null;
}