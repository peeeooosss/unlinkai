"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, Search, UserPlus } from "lucide-react";
import { getStudents } from "@/lib/actions/students";
import { getApplications } from "@/lib/actions/applications";
import { STAGE_LABELS, type Stage } from "@/lib/db/schema";
import { StudentDetailModal } from "@/components/dashboard/StudentDetailModal";
import { CreateStudentFlow } from "@/components/dashboard/CreateStudentFlow";
import { AddApplicationModal } from "@/components/dashboard/AddApplicationModal";

const stageColors: Record<string, string> = {
  lead: "bg-neutral-100 text-neutral-700",
  application_submitted: "bg-blue-100 text-blue-700",
  offer_received: "bg-amber-100 text-amber-700",
  visa_processing: "bg-purple-100 text-purple-700",
  visa_approved: "bg-green-100 text-green-700",
};

interface StudentRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  educationLevel: string;
  latestStage: string;
  accommodation?: string | null;
  insurance?: string | null;
  appCount: number;
  status: string;
}

export default function StudentsPage() {
  const [students, setStudents] = React.useState<StudentRow[]>([]);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [totalStudents, setTotalStudents] = React.useState(0);
  const [draftCount, setDraftCount] = React.useState(0);
  const [selectedStudentId, setSelectedStudentId] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [createFlowOpen, setCreateFlowOpen] = React.useState(false);
  const [appModalOpen, setAppModalOpen] = React.useState(false);
  const [newStudentId, setNewStudentId] = React.useState<string | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<"all" | "draft">("all");

  React.useEffect(() => {
    loadStudents();
    const onVisible = () => { if (document.visibilityState === "visible") loadStudents(search || undefined, statusFilter === "draft" ? "draft" : undefined); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [statusFilter]);

  async function loadStudents(searchQuery?: string, status?: string) {
    setLoading(true);
    try {
      const [studs, apps, totalAll, totalDrafts] = await Promise.all([
        getStudents(searchQuery || undefined, status),
        getApplications(),
        getStudents(),
        getStudents(undefined, "draft"),
      ]);

      const appMap = new Map<string, typeof apps>();
      for (const app of apps) {
        const existing = appMap.get(app.studentId) || [];
        existing.push(app);
        appMap.set(app.studentId, existing);
      }

      const rows: StudentRow[] = studs.map((s) => {
        const studentApps = appMap.get(s.id) || [];
        const latestApp = studentApps.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
        return {
          id: s.id,
          name: s.name,
          email: s.email,
          phone: s.phone,
          nationality: s.nationality,
          educationLevel: s.educationLevel,
          latestStage: latestApp?.stage || "lead",
          accommodation: latestApp?.accommodation || null,
          insurance: latestApp?.insurance || null,
          appCount: studentApps.length,
          status: s.status || "complete",
        };
      });

      setStudents(rows);
      setTotalStudents(totalAll.length);
      setDraftCount(totalDrafts.length);
    } catch {
      setStudents([]);
      setTotalStudents(0);
      setDraftCount(0);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(value: string) {
    setSearch(value);
    if (value.length === 0 || value.length >= 2) {
      loadStudents(value, statusFilter === "draft" ? "draft" : undefined);
    }
  }

  function handleStatusFilter(filter: "all" | "draft") {
    setStatusFilter(filter);
    loadStudents(search || undefined, filter === "draft" ? "draft" : undefined);
  }

  function handleRowClick(studentId: string) {
    setSelectedStudentId(studentId);
    setModalOpen(true);
  }

  function handleStudentCreated(studentId: string) {
    loadStudents(search || undefined, statusFilter === "draft" ? "draft" : undefined);
    setNewStudentId(studentId);
    setAppModalOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Students</h1>
          <p className="text-neutral-700 mt-1">Manage your student portfolio</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setCreateFlowOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
          <Badge variant="secondary" className="text-xs !text-neutral-900">{totalStudents} Students</Badge>
          {draftCount > 0 && (
            <Badge className="bg-amber-100 text-amber-700 text-xs">{draftCount} Draft{draftCount !== 1 ? "s" : ""}</Badge>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              placeholder="Search students..."
              className="pl-10"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-black p-0.5 bg-neutral-100">
            {(["all", "draft"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => handleStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  statusFilter === filter
                    ? "bg-white text-neutral-900 shadow-sm border border-black"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {filter === "all" ? "All Students" : "Drafts"}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-blue-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    {["Student", "Nationality", "Education", "Latest Stage", "Applications", "Accommodation", "Insurance", "Contact"].map((col) => (
                      <th key={col} className="text-left p-4 text-xs font-semibold text-neutral-700 uppercase tracking-wider">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-neutral-50 cursor-pointer"
                      onClick={() => handleRowClick(student.id)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-700 to-amber-600 flex items-center justify-center text-white font-medium text-sm shrink-0">
                            {student.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm text-neutral-900">{student.name}</p>
                              {student.status === "draft" && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                  Draft
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-neutral-700 font-mono">{student.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-neutral-700">{student.nationality}</td>
                      <td className="p-4 text-sm text-neutral-700">{student.educationLevel}</td>
                      <td className="p-4">
                        <Badge className={`text-xs ${stageColors[student.latestStage] || ""}`}>
                          {STAGE_LABELS[student.latestStage as Stage] || student.latestStage}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-neutral-700">{student.appCount}</td>
                      <td className="p-4">
                        {student.accommodation ? (
                          <Badge className={`text-xs ${student.accommodation === "yes" ? "bg-blue-100 text-blue-700" : "bg-neutral-100 text-neutral-600"}`}>
                            {student.accommodation === "yes" ? "Yes" : "No"}
                          </Badge>
                        ) : (
                          <span className="text-xs text-neutral-400">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        {student.insurance ? (
                          <Badge className={`text-xs ${student.insurance === "yes" ? "bg-green-100 text-green-700" : student.insurance === "no" ? "bg-amber-100 text-amber-700" : "bg-neutral-100 text-neutral-600"}`}>
                            {student.insurance === "yes" ? "Paid" : student.insurance === "no" ? "Pending" : "N/A"}
                          </Badge>
                        ) : (
                          <span className="text-xs text-neutral-400">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="space-y-1 text-xs text-neutral-700">
                          <div className="flex items-center gap-1"><Mail className="h-3 w-3" /> {student.email}</div>
                          <div className="flex items-center gap-1"><Phone className="h-3 w-3" /> {student.phone}</div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <StudentDetailModal
        studentId={selectedStudentId}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      <CreateStudentFlow
        open={createFlowOpen}
        onOpenChange={setCreateFlowOpen}
        onStudentCreated={handleStudentCreated}
      />

      <AddApplicationModal
        open={appModalOpen}
        onOpenChange={setAppModalOpen}
        preselectedStudentId={newStudentId}
        onApplicationCreated={() => { loadStudents(); setNewStudentId(null); }}
      />
    </div>
  );
}
