"use server";

import { db } from "@/lib/db";
import { students, applications, documents } from "@/lib/db/schema";
import { eq, desc, and, inArray, sql, SQL } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/get-session";

async function getAgentStudents(user: { id: string; role: string }) {
  if (user.role === "superadmin") return [];
  const result = await db.select({ id: students.id }).from(students).where(eq(students.agentId, user.id));
  return result.map(r => r.id);
}

function buildWhere(...conditions: (SQL | undefined)[]): SQL | undefined {
  const valid = conditions.filter((c): c is SQL => c !== undefined);
  return valid.length === 0 ? undefined : valid.length === 1 ? valid[0] : and(...valid);
}

export async function getAttentionItems() {
  const user = await getAuthenticatedUser();
  const studentIds = await getAgentStudents(user);
  const filter = user.role === "superadmin" ? undefined : studentIds.length > 0 ? inArray(students.id, studentIds) : sql`1=0`;

  // Get applications that need attention
  // 1. Applications stuck in same stage > 7 days
  // 2. Students with unverified documents
  // 3. Applications in "lead" stage with no activity

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // Get applications with their students
  const appsResult = await db
    .select({
      app: applications,
      student: students,
    })
    .from(applications)
    .leftJoin(students, eq(applications.studentId, students.id))
    .where(buildWhere(filter, eq(applications.status, "active")))
    .orderBy(desc(applications.updatedAt));

  // Get unverified document counts per student
  const unverifiedDocs = await db
    .select({
      studentId: documents.studentId,
      count: sql<number>`count(*)::int`,
    })
    .from(documents)
    .where(and(eq(documents.verified, false), filter))
    .groupBy(documents.studentId);

  const unverifiedMap = new Map(unverifiedDocs.map(d => [d.studentId, d.count]));

  const items: AttentionItem[] = [];

  for (const { app, student } of appsResult) {
    if (!student) continue;

    const updatedAt = app.updatedAt;
    const isStale = updatedAt && updatedAt < sevenDaysAgo;
    const unverifiedCount = unverifiedMap.get(student.id) ?? 0;

    if (isStale) {
      items.push({
        id: `stale-${app.id}`,
        studentName: student.name,
        action: `Application stuck in ${app.stage.replace(/_/g, " ")} for 7+ days`,
        urgency: "high",
        dueDate: updatedAt,
        college: app.university,
        course: app.course,
      });
    }

    if (unverifiedCount > 0) {
      items.push({
        id: `unverified-${student.id}`,
        studentName: student.name,
        action: `${unverifiedCount} document${unverifiedCount > 1 ? "s" : ""} pending verification`,
        urgency: "medium",
        dueDate: new Date().toISOString().split("T")[0],
        college: app.university,
        course: app.course,
      });
    }

    if (app.stage === "lead" && !isStale) {
      items.push({
        id: `lead-${app.id}`,
        studentName: student.name,
        action: "New lead - needs initial assessment",
        urgency: "low",
        dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        college: app.university,
        course: app.course,
      });
    }
  }

  // Sort by urgency: high > medium > low
  const urgencyOrder = { high: 0, medium: 1, low: 2 };
  items.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);

  return items.slice(0, 10);
}

interface AttentionItem {
  id: string;
  studentName: string;
  action: string;
  urgency: "high" | "medium" | "low";
  dueDate: string;
  college: string;
  course: string;
}