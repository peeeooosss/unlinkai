import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL!;

const sql = postgres(DATABASE_URL);

const migrations: string[] = [
  `CREATE TABLE IF NOT EXISTS "users" (
    "id" text PRIMARY KEY,
    "name" text,
    "email" text NOT NULL,
    "email_verified" text,
    "image" text,
    "password" text,
    "role" text NOT NULL DEFAULT 'student',
    "created_at" text NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "accounts" (
    "id" text PRIMARY KEY,
    "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "type" text NOT NULL,
    "provider" text NOT NULL,
    "provider_account_id" text NOT NULL,
    "refresh_token" text,
    "access_token" text,
    "expires_at" integer,
    "token_type" text,
    "scope" text,
    "id_token" text,
    "session_state" text
  )`,
  `CREATE TABLE IF NOT EXISTS "sessions" (
    "id" text PRIMARY KEY,
    "session_token" text NOT NULL,
    "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "expires" text NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "verification_tokens" (
    "identifier" text NOT NULL,
    "token" text NOT NULL,
    "expires" text NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "students" (
    "id" text PRIMARY KEY,
    "name" text NOT NULL,
    "email" text NOT NULL,
    "phone" text NOT NULL,
    "nationality" text NOT NULL,
    "passport_number" text,
    "education_level" text NOT NULL,
    "created_at" text NOT NULL,
    "date_of_birth" text,
    "gender" text,
    "current_institution" text,
    "gpa" text,
    "year_of_completion" text,
    "english_test_type" text,
    "english_test_score" text,
    "country_preferences" text,
    "course_preferences" text,
    "budget" text,
    "intake_preference" text,
    "additional_notes" text,
    "title" text,
    "passport_expiry" text,
    "country_of_residence" text,
    "address" text,
    "city" text,
    "emergency_contact_name" text,
    "emergency_contact_phone" text,
    "whatsapp_number" text,
    "native_language" text,
    "education_history" text,
    "english_test_details" text,
    "standardized_tests" text,
    "work_experience" text,
    "financial_info" text,
    "visa_history" text,
    "preferred_institutions" text,
    "accommodation_preference" text,
    "post_study_work_interest" text,
    "consent_given" text,
    "status" text NOT NULL DEFAULT 'complete'
  )`,
  `CREATE TABLE IF NOT EXISTS "applications" (
    "id" text PRIMARY KEY,
    "student_id" text NOT NULL REFERENCES "students"("id"),
    "university" text NOT NULL,
    "course" text NOT NULL,
    "stage" text NOT NULL,
    "status" text NOT NULL DEFAULT 'active',
    "accommodation" text,
    "insurance" text,
    "submitted_at" text NOT NULL,
    "updated_at" text NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "documents" (
    "id" text PRIMARY KEY,
    "student_id" text NOT NULL REFERENCES "students"("id"),
    "application_id" text REFERENCES "applications"("id"),
    "type" text NOT NULL,
    "file_name" text NOT NULL,
    "uploaded_at" text NOT NULL,
    "verified" boolean NOT NULL DEFAULT false
  )`,
  `CREATE TABLE IF NOT EXISTS "activity_logs" (
    "id" text PRIMARY KEY,
    "student_id" text NOT NULL REFERENCES "students"("id"),
    "application_id" text REFERENCES "applications"("id"),
    "action" text NOT NULL,
    "note" text,
    "performed_by" text NOT NULL,
    "created_at" text NOT NULL
  )`,
  `DO $$ BEGIN
    ALTER TABLE "accounts" ADD CONSTRAINT "accounts_provider_provider_account_id_unique" UNIQUE ("provider", "provider_account_id");
  EXCEPTION WHEN duplicate_object THEN null; END $$`,
  `DO $$ BEGIN
    ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_token_unique" UNIQUE ("token");
  EXCEPTION WHEN duplicate_object THEN null; END $$`,
];

async function migrate() {
  console.log("Connecting to Neon PostgreSQL...\n");
  for (const stmt of migrations) {
    const match = stmt.match(/CREATE TABLE IF NOT EXISTS "(\w+)"/);
    const label = match ? match[1] : "unique constraint";
    try {
      await sql.unsafe(stmt);
      console.log(`  ✓ ${label}`);
    } catch (err: any) {
      console.error(`  ✗ ${label}: ${err.message}`);
    }
  }
  await sql.end();
  console.log("\nMigration complete!");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
