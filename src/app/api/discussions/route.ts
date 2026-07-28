import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/get-session";
import { db } from "@/lib/db";
import { discussions, students } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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
    const { courseId, title, content } = body;

    if (!courseId || !title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newDiscussion = await db.insert(discussions).values({
      id: crypto.randomUUID(),
      courseId,
      authorId: student[0].id,
      authorName: student[0].name,
      authorRole: "student",
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning();

    return NextResponse.json({ success: true, discussion: newDiscussion[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
