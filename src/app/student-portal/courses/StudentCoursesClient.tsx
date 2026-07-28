"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Clock, CheckCircle, Lock } from "lucide-react";

interface CourseData {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  duration: string | null;
  progress: number;
  enrollmentStatus: string;
  enrollmentId: string;
  moduleCount?: number;
  lessonCount?: number;
}

interface StudentCoursesClientProps {
  courses: CourseData[];
}

export default function StudentCoursesClient({ courses }: StudentCoursesClientProps) {
  if (!courses.length) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold text-muted-foreground">No courses yet</h2>
        <p className="text-muted-foreground mt-2">You are not enrolled in any courses.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <span className="text-muted-foreground">{courses.length} course{courses.length !== 1 ? "s" : ""} enrolled</span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {course.thumbnailUrl && (
              <div className="relative h-40 bg-muted">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2">
                  <Badge variant={course.enrollmentStatus === "completed" ? "default" : "secondary"} className="gap-1">
                    {course.enrollmentStatus === "completed" ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <Lock className="h-3 w-3" />
                    )}
                    {course.enrollmentStatus}
                  </Badge>
                </div>
              </div>
            )}
            <CardHeader className="pb-2">
              <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{course.description}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                {(course.moduleCount ?? 0) > 0 && (
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {course.moduleCount} modules
                  </span>
                )}
                {(course.lessonCount ?? 0) > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.lessonCount} lessons
                  </span>
                )}
                {course.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              <Button
                asChild
                className="w-full mt-4"
                variant={course.enrollmentStatus === "completed" ? "secondary" : "default"}
              >
                <Link href={`/student-portal/courses/${course.id}`}>
                  {course.enrollmentStatus === "completed" ? "Review Course" : "Continue Learning"}
                </Link>
              </Button>
            </CardContent>
          </Card>
      ))}
      </div>
    </div>
  );
}