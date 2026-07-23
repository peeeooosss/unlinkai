"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Clock, AlertCircle, CheckCircle, PlusCircle, Search, Filter, X } from "lucide-react";
import { getApplications, getApplicationCounts } from "@/lib/actions/applications";
import { getStudents } from "@/lib/actions/students";
import { STAGE_ORDER, STAGE_LABELS, type Stage } from "@/lib/db/schema";
import { StudentDetailModal } from "@/components/dashboard/StudentDetailModal";
import { AddApplicationModal } from "@/components/dashboard/AddApplicationModal";
import { EditApplicationModal } from "@/components/dashboard/EditApplicationModal";
import { Button } from "@/components/ui/button";

const stageColors: Record<string, string> = {
  lead: "bg-neutral-100 text-neutral-700",
  application_submitted: "bg-blue-100 text-blue-700",
  offer_received: "bg-amber-100 text-amber-700",
  visa_processing: "bg-purple-100 text-purple-700",
  visa_approved: "bg-green-100 text-green-700",
};

const stageStatus: Record<string, { icon: typeof CheckCircle; label: string; color: string }> = {
  visa_approved: { icon: CheckCircle, label: "Complete", color: "bg-green-100 text-green-700" },
  visa_processing: { icon: Clock, label: "In Progress", color: "bg-purple-100 text-purple-700" },
  offer_received: { icon: Clock, label: "In Progress", color: "bg-amber-100 text-amber-700" },
  application_submitted: { icon: Clock, label: "In Progress", color: "bg-blue-100 text-blue-700" },
  lead: { icon: AlertCircle, label: "Pending", color: "bg-neutral-100 text-neutral-700" },
};

interface ApplicationRow {
  id: string;
  studentName: string;
  studentId: string;
  course: string;
  university: string;
  stage: string;
  accommodation?: string | null;
  insurance?: string | null;
  submittedAt: string;
  updatedAt: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = React.useState<ApplicationRow[]>([]);
  const [counts, setCounts] = React.useState({ total: 0, inProgress: 0, approved: 0, pending: 0 });
  const [loading, setLoading] = React.useState(true);
  const [selectedStudentId, setSelectedStudentId] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [stageFilter, setStageFilter] = React.useState<string>("all");

  React.useEffect(() => {
    loadData();
    const onVisible = () => { if (document.visibilityState === "visible") loadData(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  async function loadData() {
    setLoading(true);
    const [apps, appCounts, studs] = await Promise.all([
      getApplications(),
      getApplicationCounts(),
      getStudents(),
    ]);

    const studentMap = new Map(studs.map((s) => [s.id, s.name]));

    const rows: ApplicationRow[] = apps.map((app) => ({
      id: app.id,
      studentName: studentMap.get(app.studentId) || "Unknown",
      studentId: app.studentId,
      course: app.course,
      university: app.university,
      stage: app.stage,
      accommodation: app.accommodation,
      insurance: app.insurance,
      submittedAt: app.submittedAt,
      updatedAt: app.updatedAt,
    }));

    const approved = appCounts.byStage.find((s) => s.stage === "visa_approved")?.count ?? 0;
    const inProgress = appCounts.total - approved;

    setApplications(rows);
    setCounts({
      total: appCounts.total,
      inProgress,
      approved,
      pending: appCounts.byStage.find((s) => s.stage === "lead")?.count ?? 0,
    });
    setLoading(false);
  }

  function handleRowClick(studentId: string) {
    setSelectedStudentId(studentId);
    setModalOpen(true);
  }

  const filtered = applications.filter((app) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || app.studentName.toLowerCase().includes(q) || app.university.toLowerCase().includes(q) || app.course.toLowerCase().includes(q) || app.id.toLowerCase().includes(q);
    const matchesStage = stageFilter === "all" || app.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Applications</h1>
          <p className="text-neutral-700 mt-1">Track and manage all applications</p>
        </div>
        <Button onClick={() => setAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Application
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Total Applications", value: counts.total },
          { title: "In Progress", value: counts.inProgress },
          { title: "Approved", value: counts.approved },
          { title: "Pending Review", value: counts.pending },
        ].map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-neutral-700">{stat.title}</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-sm font-semibold text-neutral-900">Application Pipeline</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search by name, university, course..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-black bg-white text-neutral-900 placeholder:text-neutral-500 w-48 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2">
                    <X className="h-3 w-3 text-neutral-400 hover:text-neutral-600" />
                  </button>
                )}
              </div>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="py-1.5 px-2 text-xs rounded-lg border border-black bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Stages</option>
                {STAGE_ORDER.map((s) => (
                  <option key={s} value={s}>{STAGE_LABELS[s]}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-blue-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="h-10 w-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm text-neutral-700">{search || stageFilter !== "all" ? "No applications match your filters" : "No applications yet"}</p>
              {(search || stageFilter !== "all") && (
                <button onClick={() => { setSearch(""); setStageFilter("all"); }} className="text-xs text-blue-600 hover:text-blue-700 mt-1">Clear filters</button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {filtered.map((app) => {
                const status = stageStatus[app.stage] || stageStatus.lead;
                const Icon = status.icon;
                return (
                  <div
                    key={app.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 hover:bg-neutral-50 cursor-pointer"
                    onClick={() => handleRowClick(app.studentId)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-sm text-neutral-700">{app.id}</span>
                        <span className="font-medium text-neutral-900">{app.studentName}</span>
                        <Badge className={`text-xs ${stageColors[app.stage] || ""}`}>
                          {STAGE_LABELS[app.stage as Stage] || app.stage}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-neutral-700 flex items-center gap-2">
                        <GraduationCap className="h-3 w-3" /> {app.university} — {app.course}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <Badge variant="outline" className={`text-xs ${status.color}`}>
                        <Icon className="h-3 w-3 mr-1" /> {status.label}
                      </Badge>
                      {app.accommodation && (
                        <Badge className={`text-xs ${app.accommodation === "yes" ? "bg-blue-100 text-blue-700" : "bg-neutral-100 text-neutral-600"}`}>
                          {app.accommodation === "yes" ? "Needs Accommodation" : "No Accommodation"}
                        </Badge>
                      )}
                      {app.insurance && (
                        <Badge className={`text-xs ${app.insurance === "yes" ? "bg-green-100 text-green-700" : app.insurance === "no" ? "bg-amber-100 text-amber-700" : "bg-neutral-100 text-neutral-600"}`}>
                          {app.insurance === "yes" ? "Insurance Paid" : app.insurance === "no" ? "Insurance Pending" : "N/A"}
                        </Badge>
                      )}
                      <span className="text-sm text-neutral-700">Updated: {app.updatedAt}</span>
                      <div onClick={(e) => e.stopPropagation()}>
                        <EditApplicationModal application={app} onUpdated={() => loadData()} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <StudentDetailModal
        studentId={selectedStudentId}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      <AddApplicationModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onApplicationCreated={() => loadData()}
      />
    </div>
  );
}
