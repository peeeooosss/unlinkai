import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/get-session";
import { db } from "@/lib/db";
import { moduleProgress, enrollments } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { studentId, moduleId } = body;

    if (user.id !== studentId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const enrollment = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.studentId, studentId))
      .limit(1);

    if (!enrollment[0]) {
      return NextResponse.json({ error: "Not enrolled" }, { status: 404 });
    }

    const existing = await db
      .select()
      .from(moduleProgress)
      .where(and(eq(moduleProgress.studentId, studentId), eq(moduleProgress.moduleId, moduleId)))
      .limit(1);

    const now = new Date().toISOString();

    if (existing[0]) {
      await db
        .update(moduleProgress)
        .set({ status: "completed", completedAt: now })
        .where(eq(moduleProgress.id, existing[0].id));
    } else {
      await db.insert(moduleProgress).values({
        id: crypto.randomUUID(),
        enrollmentId: enrollment[0].id,
        studentId,
        moduleId,
        status: "completed",
        completedAt: now,
        startedAt: now,
      });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}