import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const sql = neon(DATABASE_URL);
  
  const tables = await sql.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `, []);
  
  console.log("All tables in database:");
  tables.forEach(t => console.log(" -", t.table_name));
  
  const lmsTables = [
    'courses', 'modules', 'lessons', 'enrollments', 'module_progress',
    'assignments', 'submissions', 'quizzes', 'quiz_questions', 
    'quiz_attempts', 'quiz_answers', 'announcements', 'attendance'
  ];
  
  console.log("\nLMS tables status:");
  for (const t of lmsTables) {
    const exists = tables.some(r => r.table_name === t);
    console.log(` ${exists ? '✓' : '✗'} ${t}`);
  }
}

main().catch(console.error);