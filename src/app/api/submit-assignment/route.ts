import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/get-session";
import { db } from "@/lib/db";
import { submissions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const assignmentId = formData.get("assignmentId") as string;
    const textContent = formData.get("textContent") as string;

    const student = await db.select().from(students).where(eq(students.email, user.email)).limit(1);
    if (!student[0]) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const existing = await db
      .select()
      .from(submissions)
      .where(and(eq(submissions.assignmentId, assignmentId), eq(submissions.studentId, student[0].id)))
      .limit(1);

    const fileUrls: string[] = [];
    // In production, upload files to S3/Cloudinary and get URLs
    // For now, just store placeholder URLs
    for (const entry of formData.entries()) {
      if (entry[0] === "files" && entry[1] instanceof File) {
        fileUrls.push(`/uploads/${Date.now()}-${entry[1].name}`);
      }
    }

    const now = new Date().toISOString();

    if (existing[0]) {
      await db
        .update(submissions)
        .set({
          textContent: textContent || null,
          fileUrls,
          submittedAt: now,
        })
        .where(eq(submissions.id, existing[0].id));
    } else {
      await db.insert(submissions).values({
        id: crypto.randomUUID(),
        assignmentId,
        studentId: student[0].id,
        textContent: textContent || null,
        fileUrls,
        submittedAt: now,
      });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

import { students } from "@/lib/db/schema";