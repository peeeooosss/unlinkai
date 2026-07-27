"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Clock, Award, AlertCircle, CheckCircle, PlayCircle } from "lucide-react";

interface QuizData {
  id: string;
  title: string;
  description: string | null;
  timeLimitMinutes: number | null;
  maxAttempts: number;
  passingScore: number;
  maxScore: number | null;
  courseId: string;
  attempt: { id: string; score: number; maxScore: number; passed: boolean; completedAt: string | null } | null;
  attemptsUsed: number;
}

interface StudentQuizzesClientProps {
  quizzes: QuizData[];
}

export function StudentQuizzesClient({ quizzes }: StudentQuizzesClientProps) {
  if (quizzes.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No quizzes available</h3>
        <p className="text-muted-foreground">Quizzes will appear here when your courses have published quizzes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quizzes.map(quiz => (
        <Card key={quiz.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <CardTitle>{quiz.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{quiz.description || "No description"}</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {quiz.attempt && quiz.attempt.completedAt ? (
                  <Badge variant={quiz.attempt.passed ? "default" : "destructive"} className="gap-1">
                    {quiz.attempt.passed ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                    {quiz.attempt.passed ? "Passed" : "Failed"}
                  </Badge>
                ) : quiz.attempt ? (
                  <Badge variant="outline">In Progress</Badge>
                ) : (
                  <Badge variant="secondary">Not Started</Badge>
                )}
                <Badge variant="outline" className="gap-1">
                  <Award className="h-3 w-3" />
                  {quiz.attemptsUsed}/{quiz.maxAttempts} used
                </Badge>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
              {quiz.timeLimitMinutes && (
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {quiz.timeLimitMinutes} min</span>
              )}
              <span className="flex items-center gap-1"><Award className="h-4 w-4" /> Pass: {quiz.passingScore}%</span>
              <span className="flex items-center gap-1">Max Score: {quiz.maxScore || 100}</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {quiz.attempt && quiz.attempt.completedAt && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Your Score</span>
                  <span className="font-medium">{quiz.attempt.score}/{quiz.attempt.maxScore} ({Math.round((quiz.attempt.score / quiz.attempt.maxScore) * 100)}%)</span>
                </div>
                <Progress value={Math.round((quiz.attempt.score / quiz.attempt.maxScore) * 100)} className="h-2" />
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              {quiz.attempt && !quiz.attempt.completedAt ? (
                <Button asChild variant="default" className="flex-1">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Resume Quiz
                </Button>
              ) : quiz.attemptsUsed >= quiz.maxAttempts ? (
                <Button variant="outline" className="flex-1" disabled>
                  Max Attempts Reached
                </Button>
              ) : quiz.attempt && quiz.attempt.completedAt ? (
                <>
                  <Button asChild variant="default" className="flex-1" disabled>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completed
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={`/student-portal/quizzes/${quiz.id}/attempts/${quiz.attempt.id}`}>View Results</Link>
                  </Button>
                </>
              ) : (
                <Button asChild variant="default" className="flex-1">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start Quiz
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}