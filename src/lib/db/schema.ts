import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// ==================== Auth.js Tables ====================

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: text("email_verified"),
  image: text("image"),
  password: text("password"),
  role: text("role").notNull().default("student"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const accounts = sqliteTable("accounts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const sessions = sqliteTable("sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  sessionToken: text("session_token").notNull().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: text("expires").notNull(),
});

export const verificationTokens = sqliteTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: text("expires").notNull(),
});

// ==================== Application Tables ====================

export const students = sqliteTable("students", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  nationality: text("nationality").notNull(),
  passportNumber: text("passport_number"),
  educationLevel: text("education_level").notNull(),
  createdAt: text("created_at").notNull(),
  dateOfBirth: text("date_of_birth"),
  gender: text("gender"),
  currentInstitution: text("current_institution"),
  gpa: text("gpa"),
  yearOfCompletion: text("year_of_completion"),
  englishTestType: text("english_test_type"),
  englishTestScore: text("english_test_score"),
  countryPreferences: text("country_preferences"),
  coursePreferences: text("course_preferences"),
  budget: text("budget"),
  intakePreference: text("intake_preference"),
  additionalNotes: text("additional_notes"),
  title: text("title"),
  passportExpiry: text("passport_expiry"),
  countryOfResidence: text("country_of_residence"),
  address: text("address"),
  city: text("city"),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  whatsappNumber: text("whatsapp_number"),
  nativeLanguage: text("native_language"),
  educationHistory: text("education_history"),
  englishTestDetails: text("english_test_details"),
  standardizedTests: text("standardized_tests"),
  workExperience: text("work_experience"),
  financialInfo: text("financial_info"),
  visaHistory: text("visa_history"),
  preferredInstitutions: text("preferred_institutions"),
  accommodationPreference: text("accommodation_preference"),
  postStudyWorkInterest: text("post_study_work_interest"),
  consentGiven: text("consent_given"),
  status: text("status").notNull().default("complete"),
});

export const applications = sqliteTable("applications", {
  id: text("id").primaryKey(),
  studentId: text("student_id")
    .notNull()
    .references(() => students.id),
  university: text("university").notNull(),
  course: text("course").notNull(),
  stage: text("stage").notNull(),
  status: text("status").notNull().default("active"),
  accommodation: text("accommodation"),
  insurance: text("insurance"),
  submittedAt: text("submitted_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const documents = sqliteTable("documents", {
  id: text("id").primaryKey(),
  studentId: text("student_id")
    .notNull()
    .references(() => students.id),
  applicationId: text("application_id").references(() => applications.id),
  type: text("type").notNull(),
  fileName: text("file_name").notNull(),
  uploadedAt: text("uploaded_at").notNull(),
  verified: integer("verified", { mode: "boolean" }).notNull().default(false),
});

export const activityLogs = sqliteTable("activity_logs", {
  id: text("id").primaryKey(),
  studentId: text("student_id")
    .notNull()
    .references(() => students.id),
  applicationId: text("application_id").references(() => applications.id),
  action: text("action").notNull(),
  note: text("note"),
  performedBy: text("performed_by").notNull(),
  createdAt: text("created_at").notNull(),
});

// ==================== Types ====================

export type User = typeof users.$inferSelect;
export type Student = typeof students.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type ActivityLog = typeof activityLogs.$inferSelect;

export const STAGE_ORDER = [
  "lead",
  "application_submitted",
  "offer_received",
  "visa_processing",
  "visa_approved",
] as const;

export type Stage = (typeof STAGE_ORDER)[number];

export const STAGE_LABELS: Record<Stage, string> = {
  lead: "Lead",
  application_submitted: "Application Submitted",
  offer_received: "Offer Received",
  visa_processing: "Visa Processing",
  visa_approved: "Visa Approved",
};
