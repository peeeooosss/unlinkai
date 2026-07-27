-- LMS Tables Migration for UniLinkAI
-- Run against Neon database

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  thumbnail_url text,
  duration text,
  status text NOT NULL DEFAULT 'draft',
  created_at text NOT NULL DEFAULT (now()::text),
  updated_at text NOT NULL DEFAULT (now()::text)
);

-- Modules
CREATE TABLE IF NOT EXISTS modules (
  id text PRIMARY KEY,
  course_id text NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL DEFAULT 0,
  is_locked boolean NOT NULL DEFAULT false,
  unlock_after_module_id text,
  created_at text NOT NULL DEFAULT (now()::text),
  updated_at text NOT NULL DEFAULT (now()::text)
);

-- Lessons
CREATE TABLE IF NOT EXISTS lessons (
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
);

-- Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
  id text PRIMARY KEY,
  student_id text NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id text NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at text NOT NULL DEFAULT (now()::text),
  progress integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  completed_at text
);

-- Module Progress
CREATE TABLE IF NOT EXISTS module_progress (
  id text PRIMARY KEY,
  enrollment_id text NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  student_id text NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  module_id text NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'locked',
  started_at text,
  completed_at text,
  created_at text NOT NULL DEFAULT (now()::text)
);

-- Assignments
CREATE TABLE IF NOT EXISTS assignments (
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
);

-- Submissions
CREATE TABLE IF NOT EXISTS submissions (
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
);

-- Quizzes
CREATE TABLE IF NOT EXISTS quizzes (
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
);

-- Quiz Questions
CREATE TABLE IF NOT EXISTS quiz_questions (
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
);

-- Quiz Attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
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
);

-- Quiz Answers
CREATE TABLE IF NOT EXISTS quiz_answers (
  id text PRIMARY KEY,
  attempt_id text NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id text NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  answer text NOT NULL,
  is_correct boolean,
  points_earned integer NOT NULL DEFAULT 0,
  created_at text NOT NULL DEFAULT (now()::text)
);

-- Announcements
CREATE TABLE IF NOT EXISTS announcements (
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
);

-- Attendance
CREATE TABLE IF NOT EXISTS attendance (
  id text PRIMARY KEY,
  course_id text NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  student_id text NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date text NOT NULL,
  status text NOT NULL DEFAULT 'present',
  marked_by text NOT NULL,
  marked_at text NOT NULL DEFAULT (now()::text),
  created_at text NOT NULL DEFAULT (now()::text)
);
