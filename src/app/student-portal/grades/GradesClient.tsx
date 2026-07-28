"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, TrendingUp, Award, BookOpen, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

function getGradeColor(grade: string) {
  if (grade.startsWith("A")) return "bg-green-100 text-green-700";
  if (grade.startsWith("B")) return "bg-blue-100 text-blue-700";
  if (grade.startsWith("C")) return "bg-amber-100 text-amber-700";
  if (grade.startsWith("D")) return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
}

function getScoreColor(percentage: number) {
  if (percentage >= 80) return "text-green-600";
  if (percentage >= 60) return "text-amber-600";
  return "text-red-600";
}

interface GradeItem {
  id: string;
  courseId: string;
  moduleId: string | null;
  type: string;
  title: string;
  score: number;
  maxScore: number;
  weight: number;
  letterGrade: string | null;
  comments: string | null;
  gradedAt: string;
  courseTitle: string;
  moduleTitle: string | null;
}

interface CourseGradeGroup {
  courseTitle: string;
  courseId: string;
  grades: GradeItem[];
  avgScore: number;
  letterGrade: string;
}

interface GradesClientProps {
  gradesData: {
    courseGrades: CourseGradeGroup[];
    gpa: number;
    totalCourses: number;
    activeSemester: { id: string; title: string } | null;
    allGrades: GradeItem[];
  };
}

export function GradesClient({ gradesData }: GradesClientProps) {
  const { courseGrades, gpa, totalCourses, activeSemester, allGrades } = gradesData;
  const [expandedCourses, setExpandedCourses] = useState<string[]>([]);

  const toggleCourse = (courseId: string) => {
    setExpandedCourses(prev =>
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };

  const totalGrades = allGrades.length;
  const avgGrade = totalGrades > 0 ? Math.round(allGrades.reduce((acc, g) => acc + (g.score / g.maxScore) * 100, 0) / totalGrades) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Grades</h1>
          <p className="text-neutral-600 mt-1">
            {activeSemester ? activeSemester.title : "All semesters"} &middot; {totalCourses} courses
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">GPA</p>
                <p className="text-3xl font-bold text-blue-900 mt-1">{gpa > 0 ? gpa.toFixed(1) : "N/A"}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-200/50 text-blue-700">
                <GraduationCap className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Average</p>
                <p className="text-3xl font-bold text-green-900 mt-1">{avgGrade}%</p>
              </div>
              <div className="p-2.5 rounded-xl bg-green-200/50 text-green-700">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Courses</p>
                <p className="text-3xl font-bold text-purple-900 mt-1">{totalCourses}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-200/50 text-purple-700">
                <BookOpen className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-amber-600 uppercase tracking-wide">Graded</p>
                <p className="text-3xl font-bold text-amber-900 mt-1">{totalGrades}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-200/50 text-amber-700">
                <Award className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Grades */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Course Grades</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {courseGrades.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500">No grades available yet</p>
              <p className="text-xs text-neutral-400 mt-1">Grades will appear here once assignments and quizzes are graded</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {courseGrades.map((course) => {
                const isExpanded = expandedCourses.includes(course.courseId);
                return (
                  <div key={course.courseId}>
                    <button
                      onClick={() => toggleCourse(course.courseId)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors text-left"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${getGradeColor(course.letterGrade)}`}>
                        {course.letterGrade}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">{course.courseTitle}</p>
                        <p className="text-xs text-neutral-500">{course.grades.length} graded items</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-lg font-bold ${getScoreColor(course.avgScore)}`}>{course.avgScore}%</p>
                        <p className="text-[10px] text-neutral-500">Average</p>
                      </div>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-neutral-400" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4">
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-neutral-50">
                                <th className="text-left px-4 py-2 font-medium text-neutral-600">Assessment</th>
                                <th className="text-left px-4 py-2 font-medium text-neutral-600">Type</th>
                                <th className="text-right px-4 py-2 font-medium text-neutral-600">Score</th>
                                <th className="text-right px-4 py-2 font-medium text-neutral-600">Grade</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                              {course.grades.map((grade) => {
                                const pct = Math.round((grade.score / grade.maxScore) * 100);
                                return (
                                  <tr key={grade.id} className="hover:bg-neutral-50">
                                    <td className="px-4 py-2.5">
                                      <p className="font-medium text-neutral-900">{grade.title}</p>
                                      {grade.moduleTitle && <p className="text-[10px] text-neutral-500">{grade.moduleTitle}</p>}
                                    </td>
                                    <td className="px-4 py-2.5">
                                      <Badge variant="outline" className="text-[10px] capitalize">{grade.type}</Badge>
                                    </td>
                                    <td className="px-4 py-2.5 text-right">
                                      <span className={`font-medium ${getScoreColor(pct)}`}>{grade.score}/{grade.maxScore}</span>
                                      <span className="text-neutral-500 text-[10px] ml-1">({pct}%)</span>
                                    </td>
                                    <td className="px-4 py-2.5 text-right">
                                      <Badge className={`${getGradeColor(grade.letterGrade || "")} text-xs`}>
                                        {grade.letterGrade || "N/A"}
                                      </Badge>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        {course.grades.some(g => g.comments) && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs font-medium text-neutral-600">Instructor Feedback:</p>
                            {course.grades.filter(g => g.comments).map(g => (
                              <div key={g.id} className="bg-blue-50 rounded-lg p-3">
                                <p className="text-xs font-medium text-blue-800">{g.title}</p>
                                <p className="text-xs text-blue-700 mt-1">{g.comments}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grade Distribution */}
      {allGrades.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: "A", range: "90-100%", color: "bg-green-500" },
                { label: "B", range: "80-89%", color: "bg-blue-500" },
                { label: "C", range: "70-79%", color: "bg-amber-500" },
                { label: "D", range: "60-69%", color: "bg-orange-500" },
                { label: "F", range: "<60%", color: "bg-red-500" },
              ].map((item) => {
                const count = allGrades.filter(g => {
                  const pct = (g.score / g.maxScore) * 100;
                  if (item.label === "A") return pct >= 90;
                  if (item.label === "B") return pct >= 80 && pct < 90;
                  if (item.label === "C") return pct >= 70 && pct < 80;
                  if (item.label === "D") return pct >= 60 && pct < 70;
                  return pct < 60;
                }).length;
                const percentage = allGrades.length > 0 ? Math.round((count / allGrades.length) * 100) : 0;

                return (
                  <div key={item.label} className="text-center">
                    <div className="relative h-24 bg-neutral-100 rounded-lg overflow-hidden mb-2">
                      <div
                        className={`absolute bottom-0 left-0 right-0 ${item.color} transition-all duration-500`}
                        style={{ height: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-sm font-bold text-neutral-900">{item.label}</p>
                    <p className="text-[10px] text-neutral-500">{count} ({percentage}%)</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
