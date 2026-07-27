"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, Award, FileText } from "lucide-react";

interface CourseProgress {
  id: string;
  courseId: string;
  progress: number;
  status: string;
  enrolledAt: string;
  courseTitle: string;
  courseDescription: string | null;
  courseDuration: string | null;
  totalModules: number;
  completedModules: number;
  totalAssignments: number;
  submissionsCount: number;
  totalQuizzes: number;
  quizzesAttempted: number;
  quizzesPassed: number;
}

interface ProgressStats {
  totalCourses: number;
  averageProgress: number;
  totalModulesCompleted: number;
  totalAssignmentsSubmitted: number;
  totalQuizzesPassed: number;
}

interface ProgressClientProps {
  courses: CourseProgress[];
  stats: ProgressStats;
}

export function ProgressClient({ courses, stats }: ProgressClientProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Progress</h1>
        <p className="text-muted-foreground">Track your learning journey across all courses</p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageProgress}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Modules Done</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalModulesCompleted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2"><FileText className="h-4 w-4" /> Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssignmentsSubmitted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2"><Award className="h-4 w-4" /> Quizzes Passed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuizzesPassed}</div>
          </CardContent>
        </Card>
      </div>

      {courses.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium">No courses yet</h3>
            <p className="text-muted-foreground">Enroll in a course to start tracking your progress</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{course.courseTitle}</h3>
                      <Badge variant={course.status === "completed" ? "default" : "outline"}>
                        {course.status}
                      </Badge>
                    </div>
                    {course.courseDescription && (
                      <p className="text-sm text-muted-foreground line-clamp-1">{course.courseDescription}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{course.completedModules}/{course.totalModules} modules</span>
                      <span>{course.submissionsCount}/{course.totalAssignments} assignments</span>
                      <span>{course.quizzesPassed}/{course.totalQuizzes} quizzes</span>
                    </div>
                  </div>
                  <div className="w-full md:w-48 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
