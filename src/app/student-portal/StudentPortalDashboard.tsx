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

export function StudentPortalDashboard({ dashboardData }: { dashboardData: DashboardData }) {
  const { student, stats, enrollments, upcomingAssignments, upcomingQuizzes, recentAnnouncements, todaySchedule, recentGrades, gpa, unreadNotifications, activeSemester, daysRemaining, completedLessons, totalLessons } = dashboardData;

  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Welcome back, {student.name?.split(" ")[0] || "Student"}</h1>
          <p className="text-neutral-600 mt-1">
            {activeSemester ? (
              <>
                <span className="font-medium">{activeSemester.title}</span> &middot; {daysRemaining} days remaining
              </>
            ) : (
              "Here's your learning overview"
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1 px-3 py-1.5">
            <GraduationCap className="h-4 w-4" />
            GPA: {gpa > 0 ? gpa.toFixed(1) : "N/A"}
          </Badge>
          {unreadNotifications > 0 && (
            <Badge variant="default" className="gap-1 px-3 py-1.5">
              <Bell className="h-4 w-4" />
              {unreadNotifications} new
            </Badge>
          )}
        </div>
      </div>

      {/* Semester Progress */}
      {activeSemester && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-neutral-900">{activeSemester.title} Progress</span>
              </div>
              <span className="text-sm text-neutral-600">{overallProgress}% complete</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
            <div className="flex items-center justify-between mt-2 text-sm text-neutral-500">
              <span>{completedLessons} of {totalLessons} lessons completed</span>
              <span>{daysRemaining} days until semester ends</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Courses</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.totalCourses}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
                <BookOpen className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Avg Progress</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.averageProgress}%</p>
              </div>
              <div className="p-2.5 rounded-xl bg-green-100 text-green-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Assignments Due</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.totalAssignmentsDue}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600">
                <ClipboardCheck className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Quizzes Up</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.totalQuizzesDue}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600">
                <HelpCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Courses */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-neutral-900">My Courses</CardTitle>
              <Link href="/student-portal/courses" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {enrollments.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-10 w-10 text-neutral-300 mx-auto mb-2" />
                  <p className="text-sm text-neutral-500">No courses enrolled yet</p>
                  <Link href="/student-portal/courses" className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block">
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {enrollments.slice(0, 4).map((enrollment) => (
                    <Link
                      key={enrollment.courseId}
                      href={`/student-portal/courses/${enrollment.courseId}`}
                      className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {enrollment.courseTitle.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">{enrollment.courseTitle}</p>
                        <p className="text-xs text-neutral-500 truncate">
                          {enrollment.moduleCount} modules &middot; {enrollment.lessonCount} lessons
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="w-24">
                          <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-neutral-500 text-right mt-0.5">{enrollment.progress}%</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-neutral-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-neutral-900">Today's Schedule</CardTitle>
              <Link href="/student-portal/schedule" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Full schedule <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {todaySchedule.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-10 w-10 text-neutral-300 mx-auto mb-2" />
                  <p className="text-sm text-neutral-500">No classes scheduled for today</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {todaySchedule.map((item) => (
                    <div key={item.schedules.id} className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors">
                      <div className="text-center min-w-[60px]">
                        <p className="text-sm font-semibold text-neutral-900">{formatTime(item.schedules.startTime)}</p>
                        <p className="text-[10px] text-neutral-500">{formatTime(item.schedules.endTime)}</p>
                      </div>
                      <div className="h-10 w-1 rounded-full bg-blue-600" />
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
              )}
            </CardContent>
          </Card>

          {/* Upcoming Assignments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-neutral-900">Upcoming Assignments</CardTitle>
              <Link href="/student-portal/assignments" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {upcomingAssignments.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardCheck className="h-10 w-10 text-neutral-300 mx-auto mb-2" />
                  <p className="text-sm text-neutral-500">No upcoming assignments</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {upcomingAssignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors">
                      <div className={`p-2 rounded-lg ${isOverdue(assignment.dueAt) ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>
                        <Clock className="h-4 w-4" />
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
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Recent Grades */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-neutral-900">Recent Grades</CardTitle>
              <Link href="/student-portal/grades" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {recentGrades.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="h-10 w-10 text-neutral-300 mx-auto mb-2" />
                  <p className="text-sm text-neutral-500">No grades yet</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {recentGrades.map((grade) => {
                    const percentage = Math.round((grade.score / grade.maxScore) * 100);
                    return (
                      <div key={grade.id} className="flex items-center gap-3 p-4 hover:bg-neutral-50 transition-colors">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
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
              )}
            </CardContent>
          </Card>

          {/* Upcoming Quizzes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-neutral-900">Upcoming Quizzes</CardTitle>
              <Link href="/student-portal/quizzes" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {upcomingQuizzes.length === 0 ? (
                <div className="text-center py-12">
                  <HelpCircle className="h-10 w-10 text-neutral-300 mx-auto mb-2" />
                  <p className="text-sm text-neutral-500">No upcoming quizzes</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {upcomingQuizzes.map((quiz) => (
                    <div key={quiz.id} className="flex items-center gap-3 p-4 hover:bg-neutral-50 transition-colors">
                      <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                        <HelpCircle className="h-4 w-4" />
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
              )}
            </CardContent>
          </Card>

          {/* Recent Announcements */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-neutral-900">Announcements</CardTitle>
              <Link href="/student-portal/announcements" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {recentAnnouncements.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-10 w-10 text-neutral-300 mx-auto mb-2" />
                  <p className="text-sm text-neutral-500">No announcements yet</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {recentAnnouncements.slice(0, 4).map((ann) => (
                    <div key={ann.id} className="p-4 hover:bg-neutral-50 transition-colors">
                      <div className="flex items-start gap-3">
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
              )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-neutral-900">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/student-portal/discussions" className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-neutral-700">Discussions</span>
              </Link>
              <Link href="/student-portal/resources" className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors">
                <FolderOpen className="h-4 w-4 text-green-600" />
                <span className="text-sm text-neutral-700">Resources</span>
              </Link>
              <Link href="/student-portal/grades" className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors">
                <GraduationCap className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-neutral-700">Grades & Transcript</span>
              </Link>
              <Link href="/student-portal/documents" className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors">
                <FileText className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-neutral-700">Documents</span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
