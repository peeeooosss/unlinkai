"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, FileText, TrendingUp, AlertCircle, Shield, CheckCircle, Clock } from "lucide-react";
import { getAdminStats, getAdminApplicationCounts } from "@/lib/actions/admin";
import { STAGE_LABELS, type Stage } from "@/lib/db/schema";

const stageColors: Record<string, string> = {
  lead: "bg-neutral-100 text-neutral-700",
  application_submitted: "bg-blue-100 text-blue-700",
  offer_received: "bg-amber-100 text-amber-700",
  visa_processing: "bg-purple-100 text-purple-700",
  visa_approved: "bg-green-100 text-green-700",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState< Awaited<ReturnType<typeof getAdminStats>> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch {
        setError("Failed to load admin stats");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-red-600 mx-auto mb-3" />
          <p className="text-sm text-neutral-500">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
          <p className="text-neutral-700">{error ?? "Failed to load data"}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
        <p className="text-neutral-600 mt-1">Platform-wide overview of all agents, students, and applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700">Total Agents</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{stats.totalAgents}</p>
              </div>
              <div className="p-3 rounded-xl bg-red-100 text-red-600">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700">Total Students</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{stats.totalStudents}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>
            {stats.draftStudents > 0 && (
              <div className="mt-3 text-xs text-amber-600">{stats.draftStudents} incomplete profiles</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700">Total Applications</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{stats.totalApplications}</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                <FileText className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3 text-xs text-neutral-600">{stats.approvalRate}% approval rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700">Documents</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{stats.totalDocs}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-100 text-green-600">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3 text-xs text-neutral-600">{stats.verifiedDocs} verified</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-neutral-900">Application Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.byStage.map((stage) => {
                const pct = stats.totalApplications > 0 ? Math.round((stage.count / stats.totalApplications) * 100) : 0;
                return (
                  <div key={stage.stage} className="flex items-center gap-3">
                    <Badge className={`text-xs w-36 justify-center ${stageColors[stage.stage] || ""}`}>
                      {STAGE_LABELS[stage.stage as Stage]}
                    </Badge>
                    <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-neutral-900 w-12 text-right">{stage.count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-neutral-900">Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a href="/admin/agents" className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors">
                <Users className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">Manage Agents</p>
                  <p className="text-xs text-neutral-600">View agent performance and student counts</p>
                </div>
              </a>
              <a href="/admin/students" className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">All Students</p>
                  <p className="text-xs text-neutral-600">Browse students across all agents</p>
                </div>
              </a>
              <a href="/agent-portal" className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors">
                <Shield className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">Agent Portal</p>
                  <p className="text-xs text-neutral-600">Access the agent view as superadmin</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
