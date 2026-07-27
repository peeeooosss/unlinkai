"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight, Bell, HelpCircle, AlertTriangle, CheckCircle, BookOpen, ClipboardCheck } from "lucide-react";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

function isOverdue(dueAt?: string | null) {
  if (!dueAt) return false;
  return new Date(dueAt) < new Date();
}

function getPriorityClass(priority: string) {
  switch (priority) {
    case "urgent": return "bg-red-100 text-red-700";
    case "high": return "bg-amber-100 text-amber-700";
    case "low": return "bg-green-100 text-green-700";
    default: return "bg-blue-100 text-blue-700";
  }
}

interface DashboardData {
  enrollments: {
    enrollmentId: string;
    courseId: string;
    progress: number;
    enrolledAt: string;
    courseTitle: string;
    courseDescription: string | null;
    courseThumbnail: string | null;
    courseDuration: string | null;
  }[];
  upcomingAssignments: {
    id: string;
    title: string;
    dueAt: string | null;
    courseTitle: string;
    courseId: string;
  }[];
  recentAnnouncements: {
    id: string;
    title: string;
    content: string;
    type: string;
    priority: string;
    publishedAt: string;
  }[];
  upcomingQuizzes: {
    id: string;
    title: string;
    courseTitle: string;
    courseId: string;
  }[];
}

interface StudentPortalDashboardProps {
  dashboardData: DashboardData;
  user: { name: string | null; email: string };
}

export function StudentPortalDashboard({ dashboardData, user }: StudentPortalDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-700 mt-1">Welcome back, {user.name ?? "Student"}. Here's your learning overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700">Courses Enrolled</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{dashboardData.enrollments.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700">Assignments Due</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{dashboardData.upcomingAssignments.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700">Upcoming Quizzes</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{dashboardData.upcomingQuizzes.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                <HelpCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700">Announcements</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{dashboardData.recentAnnouncements.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-100 text-green-600">
                <Bell className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-neutral-900">My Courses</CardTitle>
              <Link href="/student-portal/courses" className="text-sm text-blue-600 hover:text-blue-700">
                View all <ArrowRight className="h-3.5 w-3.5 inline" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {dashboardData.enrollments.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-10 w-10 text-neutral-300 mx-auto mb-2" />
                  <p className="text-sm text-neutral-700">No courses enrolled yet</p>
                  <Link href="/student-portal/courses" className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block">
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-neutral-200">
                  {dashboardData.enrollments.map((enrollment) => (
                    <Link key={enrollment.enrollmentId} href={`/student-portal/courses/${enrollment.courseId}`} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
                          {enrollment.courseTitle.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-neutral-900 truncate">{enrollment.courseTitle}</p>
                          <p className="text-xs text-neutral-500 truncate">{enrollment.courseDescription ?? "No description"}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-neutral-400">{enrollment.courseDuration}</span>
                            <span className="text-[10px] text-neutral-300">&middot;</span>
                            <span className="text-[10px] text-neutral-400">Enrolled {timeAgo(enrollment.enrolledAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32">
                          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${enrollment.progress}%` }} />
                          </div>
                          <p className="text-xs text-neutral-500 text-right mt-1">{enrollment.progress}% complete</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-neutral-400 shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-neutral-900">Upcoming Assignments</CardTitle>
              <Link href="/student-portal/assignments" className="text-sm text-blue-600 hover:text-blue-700">
                View all <ArrowRight className="h-3.5 w-3.5 inline" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {dashboardData.upcomingAssignments.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardCheck className="h-10 w-10 text-neutral-300 mx-auto mb-2" />
                  <p className="text-sm text-neutral-700">No upcoming assignments</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-200">
                  {dashboardData.upcomingAssignments.slice(0, 5).map((assignment) => (
                    <div key={assignment.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isOverdue(assignment.dueAt) ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>
                          <Clock className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{assignment.title}</p>
                          <p className="text-xs text-neutral-500">{assignment.courseTitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={isOverdue(assignment.dueAt) ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"} variant="outline">
                          {assignment.dueAt ? timeAgo(assignment.dueAt) : "No due date"}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-neutral-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-neutral-900">Recent Announcements</CardTitle>
              <Link href="/student-portal/announcements" className="text-sm text-blue-600 hover:text-blue-700">
                View all <ArrowRight className="h-3.5 w-3.5 inline" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {dashboardData.recentAnnouncements.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-10 w-10 text-neutral-300 mx-auto mb-2" />
                  <p className="text-sm text-neutral-700">No announcements yet</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-200">
                  {dashboardData.recentAnnouncements.slice(0, 5).map((ann) => (
                    <div key={ann.id} className="p-4 hover:bg-neutral-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className={`text-xs shrink-0 ${getPriorityClass(ann.priority)}`}>
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-neutral-900">Upcoming Quizzes</CardTitle>
              <Link href="/student-portal/quizzes" className="text-sm text-blue-600 hover:text-blue-700">
                View all <ArrowRight className="h-3.5 w-3.5 inline" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {dashboardData.upcomingQuizzes.length === 0 ? (
                <div className="text-center py-12">
                  <HelpCircle className="h-10 w-10 text-neutral-300 mx-auto mb-2" />
                  <p className="text-sm text-neutral-700">No upcoming quizzes</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-200">
                  {dashboardData.upcomingQuizzes.slice(0, 5).map((quiz) => (
                    <div key={quiz.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                          <HelpCircle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{quiz.title}</p>
                          <p className="text-xs text-neutral-500">{quiz.courseTitle}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-neutral-400" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}