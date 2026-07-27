import { neon } from "@neondatabase/serverless";

const DATABASE_URL = "postgresql://neondb_owner:npg_OjVYdH7Q1ZnI@ep-fancy-star-az49zkms-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

async function main() {
  const sql = neon(DATABASE_URL);
  
  const statements = [
    `CREATE TABLE IF NOT EXISTS courses (
      id text PRIMARY KEY,
      title text NOT NULL,
      description text,
      thumbnail_url text,
      duration text,
      status text NOT NULL DEFAULT 'draft',
      created_at text NOT NULL DEFAULT (now()::text),
      updated_at text NOT NULL DEFAULT (now()::text)
    )`,
    `CREATE TABLE IF NOT EXISTS modules (
      id text PRIMARY KEY,
      course_id text NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      title text NOT NULL,
      description text,
      order_index integer NOT NULL DEFAULT 0,
      is_locked boolean NOT NULL DEFAULT false,
      unlock_after_module_id text,
      created_at text NOT NULL DEFAULT (now()::text),
      updated_at text NOT NULL DEFAULT (now()::text)
    )`,
    `CREATE TABLE IF NOT EXISTS lessons (
      id text PRIMARY KEY,
      module_id text NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
      title text NOT NULL,
      content_type text NOT NULL,
      content text,
      content_url text,
      duration_minutes integer,
      order_index integer NOT NULL DEFAULT 0,
      is_free boolean NOT NULL DEFAULT false,
      is_published boolean NOT NULL DEFAULT false,
      created_at text NOT NULL DEFAULT (now()::text),
      updated_at text NOT NULL DEFAULT (now()::text)
    )`,
    `CREATE TABLE IF NOT EXISTS enrollments (
      id text PRIMARY KEY,
      student_id text NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      course_id text NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      enrolled_at text NOT NULL DEFAULT (now()::text),
      progress integer NOT NULL DEFAULT 0,
      status text NOT NULL DEFAULT 'active',
      completed_at text
    )`,
    `CREATE TABLE IF NOT EXISTS module_progress (
      id text PRIMARY KEY,
      enrollment_id text NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
      student_id text NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      module_id text NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
      status text NOT NULL DEFAULT 'locked',
      started_at text,
      completed_at text,
      created_at text NOT NULL DEFAULT (now()::text)
    )`,
    `CREATE TABLE IF NOT EXISTS assignments (
      id text PRIMARY KEY,
      course_id text NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      module_id text REFERENCES modules(id),
      title text NOT NULL,
      description text,
      instructions text,
      type text NOT NULL DEFAULT 'file',
      due_at text,
      max_points integer NOT NULL DEFAULT 100,
      is_published boolean NOT NULL DEFAULT false,
      created_at text NOT NULL DEFAULT (now()::text),
      updated_at text NOT NULL DEFAULT (now()::text)
    )`,
    `CREATE TABLE IF NOT EXISTS submissions (
      id text PRIMARY KEY,
      assignment_id text NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
      student_id text NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      text_content text,
      file_urls jsonb DEFAULT '[]',
      submitted_at text,
      score integer,
      feedback text,
      graded_at text,
      graded_by text,
      created_at text NOT NULL DEFAULT (now()::text)
    )`,
    `CREATE TABLE IF NOT EXISTS quizzes (
      id text PRIMARY KEY,
      course_id text NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      module_id text REFERENCES modules(id),
      title text NOT NULL,
      description text,
      time_limit_minutes integer,
      max_attempts integer NOT NULL DEFAULT 3,
      shuffle_questions boolean NOT NULL DEFAULT false,
      passing_score integer NOT NULL DEFAULT 60,
      max_score integer,
      is_published boolean NOT NULL DEFAULT false,
      created_at text NOT NULL DEFAULT (now()::text),
      updated_at text NOT NULL DEFAULT (now()::text)
    )`,
    `CREATE TABLE IF NOT EXISTS quiz_questions (
      id text PRIMARY KEY,
      quiz_id text NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
      question_type text NOT NULL,
      question text NOT NULL,
      options jsonb,
      correct_answer text,
      explanation text,
      points integer NOT NULL DEFAULT 1,
      order_index integer NOT NULL DEFAULT 0,
      created_at text NOT NULL DEFAULT (now()::text)
    )`,
    `CREATE TABLE IF NOT EXISTS quiz_attempts (
      id text PRIMARY KEY,
      quiz_id text NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
      student_id text NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      score integer NOT NULL DEFAULT 0,
      max_score integer NOT NULL DEFAULT 0,
      passed boolean NOT NULL DEFAULT false,
      started_at text NOT NULL,
      completed_at text,
      time_spent_seconds integer,
      created_at text NOT NULL DEFAULT (now()::text)
    )`,
    `CREATE TABLE IF NOT EXISTS quiz_answers (
      id text PRIMARY KEY,
      attempt_id text NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
      question_id text NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
      answer text NOT NULL,
      is_correct boolean,
      points_earned integer NOT NULL DEFAULT 0,
      created_at text NOT NULL DEFAULT (now()::text)
    )`,
    `CREATE TABLE IF NOT EXISTS announcements (
      id text PRIMARY KEY,
      title text NOT NULL,
      content text NOT NULL,
      type text NOT NULL DEFAULT 'general',
      priority text NOT NULL DEFAULT 'normal',
      course_id text REFERENCES courses(id),
      is_published boolean NOT NULL DEFAULT true,
      published_at text NOT NULL DEFAULT (now()::text),
      expires_at text,
      created_by text NOT NULL,
      created_at text NOT NULL DEFAULT (now()::text)
    )`,
    `CREATE TABLE IF NOT EXISTS attendance (
      id text PRIMARY KEY,
      course_id text NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      student_id text NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      date text NOT NULL,
      status text NOT NULL DEFAULT 'present',
      marked_by text NOT NULL,
      marked_at text NOT NULL DEFAULT (now()::text),
      created_at text NOT NULL DEFAULT (now()::text)
    )`
  ];

  for (const stmt of statements) {
    try {
      await sql.query(stmt, []);
      console.log("OK:", stmt.substring(0, 60) + "...");
    } catch (e) {
      const msg = e && e.message ? e.message : String(e);
      if (msg.includes("already exists")) {
        console.log("SKIP:", stmt.substring(0, 60) + "...");
      } else {
        console.error("ERR:", stmt.substring(0, 60) + "...");
        console.error("  ", msg);
      }
    }
  }
  
  // Verify
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`;
  console.log("\nAll tables:", tables.map(t => t.table_name).join(", "));
  
  const lmsTables = ["courses", "modules", "lessons", "enrollments", "module_progress", "assignments", "submissions", "quizzes", "quiz_questions", "quiz_attempts", "quiz_answers", "announcements", "attendance"];
  console.log("\nLMS tables status:");
  for (const t of lmsTables) {
    const exists = tables.some(row => row.table_name === t);
    console.log(` ${exists ? "✓" : "✗"} ${t}`);
  }
}

main().catch(console.error);