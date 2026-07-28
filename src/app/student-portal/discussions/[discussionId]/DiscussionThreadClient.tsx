"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Clock, User, MessageSquare, Send, Pin, Lock } from "lucide-react";
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

interface DiscussionThread {
  discussion: {
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
    createdAt: string;
    updatedAt: string;
  };
  replies: {
    id: string;
    discussionId: string;
    authorId: string;
    authorName: string;
    authorRole: string;
    content: string;
    isAnswer: boolean;
    createdAt: string;
  }[];
  courseTitle: string;
}

interface DiscussionThreadClientProps {
  data: DiscussionThread;
}

export function DiscussionThreadClient({ data }: DiscussionThreadClientProps) {
  const { discussion, replies, courseTitle } = data;
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/discussions/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discussionId: discussion.id, content: replyContent }),
      });
      if (res.ok) {
        setReplyContent("");
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
      {/* Back link */}
      <Link href="/student-portal/discussions" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
        <ArrowLeft className="h-4 w-4" />
        Back to Discussions
      </Link>

      {/* Discussion Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-lg shrink-0">
              {discussion.authorName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {discussion.isPinned && <Pin className="h-4 w-4 text-amber-500" />}
                {discussion.isLocked && <Lock className="h-4 w-4 text-red-500" />}
                <h1 className="text-xl font-bold text-neutral-900">{discussion.title}</h1>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-500 mb-4">
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {discussion.authorName}
                  <Badge variant="outline" className="text-[9px] ml-1">{discussion.authorRole}</Badge>
                </span>
                <Badge variant="outline" className="text-[9px]">{courseTitle}</Badge>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {timeAgo(discussion.createdAt)}
                </span>
              </div>
              <div className="prose prose-sm max-w-none text-neutral-700">
                {discussion.content.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
        </h2>

        {replies.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <MessageSquare className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm text-neutral-500">No replies yet. Be the first to respond!</p>
            </CardContent>
          </Card>
        ) : (
          replies.map((reply) => (
            <Card key={reply.id} className={reply.isAnswer ? "border-green-200 bg-green-50/50" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-xs shrink-0">
                    {reply.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-neutral-900">{reply.authorName}</span>
                      <Badge variant="outline" className="text-[9px]">{reply.authorRole}</Badge>
                      {reply.isAnswer && <Badge className="text-[9px] bg-green-100 text-green-700">Answer</Badge>}
                      <span className="text-[10px] text-neutral-400">{timeAgo(reply.createdAt)}</span>
                    </div>
                    <div className="text-sm text-neutral-700">
                      {reply.content.split("\n").map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Reply Form */}
      {!discussion.isLocked && (
        <Card>
          <CardContent className="p-4">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              rows={4}
              className="mb-3"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleReply}
                disabled={submitting || !replyContent.trim()}
                className="gap-2"
              >
                {submitting ? "Posting..." : "Post Reply"}
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
