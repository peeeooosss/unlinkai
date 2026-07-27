import { neon } from "@neondatabase/serverless";
import { randomUUID } from "crypto";

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const sql = neon(DATABASE_URL);
  
  // Get existing students
  const students = await sql`SELECT id, name, email FROM students LIMIT 10`;
  console.log("Found students:", students.length);
  
  // Get admin user for created_by
  const admin = await sql`SELECT id FROM users WHERE email = 'admin@unilinkai.com' LIMIT 1`;
  const adminId = admin[0]?.id;
  console.log("Admin ID:", adminId);
  
  const now = new Date().toISOString();
  
  // ===== CREATE COURSE =====
  const courseId = randomUUID();
  await sql`
    INSERT INTO courses (id, title, description, thumbnail_url, duration, status, created_at, updated_at)
    VALUES (${courseId}, 'Pathway Program - Computer Science', 'Complete pathway program covering 1 year in India + 2 years abroad. Covers programming fundamentals, data structures, algorithms, and software engineering.', '/placeholder-course.jpg', '3 years', 'published', ${now}, ${now})
  `;
  console.log("✓ Course created:", courseId);
  
  // ===== CREATE MODULES =====
  const modulesData = [
    { order: 0, title: "Programming Fundamentals", desc: "Learn the basics of programming with Python" },
    { order: 1, title: "Data Structures & Algorithms", desc: "Core CS concepts for problem solving" },
    { order: 2, title: "Web Development", desc: "Full-stack web development with React and Node.js" },
    { order: 3, title: "Database Systems", desc: "SQL, NoSQL, and database design principles" },
    { order: 4, title: "Software Engineering", desc: "Best practices, testing, and deployment" },
  ];
  
  const moduleIds = [];
  for (const m of modulesData) {
    const id = randomUUID();
    await sql`
      INSERT INTO modules (id, course_id, title, description, order_index, is_locked, created_at, updated_at)
      VALUES (${id}, ${courseId}, ${m.title}, ${m.desc}, ${m.order}, ${m.order > 0}, ${now}, ${now})
    `;
    moduleIds.push(id);
    console.log(`✓ Module ${m.order + 1} created: ${m.title}`);
  }
  
  // ===== CREATE LESSONS =====
  const lessonsData = [
    // Module 1: Programming Fundamentals
    { module: 0, order: 0, title: "Introduction to Programming", type: "video", duration: 30, free: true },
    { module: 0, order: 1, title: "Variables and Data Types", type: "video", duration: 45, free: true },
    { module: 0, order: 2, title: "Control Flow (if/else, loops)", type: "video", duration: 60, free: false },
    { module: 0, order: 3, title: "Functions and Scope", type: "video", duration: 50, free: false },
    { module: 0, order: 4, title: "Practice Exercise: Calculator", type: "assignment", duration: 30, free: false },
    
    // Module 2: Data Structures & Algorithms
    { module: 1, order: 0, title: "Arrays and Linked Lists", type: "video", duration: 60, free: false },
    { module: 1, order: 1, title: "Stacks and Queues", type: "video", duration: 45, free: false },
    { module: 1, order: 2, title: "Trees and Graphs", type: "video", duration: 75, free: false },
    { module: 1, order: 3, title: "Sorting Algorithms", type: "video", duration: 60, free: false },
    { module: 1, order: 4, title: "LeetCode Practice Session", type: "assignment", duration: 90, free: false },
    
    // Module 3: Web Development
    { module: 2, order: 0, title: "HTML & CSS Fundamentals", type: "video", duration: 60, free: false },
    { module: 2, order: 1, title: "JavaScript ES6+", type: "video", duration: 90, free: false },
    { module: 2, order: 2, title: "React Basics", type: "video", duration: 120, free: false },
    { module: 2, order: 3, title: "Building a REST API with Node.js", type: "video", duration: 90, free: false },
    { module: 2, order: 4, title: "Full-Stack Project: Task Manager", type: "assignment", duration: 180, free: false },
    
    // Module 4: Database Systems
    { module: 3, order: 0, title: "Relational Databases & SQL", type: "video", duration: 60, free: false },
    { module: 3, order: 1, title: "Database Design & Normalization", type: "video", duration: 45, free: false },
    { module: 3, order: 2, title: "NoSQL with MongoDB", type: "video", duration: 60, free: false },
    { module: 3, order: 3, title: "Database Project: E-commerce Schema", type: "assignment", duration: 120, free: false },
    
    // Module 5: Software Engineering
    { module: 4, order: 0, title: "Version Control with Git", type: "video", duration: 45, free: false },
    { module: 4, order: 1, title: "Testing & CI/CD", type: "video", duration: 60, free: false },
    { module: 4, order: 2, title: "Docker & Deployment", type: "video", duration: 60, free: false },
    { module: 4, order: 3, title: "Capstone Project", type: "assignment", duration: 300, free: false },
  ];
  
  const lessonIds = [];
  for (const l of lessonsData) {
    const id = randomUUID();
    const modId = moduleIds[l.module];
    await sql`
      INSERT INTO lessons (id, module_id, title, content_type, content, duration_minutes, order_index, is_free, is_published, created_at, updated_at)
      VALUES (${id}, ${modId}, ${l.title}, ${l.type}, ${`Content for ${l.title} - detailed lesson material goes here...`}, ${l.duration}, ${l.order}, ${l.free}, true, ${now}, ${now})
    `;
    lessonIds.push(id);
    console.log(`✓ Lesson created: ${l.title}`);
  }
  
  // ===== CREATE QUIZ =====
  const quizId = randomUUID();
  await sql`
    INSERT INTO quizzes (id, course_id, module_id, title, description, time_limit_minutes, max_attempts, shuffle_questions, passing_score, max_score, is_published, created_at, updated_at)
    VALUES (${quizId}, ${courseId}, ${moduleIds[0]}, 'Programming Fundamentals - Midterm Quiz', 'Test your understanding of programming basics', 60, 3, true, 70, 100, true, ${now}, ${now})
  `;
  console.log("✓ Quiz created");
  
  // ===== CREATE QUIZ QUESTIONS =====
  const questions = [
    { type: "multiple_choice", question: "What is the correct way to declare a variable in Python?", options: ["var x = 5", "int x = 5", "x = 5", "declare x = 5"], correct: "x = 5", points: 10, order: 0 },
    { type: "multiple_choice", question: "Which of the following is NOT a valid data type in Python?", options: ["int", "float", "char", "bool"], correct: "char", points: 10, order: 1 },
    { type: "multiple_choice", question: "What does the 'for' loop do in Python?", options: ["Iterates over a sequence", "Executes code once", "Defines a function", "Imports a module"], correct: "Iterates over a sequence", points: 10, order: 2 },
    { type: "multiple_choice", question: "What is the output of: print(2 ** 3)?", options: ["6", "8", "9", "Error"], correct: "8", points: 10, order: 3 },
    { type: "multiple_choice", question: "Which keyword is used to define a function in Python?", options: ["function", "def", "func", "define"], correct: "def", points: 10, order: 4 },
    { type: "multiple_choice", question: "What is the result of: 'Hello' + 'World'?", options: ["HelloWorld", "Hello World", "Error", "None"], correct: "HelloWorld", points: 10, order: 5 },
    { type: "multiple_choice", question: "Which data structure uses LIFO (Last In, First Out)?", options: ["Queue", "Stack", "Array", "Linked List"], correct: "Stack", points: 10, order: 6 },
    { type: "multiple_choice", question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"], correct: "O(log n)", points: 10, order: 7 },
    { type: "essay", question: "Explain the difference between a list and a tuple in Python.", options: null, correct: "Lists are mutable (can be changed), tuples are immutable (cannot be changed). Lists use square brackets [], tuples use parentheses ().", points: 10, order: 8 },
    { type: "essay", question: "Describe what a function is and why it's useful in programming.", options: null, correct: "A function is a reusable block of code that performs a specific task. It helps avoid code duplication, improves readability, and makes code easier to maintain and test.", points: 10, order: 9 },
  ];
  
  const questionIds = [];
  for (const q of questions) {
    const id = randomUUID();
    await sql`
      INSERT INTO quiz_questions (id, quiz_id, question_type, question, options, correct_answer, explanation, points, order_index, created_at)
      VALUES (${id}, ${quizId}, ${q.type}, ${q.question}, ${q.options ? JSON.stringify(q.options) : null}, ${q.correct}, ${`Explanation for: ${q.question}`}, ${q.points}, ${q.order}, ${now})
    `;
    questionIds.push(id);
    console.log(`✓ Question ${q.order + 1} created: ${q.question.substring(0, 50)}...`);
  }
  
  // ===== CREATE ASSIGNMENTS =====
  const assignmentsData = [
    { module: 0, title: "Calculator Program", desc: "Build a simple calculator in Python", maxPoints: 100 },
    { module: 1, title: "LeetCode Practice", desc: "Solve 5 easy problems on LeetCode", maxPoints: 100 },
    { module: 2, title: "Task Manager App", desc: "Build a full-stack task manager", maxPoints: 200 },
    { module: 3, title: "E-commerce Database Design", desc: "Design a normalized database schema", maxPoints: 150 },
    { module: 4, title: "Capstone Project", desc: "Complete final project demonstrating all skills", maxPoints: 300 },
  ];
  
  const assignmentIds = [];
  for (const a of assignmentsData) {
    const id = randomUUID();
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days from now
    await sql`
      INSERT INTO assignments (id, course_id, module_id, title, description, instructions, type, due_at, max_points, is_published, created_at, updated_at)
      VALUES (${id}, ${courseId}, ${moduleIds[a.module]}, ${a.title}, ${a.desc}, ${`Instructions for ${a.title}...`}, 'file', ${dueDate}, ${a.maxPoints}, true, ${now}, ${now})
    `;
    assignmentIds.push(id);
    console.log(`✓ Assignment created: ${a.title}`);
  }
  
  // ===== CREATE ANNOUNCEMENTS =====
  const announcementsData = [
    { title: "Welcome to Pathway Program!", content: "Welcome all new students to the Computer Science Pathway Program. We're excited to have you on board!", type: "general", priority: "high" },
    { title: "Module 1 is now live", content: "Programming Fundamentals module is now available. Start with the free introductory lessons.", type: "course", priority: "normal" },
    { title: "Assignment 1 due date extended", content: "The deadline for Calculator Program assignment has been extended by 3 days.", type: "assignment", priority: "high" },
    { title: "Live Q&A Session this Friday", content: "Join us for a live Q&A session on Friday 2 PM IST. Link will be shared via email.", type: "general", priority: "normal" },
  ];
  
  for (const a of announcementsData) {
    const id = randomUUID();
    await sql`
      INSERT INTO announcements (id, title, content, type, priority, course_id, is_published, published_at, created_by, created_at)
      VALUES (${id}, ${a.title}, ${a.content}, ${a.type}, ${a.priority}, ${courseId}, true, ${now}, ${adminId}, ${now})
    `;
    console.log(`✓ Announcement created: ${a.title}`);
  }
  
  // ===== ENROLL STUDENTS =====
  for (const student of students) {
    const enrollmentId = randomUUID();
    await sql`
      INSERT INTO enrollments (id, student_id, course_id, enrolled_at, progress, status)
      VALUES (${enrollmentId}, ${student.id}, ${courseId}, ${now}, 0, 'active')
    `;
    console.log(`✓ Enrolled student: ${student.name} (${student.email})`);
    
    // Create module progress for each module
    for (const modId of moduleIds) {
      const progressId = randomUUID();
      const status = modId === moduleIds[0] ? 'in_progress' : 'locked';
      const startedAt = modId === moduleIds[0] ? now : null;
      await sql`
        INSERT INTO module_progress (id, enrollment_id, student_id, module_id, status, started_at, created_at)
        VALUES (${progressId}, ${enrollmentId}, ${student.id}, ${modId}, ${status}, ${startedAt}, ${now})
      `;
    }
  }
  
  console.log("\n✅ Seed data creation complete!");
}

main().catch(console.error);