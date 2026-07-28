import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/get-session";
import { db } from "@/lib/db";
import { discussionReplies, discussions, students } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const student = await db.select().from(students).where(eq(students.email, user.email)).limit(1);
    if (!student[0]) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const body = await request.json();
    const { discussionId, content } = body;

    if (!discussionId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check discussion exists and is not locked
    const discussion = await db.select().from(discussions).where(eq(discussions.id, discussionId)).limit(1);
    if (!discussion[0]) {
      return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
    }
    if (discussion[0].isLocked) {
      return NextResponse.json({ error: "Discussion is locked" }, { status: 403 });
    }

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
    const replyCountResult = await db
      .select({ count: count() })
      .from(discussionReplies)
      .where(eq(discussionReplies.discussionId, discussionId));

    await db
      .update(discussions)
      .set({
        replyCount: replyCountResult[0].count,
        lastReplyAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(discussions.id, discussionId));

    return NextResponse.json({ success: true, reply: newReply[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
