import { getDashboardData } from "@/lib/actions/dashboard";
import { StudentPortalDashboard } from "./StudentPortalDashboard";

export default async function StudentPortalPage() {
  let dashboardData;

  try {
    dashboardData = await getDashboardData();
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
    dashboardData = {
      student: { name: "Student", email: "" },
      enrollments: [],
      upcomingAssignments: [],
      upcomingQuizzes: [],
      recentAnnouncements: [],
      todaySchedule: [],
      recentGrades: [],
      gpa: 0,
      unreadNotifications: 0,
      activeSemester: null,
      daysRemaining: 0,
      completedLessons: 0,
      totalLessons: 0,
      stats: {
        totalCourses: 0,
        totalAssignmentsDue: 0,
        totalQuizzesDue: 0,
        averageProgress: 0,
      },
    } as any;
  }

  return <StudentPortalDashboard dashboardData={dashboardData} />;
}
