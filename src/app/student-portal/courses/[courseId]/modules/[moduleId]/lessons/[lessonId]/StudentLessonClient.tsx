"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Play, CheckCircle, Lock, ChevronLeft, ChevronRight, Menu, X, Save, BookOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LessonData {
  course: {
    id: string;
    title: string;
  };
  module: {
    id: string;
    title: string;
    orderIndex: number;
  };
  lesson: {
    id: string;
    title: string;
    contentType: string;
    content: string | null;
    contentUrl: string | null;
    durationMinutes: number | null;
    isFree: boolean;
  };
  lessons: Array<{
    id: string;
    title: string;
    orderIndex: number;
    isFree: boolean;
    isPublished: boolean;
  }>;
  progress: {
    status: string;
    startedAt: string | null;
  } | null;
}

interface StudentLessonClientProps {
  data: LessonData;
  studentId: string;
  courseId: string;
  moduleId: string;
}

export function StudentLessonClient({ data, studentId, courseId, moduleId }: StudentLessonClientProps) {
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);
  const currentIndex = data.lessons.findIndex(l => l.id === data.lesson.id);

  const handleComplete = async () => {
    try {
      const res = await fetch("/api/lesson-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, moduleId, lessonId: data.lesson.id }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleNext = () => {
    const nextLesson = data.lessons[currentIndex + 1];
    if (nextLesson) router.push(`/student-portal/courses/${courseId}/modules/${moduleId}/lessons/${nextLesson.id}`);
  };

  const handlePrev = () => {
    const prevLesson = data.lessons[currentIndex - 1];
    if (prevLesson) router.push(`/student-portal/courses/${courseId}/modules/${moduleId}/lessons/${prevLesson.id}`);
  };

  const getContent = () => {
    switch (data.lesson.contentType) {
      case "video":
        return (
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            {data.lesson.contentUrl ? (
              <iframe
                src={data.lesson.contentUrl}
                className="w-full h-full rounded-lg"
                frameBorder="0"
                allowFullScreen
              />
            ) : (
              <Play className="h-16 w-16 text-muted-foreground/50" />
            )}
          </div>
        );
      case "text":
        return (
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: data.lesson.content || "<p>No content available</p>" }} />
          </div>
        );
      case "document":
        return (
          <div className="bg-muted p-6 rounded-lg text-center">
            <p className="text-muted-foreground">Document content: {data.lesson.contentUrl}</p>
            {data.lesson.contentUrl && (
              <a href={data.lesson.contentUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-primary hover:underline">
                Open Document
              </a>
            )}
          </div>
        );
      default:
        return <p className="text-muted-foreground">Unsupported content type</p>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <button
        className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg"
        onClick={() => setShowSidebar(true)}
        aria-label="Open lesson navigation"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="lg:hidden fixed inset-0 z-40 bg-background transform transition-transform duration-300 {showSidebar ? 'translate-x-0' : 'translate-x-full'}">
        <div className="flex h-full w-80 max-w-full flex-col border-r">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">Lesson Navigation</h2>
            <button onClick={() => setShowSidebar(false)} className="p-1 hover:bg-accent rounded">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {data.lessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/student-portal/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}`}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${lesson.id === data.lesson.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
                onClick={() => setShowSidebar(false)}
              >
                <div className="flex items-center gap-3">
                  {lesson.id === data.lesson.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : data.progress?.status === "completed" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <span className="h-5 w-5" />
                  )}
                  <span className="text-sm font-medium truncate">{lesson.title}</span>
                </div>
                {!lesson.isFree && <Lock className="h-4 w-4 opacity-50" />}
              </Link>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-black/50" onClick={() => setShowSidebar(false)} />
      </div>

      <div className="flex min-h-screen">
        <aside className="hidden lg:flex lg:w-80 flex-col border-r bg-muted/30">
          <div className="p-4 border-b">
            <Link href={`/student-portal/courses/${courseId}`} className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to Course
            </Link>
            <h3 className="font-semibold mt-1">{data.module.title}</h3>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {data.lessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/student-portal/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}`}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  lesson.id === data.lesson.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                <div className="flex items-center gap-3">
                  {lesson.id === data.lesson.id ? (
                    <Play className="h-5 w-5" />
                  ) : data.progress?.status === "completed" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <span className="h-5 w-5" />
                  )}
                  <span className="text-sm font-medium truncate">{lesson.title}</span>
                </div>
                {!lesson.isFree && <Lock className="h-4 w-4 opacity-50" />}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 flex flex-col">
          <header className="p-4 border-b bg-background/80 backdrop-blur sticky top-0 z-10">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{data.lesson.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {data.module.title} • {data.lesson.durationMinutes ? `${data.lesson.durationMinutes} min` : "No duration"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {currentIndex > 0 && (
                  <Button variant="outline" size="sm" onClick={handlePrev}>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                )}
                {currentIndex < data.lessons.length - 1 && (
                  <Button size="sm" onClick={handleNext}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </header>

          <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">{getContent()}</CardContent>
              </Card>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant={data.progress?.status === "completed" ? "default" : "secondary"}>
                    {data.progress?.status === "completed" ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </>
                    ) : data.progress?.status === "in_progress" ? (
                      "In Progress"
                    ) : (
                      "Not Started"
                    )}
                  </Badge>
                  {data.lesson.isFree && <Badge variant="outline">Free Preview</Badge>}
                </div>
                {data.progress?.status !== "completed" && (
                  <Button onClick={handleComplete} className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Mark Complete
                  </Button>
                )}
              </div>

              <Separator />

              <Tabs defaultValue="content" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="content">
                  <p className="text-muted-foreground">Lesson content displayed above.</p>
                </TabsContent>
                <TabsContent value="notes">
                  <NotesTab lessonId={data.lesson.id} studentId={studentId} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NotesTab({ lessonId, studentId }: { lessonId: string; studentId: string }) {
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load existing notes
    const loadNotes = async () => {
      try {
        const res = await fetch(`/api/notes?lessonId=${lessonId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.content) setNotes(data.content);
        }
      } catch (e) {
        console.error("Failed to load notes:", e);
      }
    };
    loadNotes();
  }, [lessonId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, content: notes }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (e) {
      console.error("Failed to save notes:", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-neutral-700 flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Personal Notes
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={saving}
          className="gap-1"
        >
          {saving ? "Saving..." : saved ? "Saved!" : <><Save className="h-3.5 w-3.5" /> Save</>}
        </Button>
      </div>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Take notes for this lesson... Your notes are saved automatically when you click Save."
        rows={8}
        className="resize-none"
      />
      <p className="text-[10px] text-neutral-400">Notes are private and only visible to you.</p>
    </div>
  );
}