import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.join(process.cwd(), "unilinkai.db");
const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT NOT NULL UNIQUE,
    email_verified TEXT,
    image TEXT,
    password TEXT,
    role TEXT NOT NULL DEFAULT 'student',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    session_token TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS verification_tokens (
    identifier TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    nationality TEXT NOT NULL,
    passport_number TEXT,
    education_level TEXT NOT NULL,
    created_at TEXT NOT NULL,
    date_of_birth TEXT,
    gender TEXT,
    current_institution TEXT,
    gpa TEXT,
    year_of_completion TEXT,
    english_test_type TEXT,
    english_test_score TEXT,
    country_preferences TEXT,
    course_preferences TEXT,
    budget TEXT,
    intake_preference TEXT,
    additional_notes TEXT,
    title TEXT,
    passport_expiry TEXT,
    country_of_residence TEXT,
    address TEXT,
    city TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    whatsapp_number TEXT,
    native_language TEXT,
    education_history TEXT,
    english_test_details TEXT,
    standardized_tests TEXT,
    work_experience TEXT,
    financial_info TEXT,
    visa_history TEXT,
    preferred_institutions TEXT,
    accommodation_preference TEXT,
    post_study_work_interest TEXT,
    consent_given TEXT,
    status TEXT NOT NULL DEFAULT 'complete'
  );

  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES students(id),
    university TEXT NOT NULL,
    course TEXT NOT NULL,
    stage TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    accommodation TEXT,
    insurance TEXT,
    submitted_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES students(id),
    application_id TEXT REFERENCES applications(id),
    type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    uploaded_at TEXT NOT NULL,
    verified INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES students(id),
    application_id TEXT REFERENCES applications(id),
    action TEXT NOT NULL,
    note TEXT,
    performed_by TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

const existingCount = sqlite.prepare("SELECT COUNT(*) as count FROM students").get() as { count: number };
if (existingCount.count > 0) {
  console.log(`Database already has ${existingCount.count} students. Skipping seed.`);
  sqlite.close();
  process.exit(0);
}

const insertStudent = sqlite.prepare(
  "INSERT INTO students (id, name, email, phone, nationality, passport_number, education_level, created_at, date_of_birth, gender, current_institution, gpa, year_of_completion, english_test_type, english_test_score, country_preferences, course_preferences, budget, intake_preference, additional_notes, title, passport_expiry, country_of_residence, address, city, emergency_contact_name, emergency_contact_phone, whatsapp_number, native_language, education_history, english_test_details, standardized_tests, work_experience, financial_info, visa_history, preferred_institutions, accommodation_preference, post_study_work_interest, consent_given, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
const insertApplication = sqlite.prepare(
  "INSERT INTO applications (id, student_id, university, course, stage, status, accommodation, insurance, submitted_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
const insertDocument = sqlite.prepare(
  "INSERT INTO documents (id, student_id, application_id, type, file_name, uploaded_at, verified) VALUES (?, ?, ?, ?, ?, ?, ?)"
);
const insertActivity = sqlite.prepare(
  "INSERT INTO activity_logs (id, student_id, application_id, action, note, performed_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
);

const students = [
  { id: "stu-001", name: "Priya Sharma", email: "priya.sharma@email.com", phone: "+91 98765 43210", nationality: "Indian", passport: "A1234567", education: "Master's", created: "2024-01-15", dob: "2001-05-12", gender: "Female", institution: "Delhi University", gpa: "8.5", year: "2025", engType: "IELTS", engScore: "7.5", countries: "Australia,United Kingdom", courses: "Computer Science,Data Science", budget: "3000000", intake: "Jul 2026", notes: "", title: "Ms", passportExpiry: "2030-05-12", countryOfResidence: "India", address: "12 MG Road, Sector 5", city: "Mumbai", emergencyName: "Raj Sharma", emergencyPhone: "+91 98765 43211", whatsapp: "+91 98765 43210", nativeLanguage: "Hindi", eduHistory: JSON.stringify([{ institution: "Delhi University", country: "India", degree: "B.Tech", fieldOfStudy: "Computer Science", startYear: "2019", endYear: "2023", gpa: "8.5", gradingScale: "cgpa-10", stillEnrolled: false }]), engDetails: JSON.stringify([{ testType: "IELTS", overallScore: "7.5", listening: "7.0", reading: "8.0", writing: "6.5", speaking: "7.5", testDate: "2024-10-15", trfNumber: "IELTS123456" }]), stdTests: "[]", workExp: JSON.stringify([{ employer: "TCS", jobTitle: "Software Engineer", industry: "IT", startDate: "2023-06-01", endDate: "", isCurrent: true, employmentType: "full-time", description: "Full stack development" }]), finInfo: JSON.stringify({ budget: "3000000", budgetCurrency: "INR", fundingSource: "family", bankStatementAvailable: true }), visaInfo: JSON.stringify({ hasVisaRefusals: false, visaRefusalDetails: "", hasStudiedAbroad: false, studyAbroadDetails: "", currentVisaStatus: "None" }), prefInst: "University of Melbourne", accPref: "on-campus", postWork: "yes", consent: "yes", status: "complete" },
  { id: "stu-002", name: "Rohit Gupta", email: "rohit.gupta@email.com", phone: "+91 87654 32109", nationality: "Indian", passport: "B2345678", education: "Postgraduate", created: "2024-01-20", dob: "1999-11-03", gender: "Male", institution: "IIT Bombay", gpa: "9.0", year: "2024", engType: "IELTS", engScore: "7.0", countries: "Australia", courses: "Business & Management", budget: "4000000", intake: "Feb 2026", notes: "", title: "Mr", passportExpiry: "2029-11-03", countryOfResidence: "India", address: "45 Andheri Kurla Road", city: "Mumbai", emergencyName: "Sunita Gupta", emergencyPhone: "+91 87654 32110", whatsapp: "+91 87654 32109", nativeLanguage: "Hindi", eduHistory: JSON.stringify([{ institution: "IIT Bombay", country: "India", degree: "B.Tech", fieldOfStudy: "Mechanical Engineering", startYear: "2017", endYear: "2021", gpa: "9.0", gradingScale: "cgpa-10", stillEnrolled: false }]), engDetails: JSON.stringify([{ testType: "IELTS", overallScore: "7.0", listening: "6.5", reading: "7.5", writing: "6.5", speaking: "7.0", testDate: "2024-08-20", trfNumber: "" }]), stdTests: "[]", workExp: "[]", finInfo: JSON.stringify({ budget: "4000000", budgetCurrency: "INR", fundingSource: "self", bankStatementAvailable: true }), visaInfo: JSON.stringify({ hasVisaRefusals: false, visaRefusalDetails: "", hasStudiedAbroad: false, studyAbroadDetails: "", currentVisaStatus: "None" }), prefInst: "Deakin University", accPref: "off-campus", postWork: "yes", consent: "yes", status: "complete" },
  { id: "stu-003", name: "Anita Singh", email: "anita.singh@email.com", phone: "+91 76543 21098", nationality: "Indian", passport: "C3456789", education: "Undergraduate", created: "2024-02-01", dob: "2002-03-18", gender: "Female", institution: "Mumbai University", gpa: "7.8", year: "2026", engType: "TOEFL", engScore: "95", countries: "Australia,New Zealand", courses: "Computer Science & IT", budget: "2500000", intake: "Jul 2026", notes: "", title: "Ms", passportExpiry: "2031-03-18", countryOfResidence: "India", address: "78 Bandra West", city: "Mumbai", emergencyName: "Vikram Singh", emergencyPhone: "+91 76543 21099", whatsapp: "+91 76543 21098", nativeLanguage: "Hindi", eduHistory: JSON.stringify([{ institution: "Mumbai University", country: "India", degree: "B.Sc", fieldOfStudy: "Computer Science", startYear: "2020", endYear: "2024", gpa: "7.8", gradingScale: "percentage", stillEnrolled: false }]), engDetails: JSON.stringify([{ testType: "TOEFL", overallScore: "95", listening: "", reading: "", writing: "", speaking: "", testDate: "2024-06-10", trfNumber: "" }]), stdTests: "[]", workExp: "[]", finInfo: JSON.stringify({ budget: "2500000", budgetCurrency: "INR", fundingSource: "loan", bankStatementAvailable: false }), visaInfo: JSON.stringify({ hasVisaRefusals: false, visaRefusalDetails: "", hasStudiedAbroad: false, studyAbroadDetails: "", currentVisaStatus: "None" }), prefInst: "", accPref: "homestay", postWork: "yes", consent: "yes", status: "complete" },
  { id: "stu-004", name: "Kavya Nair", email: "kavya.nair@email.com", phone: "+91 65432 10987", nationality: "Indian", passport: "D4567890", education: "Postgraduate", created: "2024-02-10", dob: "2000-08-25", gender: "Female", institution: "Kerala University", gpa: "8.2", year: "2024", engType: "IELTS", engScore: "7.0", countries: "Australia", courses: "Computer Science & IT", budget: "3500000", intake: "Feb 2026", notes: "", title: "Ms", passportExpiry: "2030-08-25", countryOfResidence: "India", address: "12 Technopark Road", city: "Thiruvananthapuram", emergencyName: "Suresh Nair", emergencyPhone: "+91 65432 10988", whatsapp: "+91 65432 10987", nativeLanguage: "Malayalam", eduHistory: JSON.stringify([{ institution: "Kerala University", country: "India", degree: "BCA", fieldOfStudy: "Computer Applications", startYear: "2018", endYear: "2021", gpa: "8.2", gradingScale: "cgpa-10", stillEnrolled: false }]), engDetails: JSON.stringify([{ testType: "IELTS", overallScore: "7.0", listening: "6.5", reading: "7.0", writing: "6.5", speaking: "7.0", testDate: "2024-07-05", trfNumber: "" }]), stdTests: "[]", workExp: JSON.stringify([{ employer: "Wipro", jobTitle: "Data Analyst", industry: "IT", startDate: "2021-08-01", endDate: "2024-01-31", isCurrent: false, employmentType: "full-time", description: "Data analysis and visualization" }]), finInfo: JSON.stringify({ budget: "3500000", budgetCurrency: "INR", fundingSource: "family", bankStatementAvailable: true }), visaInfo: JSON.stringify({ hasVisaRefusals: false, visaRefusalDetails: "", hasStudiedAbroad: false, studyAbroadDetails: "", currentVisaStatus: "None" }), prefInst: "UTS", accPref: "on-campus", postWork: "yes", consent: "yes", status: "complete" },
  { id: "stu-005", name: "Amit Kumar", email: "amit.kumar@email.com", phone: "+91 54321 09876", nationality: "Indian", passport: "E5678901", education: "Postgraduate", created: "2024-02-15", dob: "1997-01-30", gender: "Male", institution: "IIT Delhi", gpa: "9.2", year: "2023", engType: "IELTS", engScore: "8.0", countries: "Australia,United Kingdom", courses: "Engineering", budget: "5000000", intake: "Jul 2026", notes: "Research focus on AI", title: "Mr", passportExpiry: "2028-01-30", countryOfResidence: "India", address: "56 Hauz Khas", city: "New Delhi", emergencyName: "Meena Kumar", emergencyPhone: "+91 54321 09877", whatsapp: "+91 54321 09876", nativeLanguage: "Hindi", eduHistory: JSON.stringify([{ institution: "IIT Delhi", country: "India", degree: "M.Tech", fieldOfStudy: "Artificial Intelligence", startYear: "2021", endYear: "2023", gpa: "9.2", gradingScale: "cgpa-10", stillEnrolled: false }]), engDetails: JSON.stringify([{ testType: "IELTS", overallScore: "8.0", listening: "7.5", reading: "8.5", writing: "7.5", speaking: "8.0", testDate: "2024-05-20", trfNumber: "IELTS789012" }]), stdTests: "[]", workExp: "[]", finInfo: JSON.stringify({ budget: "5000000", budgetCurrency: "INR", fundingSource: "scholarship", bankStatementAvailable: true }), visaInfo: JSON.stringify({ hasVisaRefusals: false, visaRefusalDetails: "", hasStudiedAbroad: false, studyAbroadDetails: "", currentVisaStatus: "None" }), prefInst: "Monash University", accPref: "no-preference", postWork: "yes", consent: "yes", status: "complete" },
  { id: "stu-006", name: "Sarah Johnson", email: "sarah.j@email.com", phone: "+44 7911 123456", nationality: "British", passport: "F6789012", education: "Postgraduate", created: "2024-03-01", dob: "1999-07-14", gender: "Female", institution: "University of Manchester", gpa: "3.8", year: "2024", engType: "None", engScore: "", countries: "Australia", courses: "Finance & Economics", budget: "3000000", intake: "Feb 2026", notes: "", title: "Ms", passportExpiry: "2029-07-14", countryOfResidence: "United Kingdom", address: "8 Oxford Road", city: "Manchester", emergencyName: "Tom Johnson", emergencyPhone: "+44 7911 123457", whatsapp: "+44 7911 123456", nativeLanguage: "English", eduHistory: JSON.stringify([{ institution: "University of Manchester", country: "United Kingdom", degree: "BSc", fieldOfStudy: "Economics", startYear: "2017", endYear: "2020", gpa: "3.8", gradingScale: "gpa-4", stillEnrolled: false }]), engDetails: "[]", stdTests: "[]", workExp: JSON.stringify([{ employer: "Deloitte", jobTitle: "Junior Analyst", industry: "Finance", startDate: "2020-09-01", endDate: "2024-02-28", isCurrent: false, employmentType: "full-time", description: "Financial analysis and consulting" }]), finInfo: JSON.stringify({ budget: "3000000", budgetCurrency: "GBP", fundingSource: "self", bankStatementAvailable: true }), visaInfo: JSON.stringify({ hasVisaRefusals: false, visaRefusalDetails: "", hasStudiedAbroad: false, studyAbroadDetails: "", currentVisaStatus: "None" }), prefInst: "University of Sydney", accPref: "off-campus", postWork: "no", consent: "yes", status: "complete" },
  { id: "stu-007", name: "Wei Zhang", email: "wei.zhang@email.com", phone: "+86 138 1234 5678", nationality: "Chinese", passport: "G7890123", education: "Undergraduate", created: "2024-03-05", dob: "2001-09-22", gender: "Male", institution: "Peking University", gpa: "3.5", year: "2025", engType: "IELTS", engScore: "6.5", countries: "Australia,New Zealand", courses: "Engineering", budget: "2800000", intake: "Jul 2026", notes: "", title: "Mr", passportExpiry: "2030-09-22", countryOfResidence: "China", address: "234 Zhongguancun", city: "Beijing", emergencyName: "Li Zhang", emergencyPhone: "+86 138 1234 5679", whatsapp: "+86 138 1234 5678", nativeLanguage: "Mandarin", eduHistory: JSON.stringify([{ institution: "Peking University", country: "China", degree: "BEng", fieldOfStudy: "Civil Engineering", startYear: "2019", endYear: "2023", gpa: "3.5", gradingScale: "gpa-4", stillEnrolled: false }]), engDetails: JSON.stringify([{ testType: "IELTS", overallScore: "6.5", listening: "6.0", reading: "7.0", writing: "6.0", speaking: "6.5", testDate: "2024-04-15", trfNumber: "" }]), stdTests: "[]", workExp: "[]", finInfo: JSON.stringify({ budget: "2800000", budgetCurrency: "INR", fundingSource: "family", bankStatementAvailable: true }), visaInfo: JSON.stringify({ hasVisaRefusals: false, visaRefusalDetails: "", hasStudiedAbroad: false, studyAbroadDetails: "", currentVisaStatus: "None" }), prefInst: "", accPref: "on-campus", postWork: "yes", consent: "yes", status: "complete" },
  { id: "stu-008", name: "Fatima Al-Rashid", email: "fatima.r@email.com", phone: "+971 50 123 4567", nationality: "Emirati", passport: "H8901234", education: "Postgraduate", created: "2024-03-10", dob: "2000-04-08", gender: "Female", institution: "American University of Sharjah", gpa: "3.6", year: "2024", engType: "IELTS", engScore: "6.5", countries: "United Kingdom", courses: "Health Sciences", budget: "6000000", intake: "Oct 2026", notes: "", title: "Ms", passportExpiry: "2029-04-08", countryOfResidence: "United Arab Emirates", address: "12 Al Nahda Street", city: "Dubai", emergencyName: "Ahmed Al-Rashid", emergencyPhone: "+971 50 123 4568", whatsapp: "+971 50 123 4567", nativeLanguage: "Arabic", eduHistory: JSON.stringify([{ institution: "American University of Sharjah", country: "United Arab Emirates", degree: "BSc", fieldOfStudy: "Public Health", startYear: "2018", endYear: "2022", gpa: "3.6", gradingScale: "gpa-4", stillEnrolled: false }]), engDetails: JSON.stringify([{ testType: "IELTS", overallScore: "6.5", listening: "6.0", reading: "7.0", writing: "6.0", speaking: "6.5", testDate: "2024-03-01", trfNumber: "" }]), stdTests: "[]", workExp: "[]", finInfo: JSON.stringify({ budget: "6000000", budgetCurrency: "AED", fundingSource: "family", bankStatementAvailable: true }), visaInfo: JSON.stringify({ hasVisaRefusals: false, visaRefusalDetails: "", hasStudiedAbroad: false, studyAbroadDetails: "", currentVisaStatus: "None" }), prefInst: "University of Queensland", accPref: "on-campus", postWork: "no", consent: "yes", status: "complete" },
  { id: "stu-009", name: "Carlos Mendez", email: "carlos.m@email.com", phone: "+52 55 1234 5678", nationality: "Mexican", passport: "I9012345", education: "Undergraduate", created: "2024-03-15", dob: "2002-12-01", gender: "Male", institution: "UNAM", gpa: "8.0", year: "2026", engType: "TOEFL", engScore: "88", countries: "Canada,United States", courses: "Business & Management", budget: "2000000", intake: "Feb 2026", notes: "", title: "Mr", passportExpiry: "2031-12-01", countryOfResidence: "Mexico", address: "45 Reforma Avenue", city: "Mexico City", emergencyName: "Maria Mendez", emergencyPhone: "+52 55 1234 5679", whatsapp: "+52 55 1234 5678", nativeLanguage: "Spanish", eduHistory: JSON.stringify([{ institution: "UNAM", country: "Mexico", degree: "Licenciatura", fieldOfStudy: "Business Administration", startYear: "2020", endYear: "2024", gpa: "8.0", gradingScale: "percentage", stillEnrolled: false }]), engDetails: JSON.stringify([{ testType: "TOEFL", overallScore: "88", listening: "", reading: "", writing: "", speaking: "", testDate: "2024-02-15", trfNumber: "" }]), stdTests: "[]", workExp: "[]", finInfo: JSON.stringify({ budget: "2000000", budgetCurrency: "INR", fundingSource: "self", bankStatementAvailable: false }), visaInfo: JSON.stringify({ hasVisaRefusals: false, visaRefusalDetails: "", hasStudiedAbroad: false, studyAbroadDetails: "", currentVisaStatus: "None" }), prefInst: "", accPref: "no-preference", postWork: "undecided", consent: "yes", status: "complete" },
  { id: "stu-010", name: "Aisha Patel", email: "aisha.p@email.com", phone: "+91 43210 98765", nationality: "Indian", passport: "J0123456", education: "Postgraduate", created: "2024-03-20", dob: "2000-06-17", gender: "Female", institution: "Ahmedabad University", gpa: "8.8", year: "2024", engType: "IELTS", engScore: "7.5", countries: "Australia,United Kingdom", courses: "Computer Science & IT", budget: "4000000", intake: "Jul 2026", notes: "", title: "Ms", passportExpiry: "2030-06-17", countryOfResidence: "India", address: "78 CG Road", city: "Ahmedabad", emergencyName: "Kiran Patel", emergencyPhone: "+91 43210 98766", whatsapp: "+91 43210 98765", nativeLanguage: "Gujarati", eduHistory: JSON.stringify([{ institution: "Ahmedabad University", country: "India", degree: "BCA", fieldOfStudy: "Computer Applications", startYear: "2018", endYear: "2021", gpa: "8.8", gradingScale: "cgpa-10", stillEnrolled: false }]), engDetails: JSON.stringify([{ testType: "IELTS", overallScore: "7.5", listening: "7.0", reading: "8.0", writing: "7.0", speaking: "7.5", testDate: "2024-09-10", trfNumber: "IELTS345678" }]), stdTests: "[]", workExp: JSON.stringify([{ employer: "Infosys", jobTitle: "Software Developer", industry: "IT", startDate: "2021-07-01", endDate: "", isCurrent: true, employmentType: "full-time", description: "Full stack development and cloud architecture" }]), finInfo: JSON.stringify({ budget: "4000000", budgetCurrency: "INR", fundingSource: "self", bankStatementAvailable: true }), visaInfo: JSON.stringify({ hasVisaRefusals: false, visaRefusalDetails: "", hasStudiedAbroad: false, studyAbroadDetails: "", currentVisaStatus: "None" }), prefInst: "University of Adelaide", accPref: "on-campus", postWork: "yes", consent: "yes", status: "complete" },
  { id: "stu-011", name: "David Kim", email: "david.kim@email.com", phone: "+82 10 1234 5678", nationality: "South Korean", passport: "K1234567", education: "Postgraduate", created: "2024-04-01", dob: "1996-10-05", gender: "Male", institution: "Seoul National University", gpa: "3.9", year: "2023", engType: "TOEFL", engScore: "102", countries: "Australia,United Kingdom", courses: "Computer Science & IT,Engineering", budget: "5000000", intake: "Feb 2026", notes: "AI research background", title: "Mr", passportExpiry: "2028-10-05", countryOfResidence: "South Korea", address: "100 Gwanak-ro", city: "Seoul", emergencyName: "Ji-Hye Kim", emergencyPhone: "+82 10 1234 5679", whatsapp: "+82 10 1234 5678", nativeLanguage: "Korean", eduHistory: JSON.stringify([{ institution: "Seoul National University", country: "South Korea", degree: "MS", fieldOfStudy: "Computer Science", startYear: "2019", endYear: "2021", gpa: "3.9", gradingScale: "gpa-4", stillEnrolled: false }]), engDetails: JSON.stringify([{ testType: "TOEFL", overallScore: "102", listening: "", reading: "", writing: "", speaking: "", testDate: "2024-01-20", trfNumber: "" }]), stdTests: JSON.stringify([{ testType: "GRE", score: "325", breakdown: "V160 Q165 AWA4.5", testDate: "2023-12-10" }]), workExp: JSON.stringify([{ employer: "Samsung SDS", jobTitle: "AI Research Engineer", industry: "IT", startDate: "2021-03-01", endDate: "", isCurrent: true, employmentType: "full-time", description: "Machine learning model development" }]), finInfo: JSON.stringify({ budget: "5000000", budgetCurrency: "KRW", fundingSource: "employer", bankStatementAvailable: true }), visaInfo: JSON.stringify({ hasVisaRefusals: false, visaRefusalDetails: "", hasStudiedAbroad: false, studyAbroadDetails: "", currentVisaStatus: "None" }), prefInst: "Monash University", accPref: "off-campus", postWork: "yes", consent: "yes", status: "complete" },
  { id: "stu-012", name: "Neha Verma", email: "neha.v@email.com", phone: "+91 32109 87654", nationality: "Indian", passport: "L2345678", education: "Undergraduate", created: "2024-04-05", dob: "2003-02-28", gender: "Female", institution: "Lucknow University", gpa: "7.5", year: "2026", engType: "PTE", engScore: "62", countries: "New Zealand,Australia", courses: "Health Sciences", budget: "2000000", intake: "Oct 2026", notes: "", title: "Ms", passportExpiry: "2032-02-28", countryOfResidence: "India", address: "34 Hazratganj", city: "Lucknow", emergencyName: "Deepak Verma", emergencyPhone: "+91 32109 87655", whatsapp: "+91 32109 87654", nativeLanguage: "Hindi", eduHistory: JSON.stringify([{ institution: "Lucknow University", country: "India", degree: "BSc", fieldOfStudy: "Nursing", startYear: "2021", endYear: "2024", gpa: "7.5", gradingScale: "percentage", stillEnrolled: false }]), engDetails: JSON.stringify([{ testType: "PTE", overallScore: "62", listening: "", reading: "", writing: "", speaking: "", testDate: "2024-03-15", trfNumber: "" }]), stdTests: "[]", workExp: JSON.stringify([{ employer: "Medanta Hospital", jobTitle: "Nurse", industry: "Healthcare", startDate: "2024-01-01", endDate: "", isCurrent: true, employmentType: "full-time", description: "Patient care in general ward" }]), finInfo: JSON.stringify({ budget: "2000000", budgetCurrency: "INR", fundingSource: "family", bankStatementAvailable: true }), visaInfo: JSON.stringify({ hasVisaRefusals: false, visaRefusalDetails: "", hasStudiedAbroad: false, studyAbroadDetails: "", currentVisaStatus: "None" }), prefInst: "Curtin University", accPref: "homestay", postWork: "yes", consent: "yes", status: "complete" },
];

const applications = [
  { id: "app-001", studentId: "stu-001", university: "University of Melbourne", course: "Master of Computer Science", stage: "visa_processing", status: "active", accommodation: "yes", insurance: "yes", submitted: "2024-01-20", updated: "2024-03-15" },
  { id: "app-002", studentId: "stu-002", university: "Deakin University", course: "MBA", stage: "offer_received", status: "active", accommodation: "yes", insurance: "no", submitted: "2024-01-25", updated: "2024-03-10" },
  { id: "app-003", studentId: "stu-003", university: "RMIT University", course: "Bachelor of IT", stage: "application_submitted", status: "active", accommodation: "no", insurance: "yes", submitted: "2024-02-05", updated: "2024-02-05" },
  { id: "app-004", studentId: "stu-004", university: "UTS", course: "Master of Data Science", stage: "visa_approved", status: "completed", accommodation: "yes", insurance: "yes", submitted: "2024-02-15", updated: "2024-04-01" },
  { id: "app-005", studentId: "stu-005", university: "Monash University", course: "PhD in Engineering", stage: "visa_processing", status: "active", accommodation: "no", insurance: "yes", submitted: "2024-02-20", updated: "2024-03-20" },
  { id: "app-006", studentId: "stu-006", university: "University of Sydney", course: "Master of Finance", stage: "offer_received", status: "active", accommodation: "yes", insurance: "no", submitted: "2024-03-05", updated: "2024-03-25" },
  { id: "app-007", studentId: "stu-007", university: "UNSW", course: "Bachelor of Engineering", stage: "application_submitted", status: "active", accommodation: "yes", insurance: "na", submitted: "2024-03-10", updated: "2024-03-10" },
  { id: "app-008", studentId: "stu-008", university: "University of Queensland", course: "Master of Public Health", stage: "lead", status: "active", accommodation: "no", insurance: "na", submitted: "2024-03-15", updated: "2024-03-15" },
  { id: "app-009", studentId: "stu-009", university: "Macquarie University", course: "Bachelor of Business", stage: "lead", status: "active", accommodation: null, insurance: null, submitted: "2024-03-20", updated: "2024-03-20" },
  { id: "app-010", studentId: "stu-010", university: "University of Adelaide", course: "Master of AI", stage: "visa_approved", status: "completed", accommodation: "yes", insurance: "yes", submitted: "2024-03-25", updated: "2024-04-10" },
  { id: "app-011", studentId: "stu-011", university: "Flinders University", course: "PhD in Computer Science", stage: "offer_received", status: "active", accommodation: "no", insurance: "no", submitted: "2024-04-05", updated: "2024-04-15" },
  { id: "app-012", studentId: "stu-012", university: "Curtin University", course: "Master of Nursing", stage: "application_submitted", status: "active", accommodation: "yes", insurance: "na", submitted: "2024-04-10", updated: "2024-04-10" },
  { id: "app-013", studentId: "stu-001", university: "RMIT University", course: "Master of IT", stage: "lead", status: "active", accommodation: "no", insurance: "na", submitted: "2024-04-01", updated: "2024-04-01" },
  { id: "app-014", studentId: "stu-003", university: "Swinburne University", course: "Bachelor of Design", stage: "visa_processing", status: "active", accommodation: "yes", insurance: "yes", submitted: "2024-02-10", updated: "2024-03-28" },
  { id: "app-015", studentId: "stu-005", university: "La Trobe University", course: "Master of Data Science", stage: "visa_approved", status: "completed", accommodation: "no", insurance: "yes", submitted: "2024-01-15", updated: "2024-03-01" },
];

const documents = [
  { id: "doc-001", studentId: "stu-001", applicationId: "app-001", type: "passport", fileName: "priya_passport.pdf", uploaded: "2024-01-16", verified: 1 },
  { id: "doc-002", studentId: "stu-001", applicationId: "app-001", type: "financial", fileName: "priya_bank_statement.pdf", uploaded: "2024-01-17", verified: 1 },
  { id: "doc-003", studentId: "stu-001", applicationId: "app-001", type: "scores", fileName: "priya_ielts_score.pdf", uploaded: "2024-01-18", verified: 1 },
  { id: "doc-004", studentId: "stu-002", applicationId: "app-002", type: "passport", fileName: "rohit_passport.pdf", uploaded: "2024-01-26", verified: 1 },
  { id: "doc-005", studentId: "stu-002", applicationId: "app-002", type: "financial", fileName: "rohit_sponsor_letter.pdf", uploaded: "2024-01-27", verified: 0 },
  { id: "doc-006", studentId: "stu-003", applicationId: "app-003", type: "passport", fileName: "anita_passport.pdf", uploaded: "2024-02-06", verified: 1 },
  { id: "doc-007", studentId: "stu-004", applicationId: "app-004", type: "passport", fileName: "kavya_passport.pdf", uploaded: "2024-02-16", verified: 1 },
  { id: "doc-008", studentId: "stu-004", applicationId: "app-004", type: "financial", fileName: "kavya_bank_statement.pdf", uploaded: "2024-02-17", verified: 1 },
  { id: "doc-009", studentId: "stu-004", applicationId: "app-004", type: "scores", fileName: "kavya_gre_score.pdf", uploaded: "2024-02-18", verified: 1 },
  { id: "doc-010", studentId: "stu-005", applicationId: "app-005", type: "passport", fileName: "amit_passport.pdf", uploaded: "2024-02-21", verified: 1 },
  { id: "doc-011", studentId: "stu-008", applicationId: "app-008", type: "passport", fileName: "fatima_passport.pdf", uploaded: "2024-03-16", verified: 0 },
  { id: "doc-012", studentId: "stu-010", applicationId: "app-010", type: "passport", fileName: "aisha_passport.pdf", uploaded: "2024-03-26", verified: 1 },
  { id: "doc-013", studentId: "stu-010", applicationId: "app-010", type: "financial", fileName: "aisha_scholarship_letter.pdf", uploaded: "2024-03-27", verified: 1 },
];

const activities = [
  { id: "act-001", studentId: "stu-001", applicationId: "app-001", action: "stage_changed", note: "Moved to visa processing", performedBy: "Sarah Mitchell", created: "2024-03-15" },
  { id: "act-002", studentId: "stu-002", applicationId: "app-002", action: "document_uploaded", note: "Financial sponsor letter uploaded", performedBy: "Agent", created: "2024-01-27" },
  { id: "act-003", studentId: "stu-003", applicationId: "app-003", action: "application_created", note: "Application submitted to RMIT", performedBy: "Sarah Mitchell", created: "2024-02-05" },
  { id: "act-004", studentId: "stu-004", applicationId: "app-004", action: "stage_changed", note: "Visa approved! Student can proceed.", performedBy: "Sarah Mitchell", created: "2024-04-01" },
  { id: "act-005", studentId: "stu-005", applicationId: "app-005", action: "stage_changed", note: "Moved to visa processing", performedBy: "Sarah Mitchell", created: "2024-03-20" },
  { id: "act-006", studentId: "stu-008", applicationId: "app-008", action: "document_requested", note: "Requested passport copy from student", performedBy: "Sarah Mitchell", created: "2024-03-16" },
  { id: "act-007", studentId: "stu-010", applicationId: "app-010", action: "stage_changed", note: "Visa approved!", performedBy: "Sarah Mitchell", created: "2024-04-10" },
  { id: "act-008", studentId: "stu-011", applicationId: "app-011", action: "offer_received", note: "Offer letter received from Flinders", performedBy: "System", created: "2024-04-15" },
];

const seedTransaction = sqlite.transaction(() => {
  for (const s of students) {
    insertStudent.run(s.id, s.name, s.email, s.phone, s.nationality, s.passport, s.education, s.created, s.dob, s.gender, s.institution, s.gpa, s.year, s.engType, s.engScore, s.countries, s.courses, s.budget, s.intake, s.notes, s.title, s.passportExpiry, s.countryOfResidence, s.address, s.city, s.emergencyName, s.emergencyPhone, s.whatsapp, s.nativeLanguage, s.eduHistory, s.engDetails, s.stdTests, s.workExp, s.finInfo, s.visaInfo, s.prefInst, s.accPref, s.postWork, s.consent, s.status);
  }
  for (const a of applications) {
    insertApplication.run(a.id, a.studentId, a.university, a.course, a.stage, a.status, a.accommodation, a.insurance, a.submitted, a.updated);
  }
  for (const d of documents) {
    insertDocument.run(d.id, d.studentId, d.applicationId, d.type, d.fileName, d.uploaded, d.verified);
  }
  for (const a of activities) {
    insertActivity.run(a.id, a.studentId, a.applicationId, a.action, a.note, a.performedBy, a.created);
  }
});

seedTransaction();
console.log(`Seeded ${students.length} students, ${applications.length} applications, ${documents.length} documents, ${activities.length} activities.`);

// Seed auth users
const existingUsers = sqlite.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (existingUsers.count === 0) {
  const hashPassword = (pw: string) => bcrypt.hashSync(pw, 12);

  const insertUser = sqlite.prepare(
    "INSERT INTO users (id, name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  );

  insertUser.run("usr-admin", "Admin User", "admin@unilinkai.com", hashPassword("password"), "superadmin", new Date().toISOString());
  insertUser.run("usr-agent", "Sarah Mitchell", "agent@unilinkai.com", hashPassword("password"), "agent", new Date().toISOString());
  insertUser.run("usr-student", "Alex Johnson", "student@unilinkai.com", hashPassword("password"), "student", new Date().toISOString());

  console.log("Seeded 3 auth users (admin/agent/student) with password: password");
}

sqlite.close();
