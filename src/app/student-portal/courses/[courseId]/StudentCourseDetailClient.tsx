"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronDown, ChevronRight, PlayCircle, CheckCircle, Lock, BookOpen, Clock, Video } from "lucide-react";

interface LessonData {
  id: string;
  moduleId: string;
  title: string;
  contentType: string;
  durationMinutes: number | null;
  orderIndex: number;
  isFree: boolean;
  isPublished: boolean;
}

interface ModuleData {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  orderIndex: number;
  isLocked: boolean;
  unlockAfterModuleId: string | null;
  createdAt: string;
  updatedAt: string;
  lessons?: LessonData[];
  progress?: { id: string; status: string; startedAt: string | null; completedAt: string | null } | null;
}

interface CourseData {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  duration: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface EnrollmentData {
  id: string;
  studentId: string;
  courseId: string;
  progress: number;
  status: string;
  enrolledAt: string;
}

interface CourseDetailData {
  course: CourseData;
  modules: ModuleData[];
  enrollment: EnrollmentData;
}

interface EnrollmentData {
  id: string;
  studentId: string;
  courseId: string;
  progress: number;
  status: string;
}

interface CourseDetailData {
  course: CourseData;
  modules: ModuleData[];
  enrollment: EnrollmentData;
}

interface StudentCourseDetailClientProps {
  data: CourseDetailData;
  studentId: string;
}

export function StudentCourseDetailClient({ data, studentId }: StudentCourseDetailClientProps) {
  const { course, modules, enrollment } = data;
  const [expandedModules, setExpandedModules] = useState<string[]>([modules[0]?.id || ""]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  const isModuleLocked = (mod: ModuleData) => mod.isLocked;
  const isLessonLocked = (lesson: LessonData) => !lesson.isFree && !lesson.isPublished;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground mt-1">{course.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="gap-1">
            <BookOpen className="h-3 w-3" />
            {modules.length} Modules
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            {course.duration || "Self-paced"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Course Content</CardTitle>
              <p className="text-sm text-muted-foreground">
                Overall Progress: {enrollment.progress}%
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${enrollment.progress}%` }}
                />
              </div>

              <div className="space-y-2">
                {modules.map((mod, modIndex) => (
                  <div key={mod.id} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="w-full px-4 py-3 flex items-center justify-between bg-muted/50 hover:bg-muted transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        {mod.isLocked ? (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        ) : mod.progress?.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : mod.progress?.status === "in_progress" ? (
                          <PlayCircle className="h-5 w-5 text-primary" />
                        ) : (
                          <BookOpen className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium">{mod.title}</p>
                          <p className="text-sm text-muted-foreground">{mod.lessons?.length || 0} lessons</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {mod.isLocked && <Badge variant="secondary" className="text-xs">Locked</Badge>}
                        {mod.progress?.status === "completed" && <Badge variant="default" className="text-xs">Completed</Badge>}
                        {mod.progress?.status === "in_progress" && <Badge variant="outline" className="text-xs">In Progress</Badge>}
                        <ChevronRight className={`h-4 w-4 transition-transform ${expandedModules.includes(mod.id) ? "rotate-90" : ""}`} />
                      </div>
                    </button>

                    {expandedModules.includes(mod.id) && (
                      <div className="px-4 py-3 border-t bg-background">
                        <div className="space-y-2">
                          {(mod.lessons ?? []).map((lesson, lessonIndex) => (
                            <Link
                              key={lesson.id}
                              href={`/student-portal/courses/${course.id}/modules/${mod.id}/lessons/${lesson.id}`}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                lesson.isFree ? "hover:bg-muted" : "opacity-60 cursor-not-allowed"
                              }`}
                            >
                              {lesson.contentType === "video" ? (
                                <PlayCircle className="h-5 w-5 text-primary" />
                              ) : lesson.contentType === "assignment" ? (
                                <BookOpen className="h-5 w-5 text-blue-500" />
                              ) : (
                                <Video className="h-5 w-5 text-muted-foreground" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{lesson.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {lesson.durationMinutes ? `${lesson.durationMinutes} min` : "Reading"}
                                  {lesson.isFree && " • Free preview"}
                                </p>
                              </div>
                              {lesson.isFree ? (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Lock className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Your Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall</span>
                    <span className="font-medium">{enrollment.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${enrollment.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Enrollment Details</h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Status</dt>
                    <dd><Badge variant={enrollment.status === "completed" ? "default" : "outline"}>{enrollment.status}</Badge></dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Enrolled</dt>
                    <dd>{new Date(enrollment.progress ? "2024-01-01" : Date.now()).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Course Stats</h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Modules</dt>
                    <dd>{modules.length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Total Lessons</dt>
                    <dd>{modules.reduce((acc, m) => acc + (m.lessons?.length ?? 0), 0)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Completed Modules</dt>
                    <dd>{modules.filter(m => m.progress?.status === "completed").length}</dd>
                  </div>
                </dl>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}