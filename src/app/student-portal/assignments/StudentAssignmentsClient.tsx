"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FilePlus, Clock, AlertCircle, CheckCircle, FileText, Loader2, Upload } from "lucide-react";
import Link from "next/link";

interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  instructions: string | null;
  type: string;
  dueAt: string | null;
  maxPoints: number;
  isPublished: boolean;
  courseTitle?: string;
  submission: {
    id: string;
    textContent: string | null;
    fileUrls: string[] | null;
    submittedAt: string | null;
    score: number | null;
    feedback: string | null;
    gradedAt?: string | null;
    gradedBy?: string | null;
    status?: string;
  } | null;
  isOverdue: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface StudentAssignmentsClientProps {
  assignments: Assignment[];
  studentId?: string;
}

export function StudentAssignmentsClient({ assignments, studentId }: StudentAssignmentsClientProps) {
  const [activeTab, setActiveTab] = useState("pending");
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  const [textContent, setTextContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const pending = assignments.filter(a => !a.submission || a.submission.score === null);
  const submitted = assignments.filter(a => a.submission && a.submission.score !== null);
  const graded = assignments.filter(a => a.submission && a.submission.score !== null);

  const handleSubmit = async (assignmentId: string) => {
    setSubmittingId(assignmentId);
    try {
      const formData = new FormData();
      formData.append("assignmentId", assignmentId);
      formData.append("textContent", textContent);
      files.forEach(f => formData.append("files", f));

      const res = await fetch("/api/submit-assignment", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setDialogOpen(null);
        setTextContent("");
        setFiles([]);
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingId(null);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "No due date";
    const date = new Date(dateStr);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-muted-foreground">View and submit your course assignments</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted ({submitted.length})</TabsTrigger>
          <TabsTrigger value="graded">Graded ({graded.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {pending.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No pending assignments</h3>
                <p className="text-muted-foreground">You're all caught up!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pending.map(a => (
                <Card key={a.id} className={a.isOverdue ? "border-red-500/50" : ""}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{a.title}</h3>
                          {a.isOverdue && <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" /> Overdue</Badge>}
                          {!a.isOverdue && a.dueAt && <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> Due: {formatDate(a.dueAt)}</Badge>}
                        </div>
                        <p className="text-muted-foreground text-sm">{a.description || "No description"}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><FileText className="h-4 w-4" /> {a.type === "file" ? "File upload" : "Text submission"}</span>
                          <span className="flex items-center gap-1"><FilePlus className="h-4 w-4" /> Max {a.maxPoints} points</span>
                        </div>
                      </div>
                      <Dialog open={dialogOpen === a.id} onOpenChange={open => setDialogOpen(open ? a.id : null)}>
                        <DialogTrigger asChild>
                          <Button className="w-full md:w-auto" variant="default">
                            {a.submission ? "Resubmit" : "Submit"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Submit Assignment: {a.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <Label htmlFor="textContent">Text Content (optional)</Label>
                              <Textarea
                                id="textContent"
                                value={textContent}
                                onChange={e => setTextContent(e.target.value)}
                                placeholder="Enter your response here..."
                                className="mt-2"
                                rows={6}
                              />
                            </div>
                            <div>
                              <Label>File Upload (optional)</Label>
                              <Input
                                type="file"
                                multiple
                                onChange={e => setFiles(Array.from(e.target.files || []))}
                                className="mt-2"
                              />
                              {files.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {files.map((f, i) => (
                                    <Badge key={i} variant="secondary" className="gap-1">
                                      {f.name}
                                      <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))}>×</button>
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setDialogOpen(null)}>Cancel</Button>
                            <Button onClick={() => handleSubmit(a.id)} disabled={submittingId === a.id}>
                              {submittingId === a.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : ""}
                              Submit
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="submitted">
          {submitted.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No submitted assignments</h3>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {submitted.map(a => (
                <Card key={a.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{a.title}</h3>
                        <p className="text-muted-foreground text-sm">Submitted on {a.submission?.submittedAt ? new Date(a.submission.submittedAt).toLocaleDateString() : "Unknown"}</p>
                        <Badge variant="secondary" className="mt-2">Awaiting Grade</Badge>
                      </div>
                      <div className="text-right">
                        {a.submission?.fileUrls && a.submission.fileUrls.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {a.submission.fileUrls.map((url, i) => (
                              <Link key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                                {i === 0 ? "View submission" : `File ${i + 1}`}
                              </Link>
                            ))}
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">Will be graded soon</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="graded">
          {graded.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No graded assignments yet</h3>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {graded.map(a => (
                <Card key={a.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{a.title}</h3>
                        <p className="text-muted-foreground text-sm">Graded on {a.submission?.submittedAt ? new Date(a.submission.submittedAt).toLocaleDateString() : "Unknown"}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold">{a.submission?.score}/{a.maxPoints}</p>
                          <p className="text-sm text-muted-foreground">{Math.round(((a.submission?.score || 0) / a.maxPoints) * 100)}%</p>
                        </div>
                        {a.submission?.feedback && (
                          <div className="max-w-xs">
                            <p className="text-sm font-medium">Feedback:</p>
                            <p className="text-sm text-muted-foreground mt-1">{a.submission.feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}