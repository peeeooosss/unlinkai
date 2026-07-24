"use server";

import { db } from "@/lib/db";
import { students, applications, documents, activityLogs, STAGE_ORDER, type Stage } from "@/lib/db/schema";
import { eq, desc, sql, like, count, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getStudents(search?: string, status?: string) {
  if (search && status) {
    return await db
      .select()
      .from(students)
      .where(and(like(students.name, `%${search}%`), eq(students.status, status)))
      .orderBy(desc(students.createdAt));
  }
  if (search) {
    return await db
      .select()
      .from(students)
      .where(like(students.name, `%${search}%`))
      .orderBy(desc(students.createdAt));
  }
  if (status) {
    return await db
      .select()
      .from(students)
      .where(eq(students.status, status))
      .orderBy(desc(students.createdAt));
  }
  return await db.select().from(students).orderBy(desc(students.createdAt));
}

export async function getStudentById(id: string) {
  const studentResult = await db.select().from(students).where(eq(students.id, id));
  const student = studentResult[0];
  if (!student) return null;

  const studentApplications = await db
    .select()
    .from(applications)
    .where(eq(applications.studentId, id))
    .orderBy(desc(applications.updatedAt));

  const studentDocuments = await db
    .select()
    .from(documents)
    .where(eq(documents.studentId, id))
    .orderBy(desc(documents.uploadedAt));

  const studentActivities = await db
    .select()
    .from(activityLogs)
    .where(eq(activityLogs.studentId, id))
    .orderBy(desc(activityLogs.createdAt));

  return { ...student, applications: studentApplications, documents: studentDocuments, activities: studentActivities };
}

export async function getStudentCount() {
  const result = await db.select({ count: count() }).from(students);
  return result[0]?.count ?? 0;
}

export async function getStudentCounts() {
  const totalResult = await db.select({ count: count() }).from(students);
  const draftResult = await db.select({ count: count() }).from(students).where(eq(students.status, "draft"));
  return {
    total: totalResult[0]?.count ?? 0,
    drafts: draftResult[0]?.count ?? 0,
  };
}

export async function createStudent(data: {
  name: string;
  email: string;
  phone: string;
  nationality: string;
  passportNumber?: string;
  educationLevel: string;
  dateOfBirth?: string;
  gender?: string;
  currentInstitution?: string;
  gpa?: string;
  yearOfCompletion?: string;
  englishTestType?: string;
  englishTestScore?: string;
  countryPreferences?: string;
  coursePreferences?: string;
  budget?: string;
  intakePreference?: string;
  additionalNotes?: string;
  title?: string;
  passportExpiry?: string;
  countryOfResidence?: string;
  address?: string;
  city?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  whatsappNumber?: string;
  nativeLanguage?: string;
  educationHistory?: string;
  englishTestDetails?: string;
  standardizedTests?: string;
  workExperience?: string;
  financialInfo?: string;
  visaHistory?: string;
  preferredInstitutions?: string;
  accommodationPreference?: string;
  postStudyWorkInterest?: string;
  consentGiven?: string;
  status?: string;
}) {
  const id = `stu-${Date.now()}`;
  const now = new Date().toISOString().split("T")[0];

  await db.insert(students)
    .values({
      id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      nationality: data.nationality,
      passportNumber: data.passportNumber || null,
      educationLevel: data.educationLevel,
      createdAt: now,
      dateOfBirth: data.dateOfBirth || null,
      gender: data.gender || null,
      currentInstitution: data.currentInstitution || null,
      gpa: data.gpa || null,
      yearOfCompletion: data.yearOfCompletion || null,
      englishTestType: data.englishTestType || null,
      englishTestScore: data.englishTestScore || null,
      countryPreferences: data.countryPreferences || null,
      coursePreferences: data.coursePreferences || null,
      budget: data.budget || null,
      intakePreference: data.intakePreference || null,
      additionalNotes: data.additionalNotes || null,
      title: data.title || null,
      passportExpiry: data.passportExpiry || null,
      countryOfResidence: data.countryOfResidence || null,
      address: data.address || null,
      city: data.city || null,
      emergencyContactName: data.emergencyContactName || null,
      emergencyContactPhone: data.emergencyContactPhone || null,
      whatsappNumber: data.whatsappNumber || null,
      nativeLanguage: data.nativeLanguage || null,
      educationHistory: data.educationHistory || null,
      englishTestDetails: data.englishTestDetails || null,
      standardizedTests: data.standardizedTests || null,
      workExperience: data.workExperience || null,
      financialInfo: data.financialInfo || null,
      visaHistory: data.visaHistory || null,
      preferredInstitutions: data.preferredInstitutions || null,
      accommodationPreference: data.accommodationPreference || null,
      postStudyWorkInterest: data.postStudyWorkInterest || null,
      consentGiven: data.consentGiven || null,
      status: data.status || "complete",
    });

  revalidatePath("/agent-portal");
  revalidatePath("/agent-portal/students");
  return id;
}

export async function updateStudent(
  studentId: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    nationality?: string;
    passportNumber?: string;
    educationLevel?: string;
    dateOfBirth?: string;
    gender?: string;
    currentInstitution?: string;
    gpa?: string;
    yearOfCompletion?: string;
    englishTestType?: string;
    englishTestScore?: string;
    countryPreferences?: string;
    coursePreferences?: string;
    budget?: string;
    intakePreference?: string;
    additionalNotes?: string;
    title?: string;
    passportExpiry?: string;
    countryOfResidence?: string;
    address?: string;
    city?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    whatsappNumber?: string;
    nativeLanguage?: string;
    educationHistory?: string;
    englishTestDetails?: string;
    standardizedTests?: string;
    workExperience?: string;
    financialInfo?: string;
    visaHistory?: string;
    preferredInstitutions?: string;
    accommodationPreference?: string;
    postStudyWorkInterest?: string;
    consentGiven?: string;
    status?: string;
  },
  performedBy: string = "Sarah Mitchell"
) {
  const now = new Date().toISOString().split("T")[0];
  const existingResult = await db.select().from(students).where(eq(students.id, studentId));
  const existing = existingResult[0];
  if (!existing) throw new Error("Student not found");

  const updates: Record<string, string> = {};

  const fieldMap: Record<string, string> = {
    name: "name", email: "email", phone: "phone", nationality: "nationality",
    passportNumber: "passportNumber", educationLevel: "educationLevel",
    dateOfBirth: "dateOfBirth", gender: "gender", currentInstitution: "currentInstitution",
    gpa: "gpa", yearOfCompletion: "yearOfCompletion", englishTestType: "englishTestType",
    englishTestScore: "englishTestScore", countryPreferences: "countryPreferences",
    coursePreferences: "coursePreferences", budget: "budget", intakePreference: "intakePreference",
    additionalNotes: "additionalNotes", title: "title", passportExpiry: "passportExpiry",
    countryOfResidence: "countryOfResidence", address: "address", city: "city",
    emergencyContactName: "emergencyContactName", emergencyContactPhone: "emergencyContactPhone",
    whatsappNumber: "whatsappNumber", nativeLanguage: "nativeLanguage",
    educationHistory: "educationHistory", englishTestDetails: "englishTestDetails",
    standardizedTests: "standardizedTests", workExperience: "workExperience",
    financialInfo: "financialInfo", visaHistory: "visaHistory",
    preferredInstitutions: "preferredInstitutions", accommodationPreference: "accommodationPreference",
    postStudyWorkInterest: "postStudyWorkInterest", consentGiven: "consentGiven",
    status: "status",
  };

  const dbColumnMap: Record<string, string> = {
    name: "name", email: "email", phone: "phone", nationality: "nationality",
    passportNumber: "passport_number", educationLevel: "education_level",
    dateOfBirth: "date_of_birth", gender: "gender", currentInstitution: "current_institution",
    gpa: "gpa", yearOfCompletion: "year_of_completion", englishTestType: "english_test_type",
    englishTestScore: "english_test_score", countryPreferences: "country_preferences",
    coursePreferences: "course_preferences", budget: "budget", intakePreference: "intake_preference",
    additionalNotes: "additional_notes", title: "title", passportExpiry: "passport_expiry",
    countryOfResidence: "country_of_residence", address: "address", city: "city",
    emergencyContactName: "emergency_contact_name", emergencyContactPhone: "emergency_contact_phone",
    whatsappNumber: "whatsapp_number", nativeLanguage: "native_language",
    educationHistory: "education_history", englishTestDetails: "english_test_details",
    standardizedTests: "standardized_tests", workExperience: "work_experience",
    financialInfo: "financial_info", visaHistory: "visa_history",
    preferredInstitutions: "preferred_institutions", accommodationPreference: "accommodation_preference",
    postStudyWorkInterest: "post_study_work_interest", consentGiven: "consent_given",
    status: "status",
  };

  const changes: string[] = [];
  for (const [key, dbCol] of Object.entries(dbColumnMap)) {
    const val = (data as Record<string, string | undefined>)[key];
    if (val !== undefined) {
      const dbVal = val || null;
      const existingVal = (existing as Record<string, string>)[dbCol];
      if (dbVal !== existingVal) {
        updates[dbCol] = dbVal || "";
        changes.push(key.replace(/([A-Z])/g, " $1").toLowerCase());
      }
    }
  }

  if (Object.keys(updates).length === 0) return { success: true, changes: [] };

  await db.update(students)
    .set(updates)
    .where(eq(students.id, studentId));

  if (changes.length > 0) {
    await db.insert(activityLogs)
      .values({
        id: `act-${Date.now()}`,
        studentId,
        applicationId: null,
        action: "student_updated",
        note: `Updated: ${changes.join(", ")}`,
        performedBy,
        createdAt: now,
      });
  }

  revalidatePath("/agent-portal");
  revalidatePath("/agent-portal/students");
  return { success: true, changes };
}
