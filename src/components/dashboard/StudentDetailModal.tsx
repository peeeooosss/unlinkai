"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Globe,
  FileText,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
  Shield,
  GraduationCap,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  PlusCircle,
  Briefcase,
  CreditCard,
  BookOpen,
  MapPin,
  Heart,
  Pencil,
  AlertTriangle,
} from "lucide-react";
import { getStudentById } from "@/lib/actions/students";
import { updateApplicationStage } from "@/lib/actions/applications";
import { verifyDocument } from "@/lib/actions/documents";
import { STAGE_ORDER, STAGE_LABELS, type Stage, type Student } from "@/lib/db/schema";
import { AddDocumentModal } from "./AddDocumentModal";
import { EditStudentFlow } from "./EditStudentFlow";

type StudentDetail = NonNullable<Awaited<ReturnType<typeof getStudentById>>>;

interface StudentDetailModalProps {
  studentId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const stageColors: Record<string, string> = {
  lead: "bg-neutral-100 text-neutral-700",
  application_submitted: "bg-blue-100 text-blue-700",
  offer_received: "bg-amber-100 text-amber-700",
  visa_processing: "bg-purple-100 text-purple-700",
  visa_approved: "bg-green-100 text-green-700",
};

const stageIcons: Record<string, string> = {
  lead: "📋",
  application_submitted: "📤",
  offer_received: "🎓",
  visa_processing: "🛂",
  visa_approved: "✅",
};

const docTypeLabels: Record<string, string> = {
  passport: "Passport Copy",
  financial: "Financial Documents",
  scores: "Test Scores",
  medical: "Medical Exam",
  other: "Other",
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function safeJsonParse(val: string | null | undefined): any {
  if (!val) return null;
  try {
    return JSON.parse(val);
  } catch {
    return null;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function FieldRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-baseline gap-2 py-1">
      <span className="text-[11px] font-medium text-neutral-500 w-28 shrink-0">{label}</span>
      <span className="text-sm text-neutral-900">{value}</span>
    </div>
  );
}

function EmptyState({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="text-center py-6">
      <Icon className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
      <p className="text-xs text-neutral-700">{text}</p>
    </div>
  );
}

function TagList({ items }: { items: string[] }) {
  if (!items.length) return <span className="text-xs text-neutral-500">None specified</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <Badge key={i} variant="secondary" className="text-[10px] !text-neutral-900">{item}</Badge>
      ))}
    </div>
  );
}

function CollapsibleSection({
  title,
  icon: Icon,
  count,
  defaultOpen = false,
  children,
  badge,
}: {
  title: string;
  icon: React.ElementType;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
  badge?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className="border border-black rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-neutral-900 bg-white hover:bg-neutral-50 transition-colors"
      >
        {open ? <ChevronDown className="h-4 w-4 text-neutral-600" /> : <ChevronRight className="h-4 w-4 text-neutral-600" />}
        <Icon className="h-4 w-4 text-neutral-600" />
        <span className="flex-1 text-left">{title}</span>
        {count !== undefined && (
          <Badge variant="secondary" className="text-[10px] h-5 px-1.5 !text-neutral-900">
            {count}
          </Badge>
        )}
        {badge}
      </button>
      {open && <div className="px-4 pb-4 border-t border-black">{children}</div>}
    </div>
  );
}

function StageSelector({
  currentStage,
  applicationId,
  onStageChange,
}: {
  currentStage: string;
  applicationId: string;
  onStageChange: (app: string, stage: Stage) => Promise<void>;
}) {
  const currentIndex = STAGE_ORDER.indexOf(currentStage as Stage);

  return (
    <div className="mt-4">
      <p className="text-[11px] font-medium text-neutral-900 mb-2 uppercase tracking-wider">Move to Stage</p>
      <div className="flex gap-1.5 flex-wrap">
        {STAGE_ORDER.map((stage, i) => {
          const isCurrent = stage === currentStage;
          const isPast = i < currentIndex;
          const isFuture = i > currentIndex;
          return (
            <button
              key={stage}
              disabled={isCurrent}
              onClick={() => onStageChange(applicationId, stage)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all border ${
                isCurrent
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : isPast
                  ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                  : "bg-neutral-50 text-neutral-500 border-black hover:bg-neutral-100"
              }`}
            >
              {isPast && <Check className="h-3 w-3" />}
              {isCurrent && <ArrowRight className="h-3 w-3" />}
              <span className="hidden sm:inline">{STAGE_LABELS[stage]}</span>
              <span className="sm:hidden">{stageIcons[stage]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function StudentDetailModal({ studentId, open, onOpenChange }: StudentDetailModalProps) {
  const [student, setStudent] = React.useState<StudentDetail | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [updating, setUpdating] = React.useState<string | null>(null);
  const [addDocOpen, setAddDocOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);

  React.useEffect(() => {
    if (open && studentId) {
      setLoading(true);
      getStudentById(studentId).then((data) => {
        setStudent(data);
        setLoading(false);
      });
    }
  }, [open, studentId]);

  const handleStageChange = async (applicationId: string, newStage: Stage) => {
    if (!student) return;
    setUpdating(applicationId);
    await updateApplicationStage(applicationId, newStage);
    const updated = await getStudentById(studentId!);
    setStudent(updated);
    setUpdating(null);
  };

  const handleVerifyDocument = async (documentId: string) => {
    if (!student) return;
    await verifyDocument(documentId);
    const updated = await getStudentById(studentId!);
    setStudent(updated);
  };

  const handleRefresh = async () => {
    if (!studentId) return;
    const updated = await getStudentById(studentId);
    setStudent(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0 bg-white border-black">
        {loading || !student ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-blue-600" />
          </div>
        ) : (
          <>
            <DialogHeader className="sticky top-0 z-10 bg-white border-b border-black px-6 py-4">
              <DialogTitle className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-sm shadow-md">
                  {student.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-neutral-900">{student.title ? `${student.title} ` : ""}{student.name}
                    {student.status === "draft" && (
                      <Badge className="ml-2 bg-amber-100 text-amber-700 text-[10px] font-medium align-middle">Draft</Badge>
                    )}
                  </p>
                  <p className="text-xs text-neutral-700">
                    {student.nationality} · {student.educationLevel} · ID: {student.id}
                  </p>
                </div>
                {student.applications.length > 0 && (
                  <Badge className={`${stageColors[student.applications[0].stage]} text-xs`}>
                    {STAGE_LABELS[student.applications[0].stage as Stage]}
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 border-black text-neutral-900 hover:bg-neutral-100"
                  onClick={() => setEditOpen(true)}
                >
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
              </DialogTitle>
            </DialogHeader>

            {student.status === "draft" && (
              <div className="mx-6 mt-4 flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-300">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800">Incomplete Profile (Draft)</p>
                  <p className="text-xs text-amber-600">This student profile is incomplete. Complete the profile to start applications.</p>
                </div>
                <Button
                  size="sm"
                  className="h-8 bg-amber-600 hover:bg-amber-700 text-white text-xs shrink-0"
                  onClick={() => setEditOpen(true)}
                >
                  Complete Profile
                </Button>
              </div>
            )}

            <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
              {/* Quick Info Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-neutral-100 border border-black px-3 py-2">
                  <Mail className="h-3.5 w-3.5 text-neutral-600" />
                  <span className="text-xs text-neutral-900 truncate">{student.email}</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-neutral-100 border border-black px-3 py-2">
                  <Phone className="h-3.5 w-3.5 text-neutral-600" />
                  <span className="text-xs text-neutral-900">{student.phone}</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-neutral-100 border border-black px-3 py-2">
                  <Globe className="h-3.5 w-3.5 text-neutral-600" />
                  <span className="text-xs text-neutral-900">{student.nationality}</span>
                </div>
                {student.passportNumber && (
                  <div className="flex items-center gap-2 rounded-lg bg-neutral-100 border border-black px-3 py-2">
                    <Shield className="h-3.5 w-3.5 text-neutral-600" />
                    <span className="text-xs text-neutral-900">{student.passportNumber}</span>
                  </div>
                )}
              </div>

              {/* Applications */}
              <CollapsibleSection
                title="Applications"
                icon={GraduationCap}
                count={student.applications.length}
                defaultOpen={true}
              >
                <div className="space-y-4 pt-3">
                  {student.applications.map((app) => {
                    const stageIndex = STAGE_ORDER.indexOf(app.stage as Stage);
                    return (
                      <div key={app.id} className="rounded-lg border border-black bg-neutral-50 p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-sm text-neutral-900">{app.university}</p>
                            <p className="text-xs text-neutral-700">{app.course}</p>
                          </div>
                          <div className="text-right flex flex-col items-end gap-1">
                            <Badge className={`${stageColors[app.stage]} text-[10px]`}>
                              {STAGE_LABELS[app.stage as Stage]}
                            </Badge>
                            {app.accommodation && (
                              <Badge className={`text-[10px] ${app.accommodation === "yes" ? "bg-blue-100 text-blue-700" : "bg-neutral-100 text-neutral-600"}`}>
                                {app.accommodation === "yes" ? "Needs Accommodation" : "No Accommodation"}
                              </Badge>
                            )}
                            {app.insurance && (
                              <Badge className={`text-[10px] ${app.insurance === "yes" ? "bg-green-100 text-green-700" : app.insurance === "no" ? "bg-amber-100 text-amber-700" : "bg-neutral-100 text-neutral-600"}`}>
                                {app.insurance === "yes" ? "Insurance Paid" : app.insurance === "no" ? "Insurance Pending" : "N/A"}
                              </Badge>
                            )}
                            <p className="text-[10px] text-neutral-600 mt-1">Updated {app.updatedAt}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 mb-3">
                          {STAGE_ORDER.map((s, i) => (
                            <div key={s} className="flex-1 flex flex-col items-center gap-1">
                              <div className={`h-1.5 w-full rounded-full transition-colors ${i <= stageIndex ? "bg-blue-600" : "bg-neutral-200"}`} />
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-neutral-900 mb-1">
                          {STAGE_ORDER.map((s, i) => (
                            <span key={s} className={`${i <= stageIndex ? "text-blue-600 font-medium" : ""}`}>
                              {stageIcons[s]}
                            </span>
                          ))}
                        </div>

                        <StageSelector currentStage={app.stage} applicationId={app.id} onStageChange={handleStageChange} />

                        {updating === app.id && (
                          <div className="flex items-center gap-2 mt-2 text-xs text-blue-600">
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                            Updating stage...
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CollapsibleSection>

              {/* Education History */}
              <CollapsibleSection
                title="Education History"
                icon={GraduationCap}
                count={safeJsonParse(student.educationHistory)?.length}
                defaultOpen={false}
              >
                <div className="space-y-3 pt-3">
                  {(() => {
                    const entries = safeJsonParse(student.educationHistory);
                    if (!entries?.length) return <EmptyState icon={GraduationCap} text="No education history recorded" />;
                    return entries.map((entry: Record<string, any>, i: number) => (
                      <div key={i} className="rounded-lg border border-black bg-white p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="text-[10px] !text-neutral-900">#{i + 1}{entry.stillEnrolled ? " (In Progress)" : ""}</Badge>
                        </div>
                        <FieldRow label="Institution" value={entry.institution as string} />
                        <FieldRow label="Country" value={entry.country as string} />
                        <FieldRow label="Degree" value={entry.degree as string} />
                        <FieldRow label="Field of Study" value={entry.fieldOfStudy as string} />
                        <FieldRow label="Duration" value={`${entry.startYear || "?"} – ${entry.stillEnrolled ? "Present" : entry.endYear || "?"}`} />
                        <FieldRow label="GPA / Score" value={entry.gpa as string} />
                        {entry.gradingScale && <FieldRow label="Grading Scale" value={String(entry.gradingScale).replace(/-/g, " ")} />}
                      </div>
                    ));
                  })()}
                </div>
              </CollapsibleSection>

              {/* English & Standardized Tests */}
              <CollapsibleSection
                title="English & Standardized Tests"
                icon={FileText}
                count={(safeJsonParse(student.englishTestDetails)?.length || 0) + (safeJsonParse(student.standardizedTests)?.length || 0)}
                defaultOpen={false}
              >
                <div className="space-y-3 pt-3">
                  {(() => {
                    const tests = safeJsonParse(student.englishTestDetails);
                    if (!tests?.length) return <EmptyState icon={FileText} text="No English test scores recorded" />;
                    return (
                      <div>
                        <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-2">English Proficiency</p>
                        {tests.map((t: any, i: number) => (
                          <div key={i} className="rounded-lg border border-black bg-white p-3 mb-2">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-[10px] !text-neutral-900">{t.testType as string}</Badge>
                              <span className="text-sm font-semibold text-neutral-900">Overall: {t.overallScore as string}</span>
                            </div>
                            {t.testType === "IELTS" && t.listening && (
                              <div className="grid grid-cols-4 gap-2 text-xs">
                                <div><span className="text-neutral-500">L:</span> <span className="font-medium">{String(t.listening)}</span></div>
                                <div><span className="text-neutral-500">R:</span> <span className="font-medium">{String(t.reading)}</span></div>
                                <div><span className="text-neutral-500">W:</span> <span className="font-medium">{String(t.writing)}</span></div>
                                <div><span className="text-neutral-500">S:</span> <span className="font-medium">{String(t.speaking)}</span></div>
                              </div>
                            )}
                            {t.testDate && <p className="text-[10px] text-neutral-500 mt-1">Taken: {String(t.testDate)}</p>}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                  {(() => {
                    const std = safeJsonParse(student.standardizedTests);
                    if (!std?.length) return null;
                    return (
                      <div className="mt-3">
                        <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-2">Standardized Tests</p>
                        {std.map((t: any, i: number) => (
                          <div key={i} className="rounded-lg border border-black bg-white p-3 mb-2">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-[10px] !text-neutral-900">{t.testType as string}</Badge>
                              <span className="text-sm font-semibold text-neutral-900">{t.score as string}</span>
                            </div>
                            {t.breakdown && <p className="text-xs text-neutral-700">{String(t.breakdown)}</p>}
                            {t.testDate && <p className="text-[10px] text-neutral-500 mt-1">Taken: {String(t.testDate)}</p>}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </CollapsibleSection>

              {/* Work Experience */}
              <CollapsibleSection
                title="Work Experience"
                icon={Briefcase}
                count={safeJsonParse(student.workExperience)?.length}
                defaultOpen={false}
              >
                <div className="space-y-3 pt-3">
                  {(() => {
                    const work = safeJsonParse(student.workExperience);
                    if (!work?.length) return <EmptyState icon={Briefcase} text="No work experience recorded" />;
                    return work.map((w: any, i: number) => (
                      <div key={i} className="rounded-lg border border-black bg-white p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-[10px] !text-neutral-900">{String(w.employmentType)}</Badge>
                          {w.isCurrent && <Badge className="bg-green-100 text-green-700 text-[10px]">Current</Badge>}
                        </div>
                        <FieldRow label="Employer" value={w.employer as string} />
                        <FieldRow label="Job Title" value={w.jobTitle as string} />
                        <FieldRow label="Industry" value={w.industry as string} />
                        <FieldRow label="Duration" value={`${w.startDate || "?"} – ${w.isCurrent ? "Present" : w.endDate || "?"}`} />
                        {w.description && <FieldRow label="Responsibilities" value={w.description as string} />}
                      </div>
                    ));
                  })()}
                </div>
              </CollapsibleSection>

              {/* Financial & Visa Info */}
              <CollapsibleSection
                title="Financial & Visa Information"
                icon={CreditCard}
                defaultOpen={false}
              >
                <div className="space-y-3 pt-3">
                  {(() => {
                    const fin = safeJsonParse(student.financialInfo);
                    if (!fin) return <EmptyState icon={CreditCard} text="No financial information recorded" />;
                    return (
                      <div className="rounded-lg border border-black bg-white p-3">
                        <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-2">Financial Details</p>
                        <FieldRow label="Budget" value={fin.budget ? `${fin.budgetCurrency} ${fin.budget}` : null} />
                        <FieldRow label="Funding Source" value={fin.fundingSource as string} />
                        <FieldRow label="Bank Statement" value={fin.bankStatementAvailable ? "Available" : "Not available"} />
                      </div>
                    );
                  })()}
                  {(() => {
                    const visa = safeJsonParse(student.visaHistory);
                    if (!visa) return null;
                    return (
                      <div className="rounded-lg border border-black bg-white p-3 mt-2">
                        <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-2">Visa & Immigration</p>
                        <FieldRow label="Current Visa Status" value={visa.currentVisaStatus as string} />
                        <FieldRow label="Prior Visa Refusals" value={visa.hasVisaRefusals ? "Yes" : "No"} />
                        {visa.hasVisaRefusals && visa.visaRefusalDetails && (
                          <FieldRow label="Refusal Details" value={visa.visaRefusalDetails as string} />
                        )}
                        <FieldRow label="Study Abroad History" value={visa.hasStudiedAbroad ? "Yes" : "No"} />
                        {visa.hasStudiedAbroad && visa.studyAbroadDetails && (
                          <FieldRow label="Abroad Details" value={visa.studyAbroadDetails as string} />
                        )}
                      </div>
                    );
                  })()}
                </div>
              </CollapsibleSection>

              {/* Study Preferences */}
              <CollapsibleSection
                title="Study Preferences"
                icon={Globe}
                defaultOpen={false}
              >
                <div className="space-y-3 pt-3">
                  <div className="rounded-lg border border-black bg-white p-3">
                    <FieldRow label="Study Level" value={student.educationLevel} />
                    <FieldRow label="Preferred Intake" value={student.intakePreference} />
                    <FieldRow label="Accommodation" value={student.accommodationPreference} />
                    <FieldRow label="Post-Study Work" value={student.postStudyWorkInterest} />
                    <FieldRow label="Preferred Institutions" value={student.preferredInstitutions} />
                    <div className="py-1">
                      <span className="text-[11px] font-medium text-neutral-500 w-28 inline-block">Countries</span>
                      <div className="mt-1">
                        <TagList items={student.countryPreferences ? student.countryPreferences.split(",") : []} />
                      </div>
                    </div>
                    <div className="py-1">
                      <span className="text-[11px] font-medium text-neutral-500 w-28 inline-block">Course Fields</span>
                      <div className="mt-1">
                        <TagList items={student.coursePreferences ? student.coursePreferences.split(",") : []} />
                      </div>
                    </div>
                    <FieldRow label="Additional Notes" value={student.additionalNotes} />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Additional Details */}
              <CollapsibleSection
                title="Additional Details"
                icon={Heart}
                defaultOpen={false}
              >
                <div className="space-y-3 pt-3">
                  <div className="rounded-lg border border-black bg-white p-3">
                    <FieldRow label="Date of Birth" value={student.dateOfBirth} />
                    <FieldRow label="Gender" value={student.gender} />
                    <FieldRow label="Country of Residence" value={student.countryOfResidence} />
                    <FieldRow label="Address" value={student.address} />
                    <FieldRow label="City" value={student.city} />
                    <FieldRow label="Passport Expiry" value={student.passportExpiry} />
                    <FieldRow label="WhatsApp" value={student.whatsappNumber} />
                    <FieldRow label="Native Language" value={student.nativeLanguage} />
                    <div className="border-t border-neutral-200 mt-2 pt-2">
                      <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-1">Emergency Contact</p>
                    </div>
                    <FieldRow label="Contact Name" value={student.emergencyContactName} />
                    <FieldRow label="Contact Phone" value={student.emergencyContactPhone} />
                    {student.consentGiven && (
                      <div className="mt-2 flex items-center gap-1.5 text-green-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">Consent given</span>
                      </div>
                    )}
                  </div>
                </div>
              </CollapsibleSection>

              {/* Documents */}
              <CollapsibleSection
                title="Documents"
                icon={FileText}
                count={student.documents.length}
                defaultOpen={true}
                badge={
                  student.documents.length > 0 ? (
                    <Badge
                      variant="secondary"
                      className={`text-[10px] h-5 px-1.5 ml-1 ${
                        student.documents.every((d) => d.verified)
                          ? "!bg-green-100 !text-green-700"
                          : "!bg-amber-100 !text-amber-700"
                      }`}
                    >
                      {student.documents.filter((d) => d.verified).length}/{student.documents.length} verified
                    </Badge>
                  ) : null
                }
              >
                <div className="flex items-center justify-end pt-3 mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[11px] border-black text-neutral-900 hover:bg-neutral-100"
                    onClick={() => setAddDocOpen(true)}
                  >
                    <PlusCircle className="h-3 w-3 mr-1" />
                    Add Document
                  </Button>
                </div>
                <div className="space-y-2">
                  {student.documents.length === 0 ? (
                    <EmptyState icon={FileText} text="No documents uploaded yet" />
                  ) : (
                    student.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-lg border border-black bg-white p-3 hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${doc.verified ? "bg-green-100" : "bg-amber-100"}`}>
                            <FileText className={`h-4 w-4 ${doc.verified ? "text-green-600" : "text-amber-600"}`} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-900">{doc.fileName}</p>
                            <p className="text-[11px] text-neutral-700">
                              {docTypeLabels[doc.type] || doc.type} · Uploaded {doc.uploadedAt}
                            </p>
                          </div>
                        </div>
                        {doc.verified ? (
                          <Badge className="bg-green-100 text-green-700 text-[10px]">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-[11px] border-amber-300 text-amber-700 hover:bg-amber-50"
                            onClick={() => handleVerifyDocument(doc.id)}
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Verify
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CollapsibleSection>

              {/* Activity Log */}
              <CollapsibleSection
                title="Activity Log"
                icon={Clock}
                count={student.activities.length}
                defaultOpen={false}
              >
                <div className="space-y-2 pt-3">
                  {student.activities.length === 0 ? (
                    <EmptyState icon={Clock} text="No activity yet" />
                  ) : (
                    student.activities.map((act, idx) => (
                      <div
                        key={act.id}
                        className="flex items-start gap-3 rounded-lg bg-neutral-100 border border-black p-3"
                      >
                        <div className="relative mt-1">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          {idx < student.activities.length - 1 && (
                            <div className="absolute top-3 left-0.5 h-full w-px bg-neutral-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-neutral-900">{act.note}</p>
                          <p className="text-[11px] text-neutral-700 mt-0.5">
                            {act.performedBy} · {act.createdAt}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-[10px] h-4 px-1 !text-neutral-900 flex-shrink-0">
                          {act.action.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CollapsibleSection>
            </div>
          </>
        )}
      </DialogContent>

      {student && (
        <AddDocumentModal
          open={addDocOpen}
          onOpenChange={setAddDocOpen}
          studentId={student.id}
          onDocumentAdded={handleRefresh}
        />
      )}

      {student && (
        <EditStudentFlow
          student={student}
          open={editOpen}
          onOpenChange={setEditOpen}
          onStudentUpdated={handleRefresh}
        />
      )}
    </Dialog>
  );
}
