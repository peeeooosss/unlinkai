"use server";

import { db } from "@/lib/db";
import { discussions, discussionReplies, courses, enrollments, students, users } from "@/lib/db/schema";
import { eq, and, desc, count } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/get-session";

export async function getDiscussions(courseId?: string) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "student") throw new Error("Unauthorized");

  const student = await db.select().from(students).where(eq(students.email, user.email)).limit(1);
  if (!student[0]) throw new Error("Student not found");

  const studentEnrollments = await db
    .select({ courseId: enrollments.courseId })
    .from(enrollments)
    .where(eq(enrollments.studentId, student[0].id));

  const courseIds = studentEnrollments.map((e) => e.courseId);

  const whereCondition = courseId
    ? and(eq(discussions.courseId, courseId))
    : undefined;

  const allDiscussions = await db
    .select()
    .from(discussions)
    .where(whereCondition)
    .orderBy(desc(discussions.isPinned), desc(discussions.lastReplyAt), desc(discussions.createdAt));

  // Filter to enrolled courses
  const filteredDiscussions = courseId
    ? allDiscussions
    : allDiscussions.filter((d) => courseIds.includes(d.courseId));

  // Get course names
  const allCourses = await db.select().from(courses);
  const courseMap = new Map(allCourses.map((c) => [c.id, c.title]));

  return filteredDiscussions.map((d) => ({
    ...d,
    courseTitle: courseMap.get(d.courseId) || "Unknown Course",
  }));
}

export async function getDiscussionThread(discussionId: string) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "student") throw new Error("Unauthorized");

  const discussion = await db.select().from(discussions).where(eq(discussions.id, discussionId)).limit(1);
  if (!discussion[0]) throw new Error("Discussion not found");

  const replies = await db
    .select()
    .from(discussionReplies)
    .where(eq(discussionReplies.discussionId, discussionId))
    .orderBy(discussionReplies.createdAt);

  const course = await db.select().from(courses).where(eq(courses.id, discussion[0].courseId)).limit(1);

  return {
    discussion: discussion[0],
    replies,
    courseTitle: course[0]?.title || "Unknown Course",
  };
}

export async function createDiscussion(data: { courseId: string; title: string; content: string }) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "student") throw new Error("Unauthorized");

  const student = await db.select().from(students).where(eq(students.email, user.email)).limit(1);
  if (!student[0]) throw new Error("Student not found");

  const newDiscussion = await db.insert(discussions).values({
    id: crypto.randomUUID(),
    courseId: data.courseId,
    authorId: student[0].id,
    authorName: student[0].name,
    authorRole: "student",
    title: data.title,
    content: data.content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }).returning();

  return newDiscussion[0];
}

export async function createReply(discussionId: string, content: string) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "student") throw new Error("Unauthorized");

  const student = await db.select().from(students).where(eq(students.email, user.email)).limit(1);
  if (!student[0]) throw new Error("Student not found");

  const newReply = await db.insert(discussionReplies).values({
    id: crypto.randomUUID(),
    discussionId,
    authorId: student[0].id,
    authorName: student[0].name,
    authorRole: "student",
    content,
    createdAt: new Date().toISOString(),
  }).returning();

  // Update reply count and last reply time
  await db
    .update(discussions)
    .set({
      replyCount: (await db.select({ count: count() }).from(discussionReplies).where(eq(discussionReplies.discussionId, discussionId)))[0].count,
      lastReplyAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .where(eq(discussions.id, discussionId));

  return newReply[0];
}
