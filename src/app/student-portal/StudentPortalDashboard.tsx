"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  ArrowRight,
  Bell,
  HelpCircle,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Play,
  FileText,
  MessageSquare,
  FolderOpen,
  Award,
  ChevronRight,
  Timer,
  Users,
} from "lucide-react";

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return "Just now";
}

function timeUntil(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  if (diffMs < 0) return "Overdue";
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffDays > 0) return `${diffDays}d left`;
  if (diffHours > 0) return `${diffHours}h left`;
  return "Due soon";
}

function isOverdue(dueAt?: string | null) {
  if (!dueAt) return false;
  return new Date(dueAt) < new Date();
}

function formatTime(timeStr: string) {
  const [hours, minutes] = timeStr.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

function getLetterGrade(percentage: number) {
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

interface DashboardData {
  student: { name: string; email: string };
  enrollments: {
    enrollmentId: string;
    courseId: string;
    progress: number;
    enrolledAt: string;
    courseTitle: string;
    courseDescription: string | null;
    courseThumbnail: string | null;
    courseDuration: string | null;
    moduleCount: number;
    lessonCount: number;
  }[];
  upcomingAssignments: {
    id: string;
    title: string;
    dueAt: string | null;
    courseId: string;
    maxPoints: number;
    courseTitle: string;
  }[];
  upcomingQuizzes: {
    id: string;
    title: string;
    courseId: string;
    courseTitle: string;
    timeLimitMinutes: number | null;
    maxAttempts: number;
  }[];
  recentAnnouncements: {
    id: string;
    title: string;
    content: string;
    type: string;
    priority: string;
    publishedAt: string;
  }[];
  todaySchedule: {
    schedules: {
      id: string;
      title: string;
      startTime: string;
      endTime: string;
      location: string | null;
      type: string;
    };
    courses: {
      title: string;
    };
  }[];
  recentGrades: {
    id: string;
    title: string;
    score: number;
    maxScore: number;
    letterGrade: string | null;
    courseId: string;
  }[];
  gpa: number;
  unreadNotifications: number;
  activeSemester: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
  } | null;
  daysRemaining: number;
  completedLessons: number;
  totalLessons: number;
  stats: {
    totalCourses: number;
    totalAssignmentsDue: number;
    totalQuizzesDue: number;
    averageProgress: number;
  };
}

function EmptyState({ icon: Icon, title, description, action }: { 
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-6">
      <Icon className="h-6 w-6 text-neutral-300 mx-auto mb-1.5" />
      <p className="text-sm text-neutral-500 mb-1">{title}</p>
      <p className="text-xs text-neutral-400 mb-2">{description}</p>
      {action}
    </div>
  );
}

function SectionCard({ title, href, children, emptyState }: { 
  title: string;
  href: string;
  children?: React.ReactNode;
  emptyState?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold text-neutral-900">{title}</CardTitle>
        <Link href={href} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {children || emptyState}
      </CardContent>
    </Card>
  );
}

export function StudentPortalDashboard({ dashboardData }: { dashboardData: DashboardData }) {
  const { student, stats, enrollments, upcomingAssignments, upcomingQuizzes, recentAnnouncements, todaySchedule, recentGrades, gpa, unreadNotifications, activeSemester, daysRemaining, completedLessons, totalLessons } = dashboardData;

  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const hasAnyData = enrollments.length > 0 || upcomingAssignments.length > 0 || upcomingQuizzes.length > 0 || recentAnnouncements.length > 0 || recentGrades.length > 0 || todaySchedule.length > 0;

  // Determine if we should show "Getting Started" instead of individual empty states
  const showGettingStarted = !hasAnyData && enrollments.length === 0;

  return (
    <div className="space-y-4">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Welcome back, {student.name?.split(" ")[0] || "Student"}</h1>
          <p className="text-neutral-600 text-sm mt-0.5">
            {activeSemester ? (
              <>
                <span className="font-medium">{activeSemester.title}</span> &middot; {daysRemaining} days remaining
              </>
            ) : (
              "Here's your learning overview"
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 px-2.5 py-1 text-xs">
            <GraduationCap className="h-3.5 w-3.5" />
            GPA: {gpa > 0 ? gpa.toFixed(1) : "N/A"}
          </Badge>
          {unreadNotifications > 0 && (
            <Badge variant="default" className="gap-1 px-2.5 py-1 text-xs">
              <Bell className="h-3.5 w-3.5" />
              {unreadNotifications} new
            </Badge>
          )}
        </div>
      </div>

      {/* Semester Progress */}
      {activeSemester && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-neutral-900">{activeSemester.title} Progress</span>
              </div>
              <span className="text-sm text-neutral-600">{overallProgress}% complete</span>
            </div>
            <Progress value={overallProgress} className="h-1.5" />
            <div className="flex items-center justify-between mt-1.5 text-xs text-neutral-500">
              <span>{completedLessons} of {totalLessons} lessons completed</span>
              <span>{daysRemaining} days until semester ends</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Courses</p>
                <p className="text-xl font-bold text-neutral-900">{stats.totalCourses}</p>
              </div>
              <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                <BookOpen className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Avg Progress</p>
                <p className="text-xl font-bold text-neutral-900">{stats.averageProgress}%</p>
              </div>
              <div className="p-2 rounded-xl bg-green-100 text-green-600">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Assignments</p>
                <p className="text-xl font-bold text-neutral-900">{stats.totalAssignmentsDue}</p>
              </div>
              <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
                <ClipboardCheck className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Quizzes</p>
                <p className="text-xl font-bold text-neutral-900">{stats.totalQuizzesDue}</p>
              </div>
              <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
                <HelpCircle className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-4">
          {/* My Courses */}
          <SectionCard
            title="My Courses"
            href="/student-portal/courses"
            emptyState={
              showGettingStarted ? (
                <EmptyState
                  icon={BookOpen}
                  title="No courses yet"
                  description="Browse the catalog to enroll in your first course"
                  action={<Link href="/student-portal/courses" className="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 mt-1"><ArrowRight className="h-3 w-3" /> Browse Courses</Link>}
                />
              ) : (
                <EmptyState
                  icon={BookOpen}
                  title="No courses enrolled"
                  description="Enroll in courses to see them here"
                  action={<Link href="/student-portal/courses" className="text-sm text-blue-600 hover:text-blue-700">Browse Courses</Link>}
                />
              )
            }
          >
            <div className="divide-y divide-neutral-100">
              {enrollments.slice(0, 4).map((enrollment) => (
                <Link
                  key={enrollment.courseId}
                  href={`/student-portal/courses/${enrollment.courseId}`}
                  className="flex items-center gap-3 p-3 hover:bg-neutral-50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {enrollment.courseTitle.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{enrollment.courseTitle}</p>
                    <p className="text-xs text-neutral-500 truncate">
                      {enrollment.moduleCount} modules &middot; {enrollment.lessonCount} lessons
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-20">
                      <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${enrollment.progress}%` }} />
                      </div>
                      <p className="text-[10px] text-neutral-500 text-right mt-0.5">{enrollment.progress}%</p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
                  </div>
                </Link>
              ))}
            </div>
          </SectionCard>

          {/* Today's Schedule + Upcoming Assignments - Combined */}
          {(todaySchedule.length > 0 || upcomingAssignments.length > 0) ? (
            <>
              {todaySchedule.length > 0 && (
                <SectionCard title="Today's Schedule" href="/student-portal/schedule">
                  <div className="divide-y divide-neutral-100">
                    {todaySchedule.map((item) => (
                      <div key={item.schedules.id} className="flex items-center gap-3 p-3 hover:bg-neutral-50 transition-colors">
                        <div className="text-center min-w-[50px]">
                          <p className="text-sm font-semibold text-neutral-900">{formatTime(item.schedules.startTime)}</p>
                          <p className="text-[10px] text-neutral-500">{formatTime(item.schedules.endTime)}</p>
                        </div>
                        <div className="h-8 w-1 rounded-full bg-blue-600" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 truncate">{item.schedules.title}</p>
                          <p className="text-xs text-neutral-500">{item.courses.title}</p>
                        </div>
                        {item.schedules.location && (
                          <Badge variant="outline" className="text-xs shrink-0">{item.schedules.location}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}
              {upcomingAssignments.length > 0 && (
                <SectionCard title="Upcoming Assignments" href="/student-portal/assignments">
                  <div className="divide-y divide-neutral-100">
                    {upcomingAssignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-center gap-3 p-3 hover:bg-neutral-50 transition-colors">
                        <div className={`p-1.5 rounded-lg ${isOverdue(assignment.dueAt) ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>
                          <Clock className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 truncate">{assignment.title}</p>
                          <p className="text-xs text-neutral-500">{assignment.courseTitle}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs shrink-0 ${isOverdue(assignment.dueAt) ? "bg-red-50 text-red-700 border-red-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}
                        >
                          {assignment.dueAt ? timeUntil(assignment.dueAt) : "No due date"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}
            </>
          ) : (
            <SectionCard
              title="Today's Schedule & Assignments"
              href="/student-portal/schedule"
              emptyState={
                <EmptyState
                  icon={Calendar}
                  title="Nothing scheduled"
                  description={enrollments.length === 0 ? "Enroll in courses to see your schedule" : "No classes or assignments for today"}
                  action={<Link href="/student-portal/courses" className="text-sm text-blue-600 hover:text-blue-700">Browse Courses</Link>}
                />
              }
            />
          )}

          {/* Upcoming Quizzes */}
          <SectionCard
            title="Upcoming Quizzes"
            href="/student-portal/quizzes"
            emptyState={
              <EmptyState
                icon={HelpCircle}
                title={upcomingQuizzes.length === 0 ? "No upcoming quizzes" : "No quizzes scheduled"}
                description="Quizzes will appear here when published by instructors"
              />
            }
          >
            <div className="divide-y divide-neutral-100">
              {upcomingQuizzes.map((quiz) => (
                <div key={quiz.id} className="flex items-center gap-3 p-3 hover:bg-neutral-50 transition-colors">
                  <div className="p-1.5 rounded-lg bg-purple-100 text-purple-600">
                    <HelpCircle className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{quiz.title}</p>
                    <p className="text-xs text-neutral-500">{quiz.courseTitle}</p>
                  </div>
                  {quiz.timeLimitMinutes && (
                    <Badge variant="outline" className="text-xs shrink-0">{quiz.timeLimitMinutes}m</Badge>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-4">
          {/* Combined: Recent Grades + Upcoming Quizzes (if not in left) */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-neutral-900">Grades Overview</CardTitle>
              <Link href="/student-portal/grades" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              {/* Recent Grades */}
              {recentGrades.length > 0 ? (
                <div className="p-3 divide-y divide-neutral-100">
                  {recentGrades.slice(0, 3).map((grade) => {
                    const percentage = Math.round((grade.score / grade.maxScore) * 100);
                    return (
                      <div key={grade.id} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          percentage >= 80 ? "bg-green-100 text-green-700" :
                          percentage >= 60 ? "bg-amber-100 text-amber-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {grade.letterGrade || getLetterGrade(percentage)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 truncate">{grade.title}</p>
                          <p className="text-xs text-neutral-500">{grade.score}/{grade.maxScore} ({percentage}%)</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={Award}
                  title="No grades yet"
                  description="Complete assignments and quizzes to see grades"
                />
              )}

              {/* Quick Links */}
              <div className="p-3 pt-0 space-y-1.5 border-t border-neutral-100">
                <p className="text-xs font-medium text-neutral-600 px-1">Quick Access</p>
                <Link href="/student-portal/discussions" className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-50 transition-colors text-sm text-neutral-700">
                  <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
                  Discussions
                </Link>
                <Link href="/student-portal/resources" className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-50 transition-colors text-sm text-neutral-700">
                  <FolderOpen className="h-3.5 w-3.5 text-green-600" />
                  Resources
                </Link>
                <Link href="/student-portal/grades" className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-50 transition-colors text-sm text-neutral-700">
                  <GraduationCap className="h-3.5 w-3.5 text-purple-600" />
                  Grades & Transcript
                </Link>
                <Link href="/student-portal/documents" className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-50 transition-colors text-sm text-neutral-700">
                  <FileText className="h-3.5 w-3.5 text-amber-600" />
                  Documents
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Announcements */}
          <SectionCard
            title="Announcements"
            href="/student-portal/announcements"
            emptyState={
              <EmptyState
                icon={Bell}
                title="No announcements"
                description="Check back later for updates from your instructors"
              />
            }
          >
            <div className="divide-y divide-neutral-100">
              {recentAnnouncements.slice(0, 3).map((ann) => (
                <div key={ann.id} className="p-3 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start gap-2">
                    <Badge
                      variant="outline"
                      className={`text-[10px] shrink-0 ${
                        ann.priority === "urgent" ? "bg-red-50 text-red-700 border-red-200" :
                        ann.priority === "high" ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {ann.type}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900">{ann.title}</p>
                      <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{ann.content}</p>
                      <p className="text-[10px] text-neutral-400 mt-1">{timeAgo(ann.publishedAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Getting Started Banner - only when completely empty */}
      {showGettingStarted && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-900">Welcome to your Student Portal!</p>
                <p className="text-sm text-neutral-600">Enroll in courses to see your schedule, assignments, grades, and more.</p>
              </div>
              <Link href="/student-portal/courses" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shrink-0">
                Browse Courses
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}