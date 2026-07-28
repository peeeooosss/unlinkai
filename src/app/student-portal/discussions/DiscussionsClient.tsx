"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Pin, Clock, User, Send, Plus, Search, Filter } from "lucide-react";
import Link from "next/link";

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

interface Discussion {
  id: string;
  courseId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  title: string;
  content: string;
  isPinned: boolean;
  isLocked: boolean;
  replyCount: number;
  lastReplyAt: string | null;
  createdAt: string;
  updatedAt: string;
  courseTitle: string;
}

interface DiscussionsClientProps {
  discussions: Discussion[];
}

export function DiscussionsClient({ discussions }: DiscussionsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [newThreadOpen, setNewThreadOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCourseId, setNewCourseId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Get unique courses from discussions
  const courses = Array.from(new Set(discussions.map(d => ({ id: d.courseId, title: d.courseTitle }))));
  const uniqueCourses = courses.filter((c, i, arr) => arr.findIndex(x => x.id === c.id) === i);

  // Filter discussions
  const filtered = discussions.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         d.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = filterCourse === "all" || d.courseId === filterCourse;
    return matchesSearch && matchesCourse;
  });

  // Sort: pinned first, then by last reply
  const sorted = [...filtered].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    const aTime = a.lastReplyAt || a.createdAt;
    const bTime = b.lastReplyAt || b.createdAt;
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });

  const handleCreateThread = async () => {
    if (!newTitle.trim() || !newContent.trim() || !newCourseId) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: newCourseId, title: newTitle, content: newContent }),
      });
      if (res.ok) {
        setNewThreadOpen(false);
        setNewTitle("");
        setNewContent("");
        setNewCourseId("");
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Discussions</h1>
          <p className="text-neutral-600 mt-1">Ask questions, share ideas, and collaborate with classmates</p>
        </div>
        <Dialog open={newThreadOpen} onOpenChange={setNewThreadOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Discussion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Start a New Discussion</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-neutral-700">Course</label>
                <Select value={newCourseId} onValueChange={setNewCourseId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueCourses.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">Title</label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="What's your question or topic?"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">Details</label>
                <Textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Provide more context..."
                  className="mt-1"
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewThreadOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateThread} disabled={submitting || !newTitle.trim() || !newContent.trim() || !newCourseId}>
                {submitting ? "Posting..." : "Post Discussion"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterCourse} onValueChange={setFilterCourse}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {uniqueCourses.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Discussion List */}
      {sorted.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-neutral-600 mb-1">No discussions yet</h3>
            <p className="text-sm text-neutral-500 mb-4">Be the first to start a conversation!</p>
            <Button onClick={() => setNewThreadOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Start Discussion
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sorted.map((discussion) => (
            <Link key={discussion.id} href={`/student-portal/discussions/${discussion.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                        {discussion.authorName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {discussion.isPinned && (
                          <Pin className="h-3.5 w-3.5 text-amber-500" />
                        )}
                        <h3 className="text-sm font-semibold text-neutral-900 truncate">{discussion.title}</h3>
                      </div>
                      <p className="text-xs text-neutral-500 line-clamp-2 mb-2">{discussion.content}</p>
                      <div className="flex items-center gap-3 text-[10px] text-neutral-400">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {discussion.authorName}
                        </span>
                        <Badge variant="outline" className="text-[9px]">{discussion.courseTitle}</Badge>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {discussion.replyCount} replies
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeAgo(discussion.lastReplyAt || discussion.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
