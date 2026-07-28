import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/get-session";
import { db } from "@/lib/db";
import { lessonNotes, students } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const student = await db.select().from(students).where(eq(students.email, user.email)).limit(1);
    if (!student[0]) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");

    if (!lessonId) {
      return NextResponse.json({ error: "Missing lessonId" }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(lessonNotes)
      .where(and(eq(lessonNotes.studentId, student[0].id), eq(lessonNotes.lessonId, lessonId)))
      .limit(1);

    return NextResponse.json({ content: existing[0]?.content || "" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

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
    const { lessonId, content } = body;

    if (!lessonId) {
      return NextResponse.json({ error: "Missing lessonId" }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(lessonNotes)
      .where(and(eq(lessonNotes.studentId, student[0].id), eq(lessonNotes.lessonId, lessonId)))
      .limit(1);

    const now = new Date().toISOString();

    if (existing[0]) {
      await db
        .update(lessonNotes)
        .set({ content, updatedAt: now })
        .where(eq(lessonNotes.id, existing[0].id));
    } else {
      await db.insert(lessonNotes).values({
        id: crypto.randomUUID(),
        studentId: student[0].id,
        lessonId,
        content,
        createdAt: now,
        updatedAt: now,
      });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
