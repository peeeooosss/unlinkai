"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Pencil, Loader2, ChevronDown, ChevronUp, Plus, X, CheckCircle,
  GraduationCap, Briefcase, Globe, CreditCard, BookOpen, Shield,
  Trash2, FileText, AlertCircle,
} from "lucide-react";
import { updateStudent } from "@/lib/actions/students";
import { type Student } from "@/lib/db/schema";

const COUNTRIES = [
  "United Kingdom", "Australia", "Canada", "United States", "New Zealand",
  "Germany", "Netherlands", "Singapore", "Malta", "Cyprus", "Latvia", "Dubai",
];
const COURSES = [
  "Business & Management", "Computer Science & IT", "Engineering",
  "Finance & Economics", "Marketing & Media", "Health Sciences",
  "Hospitality & Tourism", "Education", "Law", "Creative Arts & Design",
  "Science", "Aviation & Aerospace",
];
const BUDGET_CURRENCIES = ["GBP", "EUR", "AUD", "USD", "CAD", "NZD", "SGD", "AED", "INR"];

interface EducationEntry {
  institution: string;
  country: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  gpa: string;
  gradingScale: string;
  stillEnrolled: boolean;
}

interface EnglishTestEntry {
  testType: string;
  overallScore: string;
  listening: string;
  reading: string;
  writing: string;
  speaking: string;
  testDate: string;
  trfNumber: string;
}

interface StandardizedTestEntry {
  testType: string;
  score: string;
  breakdown: string;
  testDate: string;
}

interface WorkEntry {
  employer: string;
  jobTitle: string;
  industry: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  employmentType: string;
  description: string;
}

interface EditStudentFlowProps {
  student: Student;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStudentUpdated?: () => void;
}

function safeJsonParse(val: string | null | undefined): any {
  if (!val) return null;
  try { return JSON.parse(val); } catch { return null; }
}

function parseFinancialInfo(val: string | null | undefined) {
  const parsed = safeJsonParse(val);
  return { budget: parsed?.budget || "", budgetCurrency: parsed?.budgetCurrency || "GBP", fundingSource: parsed?.fundingSource || "", bankStatementAvailable: parsed?.bankStatementAvailable || false };
}

function parseVisaHistory(val: string | null | undefined) {
  const parsed = safeJsonParse(val);
  return { hasVisaRefusals: parsed?.hasVisaRefusals || false, visaRefusalDetails: parsed?.visaRefusalDetails || "", hasStudiedAbroad: parsed?.hasStudiedAbroad || false, studyAbroadDetails: parsed?.studyAbroadDetails || "", currentVisaStatus: parsed?.currentVisaStatus || "" };
}

export function EditStudentFlow({ student, open, onOpenChange, onStudentUpdated }: EditStudentFlowProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  // Personal
  const [title, setTitle] = React.useState(student.title || "");
  const [name, setName] = React.useState(student.name);
  const [email, setEmail] = React.useState(student.email);
  const [phone, setPhone] = React.useState(student.phone);
  const [whatsapp, setWhatsapp] = React.useState(student.whatsappNumber || "");
  const [nationality, setNationality] = React.useState(student.nationality);
  const [countryOfResidence, setCountryOfResidence] = React.useState(student.countryOfResidence || "");
  const [passportNumber, setPassportNumber] = React.useState(student.passportNumber || "");
  const [passportExpiry, setPassportExpiry] = React.useState(student.passportExpiry || "");
  const [dob, setDob] = React.useState(student.dateOfBirth || "");
  const [gender, setGender] = React.useState(student.gender || "");
  const [address, setAddress] = React.useState(student.address || "");
  const [city, setCity] = React.useState(student.city || "");
  const [nativeLanguage, setNativeLanguage] = React.useState(student.nativeLanguage || "");
  const [emergencyName, setEmergencyName] = React.useState(student.emergencyContactName || "");
  const [emergencyPhone, setEmergencyPhone] = React.useState(student.emergencyContactPhone || "");

  // Education
  const [educationHistory, setEducationHistory] = React.useState<EducationEntry[]>(() => {
    const parsed = safeJsonParse(student.educationHistory);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return [{ institution: "", country: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "", gpa: "", gradingScale: "percentage", stillEnrolled: false }];
  });

  // English Tests
  const [englishTests, setEnglishTests] = React.useState<EnglishTestEntry[]>(() => {
    const parsed = safeJsonParse(student.englishTestDetails);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return [{ testType: "IELTS", overallScore: "", listening: "", reading: "", writing: "", speaking: "", testDate: "", trfNumber: "" }];
  });

  // Standardized Tests
  const [standardizedTests, setStandardizedTests] = React.useState<StandardizedTestEntry[]>(() => {
    const parsed = safeJsonParse(student.standardizedTests);
    return Array.isArray(parsed) ? parsed : [];
  });
  const [showStandardized, setShowStandardized] = React.useState(false);

  // Work Experience
  const [workExperience, setWorkExperience] = React.useState<WorkEntry[]>(() => {
    const parsed = safeJsonParse(student.workExperience);
    return Array.isArray(parsed) ? parsed : [];
  });
  const [hasWorkExperience, setHasWorkExperience] = React.useState(() => {
    const parsed = safeJsonParse(student.workExperience);
    return Array.isArray(parsed) && parsed.length > 0;
  });

  // Financial
  const fin = parseFinancialInfo(student.financialInfo);
  const [budget, setBudget] = React.useState(fin.budget);
  const [budgetCurrency, setBudgetCurrency] = React.useState(fin.budgetCurrency);
  const [fundingSource, setFundingSource] = React.useState(fin.fundingSource);
  const [bankStatementAvailable, setBankStatementAvailable] = React.useState(fin.bankStatementAvailable);

  // Visa History
  const visa = parseVisaHistory(student.visaHistory);
  const [hasVisaRefusals, setHasVisaRefusals] = React.useState(visa.hasVisaRefusals);
  const [visaRefusalDetails, setVisaRefusalDetails] = React.useState(visa.visaRefusalDetails);
  const [hasStudiedAbroad, setHasStudiedAbroad] = React.useState(visa.hasStudiedAbroad);
  const [studyAbroadDetails, setStudyAbroadDetails] = React.useState(visa.studyAbroadDetails);
  const [currentVisaStatus, setCurrentVisaStatus] = React.useState(visa.currentVisaStatus);

  // Preferences
  const [countryPreferences, setCountryPreferences] = React.useState<string[]>(() => student.countryPreferences ? student.countryPreferences.split(",") : []);
  const [coursePreferences, setCoursePreferences] = React.useState<string[]>(() => student.coursePreferences ? student.coursePreferences.split(",") : []);
  const [studyLevel, setStudyLevel] = React.useState(student.educationLevel);
  const [preferredInstitutions, setPreferredInstitutions] = React.useState(student.preferredInstitutions || "");
  const [intakePreference, setIntakePreference] = React.useState(student.intakePreference || "");
  const [accommodationPref, setAccommodationPref] = React.useState(student.accommodationPreference || "");
  const [postStudyWork, setPostStudyWork] = React.useState(student.postStudyWorkInterest || "");
  const [additionalNotes, setAdditionalNotes] = React.useState(student.additionalNotes || "");
  const [consentGiven, setConsentGiven] = React.useState(student.consentGiven === "yes");

  const [countriesExpanded, setCountriesExpanded] = React.useState(false);
  const [coursesExpanded, setCoursesExpanded] = React.useState(false);

  // --- Education helpers ---
  const addEducation = () => setEducationHistory((prev) => [...prev, { institution: "", country: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "", gpa: "", gradingScale: "percentage", stillEnrolled: false }]);
  const removeEducation = (i: number) => setEducationHistory((prev) => prev.filter((_, idx) => idx !== i));
  const updateEducation = (i: number, field: keyof EducationEntry, value: string | boolean) =>
    setEducationHistory((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));

  // --- English test helpers ---
  const addEnglishTest = () => setEnglishTests((prev) => [...prev, { testType: "IELTS", overallScore: "", listening: "", reading: "", writing: "", speaking: "", testDate: "", trfNumber: "" }]);
  const removeEnglishTest = (i: number) => setEnglishTests((prev) => prev.filter((_, idx) => idx !== i));
  const updateEnglishTest = (i: number, field: keyof EnglishTestEntry, value: string) =>
    setEnglishTests((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));

  // --- Standardized test helpers ---
  const addStandardizedTest = () => setStandardizedTests((prev) => [...prev, { testType: "GRE", score: "", breakdown: "", testDate: "" }]);
  const removeStandardizedTest = (i: number) => setStandardizedTests((prev) => prev.filter((_, idx) => idx !== i));
  const updateStandardizedTest = (i: number, field: keyof StandardizedTestEntry, value: string) =>
    setStandardizedTests((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));

  // --- Work helpers ---
  const addWork = () => setWorkExperience((prev) => [...prev, { employer: "", jobTitle: "", industry: "", startDate: "", endDate: "", isCurrent: false, employmentType: "full-time", description: "" }]);
  const removeWork = (i: number) => setWorkExperience((prev) => prev.filter((_, idx) => idx !== i));
  const updateWork = (i: number, field: keyof WorkEntry, value: string | boolean) =>
    setWorkExperience((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));

  // --- Country/Course toggles ---
  const toggleCountry = (c: string) => setCountryPreferences((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  const toggleCourse = (c: string) => setCoursePreferences((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  const handleClose = () => {
    setSuccess(false);
    setError("");
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !nationality) {
      setError("Please fill in Name, Email, Phone, and Nationality.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const filledEducation = educationHistory.filter((e) => e.institution);
      const filledEnglish = englishTests.filter((e) => e.overallScore);
      const filledWork = workExperience.filter((e) => e.employer);
      const filledStandardized = standardizedTests.filter((e) => e.score);

      await updateStudent(student.id, {
        name, email, phone, nationality,
        passportNumber: passportNumber || undefined,
        educationLevel: studyLevel,
        dateOfBirth: dob || undefined,
        gender: gender || undefined,
        currentInstitution: filledEducation.length > 0 ? filledEducation[filledEducation.length - 1].institution : undefined,
        gpa: filledEducation.length > 0 ? filledEducation[filledEducation.length - 1].gpa : undefined,
        yearOfCompletion: filledEducation.length > 0 ? filledEducation[filledEducation.length - 1].endYear : undefined,
        englishTestType: filledEnglish.length > 0 ? filledEnglish[0].testType : undefined,
        englishTestScore: filledEnglish.length > 0 ? filledEnglish[0].overallScore : undefined,
        countryPreferences: countryPreferences.length > 0 ? countryPreferences.join(",") : undefined,
        coursePreferences: coursePreferences.length > 0 ? coursePreferences.join(",") : undefined,
        budget: budget ? `${budgetCurrency} ${budget}` : undefined,
        intakePreference: intakePreference || undefined,
        additionalNotes: additionalNotes || undefined,
        title: title || undefined,
        passportExpiry: passportExpiry || undefined,
        countryOfResidence: countryOfResidence || undefined,
        address: address || undefined,
        city: city || undefined,
        emergencyContactName: emergencyName || undefined,
        emergencyContactPhone: emergencyPhone || undefined,
        whatsappNumber: whatsapp || undefined,
        nativeLanguage: nativeLanguage || undefined,
        educationHistory: filledEducation.length > 0 ? JSON.stringify(filledEducation) : undefined,
        englishTestDetails: filledEnglish.length > 0 ? JSON.stringify(filledEnglish) : undefined,
        standardizedTests: filledStandardized.length > 0 ? JSON.stringify(filledStandardized) : undefined,
        workExperience: filledWork.length > 0 ? JSON.stringify(filledWork) : undefined,
        financialInfo: JSON.stringify({ budget, budgetCurrency, fundingSource, bankStatementAvailable }),
        visaHistory: JSON.stringify({ hasVisaRefusals, visaRefusalDetails, hasStudiedAbroad, studyAbroadDetails, currentVisaStatus }),
        preferredInstitutions: preferredInstitutions || undefined,
        accommodationPreference: accommodationPref || undefined,
        postStudyWorkInterest: postStudyWork || undefined,
        consentGiven: consentGiven ? "yes" : undefined,
        status: "complete",
      });

      setSuccess(true);
      onStudentUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else onOpenChange(true); }}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto bg-white border-black p-0">
        <DialogHeader className="sticky top-0 z-10 bg-white border-b border-black px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-neutral-900 text-xl">
            <Pencil className="h-5 w-5 text-blue-600" />
            Edit Student Profile
          </DialogTitle>
          <p className="text-sm text-neutral-600">
            Update {student.name}&apos;s profile. All fields are optional.
          </p>
        </DialogHeader>

        {success ? (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800">Profile updated successfully!</p>
                <p className="text-xs text-green-600 mt-0.5">Changes have been saved and logged.</p>
              </div>
            </div>
            <Button onClick={handleClose} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Done</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* SECTION 1: Personal Details */}
            <Section title="Personal Details" icon={Shield} defaultOpen>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-neutral-900">Title</Label>
                  <select value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-10 rounded-md border border-black bg-white px-3 text-sm text-neutral-900">
                    <option value="">Select...</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Dr">Dr</option>
                  </select>
                </div>
                <Field label="Full Name" id="name" value={name} onChange={setName} required />
                <Field label="Email" id="email" type="email" value={email} onChange={setEmail} required />
                <Field label="Phone" id="phone" value={phone} onChange={setPhone} required />
                <Field label="WhatsApp" id="whatsapp" placeholder="Separate if different from phone" value={whatsapp} onChange={setWhatsapp} />
                <Field label="Nationality" id="nationality" value={nationality} onChange={setNationality} required />
                <Field label="Country of Residence" id="residence" placeholder="If different from nationality" value={countryOfResidence} onChange={setCountryOfResidence} />
                <Field label="Date of Birth" id="dob" type="date" value={dob} onChange={setDob} />
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-neutral-900">Gender</Label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full h-10 rounded-md border border-black bg-white px-3 text-sm text-neutral-900">
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <Field label="Passport Number" id="passport" placeholder="Optional" value={passportNumber} onChange={setPassportNumber} />
                <Field label="Passport Expiry" id="passportExpiry" type="date" value={passportExpiry} onChange={setPassportExpiry} />
                <Field label="Native Language" id="nativeLang" placeholder="e.g. Hindi" value={nativeLanguage} onChange={setNativeLanguage} />
                <div className="col-span-2">
                  <Field label="Current Address" id="address" placeholder="Street address" value={address} onChange={setAddress} />
                </div>
                <Field label="City" id="city" placeholder="e.g. Mumbai" value={city} onChange={setCity} />
                <div className="col-span-2 border-t border-neutral-200 pt-4 mt-2">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Emergency Contact</p>
                </div>
                <Field label="Emergency Contact Name" id="emergencyName" placeholder="Full name" value={emergencyName} onChange={setEmergencyName} />
                <Field label="Emergency Contact Phone" id="emergencyPhone" placeholder="+91 ..." value={emergencyPhone} onChange={setEmergencyPhone} />
              </div>
            </Section>

            {/* SECTION 2: Education History */}
            <Section title="Education History" icon={GraduationCap}>
              <p className="text-xs text-neutral-500 mb-3">Add all qualifications from high school onwards.</p>
              {educationHistory.map((entry, i) => (
                <div key={i} className="border border-neutral-200 rounded-lg p-4 space-y-3 mb-3 bg-neutral-50">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs !text-neutral-900">
                      Education #{i + 1}{entry.stillEnrolled ? " (In Progress)" : ""}
                    </Badge>
                    {educationHistory.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => removeEducation(i)}>
                        <Trash2 className="h-3 w-3 mr-1" /> Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Institution Name" id={`edu-inst-${i}`} placeholder="e.g. Delhi University" value={entry.institution} onChange={(v) => updateEducation(i, "institution", v)} />
                    <Field label="Country" id={`edu-country-${i}`} placeholder="e.g. India" value={entry.country} onChange={(v) => updateEducation(i, "country", v)} />
                    <Field label="Degree / Diploma" id={`edu-degree-${i}`} placeholder="e.g. B.Tech" value={entry.degree} onChange={(v) => updateEducation(i, "degree", v)} />
                    <Field label="Field of Study" id={`edu-field-${i}`} placeholder="e.g. Computer Science" value={entry.fieldOfStudy} onChange={(v) => updateEducation(i, "fieldOfStudy", v)} />
                    <Field label="Start Year" id={`edu-start-${i}`} placeholder="e.g. 2019" value={entry.startYear} onChange={(v) => updateEducation(i, "startYear", v)} />
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-neutral-900">End Year</Label>
                      {entry.stillEnrolled ? (
                        <Input id={`edu-end-${i}`} placeholder="Present" disabled className="bg-white border-black text-neutral-500" />
                      ) : (
                        <Input id={`edu-end-${i}`} placeholder="e.g. 2023" value={entry.endYear} onChange={(e) => updateEducation(i, "endYear", e.target.value)} className="bg-white border-black text-neutral-900 placeholder:text-neutral-500" />
                      )}
                    </div>
                    <Field label="GPA / Percentage" id={`edu-gpa-${i}`} placeholder="e.g. 8.5 CGPA" value={entry.gpa} onChange={(v) => updateEducation(i, "gpa", v)} />
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-neutral-900">Grading Scale</Label>
                      <select value={entry.gradingScale} onChange={(e) => updateEducation(i, "gradingScale", e.target.value)} className="w-full h-10 rounded-md border border-black bg-white px-3 text-sm text-neutral-900">
                        <option value="percentage">Percentage</option>
                        <option value="cgpa-10">CGPA (10-point)</option>
                        <option value="cgpa-4">CGPA (4-point / GPA)</option>
                        <option value="gpa-4">GPA (4.0 scale)</option>
                        <option value="first-class">Class / Division</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <input type="checkbox" id={`edu-enrolled-${i}`} checked={entry.stillEnrolled} onChange={(e) => updateEducation(i, "stillEnrolled", e.target.checked)} className="h-4 w-4 rounded border-black" />
                      <Label htmlFor={`edu-enrolled-${i}`} className="text-sm text-neutral-900">Still Enrolled</Label>
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="border-dashed border-black text-neutral-700 hover:bg-neutral-100" onClick={addEducation}>
                <Plus className="h-4 w-4 mr-1.5" /> Add Education Entry
              </Button>
            </Section>

            {/* SECTION 3: English & Standardized Tests */}
            <Section title="English & Standardized Tests" icon={FileText}>
              <p className="text-xs text-neutral-500 mb-3">IELTS/TOEFL scores expire after 2 years. Include test date for accuracy.</p>
              {englishTests.map((entry, i) => (
                <div key={i} className="border border-neutral-200 rounded-lg p-4 space-y-3 mb-3 bg-neutral-50">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs !text-neutral-900">English Test #{i + 1}</Badge>
                    {englishTests.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => removeEnglishTest(i)}>
                        <Trash2 className="h-3 w-3 mr-1" /> Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-neutral-900">Test Type</Label>
                      <select value={entry.testType} onChange={(e) => updateEnglishTest(i, "testType", e.target.value)} className="w-full h-10 rounded-md border border-black bg-white px-3 text-sm text-neutral-900">
                        <option value="IELTS">IELTS</option>
                        <option value="TOEFL">TOEFL iBT</option>
                        <option value="PTE">PTE Academic</option>
                        <option value="Duolingo">Duolingo</option>
                        <option value="Cambridge">Cambridge C1/C2</option>
                        <option value="None">None / MOI Certificate</option>
                      </select>
                    </div>
                    <Field label="Overall Score" id={`eng-overall-${i}`} placeholder={entry.testType === "IELTS" ? "e.g. 7.0" : entry.testType === "TOEFL" ? "e.g. 100" : "e.g. 65"} value={entry.overallScore} onChange={(v) => updateEnglishTest(i, "overallScore", v)} />
                    {entry.testType === "IELTS" && (
                      <>
                        <Field label="Listening" id={`eng-l-${i}`} placeholder="e.g. 7.0" value={entry.listening} onChange={(v) => updateEnglishTest(i, "listening", v)} />
                        <Field label="Reading" id={`eng-r-${i}`} placeholder="e.g. 7.5" value={entry.reading} onChange={(v) => updateEnglishTest(i, "reading", v)} />
                        <Field label="Writing" id={`eng-w-${i}`} placeholder="e.g. 6.5" value={entry.writing} onChange={(v) => updateEnglishTest(i, "writing", v)} />
                        <Field label="Speaking" id={`eng-s-${i}`} placeholder="e.g. 7.0" value={entry.speaking} onChange={(v) => updateEnglishTest(i, "speaking", v)} />
                      </>
                    )}
                    <Field label="Test Date" id={`eng-date-${i}`} type="date" value={entry.testDate} onChange={(v) => updateEnglishTest(i, "testDate", v)} />
                    <Field label="TRF / Registration No." id={`eng-trf-${i}`} placeholder="Optional" value={entry.trfNumber} onChange={(v) => updateEnglishTest(i, "trfNumber", v)} />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="border-dashed border-black text-neutral-700 hover:bg-neutral-100 mb-4" onClick={addEnglishTest}>
                <Plus className="h-4 w-4 mr-1.5" /> Add Another English Test
              </Button>

              {/* Standardized Tests */}
              <div className="border-t border-neutral-200 pt-4">
                <button type="button" onClick={() => setShowStandardized(!showStandardized)} className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                  {showStandardized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  Standardized Tests (GRE, GMAT, SAT, ACT)
                </button>
                {showStandardized && (
                  <div className="mt-3 space-y-3">
                    {standardizedTests.map((entry, i) => (
                      <div key={i} className="border border-neutral-200 rounded-lg p-4 space-y-3 bg-neutral-50">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs !text-neutral-900">Standardized #{i + 1}</Badge>
                          <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => removeStandardizedTest(i)}>
                            <Trash2 className="h-3 w-3 mr-1" /> Remove
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-neutral-900">Test Type</Label>
                            <select value={entry.testType} onChange={(e) => updateStandardizedTest(i, "testType", e.target.value)} className="w-full h-10 rounded-md border border-black bg-white px-3 text-sm text-neutral-900">
                              <option value="GRE">GRE</option>
                              <option value="GMAT">GMAT</option>
                              <option value="SAT">SAT</option>
                              <option value="ACT">ACT</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <Field label="Overall Score" id={`std-score-${i}`} placeholder="e.g. 320" value={entry.score} onChange={(v) => updateStandardizedTest(i, "score", v)} />
                          <Field label="Section Breakdown" id={`std-break-${i}`} placeholder="e.g. V160 Q160 AWA4.0" value={entry.breakdown} onChange={(v) => updateStandardizedTest(i, "breakdown", v)} />
                          <Field label="Test Date" id={`std-date-${i}`} type="date" value={entry.testDate} onChange={(v) => updateStandardizedTest(i, "testDate", v)} />
                        </div>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" className="border-dashed border-black text-neutral-700 hover:bg-neutral-100" onClick={addStandardizedTest}>
                      <Plus className="h-4 w-4 mr-1.5" /> Add Standardized Test
                    </Button>
                  </div>
                )}
              </div>
            </Section>

            {/* SECTION 4: Work Experience */}
            <Section title="Work Experience" icon={Briefcase}>
              <div className="flex items-center gap-3 mb-3">
                <input type="checkbox" id="hasWork" checked={hasWorkExperience} onChange={(e) => setHasWorkExperience(e.target.checked)} className="h-4 w-4 rounded border-black" />
                <Label htmlFor="hasWork" className="text-sm text-neutral-900">Student has work experience</Label>
              </div>
              {hasWorkExperience && (
                <>
                  {workExperience.map((entry, i) => (
                    <div key={i} className="border border-neutral-200 rounded-lg p-4 space-y-3 mb-3 bg-neutral-50">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs !text-neutral-900">Position #{i + 1}</Badge>
                        <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => removeWork(i)}>
                          <Trash2 className="h-3 w-3 mr-1" /> Remove
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Employer" id={`work-emp-${i}`} placeholder="Company name" value={entry.employer} onChange={(v) => updateWork(i, "employer", v)} />
                        <Field label="Job Title" id={`work-title-${i}`} placeholder="e.g. Software Engineer" value={entry.jobTitle} onChange={(v) => updateWork(i, "jobTitle", v)} />
                        <Field label="Industry" id={`work-ind-${i}`} placeholder="e.g. IT, Banking" value={entry.industry} onChange={(v) => updateWork(i, "industry", v)} />
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-neutral-900">Employment Type</Label>
                          <select value={entry.employmentType} onChange={(e) => updateWork(i, "employmentType", e.target.value)} className="w-full h-10 rounded-md border border-black bg-white px-3 text-sm text-neutral-900">
                            <option value="full-time">Full-Time</option>
                            <option value="part-time">Part-Time</option>
                            <option value="internship">Internship</option>
                            <option value="contract">Contract</option>
                          </select>
                        </div>
                        <Field label="Start Date" id={`work-start-${i}`} type="date" value={entry.startDate} onChange={(v) => updateWork(i, "startDate", v)} />
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-neutral-900">End Date</Label>
                          {entry.isCurrent ? (
                            <Input id={`work-end-${i}`} placeholder="Present" disabled className="bg-white border-black text-neutral-500" />
                          ) : (
                            <Input id={`work-end-${i}`} type="date" value={entry.endDate} onChange={(e) => updateWork(i, "endDate", e.target.value)} className="bg-white border-black text-neutral-900" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                          <input type="checkbox" id={`work-cur-${i}`} checked={entry.isCurrent} onChange={(e) => updateWork(i, "isCurrent", e.target.checked)} className="h-4 w-4 rounded border-black" />
                          <Label htmlFor={`work-cur-${i}`} className="text-sm text-neutral-900">Currently Working Here</Label>
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label className="text-sm font-semibold text-neutral-900">Key Responsibilities</Label>
                          <textarea value={entry.description} onChange={(e) => updateWork(i, "description", e.target.value)} rows={2} placeholder="Brief description of role..."
                            className="w-full rounded-md border border-black bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" className="border-dashed border-black text-neutral-700 hover:bg-neutral-100" onClick={addWork}>
                    <Plus className="h-4 w-4 mr-1.5" /> Add Work Experience
                  </Button>
                </>
              )}
            </Section>

            {/* SECTION 5: Financial & Visa Info */}
            <Section title="Financial & Visa Information" icon={CreditCard}>
              <div className="space-y-4">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Financial Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-neutral-900">Budget Currency</Label>
                    <select value={budgetCurrency} onChange={(e) => setBudgetCurrency(e.target.value)} className="w-full h-10 rounded-md border border-black bg-white px-3 text-sm text-neutral-900">
                      {BUDGET_CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <Field label="Budget Amount" id="budget" placeholder={`e.g. ${budgetCurrency === "INR" ? "2500000" : "25000"}`} value={budget} onChange={setBudget} />
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-neutral-900">Source of Funding</Label>
                    <select value={fundingSource} onChange={(e) => setFundingSource(e.target.value)} className="w-full h-10 rounded-md border border-black bg-white px-3 text-sm text-neutral-900">
                      <option value="">Select...</option>
                      <option value="self">Self-Funded</option>
                      <option value="family">Family-Sponsored</option>
                      <option value="loan">Education Loan</option>
                      <option value="scholarship">Scholarship</option>
                      <option value="employer">Employer-Sponsored</option>
                      <option value="mixed">Mixed Sources</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input type="checkbox" id="bankStmt" checked={bankStatementAvailable} onChange={(e) => setBankStatementAvailable(e.target.checked)} className="h-4 w-4 rounded border-black" />
                    <Label htmlFor="bankStmt" className="text-sm text-neutral-900">Bank Statement Available</Label>
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-4">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Visa & Immigration History</p>
                  <div className="space-y-3">
                    <Field label="Current Visa Status" id="visaStatus" placeholder="e.g. Tourist, Student Visa, None" value={currentVisaStatus} onChange={setCurrentVisaStatus} />
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="visaRefusal" checked={hasVisaRefusals} onChange={(e) => setHasVisaRefusals(e.target.checked)} className="h-4 w-4 rounded border-black" />
                      <Label htmlFor="visaRefusal" className="text-sm text-neutral-900">Previous Visa Refusals</Label>
                    </div>
                    {hasVisaRefusals && (
                      <textarea value={visaRefusalDetails} onChange={(e) => setVisaRefusalDetails(e.target.value)} rows={2} placeholder="Country, date, and reason for refusal..."
                        className="w-full rounded-md border border-black bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500" />
                    )}
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="studyAbroad" checked={hasStudiedAbroad} onChange={(e) => setHasStudiedAbroad(e.target.checked)} className="h-4 w-4 rounded border-black" />
                      <Label htmlFor="studyAbroad" className="text-sm text-neutral-900">Previous Study Abroad Experience</Label>
                    </div>
                    {hasStudiedAbroad && (
                      <textarea value={studyAbroadDetails} onChange={(e) => setStudyAbroadDetails(e.target.value)} rows={2} placeholder="Institution, country, duration, and reason for leaving..."
                        className="w-full rounded-md border border-black bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500" />
                    )}
                  </div>
                </div>
              </div>
            </Section>

            {/* SECTION 6: Study Preferences */}
            <Section title="Study Preferences" icon={Globe}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-neutral-900">Study Level</Label>
                  <select value={studyLevel} onChange={(e) => setStudyLevel(e.target.value)} className="w-full h-10 rounded-md border border-black bg-white px-3 text-sm text-neutral-900">
                    <option value="Undergraduate">Undergraduate (Bachelor&apos;s)</option>
                    <option value="Postgraduate">Postgraduate (Master&apos;s)</option>
                    <option value="PhD">PhD / Doctorate</option>
                    <option value="Diploma">Diploma / Certificate</option>
                    <option value="Foundation">Foundation / Pathway</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-neutral-900">Country Preferences</Label>
                  <button type="button" onClick={() => setCountriesExpanded(!countriesExpanded)} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    {countriesExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    {countryPreferences.length > 0 ? `${countryPreferences.length} selected` : "Select countries"}
                  </button>
                  {countriesExpanded && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {COUNTRIES.map((c) => (
                        <button key={c} type="button" onClick={() => toggleCountry(c)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${countryPreferences.includes(c) ? "bg-blue-600 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-black"}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-neutral-900">Course/Field Preferences</Label>
                  <button type="button" onClick={() => setCoursesExpanded(!coursesExpanded)} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    {coursesExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    {coursePreferences.length > 0 ? `${coursePreferences.length} selected` : "Select fields"}
                  </button>
                  {coursesExpanded && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {COURSES.map((c) => (
                        <button key={c} type="button" onClick={() => toggleCourse(c)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${coursePreferences.includes(c) ? "bg-blue-600 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-black"}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Field label="Preferred Institutions (if any)" id="prefInst" placeholder="e.g. University of Oxford, University of Melbourne" value={preferredInstitutions} onChange={setPreferredInstitutions} />

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-neutral-900">Preferred Intake</Label>
                    <select value={intakePreference} onChange={(e) => setIntakePreference(e.target.value)} className="w-full h-10 rounded-md border border-black bg-white px-3 text-sm text-neutral-900">
                      <option value="">Select...</option>
                      <option value="Jan 2026">January 2026</option>
                      <option value="Feb 2026">February 2026</option>
                      <option value="May 2026">May 2026</option>
                      <option value="Jul 2026">July 2026</option>
                      <option value="Sep 2026">September 2026</option>
                      <option value="Oct 2026">October 2026</option>
                      <option value="Jan 2027">January 2027</option>
                      <option value="Sep 2027">September 2027</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-neutral-900">Accommodation</Label>
                    <select value={accommodationPref} onChange={(e) => setAccommodationPref(e.target.value)} className="w-full h-10 rounded-md border border-black bg-white px-3 text-sm text-neutral-900">
                      <option value="">Select...</option>
                      <option value="on-campus">On-Campus</option>
                      <option value="off-campus">Off-Campus</option>
                      <option value="homestay">Homestay</option>
                      <option value="no-preference">No Preference</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-neutral-900">Post-Study Work Interest</Label>
                  <select value={postStudyWork} onChange={(e) => setPostStudyWork(e.target.value)} className="w-full h-10 rounded-md border border-black bg-white px-3 text-sm text-neutral-900">
                    <option value="">Select...</option>
                    <option value="yes">Yes, interested in post-study work visa</option>
                    <option value="no">No, planning to return home</option>
                    <option value="undecided">Not sure yet</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-neutral-900">Additional Notes</Label>
                  <textarea value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} rows={3} placeholder="Study gaps, special requirements, specific university queries..."
                    className="w-full rounded-md border border-black bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500" />
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <input type="checkbox" id="consent" checked={consentGiven} onChange={(e) => setConsentGiven(e.target.checked)} className="h-4 w-4 rounded border-black mt-0.5" />
                  <Label htmlFor="consent" className="text-xs text-neutral-700 leading-relaxed">
                    I confirm that the student/guardian has provided consent to share their personal and educational data with partner institutions for the purpose of study abroad applications.
                  </Label>
                </div>
              </div>
            </Section>

            <div className="flex justify-end gap-3 pt-2 border-t border-black">
              <Button type="button" variant="outline" onClick={handleClose} className="text-neutral-900 border-black">Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, icon: Icon, defaultOpen = false, children }: { title: string; icon: React.ElementType; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="border border-black rounded-lg overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 bg-neutral-100 hover:bg-neutral-200 transition-colors">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-neutral-600" />
          <span className="font-semibold text-sm text-neutral-900">{title}</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-neutral-600" /> : <ChevronDown className="h-4 w-4 text-neutral-600" />}
      </button>
      {open && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
}

function Field({ label, id, type = "text", placeholder, value, onChange, required }: { label: string; id: string; type?: string; placeholder?: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-semibold text-neutral-900">{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} required={required} className="bg-white border-black text-neutral-900 placeholder:text-neutral-500" />
    </div>
  );
}
