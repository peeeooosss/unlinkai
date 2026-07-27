import { pgTable, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

// ==================== Auth.js Tables ====================

export const users = pgTable("users", {
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

export const accounts = pgTable("accounts", {
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

export const sessions = pgTable("sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  sessionToken: text("session_token").notNull().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: text("expires").notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: text("expires").notNull(),
});

// ==================== Application Tables ====================

export const students = pgTable("students", {
  id: text("id").primaryKey(),
  agentId: text("agent_id").notNull().references(() => users.id),
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

export const applications = pgTable("applications", {
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

export const documents = pgTable("documents", {
  id: text("id").primaryKey(),
  studentId: text("student_id")
    .notNull()
    .references(() => students.id),
  applicationId: text("application_id").references(() => applications.id),
  type: text("type").notNull(),
  fileName: text("file_name").notNull(),
  uploadedAt: text("uploaded_at").notNull(),
  verified: boolean("verified").notNull().default(false),
});

export const activityLogs = pgTable("activity_logs", {
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

// ==================== LMS Tables ====================

export const courses = pgTable("courses", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  duration: text("duration"),
  status: text("status").notNull().default("draft"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const modules = pgTable("modules", {
  id: text("id").primaryKey(),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull().default(0),
  isLocked: boolean("is_locked").notNull().default(false),
  unlockAfterModuleId: text("unlock_after_module_id"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const lessons = pgTable("lessons", {
  id: text("id").primaryKey(),
  moduleId: text("module_id")
    .notNull()
    .references(() => modules.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  contentType: text("content_type").notNull(),
  content: text("content"),
  contentUrl: text("content_url"),
  durationMinutes: integer("duration_minutes"),
  orderIndex: integer("order_index").notNull().default(0),
  isFree: boolean("is_free").notNull().default(false),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const enrollments = pgTable("enrollments", {
  id: text("id").primaryKey(),
  studentId: text("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  enrolledAt: text("enrolled_at").notNull().$defaultFn(() => new Date().toISOString()),
  progress: integer("progress").notNull().default(0),
  status: text("status").notNull().default("active"),
  completedAt: text("completed_at"),
});

export const moduleProgress = pgTable("module_progress", {
  id: text("id").primaryKey(),
  enrollmentId: text("enrollment_id")
    .notNull()
    .references(() => enrollments.id, { onDelete: "cascade" }),
  studentId: text("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  moduleId: text("module_id")
    .notNull()
    .references(() => modules.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("locked"),
  startedAt: text("started_at"),
  completedAt: text("completed_at"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const assignments = pgTable("assignments", {
  id: text("id").primaryKey(),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  moduleId: text("module_id").references(() => modules.id),
  title: text("title").notNull(),
  description: text("description"),
  instructions: text("instructions"),
  type: text("type").notNull().default("file"),
  dueAt: text("due_at"),
  maxPoints: integer("max_points").notNull().default(100),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const submissions = pgTable("submissions", {
  id: text("id").primaryKey(),
  assignmentId: text("assignment_id")
    .notNull()
    .references(() => assignments.id, { onDelete: "cascade" }),
  studentId: text("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  textContent: text("text_content"),
  fileUrls: jsonb("file_urls").$type<string[]>().default([]),
  submittedAt: text("submitted_at"),
  score: integer("score"),
  feedback: text("feedback"),
  gradedAt: text("graded_at"),
  gradedBy: text("graded_by"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const quizzes = pgTable("quizzes", {
  id: text("id").primaryKey(),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  moduleId: text("module_id").references(() => modules.id),
  title: text("title").notNull(),
  description: text("description"),
  timeLimitMinutes: integer("time_limit_minutes"),
  maxAttempts: integer("max_attempts").notNull().default(3),
  shuffleQuestions: boolean("shuffle_questions").notNull().default(false),
  passingScore: integer("passing_score").notNull().default(60),
  maxScore: integer("max_score"),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: text("id").primaryKey(),
  quizId: text("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  questionType: text("question_type").notNull(),
  question: text("question").notNull(),
  options: jsonb("options").$type<string[]>(),
  correctAnswer: text("correct_answer"),
  explanation: text("explanation"),
  points: integer("points").notNull().default(1),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: text("id").primaryKey(),
  quizId: text("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  studentId: text("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  score: integer("score").notNull().default(0),
  maxScore: integer("max_score").notNull().default(0),
  passed: boolean("passed").notNull().default(false),
  startedAt: text("started_at").notNull(),
  completedAt: text("completed_at"),
  timeSpentSeconds: integer("time_spent_seconds"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const quizAnswers = pgTable("quiz_answers", {
  id: text("id").primaryKey(),
  attemptId: text("attempt_id")
    .notNull()
    .references(() => quizAttempts.id, { onDelete: "cascade" }),
  questionId: text("question_id")
    .notNull()
    .references(() => quizQuestions.id, { onDelete: "cascade" }),
  answer: text("answer").notNull(),
  isCorrect: boolean("is_correct"),
  pointsEarned: integer("points_earned").notNull().default(0),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const announcements = pgTable("announcements", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull().default("general"),
  priority: text("priority").notNull().default("normal"),
  courseId: text("course_id").references(() => courses.id),
  isPublished: boolean("is_published").notNull().default(true),
  publishedAt: text("published_at").notNull().$defaultFn(() => new Date().toISOString()),
  expiresAt: text("expires_at"),
  createdBy: text("created_by").notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const attendance = pgTable("attendance", {
  id: text("id").primaryKey(),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  studentId: text("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  status: text("status").notNull().default("present"),
  markedBy: text("marked_by").notNull(),
  markedAt: text("marked_at").notNull().$defaultFn(() => new Date().toISOString()),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// ==================== Types ====================

export type User = typeof users.$inferSelect;
export type Student = typeof students.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Module = typeof modules.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type Enrollment = typeof enrollments.$inferSelect;
export type ModuleProgress = typeof moduleProgress.$inferSelect;
export type Assignment = typeof assignments.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type QuizAnswer = typeof quizAnswers.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type Attendance = typeof attendance.$inferSelect;

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