import postgres from "postgres";
import bcrypt from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL!;
const sql = postgres(DATABASE_URL);

async function seed() {
  const existingStudents = await sql`SELECT COUNT(*)::int as count FROM "students"`;
  if (existingStudents[0].count > 0) {
    console.log(`Database already has ${existingStudents[0].count} students. Skipping student seed.`);
  } else {
    const existingUsers = await sql`SELECT COUNT(*)::int as count FROM "users"`;
    if (existingUsers[0].count === 0) {
      const hashPassword = (pw: string) => bcrypt.hashSync(pw, 12);
      const now = new Date().toISOString();

      await sql`INSERT INTO "users" ("id", "name", "email", "password", "role", "created_at") VALUES
        ('usr-admin', 'Admin User', 'admin@unilinkai.com', ${hashPassword("password")}, 'superadmin', ${now}),
        ('usr-agent', 'Sarah Mitchell', 'agent@unilinkai.com', ${hashPassword("password")}, 'agent', ${now}),
        ('usr-student', 'Alex Johnson', 'student@unilinkai.com', ${hashPassword("password")}, 'student', ${now})`;
      console.log("Seeded 3 auth users (admin/agent/student) with password: password");
    }

    await sql`INSERT INTO "students" ("id", "name", "email", "phone", "nationality", "passport_number", "education_level", "created_at", "date_of_birth", "gender", "current_institution", "gpa", "year_of_completion", "english_test_type", "english_test_score", "country_preferences", "course_preferences", "budget", "intake_preference", "additional_notes", "title", "passport_expiry", "country_of_residence", "address", "city", "emergency_contact_name", "emergency_contact_phone", "whatsapp_number", "native_language", "education_history", "english_test_details", "standardized_tests", "work_experience", "financial_info", "visa_history", "preferred_institutions", "accommodation_preference", "post_study_work_interest", "consent_given", "status") VALUES
    ('stu-001', 'Priya Sharma', 'student@unilinkai.com', '+91 98765 43210', 'Indian', 'A1234567', 'Master''s', '2024-01-15', '2001-05-12', 'Female', 'Delhi University', '8.5', '2025', 'IELTS', '7.5', 'Australia,United Kingdom', 'Computer Science,Data Science', '3000000', 'Jul 2026', '', 'Ms', '2030-05-12', 'India', '12 MG Road, Sector 5', 'Mumbai', 'Raj Sharma', '+91 98765 43211', '+91 98765 43210', 'Hindi', '[{"institution":"Delhi University","country":"India","degree":"B.Tech","fieldOfStudy":"Computer Science","startYear":"2019","endYear":"2023","gpa":"8.5","gradingScale":"cgpa-10","stillEnrolled":false}]', '[{"testType":"IELTS","overallScore":"7.5","listening":"7.0","reading":"8.0","writing":"6.5","speaking":"7.5","testDate":"2024-10-15","trfNumber":"IELTS123456"}]', '[]', '[{"employer":"TCS","jobTitle":"Software Engineer","industry":"IT","startDate":"2023-06-01","endDate":"","isCurrent":true,"employmentType":"full-time","description":"Full stack development"}]', '{"budget":"3000000","budgetCurrency":"INR","fundingSource":"family","bankStatementAvailable":true}', '{"hasVisaRefusals":false,"visaRefusalDetails":"","hasStudiedAbroad":false,"studyAbroadDetails":"","currentVisaStatus":"None"}', 'University of Melbourne', 'on-campus', 'yes', 'yes', 'complete'),
    ('stu-002', 'Rohit Gupta', 'rohit.gupta@email.com', '+91 87654 32109', 'Indian', 'B2345678', 'Postgraduate', '2024-01-20', '1999-11-03', 'Male', 'IIT Bombay', '9.0', '2024', 'IELTS', '7.0', 'Australia', 'Business & Management', '4000000', 'Feb 2026', '', 'Mr', '2029-11-03', 'India', '45 Andheri Kurla Road', 'Mumbai', 'Sunita Gupta', '+91 87654 32110', '+91 87654 32109', 'Hindi', '[{"institution":"IIT Bombay","country":"India","degree":"B.Tech","fieldOfStudy":"Mechanical Engineering","startYear":"2017","endYear":"2021","gpa":"9.0","gradingScale":"cgpa-10","stillEnrolled":false}]', '[{"testType":"IELTS","overallScore":"7.0","listening":"6.5","reading":"7.5","writing":"6.5","speaking":"7.0","testDate":"2024-08-20","trfNumber":""}]', '[]', '[]', '{"budget":"4000000","budgetCurrency":"INR","fundingSource":"self","bankStatementAvailable":true}', '{"hasVisaRefusals":false,"visaRefusalDetails":"","hasStudiedAbroad":false,"studyAbroadDetails":"","currentVisaStatus":"None"}', 'Deakin University', 'off-campus', 'yes', 'yes', 'complete'),
    ('stu-003', 'Anita Singh', 'anita.singh@email.com', '+91 76543 21098', 'Indian', 'C3456789', 'Undergraduate', '2024-02-01', '2002-03-18', 'Female', 'Mumbai University', '7.8', '2026', 'TOEFL', '95', 'Australia,New Zealand', 'Computer Science & IT', '2500000', 'Jul 2026', '', 'Ms', '2031-03-18', 'India', '78 Bandra West', 'Mumbai', 'Vikram Singh', '+91 76543 21099', '+91 76543 21098', 'Hindi', '[{"institution":"Mumbai University","country":"India","degree":"B.Sc","fieldOfStudy":"Computer Science","startYear":"2020","endYear":"2024","gpa":"7.8","gradingScale":"percentage","stillEnrolled":false}]', '[{"testType":"TOEFL","overallScore":"95","listening":"","reading":"","writing":"","speaking":"","testDate":"2024-06-10","trfNumber":""}]', '[]', '[]', '{"budget":"2500000","budgetCurrency":"INR","fundingSource":"loan","bankStatementAvailable":false}', '{"hasVisaRefusals":false,"visaRefusalDetails":"","hasStudiedAbroad":false,"studyAbroadDetails":"","currentVisaStatus":"None"}', '', 'homestay', 'yes', 'yes', 'complete'),
    ('stu-004', 'Kavya Nair', 'kavya.nair@email.com', '+91 65432 10987', 'Indian', 'D4567890', 'Postgraduate', '2024-02-10', '2000-08-25', 'Female', 'Kerala University', '8.2', '2024', 'IELTS', '7.0', 'Australia', 'Computer Science & IT', '3500000', 'Feb 2026', '', 'Ms', '2030-08-25', 'India', '12 Technopark Road', 'Thiruvananthapuram', 'Suresh Nair', '+91 65432 10988', '+91 65432 10987', 'Malayalam', '[{"institution":"Kerala University","country":"India","degree":"BCA","fieldOfStudy":"Computer Applications","startYear":"2018","endYear":"2021","gpa":"8.2","gradingScale":"cgpa-10","stillEnrolled":false}]', '[{"testType":"IELTS","overallScore":"7.0","listening":"6.5","reading":"7.0","writing":"6.5","speaking":"7.0","testDate":"2024-07-05","trfNumber":""}]', '[]', '[{"employer":"Wipro","jobTitle":"Data Analyst","industry":"IT","startDate":"2021-08-01","endDate":"2024-01-31","isCurrent":false,"employmentType":"full-time","description":"Data analysis and visualization"}]', '{"budget":"3500000","budgetCurrency":"INR","fundingSource":"family","bankStatementAvailable":true}', '{"hasVisaRefusals":false,"visaRefusalDetails":"","hasStudiedAbroad":false,"studyAbroadDetails":"","currentVisaStatus":"None"}', 'UTS', 'on-campus', 'yes', 'yes', 'complete'),
    ('stu-005', 'Amit Kumar', 'amit.kumar@email.com', '+91 54321 09876', 'Indian', 'E5678901', 'Postgraduate', '2024-02-15', '1997-01-30', 'Male', 'IIT Delhi', '9.2', '2023', 'IELTS', '8.0', 'Australia,United Kingdom', 'Engineering', '5000000', 'Jul 2026', 'Research focus on AI', 'Mr', '2028-01-30', 'India', '56 Hauz Khas', 'New Delhi', 'Meena Kumar', '+91 54321 09877', '+91 54321 09876', 'Hindi', '[{"institution":"IIT Delhi","country":"India","degree":"M.Tech","fieldOfStudy":"Artificial Intelligence","startYear":"2021","endYear":"2023","gpa":"9.2","gradingScale":"cgpa-10","stillEnrolled":false}]', '[{"testType":"IELTS","overallScore":"8.0","listening":"7.5","reading":"8.5","writing":"7.5","speaking":"8.0","testDate":"2024-05-20","trfNumber":"IELTS789012"}]', '[]', '[]', '{"budget":"5000000","budgetCurrency":"INR","fundingSource":"scholarship","bankStatementAvailable":true}', '{"hasVisaRefusals":false,"visaRefusalDetails":"","hasStudiedAbroad":false,"studyAbroadDetails":"","currentVisaStatus":"None"}', 'Monash University', 'no-preference', 'yes', 'yes', 'complete'),
    ('stu-006', 'Sarah Johnson', 'sarah.j@email.com', '+44 7911 123456', 'British', 'F6789012', 'Postgraduate', '2024-03-01', '1999-07-14', 'Female', 'University of Manchester', '3.8', '2024', 'None', '', 'Australia', 'Finance & Economics', '3000000', 'Feb 2026', '', 'Ms', '2029-07-14', 'United Kingdom', '8 Oxford Road', 'Manchester', 'Tom Johnson', '+44 7911 123457', '+44 7911 123456', 'English', '[{"institution":"University of Manchester","country":"United Kingdom","degree":"BSc","fieldOfStudy":"Economics","startYear":"2017","endYear":"2020","gpa":"3.8","gradingScale":"gpa-4","stillEnrolled":false}]', '[]', '[]', '[{"employer":"Deloitte","jobTitle":"Junior Analyst","industry":"Finance","startDate":"2020-09-01","endDate":"2024-02-28","isCurrent":false,"employmentType":"full-time","description":"Financial analysis and consulting"}]', '{"budget":"3000000","budgetCurrency":"GBP","fundingSource":"self","bankStatementAvailable":true}', '{"hasVisaRefusals":false,"visaRefusalDetails":"","hasStudiedAbroad":false,"studyAbroadDetails":"","currentVisaStatus":"None"}', 'University of Sydney', 'off-campus', 'no', 'yes', 'complete'),
    ('stu-007', 'Wei Zhang', 'wei.zhang@email.com', '+86 138 1234 5678', 'Chinese', 'G7890123', 'Undergraduate', '2024-03-05', '2001-09-22', 'Male', 'Peking University', '3.5', '2025', 'IELTS', '6.5', 'Australia,New Zealand', 'Engineering', '2800000', 'Jul 2026', '', 'Mr', '2030-09-22', 'China', '234 Zhongguancun', 'Beijing', 'Li Zhang', '+86 138 1234 5679', '+86 138 1234 5678', 'Mandarin', '[{"institution":"Peking University","country":"China","degree":"BEng","fieldOfStudy":"Civil Engineering","startYear":"2019","endYear":"2023","gpa":"3.5","gradingScale":"gpa-4","stillEnrolled":false}]', '[{"testType":"IELTS","overallScore":"6.5","listening":"6.0","reading":"7.0","writing":"6.0","speaking":"6.5","testDate":"2024-04-15","trfNumber":""}]', '[]', '[]', '{"budget":"2800000","budgetCurrency":"INR","fundingSource":"family","bankStatementAvailable":true}', '{"hasVisaRefusals":false,"visaRefusalDetails":"","hasStudiedAbroad":false,"studyAbroadDetails":"","currentVisaStatus":"None"}', '', 'on-campus', 'yes', 'yes', 'complete'),
    ('stu-008', 'Fatima Al-Rashid', 'fatima.r@email.com', '+971 50 123 4567', 'Emirati', 'H8901234', 'Postgraduate', '2024-03-10', '2000-04-08', 'Female', 'American University of Sharjah', '3.6', '2024', 'IELTS', '6.5', 'United Kingdom', 'Health Sciences', '6000000', 'Oct 2026', '', 'Ms', '2029-04-08', 'United Arab Emirates', '12 Al Nahda Street', 'Dubai', 'Ahmed Al-Rashid', '+971 50 123 4568', '+971 50 123 4567', 'Arabic', '[{"institution":"American University of Sharjah","country":"United Arab Emirates","degree":"BSc","fieldOfStudy":"Public Health","startYear":"2018","endYear":"2022","gpa":"3.6","gradingScale":"gpa-4","stillEnrolled":false}]', '[{"testType":"IELTS","overallScore":"6.5","listening":"6.0","reading":"7.0","writing":"6.0","speaking":"6.5","testDate":"2024-03-01","trfNumber":""}]', '[]', '[]', '{"budget":"6000000","budgetCurrency":"AED","fundingSource":"family","bankStatementAvailable":true}', '{"hasVisaRefusals":false,"visaRefusalDetails":"","hasStudiedAbroad":false,"studyAbroadDetails":"","currentVisaStatus":"None"}', 'University of Queensland', 'on-campus', 'no', 'yes', 'complete'),
    ('stu-009', 'Carlos Mendez', 'carlos.m@email.com', '+52 55 1234 5678', 'Mexican', 'I9012345', 'Undergraduate', '2024-03-15', '2002-12-01', 'Male', 'UNAM', '8.0', '2026', 'TOEFL', '88', 'Canada,United States', 'Business & Management', '2000000', 'Feb 2026', '', 'Mr', '2031-12-01', 'Mexico', '45 Reforma Avenue', 'Mexico City', 'Maria Mendez', '+52 55 1234 5679', '+52 55 1234 5678', 'Spanish', '[{"institution":"UNAM","country":"Mexico","degree":"Licenciatura","fieldOfStudy":"Business Administration","startYear":"2020","endYear":"2024","gpa":"8.0","gradingScale":"percentage","stillEnrolled":false}]', '[{"testType":"TOEFL","overallScore":"88","listening":"","reading":"","writing":"","speaking":"","testDate":"2024-02-15","trfNumber":""}]', '[]', '[]', '{"budget":"2000000","budgetCurrency":"INR","fundingSource":"self","bankStatementAvailable":false}', '{"hasVisaRefusals":false,"visaRefusalDetails":"","hasStudiedAbroad":false,"studyAbroadDetails":"","currentVisaStatus":"None"}', '', 'no-preference', 'undecided', 'yes', 'complete'),
    ('stu-010', 'Aisha Patel', 'aisha.p@email.com', '+91 43210 98765', 'Indian', 'J0123456', 'Postgraduate', '2024-03-20', '2000-06-17', 'Female', 'Ahmedabad University', '8.8', '2024', 'IELTS', '7.5', 'Australia,United Kingdom', 'Computer Science & IT', '4000000', 'Jul 2026', '', 'Ms', '2030-06-17', 'India', '78 CG Road', 'Ahmedabad', 'Kiran Patel', '+91 43210 98766', '+91 43210 98765', 'Gujarati', '[{"institution":"Ahmedabad University","country":"India","degree":"BCA","fieldOfStudy":"Computer Applications","startYear":"2018","endYear":"2021","gpa":"8.8","gradingScale":"cgpa-10","stillEnrolled":false}]', '[{"testType":"IELTS","overallScore":"7.5","listening":"7.0","reading":"8.0","writing":"7.0","speaking":"7.5","testDate":"2024-09-10","trfNumber":"IELTS345678"}]', '[]', '[{"employer":"Infosys","jobTitle":"Software Developer","industry":"IT","startDate":"2021-07-01","endDate":"","isCurrent":true,"employmentType":"full-time","description":"Full stack development and cloud architecture"}]', '{"budget":"4000000","budgetCurrency":"INR","fundingSource":"self","bankStatementAvailable":true}', '{"hasVisaRefusals":false,"visaRefusalDetails":"","hasStudiedAbroad":false,"studyAbroadDetails":"","currentVisaStatus":"None"}', 'University of Adelaide', 'on-campus', 'yes', 'yes', 'complete'),
    ('stu-011', 'David Kim', 'david.kim@email.com', '+82 10 1234 5678', 'South Korean', 'K1234567', 'Postgraduate', '2024-04-01', '1996-10-05', 'Male', 'Seoul National University', '3.9', '2023', 'TOEFL', '102', 'Australia,United Kingdom', 'Computer Science & IT,Engineering', '5000000', 'Feb 2026', 'AI research background', 'Mr', '2028-10-05', 'South Korea', '100 Gwanak-ro', 'Seoul', 'Ji-Hye Kim', '+82 10 1234 5679', '+82 10 1234 5678', 'Korean', '[{"institution":"Seoul National University","country":"South Korea","degree":"MS","fieldOfStudy":"Computer Science","startYear":"2019","endYear":"2021","gpa":"3.9","gradingScale":"gpa-4","stillEnrolled":false}]', '[{"testType":"TOEFL","overallScore":"102","listening":"","reading":"","writing":"","speaking":"","testDate":"2024-01-20","trfNumber":""}]', '[{"testType":"GRE","score":"325","breakdown":"V160 Q165 AWA4.5","testDate":"2023-12-10"}]', '[{"employer":"Samsung SDS","jobTitle":"AI Research Engineer","industry":"IT","startDate":"2021-03-01","endDate":"","isCurrent":true,"employmentType":"full-time","description":"Machine learning model development"}]', '{"budget":"5000000","budgetCurrency":"KRW","fundingSource":"employer","bankStatementAvailable":true}', '{"hasVisaRefusals":false,"visaRefusalDetails":"","hasStudiedAbroad":false,"studyAbroadDetails":"","currentVisaStatus":"None"}', 'Monash University', 'off-campus', 'yes', 'yes', 'complete'),
    ('stu-012', 'Neha Verma', 'neha.v@email.com', '+91 32109 87654', 'Indian', 'L2345678', 'Undergraduate', '2024-04-05', '2003-02-28', 'Female', 'Lucknow University', '7.5', '2026', 'PTE', '62', 'New Zealand,Australia', 'Health Sciences', '2000000', 'Oct 2026', '', 'Ms', '2032-02-28', 'India', '34 Hazratganj', 'Lucknow', 'Deepak Verma', '+91 32109 87655', '+91 32109 87654', 'Hindi', '[{"institution":"Lucknow University","country":"India","degree":"BSc","fieldOfStudy":"Nursing","startYear":"2021","endYear":"2024","gpa":"7.5","gradingScale":"percentage","stillEnrolled":false}]', '[{"testType":"PTE","overallScore":"62","listening":"","reading":"","writing":"","speaking":"","testDate":"2024-03-15","trfNumber":""}]', '[]', '[{"employer":"Medanta Hospital","jobTitle":"Nurse","industry":"Healthcare","startDate":"2024-01-01","endDate":"","isCurrent":true,"employmentType":"full-time","description":"Patient care in general ward"}]', '{"budget":"2000000","budgetCurrency":"INR","fundingSource":"family","bankStatementAvailable":true}', '{"hasVisaRefusals":false,"visaRefusalDetails":"","hasStudiedAbroad":false,"studyAbroadDetails":"","currentVisaStatus":"None"}', 'Curtin University', 'homestay', 'yes', 'yes', 'complete')`;
  console.log("Inserted 12 students");

  await sql`INSERT INTO "applications" ("id", "student_id", "university", "course", "stage", "status", "accommodation", "insurance", "submitted_at", "updated_at") VALUES
    ('app-001', 'stu-001', 'University of Melbourne', 'Master of Computer Science', 'visa_processing', 'active', 'yes', 'yes', '2024-01-20', '2024-03-15'),
    ('app-002', 'stu-002', 'Deakin University', 'MBA', 'offer_received', 'active', 'yes', 'no', '2024-01-25', '2024-03-10'),
    ('app-003', 'stu-003', 'RMIT University', 'Bachelor of IT', 'application_submitted', 'active', 'no', 'yes', '2024-02-05', '2024-02-05'),
    ('app-004', 'stu-004', 'UTS', 'Master of Data Science', 'visa_approved', 'completed', 'yes', 'yes', '2024-02-15', '2024-04-01'),
    ('app-005', 'stu-005', 'Monash University', 'PhD in Engineering', 'visa_processing', 'active', 'no', 'yes', '2024-02-20', '2024-03-20'),
    ('app-006', 'stu-006', 'University of Sydney', 'Master of Finance', 'offer_received', 'active', 'yes', 'no', '2024-03-05', '2024-03-25'),
    ('app-007', 'stu-007', 'UNSW', 'Bachelor of Engineering', 'application_submitted', 'active', 'yes', 'na', '2024-03-10', '2024-03-10'),
    ('app-008', 'stu-008', 'University of Queensland', 'Master of Public Health', 'lead', 'active', 'no', 'na', '2024-03-15', '2024-03-15'),
    ('app-009', 'stu-009', 'Macquarie University', 'Bachelor of Business', 'lead', 'active', null, null, '2024-03-20', '2024-03-20'),
    ('app-010', 'stu-010', 'University of Adelaide', 'Master of AI', 'visa_approved', 'completed', 'yes', 'yes', '2024-03-25', '2024-04-10'),
    ('app-011', 'stu-011', 'Flinders University', 'PhD in Computer Science', 'offer_received', 'active', 'no', 'no', '2024-04-05', '2024-04-15'),
    ('app-012', 'stu-012', 'Curtin University', 'Master of Nursing', 'application_submitted', 'active', 'yes', 'na', '2024-04-10', '2024-04-10'),
    ('app-013', 'stu-001', 'RMIT University', 'Master of IT', 'lead', 'active', 'no', 'na', '2024-04-01', '2024-04-01'),
    ('app-014', 'stu-003', 'Swinburne University', 'Bachelor of Design', 'visa_processing', 'active', 'yes', 'yes', '2024-02-10', '2024-03-28'),
    ('app-015', 'stu-005', 'La Trobe University', 'Master of Data Science', 'visa_approved', 'completed', 'no', 'yes', '2024-01-15', '2024-03-01')`;
  console.log("Inserted 15 applications");

  await sql`INSERT INTO "documents" ("id", "student_id", "application_id", "type", "file_name", "uploaded_at", "verified") VALUES
    ('doc-001', 'stu-001', 'app-001', 'passport', 'priya_passport.pdf', '2024-01-16', true),
    ('doc-002', 'stu-001', 'app-001', 'financial', 'priya_bank_statement.pdf', '2024-01-17', true),
    ('doc-003', 'stu-001', 'app-001', 'scores', 'priya_ielts_score.pdf', '2024-01-18', true),
    ('doc-004', 'stu-002', 'app-002', 'passport', 'rohit_passport.pdf', '2024-01-26', true),
    ('doc-005', 'stu-002', 'app-002', 'financial', 'rohit_sponsor_letter.pdf', '2024-01-27', false),
    ('doc-006', 'stu-003', 'app-003', 'passport', 'anita_passport.pdf', '2024-02-06', true),
    ('doc-007', 'stu-004', 'app-004', 'passport', 'kavya_passport.pdf', '2024-02-16', true),
    ('doc-008', 'stu-004', 'app-004', 'financial', 'kavya_bank_statement.pdf', '2024-02-17', true),
    ('doc-009', 'stu-004', 'app-004', 'scores', 'kavya_gre_score.pdf', '2024-02-18', true),
    ('doc-010', 'stu-005', 'app-005', 'passport', 'amit_passport.pdf', '2024-02-21', true),
    ('doc-011', 'stu-008', 'app-008', 'passport', 'fatima_passport.pdf', '2024-03-16', false),
    ('doc-012', 'stu-010', 'app-010', 'passport', 'aisha_passport.pdf', '2024-03-26', true),
    ('doc-013', 'stu-010', 'app-010', 'financial', 'aisha_scholarship_letter.pdf', '2024-03-27', true)`;
  console.log("Inserted 13 documents");

  await sql`INSERT INTO "activity_logs" ("id", "student_id", "application_id", "action", "note", "performed_by", "created_at") VALUES
    ('act-001', 'stu-001', 'app-001', 'stage_changed', 'Moved to visa processing', 'Sarah Mitchell', '2024-03-15'),
    ('act-002', 'stu-002', 'app-002', 'document_uploaded', 'Financial sponsor letter uploaded', 'Agent', '2024-01-27'),
    ('act-003', 'stu-003', 'app-003', 'application_created', 'Application submitted to RMIT', 'Sarah Mitchell', '2024-02-05'),
    ('act-004', 'stu-004', 'app-004', 'stage_changed', 'Visa approved! Student can proceed.', 'Sarah Mitchell', '2024-04-01'),
    ('act-005', 'stu-005', 'app-005', 'stage_changed', 'Moved to visa processing', 'Sarah Mitchell', '2024-03-20'),
    ('act-006', 'stu-008', 'app-008', 'document_requested', 'Requested passport copy from student', 'Sarah Mitchell', '2024-03-16'),
    ('act-007', 'stu-010', 'app-010', 'stage_changed', 'Visa approved!', 'Sarah Mitchell', '2024-04-10'),
    ('act-008', 'stu-011', 'app-011', 'offer_received', 'Offer letter received from Flinders', 'System', '2024-04-15')`;
  console.log("Inserted 8 activity logs");
  }

  {
    const now = new Date().toISOString();

    await sql`DELETE FROM "discussion_replies"`;
    await sql`DELETE FROM "discussions"`;
    await sql`DELETE FROM "notifications"`;
    await sql`DELETE FROM "resources"`;
    await sql`DELETE FROM "schedules"`;
    await sql`DELETE FROM "grades"`;
    await sql`DELETE FROM "quiz_attempts"`;
    await sql`DELETE FROM "quiz_questions"`;
    await sql`DELETE FROM "quizzes"`;
    await sql`DELETE FROM "assignments"`;
    await sql`DELETE FROM "enrollments"`;
    await sql`DELETE FROM "lessons"`;
    await sql`DELETE FROM "modules"`;
    await sql`DELETE FROM "course_semesters"`;
    await sql`DELETE FROM "semesters"`;
    await sql`DELETE FROM "announcements"`;
    await sql`DELETE FROM "courses"`;
    console.log("Cleared existing LMS data");

    await sql`INSERT INTO "courses" ("id", "title", "description", "duration", "status", "created_at", "updated_at") VALUES
      ('crs-001', 'Academic English & IELTS Prep', 'Intensive English language course covering all four IELTS skills: listening, reading, writing, and speaking. Designed for students preparing for university admission.', '12 weeks', 'published', ${now}, ${now}),
      ('crs-002', 'Foundations of Computer Science', 'Introduction to computational thinking, algorithms, data structures, and programming fundamentals using Python.', '12 weeks', 'published', ${now}, ${now}),
      ('crs-003', 'Business Mathematics & Statistics', 'Core mathematical concepts for business: algebra, calculus, probability, and statistical analysis with real-world applications.', '12 weeks', 'published', ${now}, ${now}),
      ('crs-004', 'Indian Culture & Society', 'Understanding Indian history, culture, social structures, and contemporary issues relevant to international students.', '8 weeks', 'published', ${now}, ${now}),
      ('crs-005', 'Study Skills & Critical Thinking', 'Academic skills including research methodology, essay writing, critical analysis, and time management.', '8 weeks', 'published', ${now}, ${now})`;
    console.log("Seeded 5 courses");

    await sql`INSERT INTO "semesters" ("id", "title", "description", "start_date", "end_date", "is_active", "order_index", "created_at") VALUES
      ('sem-001', 'Semester 1 - Foundation', 'Core foundation courses for the India Pathway Program', '2026-01-15', '2026-05-30', true, 1, ${now}),
      ('sem-002', 'Semester 2 - Advanced', 'Advanced courses and specialisation tracks', '2026-07-01', '2026-11-30', false, 2, ${now})`;
    console.log("Seeded 2 semesters");

    await sql`INSERT INTO "course_semesters" ("id", "course_id", "semester_id", "credits", "is_required", "order_index") VALUES
      ('cs-001', 'crs-001', 'sem-001', 4, true, 1),
      ('cs-002', 'crs-002', 'sem-001', 4, true, 2),
      ('cs-003', 'crs-003', 'sem-001', 3, true, 3),
      ('cs-004', 'crs-004', 'sem-001', 2, false, 4),
      ('cs-005', 'crs-005', 'sem-001', 2, false, 5)`;
    console.log("Seeded course-semester links");

    await sql`INSERT INTO "modules" ("id", "course_id", "title", "description", "order_index", "created_at", "updated_at") VALUES
      ('mod-001', 'crs-001', 'IELTS Listening & Reading', 'Master listening comprehension and reading strategies for IELTS', 1, ${now}, ${now}),
      ('mod-002', 'crs-001', 'IELTS Writing Task 1 & 2', 'Academic and general writing techniques for high band scores', 2, ${now}, ${now}),
      ('mod-003', 'crs-001', 'IELTS Speaking & Fluency', 'Build confidence and fluency for the speaking test', 3, ${now}, ${now}),
      ('mod-004', 'crs-002', 'Introduction to Algorithms', 'Understanding algorithmic thinking, pseudocode, and complexity', 1, ${now}, ${now}),
      ('mod-005', 'crs-002', 'Python Programming Basics', 'Variables, loops, functions, and basic data structures in Python', 2, ${now}, ${now}),
      ('mod-006', 'crs-002', 'Data Structures & OOP', 'Arrays, linked lists, stacks, queues, and object-oriented programming', 3, ${now}, ${now}),
      ('mod-007', 'crs-003', 'Algebra for Business', 'Linear equations, matrices, and business applications', 1, ${now}, ${now}),
      ('mod-008', 'crs-003', 'Statistics & Probability', 'Descriptive statistics, probability distributions, and hypothesis testing', 2, ${now}, ${now}),
      ('mod-009', 'crs-004', 'History of India', 'From ancient civilisations to modern India', 1, ${now}, ${now}),
      ('mod-010', 'crs-005', 'Academic Writing Fundamentals', 'Essay structure, referencing, and academic integrity', 1, ${now}, ${now})`;
    console.log("Seeded 10 modules");

    await sql`INSERT INTO "lessons" ("id", "module_id", "title", "content_type", "content", "duration_minutes", "order_index", "is_published", "created_at", "updated_at") VALUES
      ('les-001', 'mod-001', 'Understanding IELTS Listening Format', 'video', 'Overview of the four sections of the IELTS listening test, question types, and scoring criteria.', 45, 1, true, ${now}, ${now}),
      ('les-002', 'mod-001', 'Note-taking Strategies for Listening', 'article', 'Learn effective note-taking techniques to capture key information during the listening test.', 20, 2, true, ${now}, ${now}),
      ('les-003', 'mod-001', 'Reading: Skimming & Scanning', 'video', 'Techniques for quickly identifying main ideas and locating specific information in passages.', 40, 3, true, ${now}, ${now}),
      ('les-004', 'mod-002', 'Writing Task 1: Describing Graphs', 'article', 'How to describe visual data including line graphs, bar charts, and tables with proper academic vocabulary.', 30, 1, true, ${now}, ${now}),
      ('les-005', 'mod-002', 'Writing Task 2: Essay Structure', 'video', 'Introduction, body paragraphs, and conclusion. How to plan and write a band 7+ essay.', 50, 2, true, ${now}, ${now}),
      ('les-006', 'mod-004', 'What is an Algorithm?', 'video', 'Introduction to algorithms: definition, examples, and why they matter in computer science.', 35, 1, true, ${now}, ${now}),
      ('les-007', 'mod-004', 'Pseudocode & Flowcharts', 'article', 'Writing pseudocode and drawing flowcharts to plan solutions before coding.', 25, 2, true, ${now}, ${now}),
      ('les-008', 'mod-004', 'Big O Notation', 'article', 'Understanding time and space complexity to evaluate algorithm efficiency.', 30, 3, true, ${now}, ${now}),
      ('les-009', 'mod-005', 'Python Setup & Hello World', 'video', 'Installing Python, setting up VS Code, and writing your first program.', 20, 1, true, ${now}, ${now}),
      ('les-010', 'mod-005', 'Variables & Data Types', 'article', 'Numbers, strings, booleans, and type conversion in Python.', 25, 2, true, ${now}, ${now}),
      ('les-011', 'mod-005', 'Control Flow: If, For, While', 'video', 'Conditional statements and loops with practical exercises.', 40, 3, true, ${now}, ${now}),
      ('les-012', 'mod-007', 'Linear Equations in Business', 'article', 'Setting up and solving linear equations for pricing, cost, and revenue analysis.', 30, 1, true, ${now}, ${now}),
      ('les-013', 'mod-008', 'Descriptive Statistics', 'video', 'Mean, median, mode, standard deviation, and data visualisation.', 35, 1, true, ${now}, ${now}),
      ('les-014', 'mod-009', 'Ancient Indian Civilisations', 'article', 'Indus Valley, Vedic period, and the foundations of Indian culture.', 25, 1, true, ${now}, ${now}),
      ('les-015', 'mod-010', 'Essay Structure & Paragraphing', 'article', 'How to organise an academic essay with clear topic sentences and evidence.', 20, 1, true, ${now}, ${now})`;
    console.log("Seeded 15 lessons");

    await sql`INSERT INTO "enrollments" ("id", "student_id", "course_id", "enrolled_at", "progress", "status") VALUES
      ('enr-001', 'stu-001', 'crs-001', '2026-01-15', 45, 'active'),
      ('enr-002', 'stu-001', 'crs-002', '2026-01-15', 30, 'active'),
      ('enr-003', 'stu-001', 'crs-003', '2026-01-15', 55, 'active'),
      ('enr-004', 'stu-001', 'crs-004', '2026-01-15', 70, 'active'),
      ('enr-005', 'stu-001', 'crs-005', '2026-01-15', 60, 'active')`;
    console.log("Seeded 5 enrollments");

    await sql`INSERT INTO "assignments" ("id", "course_id", "module_id", "title", "description", "instructions", "due_at", "max_points", "is_published", "created_at", "updated_at") VALUES
      ('asg-001', 'crs-001', 'mod-001', 'IELTS Listening Practice Test 1', 'Complete the full listening practice test under timed conditions.', 'Listen to all 4 sections and answer all questions. Submit your answer sheet as a PDF.', '2026-08-05T23:59:00.000Z', 100, true, ${now}, ${now}),
      ('asg-002', 'crs-001', 'mod-002', 'IELTS Writing Task 2 Essay', 'Write a 250-word essay on the given topic.', 'Choose ONE of the three provided topics. Use formal academic English. Include an introduction, 2-3 body paragraphs, and conclusion.', '2026-08-10T23:59:00.000Z', 100, true, ${now}, ${now}),
      ('asg-003', 'crs-002', 'mod-005', 'Python Assignment: Calculator Program', 'Build a calculator that handles basic arithmetic operations.', 'Create a Python program that takes two numbers and an operator as input and returns the result. Include error handling for division by zero.', '2026-08-08T23:59:00.000Z', 100, true, ${now}, ${now}),
      ('asg-004', 'crs-002', 'mod-006', 'Data Structures Implementation', 'Implement a stack and queue using Python classes.', 'Write Python classes for Stack and Queue with push/pop/enqueue/dequeue methods. Include test cases.', '2026-08-15T23:59:00.000Z', 100, true, ${now}, ${now}),
      ('asg-005', 'crs-003', 'mod-007', 'Business Math Problem Set', 'Solve 10 word problems involving linear equations.', 'Show all working. Each problem must have a clearly labelled equation and solution.', '2026-08-06T23:59:00.000Z', 50, true, ${now}, ${now}),
      ('asg-006', 'crs-005', 'mod-010', 'Academic Essay Draft', 'Write a 1000-word academic essay on a provided topic.', 'Use at least 5 academic references. Follow APA formatting. Submit via the upload portal.', '2026-08-12T23:59:00.000Z', 100, true, ${now}, ${now})`;
    console.log("Seeded 6 assignments");

    await sql`INSERT INTO "quizzes" ("id", "course_id", "module_id", "title", "description", "time_limit_minutes", "max_attempts", "passing_score", "max_score", "is_published", "created_at", "updated_at") VALUES
      ('qz-001', 'crs-001', 'mod-001', 'Listening Comprehension Quiz', 'Test your understanding of IELTS listening strategies.', 20, 3, 60, 10, true, ${now}, ${now}),
      ('qz-002', 'crs-002', 'mod-004', 'Algorithm Basics Quiz', 'Test your knowledge of algorithms, pseudocode, and Big O notation.', 15, 3, 70, 10, true, ${now}, ${now}),
      ('qz-003', 'crs-002', 'mod-005', 'Python Fundamentals Quiz', 'Variables, data types, and control flow in Python.', 20, 3, 60, 10, true, ${now}, ${now}),
      ('qz-004', 'crs-003', 'mod-008', 'Statistics Intro Quiz', 'Basic concepts of descriptive statistics.', 15, 2, 60, 10, true, ${now}, ${now})`;
    console.log("Seeded 4 quizzes");

    await sql`INSERT INTO "quiz_questions" ("id", "quiz_id", "question_type", "question", "options", "correct_answer", "explanation", "points", "order_index", "created_at") VALUES
      ('qq-001', 'qz-001', 'multiple_choice', 'How many sections are in the IELTS listening test?', '["2","3","4","5"]', '4', 'The IELTS listening test has 4 sections.', 1, 0, ${now}),
      ('qq-002', 'qz-001', 'multiple_choice', 'What is the best strategy for IELTS listening note-taking?', '["Write every word","Use abbreviations and keywords","Only write nouns","Skip the notes"]', 'Use abbreviations and keywords', 'Using abbreviations and keywords helps you keep up with the audio.', 1, 1, ${now}),
      ('qq-003', 'qz-001', 'true_false', 'You hear the listening audio only once in the IELTS test.', '["True","False"]', 'True', 'The audio is played only once in the IELTS listening test.', 1, 2, ${now}),
      ('qq-004', 'qz-002', 'multiple_choice', 'What does Big O notation measure?', '["Memory usage","Code readability","Time and space complexity","Number of variables"]', 'Time and space complexity', 'Big O notation describes the upper bound of an algorithm growth rate.', 1, 0, ${now}),
      ('qq-005', 'qz-002', 'multiple_choice', 'Which data structure uses FIFO (First In, First Out)?', '["Stack","Queue","Tree","Graph"]', 'Queue', 'A queue follows FIFO ordering - the first element added is the first removed.', 1, 1, ${now}),
      ('qq-006', 'qz-002', 'true_false', 'Pseudocode can be executed directly by a computer.', '["True","False"]', 'False', 'Pseudocode is a human-readable description and must be translated to actual code.', 1, 2, ${now}),
      ('qq-007', 'qz-003', 'multiple_choice', 'Which keyword defines a function in Python?', '["function","func","def","define"]', 'def', 'Python uses the "def" keyword to define functions.', 1, 0, ${now}),
      ('qq-008', 'qz-003', 'multiple_choice', 'What is the output of: print(type(42))?', '["<class int>","<class str>","<class float>","<class bool>"]', '<class int>', '42 is an integer literal, so type() returns int.', 1, 1, ${now}),
      ('qq-009', 'qz-004', 'multiple_choice', 'What does the mean represent?', '["Most frequent value","Middle value","Average value","Range of values"]', 'Average value', 'The mean is the sum of all values divided by the number of values.', 1, 0, ${now}),
      ('qq-010', 'qz-004', 'multiple_choice', 'Which measure of central tendency is least affected by outliers?', '["Mean","Median","Mode","Range"]', 'Median', 'The median is the middle value and is robust to extreme values.', 1, 1, ${now})`;
    console.log("Seeded 10 quiz questions");

    await sql`INSERT INTO "quiz_attempts" ("id", "quiz_id", "student_id", "score", "max_score", "passed", "started_at", "completed_at", "time_spent_seconds", "created_at") VALUES
      ('qa-001', 'qz-001', 'stu-001', 7, 10, true, '2026-07-20T10:00:00.000Z', '2026-07-20T10:18:00.000Z', 1080, ${now}),
      ('qa-002', 'qz-002', 'stu-001', 8, 10, true, '2026-07-22T14:00:00.000Z', '2026-07-22T14:12:00.000Z', 720, ${now}),
      ('qa-003', 'qz-003', 'stu-001', 6, 10, true, '2026-07-25T09:00:00.000Z', '2026-07-25T09:15:00.000Z', 900, ${now})`;
    console.log("Seeded 3 quiz attempts");

    await sql`INSERT INTO "grades" ("id", "student_id", "course_id", "module_id", "type", "title", "score", "max_score", "weight", "letter_grade", "comments", "graded_at", "graded_by", "created_at") VALUES
      ('grd-001', 'stu-001', 'crs-001', 'mod-001', 'quiz', 'Listening Comprehension Quiz', 7, 10, 15, 'B+', null, '2026-07-20', 'System', ${now}),
      ('grd-002', 'stu-001', 'crs-001', 'mod-002', 'assignment', 'IELTS Writing Task 2 Essay', 82, 100, 25, 'A-', 'Good essay structure. Work on vocabulary range.', '2026-07-28', 'Dr. Mehta', ${now}),
      ('grd-003', 'stu-001', 'crs-002', 'mod-004', 'quiz', 'Algorithm Basics Quiz', 8, 10, 15, 'A', null, '2026-07-22', 'System', ${now}),
      ('grd-004', 'stu-001', 'crs-002', 'mod-005', 'quiz', 'Python Fundamentals Quiz', 6, 10, 10, 'B', 'Review list comprehensions.', '2026-07-25', 'System', ${now}),
      ('grd-005', 'stu-001', 'crs-002', 'mod-005', 'assignment', 'Python Assignment: Calculator Program', 90, 100, 20, 'A', 'Excellent implementation with clean error handling.', '2026-07-27', 'Prof. Kumar', ${now}),
      ('grd-006', 'stu-001', 'crs-003', 'mod-007', 'assignment', 'Business Math Problem Set', 42, 50, 30, 'B+', 'Minor calculation errors on Q7 and Q9.', '2026-07-26', 'Dr. Sharma', ${now}),
      ('grd-007', 'stu-001', 'crs-003', 'mod-008', 'quiz', 'Statistics Intro Quiz', 9, 10, 15, 'A', null, '2026-07-24', 'System', ${now}),
      ('grd-008', 'stu-001', 'crs-004', 'mod-009', 'assignment', 'Indian History Essay', 88, 100, 40, 'A', 'Well-researched with good primary sources.', '2026-07-23', 'Prof. Iyer', ${now}),
      ('grd-009', 'stu-001', 'crs-005', 'mod-010', 'assignment', 'Academic Essay Draft', 78, 100, 35, 'B+', 'Needs stronger thesis statement.', '2026-07-25', 'Dr. Patel', ${now})`;
    console.log("Seeded 9 grades");

    await sql`INSERT INTO "schedules" ("id", "course_id", "title", "description", "day_of_week", "start_time", "end_time", "location", "type", "start_date", "end_date", "is_active", "created_at") VALUES
      ('sch-001', 'crs-001', 'IELTS Listening & Reading Class', 'Interactive session with practice tests', 1, '09:00', '11:00', 'Room 201, Main Campus', 'class', '2026-07-01', '2026-11-30', true, ${now}),
      ('sch-002', 'crs-001', 'IELTS Writing Workshop', 'Peer review and writing practice', 3, '09:00', '11:00', 'Room 201, Main Campus', 'class', '2026-07-01', '2026-11-30', true, ${now}),
      ('sch-003', 'crs-002', 'Computer Science Lecture', 'Theory and live coding sessions', 1, '13:00', '15:00', 'Computer Lab 3', 'class', '2026-07-01', '2026-11-30', true, ${now}),
      ('sch-004', 'crs-002', 'Python Lab Session', 'Hands-on programming exercises', 3, '13:00', '15:00', 'Computer Lab 3', 'lab', '2026-07-01', '2026-11-30', true, ${now}),
      ('sch-005', 'crs-002', 'Data Structures Tutorial', 'Group problem-solving and code reviews', 5, '10:00', '12:00', 'Computer Lab 3', 'tutorial', '2026-07-01', '2026-11-30', true, ${now}),
      ('sch-006', 'crs-003', 'Business Mathematics Lecture', 'Theory and worked examples', 2, '10:00', '12:00', 'Room 105, Main Campus', 'class', '2026-07-01', '2026-11-30', true, ${now}),
      ('sch-007', 'crs-003', 'Statistics Tutorial', 'Practice problems and group work', 4, '10:00', '12:00', 'Room 105, Main Campus', 'tutorial', '2026-07-01', '2026-11-30', true, ${now}),
      ('sch-008', 'crs-004', 'Indian Culture Seminar', 'Discussion-based sessions on Indian society', 2, '14:00', '16:00', 'Seminar Room A', 'class', '2026-07-01', '2026-11-30', true, ${now}),
      ('sch-009', 'crs-005', 'Study Skills Workshop', 'Interactive workshops on academic skills', 4, '14:00', '16:00', 'Seminar Room A', 'class', '2026-07-01', '2026-11-30', true, ${now}),
      ('sch-010', 'crs-001', 'IELTS Speaking Practice', 'One-on-one speaking sessions', 5, '14:00', '16:00', 'Room 302, Main Campus', 'class', '2026-07-01', '2026-11-30', true, ${now})`;
    console.log("Seeded 10 schedule entries");

    await sql`INSERT INTO "discussions" ("id", "course_id", "author_id", "author_name", "author_role", "title", "content", "reply_count", "last_reply_at", "created_at", "updated_at") VALUES
      ('disc-001', 'crs-002', 'usr-student', 'Alex Johnson', 'student', 'How to handle edge cases in Python?', 'I am working on the calculator assignment and struggling with handling invalid input. What are some best practices for input validation in Python?', 2, '2026-07-26T08:00:00.000Z', '2026-07-24T10:30:00.000Z', ${now}),
      ('disc-002', 'crs-001', 'usr-agent', 'Sarah Mitchell', 'instructor', 'IELTS Writing Tips - Band 7+ Strategies', 'Here are some key strategies to achieve a band 7+ in IELTS writing: 1) Plan for 5 minutes before writing. 2) Use a range of vocabulary. 3) Include complex sentence structures. Feel free to ask questions!', 3, '2026-07-27T15:00:00.000Z', '2026-07-20T09:00:00.000Z', ${now}),
      ('disc-003', 'crs-003', 'usr-student', 'Alex Johnson', 'student', 'Clarification on standard deviation formula', 'Can someone explain when to use population vs sample standard deviation? The lecture notes mention both but I am confused about which to use for assignments.', 1, '2026-07-25T14:30:00.000Z', '2026-07-25T11:00:00.000Z', ${now})`;
    console.log("Seeded 3 discussions");

    await sql`INSERT INTO "discussion_replies" ("id", "discussion_id", "author_id", "author_name", "author_role", "content", "is_answer", "created_at") VALUES
      ('dr-001', 'disc-001', 'usr-agent', 'Sarah Mitchell', 'instructor', 'Great question! Use try-except blocks to catch invalid inputs. You can also use isinstance() to check types before processing.', false, '2026-07-25T08:00:00.000Z'),
      ('dr-002', 'disc-001', 'usr-agent', 'Sarah Mitchell', 'instructor', 'Here is a helpful pattern: while True loop with try-except that breaks on valid input. This keeps asking until valid data is received.', true, '2026-07-26T08:00:00.000Z'),
      ('dr-003', 'disc-002', 'usr-student', 'Alex Johnson', 'student', 'Thank you for the tips! When you say complex sentences, do you mean using relative clauses and conditionals?', false, '2026-07-21T10:00:00.000Z'),
      ('dr-004', 'disc-002', 'usr-agent', 'Sarah Mitchell', 'instructor', 'Exactly! Relative clauses, conditionals (2nd and 3rd type), and passive voice are all great ways to show grammatical range.', false, '2026-07-22T09:00:00.000Z'),
      ('dr-005', 'disc-002', 'usr-student', 'Alex Johnson', 'student', 'That makes sense. I will try to incorporate these in my next essay draft.', false, '2026-07-27T15:00:00.000Z'),
      ('dr-006', 'disc-003', 'usr-agent', 'Sarah Mitchell', 'instructor', 'Use population standard deviation when your data represents the entire group. Use sample standard deviation when your data is a subset. For assignments, check if the problem states it is a sample or population.', true, '2026-07-25T14:30:00.000Z')`;
    console.log("Seeded 6 discussion replies");

    await sql`INSERT INTO "resources" ("id", "course_id", "module_id", "title", "description", "type", "url", "is_required", "order_index", "created_at") VALUES
      ('res-001', 'crs-001', 'mod-001', 'IELTS Listening Practice Audio Pack', 'Complete audio collection for all listening practice tests.', 'file', null, true, 1, ${now}),
      ('res-002', 'crs-001', 'mod-002', 'IELTS Writing Band Descriptors', 'Official IELTS writing band score criteria.', 'link', 'https://www.ielts.org/about-ielts/assessment-criteria', true, 2, ${now}),
      ('res-003', 'crs-001', null, 'IELTS Vocabulary Workbook', 'Essential vocabulary lists organised by topic.', 'file', null, false, 3, ${now}),
      ('res-004', 'crs-002', 'mod-004', 'Algorithm Visualisation Tool', 'Interactive tool to see how algorithms execute step by step.', 'link', 'https://visualgo.net', false, 1, ${now}),
      ('res-005', 'crs-002', 'mod-005', 'Python Official Documentation', 'Official Python 3.x documentation and tutorials.', 'link', 'https://docs.python.org/3/tutorial/', false, 2, ${now}),
      ('res-006', 'crs-002', null, 'CS Course Textbook PDF', 'Foundations of Computer Science - Complete textbook.', 'file', null, true, 3, ${now}),
      ('res-007', 'crs-003', 'mod-007', 'Business Math Formula Sheet', 'Quick reference of all formulas covered in the course.', 'file', null, true, 1, ${now}),
      ('res-008', 'crs-003', 'mod-008', 'Statistics Cheat Sheet', 'Visual summary of key statistical concepts.', 'file', null, false, 2, ${now}),
      ('res-009', 'crs-004', 'mod-009', 'Indian History Timeline', 'Interactive timeline of major events in Indian history.', 'link', 'https://en.wikipedia.org/wiki/Timeline_of_Indian_history', false, 1, ${now}),
      ('res-010', 'crs-005', 'mod-010', 'APA Referencing Guide', 'Complete guide to APA 7th edition referencing.', 'link', 'https://apastyle.apa.org', true, 1, ${now})`;
    console.log("Seeded 10 resources");

    await sql`INSERT INTO "notifications" ("id", "user_id", "type", "title", "message", "link", "is_read", "created_at") VALUES
      ('ntf-001', 'usr-student', 'assignment', 'New Assignment Posted', 'IELTS Writing Task 2 Essay is due on Aug 10.', '/student-portal/courses/crs-001', false, '2026-07-25T09:00:00.000Z'),
      ('ntf-002', 'usr-student', 'grade', 'Grade Available', 'Your Python Assignment: Calculator Program has been graded. Score: 90/100', '/student-portal/grades', false, '2026-07-27T16:00:00.000Z'),
      ('ntf-003', 'usr-student', 'discussion', 'New Reply to Your Post', 'Sarah Mitchell replied to your discussion: "How to handle edge cases in Python?"', '/student-portal/discussions/disc-001', false, '2026-07-26T08:00:00.000Z'),
      ('ntf-004', 'usr-student', 'announcement', 'Welcome to Semester 1!', 'Your first semester of the India Pathway Program has begun. Check your courses and schedule.', '/student-portal', true, '2026-07-01T08:00:00.000Z'),
      ('ntf-005', 'usr-student', 'assignment', 'Assignment Due Soon', 'Business Math Problem Set is due in 2 days.', '/student-portal/courses/crs-003', false, '2026-07-28T09:00:00.000Z')`;
    console.log("Seeded 5 notifications");
  }

  console.log("\nSeeding complete!");
  await sql.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
