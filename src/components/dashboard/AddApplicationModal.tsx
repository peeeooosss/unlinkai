"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, PlusCircle, Search, ChevronDown } from "lucide-react";
import { createApplication } from "@/lib/actions/applications";
import universities from "@/lib/data/universities.json";

interface AddApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplicationCreated?: () => void;
  preselectedStudentId?: string | null;
}

type Region = keyof typeof universities;

interface UniOption {
  name: string;
  region: Region;
  courses: { name: string; level: string; department: string; fee: number; currency: string; symbol: string; intakes: string[] }[];
}

function flattenUnis(): UniOption[] {
  const list: UniOption[] = [];
  for (const [region, unis] of Object.entries(universities) as [Region, typeof universities[Region]][]) {
    for (const uni of unis) {
      list.push({ name: uni.name, region, courses: uni.courses });
    }
  }
  return list;
}

const allUnis = flattenUnis();

export function AddApplicationModal({ open, onOpenChange, onApplicationCreated, preselectedStudentId }: AddApplicationModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    studentId: "",
    studentName: "",
    university: "",
    course: "",
    accommodation: "" as string,
    insurance: "" as string,
  });

  const [uniSearch, setUniSearch] = React.useState("");
  const [showUniDropdown, setShowUniDropdown] = React.useState(false);
  const [courseSearch, setCourseSearch] = React.useState("");
  const [showCourseDropdown, setShowCourseDropdown] = React.useState(false);

  const [students, setStudents] = React.useState<{ id: string; name: string }[]>([]);
  const [studentSearch, setStudentSearch] = React.useState("");
  const [showStudentDropdown, setShowStudentDropdown] = React.useState(false);

  const selectedUni = allUnis.find((u) => u.name === form.university);
  const availableCourses = selectedUni?.courses || [];

  React.useEffect(() => {
    if (open) {
      import("@/lib/actions/students").then(({ getStudents }) =>
        getStudents().then((s) => {
          setStudents(s.map((st) => ({ id: st.id, name: st.name })));
          if (preselectedStudentId) {
            const match = s.find((st) => st.id === preselectedStudentId);
            if (match) {
              setForm((prev) => ({ ...prev, studentId: match.id, studentName: match.name }));
              setStudentSearch(match.name);
            }
          }
        })
      );
    }
  }, [open, preselectedStudentId]);

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredUnis = allUnis.filter((u) =>
    u.name.toLowerCase().includes(uniSearch.toLowerCase()) ||
    u.region.toLowerCase().includes(uniSearch.toLowerCase())
  );

  const filteredCourses = availableCourses.filter((c) =>
    c.name.toLowerCase().includes(courseSearch.toLowerCase())
  );

  const handleSelectStudent = (id: string, name: string) => {
    setForm((prev) => ({ ...prev, studentId: id, studentName: name }));
    setStudentSearch(name);
    setShowStudentDropdown(false);
  };

  const handleSelectUni = (name: string) => {
    setForm((prev) => ({ ...prev, university: name, course: "" }));
    setUniSearch(name);
    setShowUniDropdown(false);
    setCourseSearch("");
  };

  const handleSelectCourse = (name: string) => {
    setForm((prev) => ({ ...prev, course: name }));
    setCourseSearch(name);
    setShowCourseDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId || !form.university || !form.course) return;

    setLoading(true);
    await createApplication({
      studentId: form.studentId,
      university: form.university,
      course: form.course,
      accommodation: form.accommodation || undefined,
      insurance: form.insurance || undefined,
    });
    setLoading(false);
    resetForm();
    onOpenChange(false);
    onApplicationCreated?.();
  };

  const resetForm = () => {
    setForm({ studentId: "", studentName: "", university: "", course: "", accommodation: "", insurance: "" });
    setStudentSearch("");
    setUniSearch("");
    setCourseSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v); }}>
      <DialogContent className="max-w-md bg-white border-black">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-neutral-900">
            <PlusCircle className="h-5 w-5 text-blue-600" />
            Add New Application
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student */}
          <div className="space-y-2 relative">
            <Label className="text-sm font-semibold text-neutral-900">Student *</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                placeholder="Search student by name..."
                value={studentSearch}
                onChange={(e) => { setStudentSearch(e.target.value); setShowStudentDropdown(true); setForm((prev) => ({ ...prev, studentId: "", studentName: "" })); }}
                onFocus={() => setShowStudentDropdown(true)}
                className="pl-10 bg-white border-black text-neutral-900 placeholder:text-neutral-500"
              />
            </div>
            {showStudentDropdown && studentSearch && !form.studentId && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-black rounded-lg shadow-lg max-h-40 overflow-y-auto">
                {filteredStudents.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-neutral-500">No students found</div>
                ) : (
                  filteredStudents.map((s) => (
                    <button key={s.id} type="button" onClick={() => handleSelectStudent(s.id, s.name)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-100 text-neutral-900">
                      {s.name} <span className="ml-2 text-xs text-neutral-500">{s.id}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* University */}
          <div className="space-y-2 relative">
            <Label className="text-sm font-semibold text-neutral-900">University *</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                placeholder="Search university by name or country..."
                value={uniSearch}
                onChange={(e) => { setUniSearch(e.target.value); setShowUniDropdown(true); setForm((prev) => ({ ...prev, university: "", course: "" })); setCourseSearch(""); }}
                onFocus={() => setShowUniDropdown(true)}
                className="pl-10 bg-white border-black text-neutral-900 placeholder:text-neutral-500"
              />
            </div>
            {showUniDropdown && uniSearch && !form.university && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-black rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredUnis.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-neutral-500">No universities found</div>
                ) : (
                  filteredUnis.map((u) => (
                    <button key={u.name + u.region} type="button" onClick={() => handleSelectUni(u.name)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-100 text-neutral-900 flex items-center justify-between">
                      <span className="font-medium">{u.name}</span>
                      <span className="text-xs text-neutral-500">{u.region}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Course */}
          <div className="space-y-2 relative">
            <Label className="text-sm font-semibold text-neutral-900">Course *</Label>
            {form.university ? (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                  <Input
                    placeholder="Search courses at this university..."
                    value={courseSearch}
                    onChange={(e) => { setCourseSearch(e.target.value); setShowCourseDropdown(true); setForm((prev) => ({ ...prev, course: "" })); }}
                    onFocus={() => setShowCourseDropdown(true)}
                    className="pl-10 bg-white border-black text-neutral-900 placeholder:text-neutral-500"
                  />
                </div>
                {showCourseDropdown && !form.course && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-black rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredCourses.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-neutral-500">No courses found</div>
                    ) : (
                      filteredCourses.map((c) => (
                        <button key={c.name} type="button" onClick={() => handleSelectCourse(c.name)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-100 text-neutral-900 flex items-center justify-between">
                          <div>
                            <span className="font-medium">{c.name}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded">{c.department}</span>
                              <span className="text-[10px] text-neutral-500">{c.level}</span>
                            </div>
                          </div>
                          <span className="text-xs text-green-700 font-medium">{c.symbol}{c.fee.toLocaleString()}/yr</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </>
            ) : (
              <Input
                placeholder="Select a university first"
                disabled
                className="bg-neutral-100 border-black text-neutral-500"
              />
            )}
          </div>

          {/* Accommodation */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-neutral-900">Accommodation</Label>
            <div className="flex gap-3">
              {["yes", "no"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, accommodation: v }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    form.accommodation === v ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  {v === "yes" ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>

          {/* Insurance */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-neutral-900">Insurance (IHS / OSHC)</Label>
            <div className="flex gap-3">
              {[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "na", label: "N/A" }].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, insurance: opt.value }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    form.insurance === opt.value ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading || !form.studentId || !form.university || !form.course}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Create Application"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
