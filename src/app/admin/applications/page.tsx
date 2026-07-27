"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, AlertCircle, X, Filter } from "lucide-react";
import { getAllApplicationsWithAgent } from "@/lib/actions/admin";
import { STAGE_LABELS, STAGE_ORDER, type Stage } from "@/lib/db/schema";
import { timeAgo } from "@/lib/time-ago";

const stageColors: Record<string, string> = {
  lead: "bg-neutral-100 text-neutral-700",
  application_submitted: "bg-blue-100 text-blue-700",
  offer_received: "bg-amber-100 text-amber-700",
  visa_processing: "bg-purple-100 text-purple-700",
  visa_approved: "bg-green-100 text-green-700",
};

export default function AdminApplicationsPage() {
  const [applications, setApplications] = React.useState<Awaited<ReturnType<typeof getAllApplicationsWithAgent>>>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [stageFilter, setStageFilter] = React.useState<string>("all");
  const [agentFilter, setAgentFilter] = React.useState<string>("all");

  React.useEffect(() => {
    async function load() {
      try {
        const data = await getAllApplicationsWithAgent();
        setApplications(data);
      } catch {
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const agents = React.useMemo(() => {
    const map = new Map<string, { name: string; count: number }>();
    for (const a of applications) {
      if (!a.agentId) continue;
      const existing = map.get(a.agentId);
      if (existing) {
        existing.count++;
      } else {
        map.set(a.agentId, { name: a.agentName ?? "Unknown", count: 1 });
      }
    }
    return Array.from(map.entries()).map(([id, data]) => ({ id, ...data }));
  }, [applications]);

  const filtered = applications.filter((a) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || a.studentName.toLowerCase().includes(q) || a.university.toLowerCase().includes(q) || a.course.toLowerCase().includes(q);
    const matchesStage = stageFilter === "all" || a.stage === stageFilter;
    const matchesAgent = agentFilter === "all" || a.agentId === agentFilter;
    return matchesSearch && matchesStage && matchesAgent;
  });

  const stageCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of STAGE_ORDER) {
      counts[s] = applications.filter((a) => a.stage === s).length;
    }
    return counts;
  }, [applications]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-red-600 mx-auto mb-3" />
          <p className="text-sm text-neutral-500">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
          <p className="text-neutral-700">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">All Applications</h1>
        <p className="text-neutral-600 mt-1">Browse every application across all agents</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {STAGE_ORDER.map((stage) => (
          <button
            key={stage}
            onClick={() => setStageFilter(stageFilter === stage ? "all" : stage)}
            className={`p-3 rounded-xl border text-center transition-all ${
              stageFilter === stage
                ? "border-red-300 bg-red-50 shadow-sm"
                : "border-neutral-200 bg-white hover:bg-neutral-50"
            }`}
          >
            <p className={`text-2xl font-bold ${stageFilter === stage ? "text-red-700" : "text-neutral-900"}`}>
              {stageCounts[stage]}
            </p>
            <p className="text-[10px] text-neutral-500 mt-0.5 leading-tight">
              {STAGE_LABELS[stage as Stage].split(" ").length > 2
                ? STAGE_LABELS[stage as Stage].split(" ").slice(0, 2).join(" ")
                : STAGE_LABELS[stage as Stage]}
            </p>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-sm font-semibold text-neutral-900">
              Applications ({filtered.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search student, uni..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-black bg-white text-neutral-900 placeholder:text-neutral-500 w-44 focus:outline-none focus:ring-1 focus:ring-red-500"
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
                className="py-1.5 px-2 text-xs rounded-lg border border-black bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="all">All Stages</option>
                {STAGE_ORDER.map((s) => (
                  <option key={s} value={s}>{STAGE_LABELS[s]}</option>
                ))}
              </select>
              <select
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                className="py-1.5 px-2 text-xs rounded-lg border border-black bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="all">All Agents</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-10 w-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm text-neutral-700">
                {search || stageFilter !== "all" || agentFilter !== "all"
                  ? "No applications match your filters"
                  : "No applications yet"}
              </p>
              {(search || stageFilter !== "all" || agentFilter !== "all") && (
                <button
                  onClick={() => { setSearch(""); setStageFilter("all"); setAgentFilter("all"); }}
                  className="text-xs text-red-600 hover:text-red-700 mt-1"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {filtered.map((app) => (
                <div key={app.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-neutral-900 truncate">{app.studentName}</p>
                      <Badge className={`text-[10px] ${stageColors[app.stage] || ""}`}>
                        {STAGE_LABELS[app.stage as Stage]}
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-600 truncate">{app.university}</p>
                    <p className="text-xs text-neutral-500 truncate">{app.course}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {app.agentName ?? "Unassigned"}
                    </Badge>
                    <span className="text-[10px] text-neutral-500">Updated {timeAgo(app.updatedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
