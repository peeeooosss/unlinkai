"use client";

import * as React from "react";
import { Users, AlertCircle, CheckCircle, TrendingUp, Clock } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { AttentionList } from "@/components/dashboard/AttentionList";
import { Badge } from "@/components/ui/badge";
import { getStudentCount } from "@/lib/actions/students";
import { getApplicationCounts, getPendingActionCount } from "@/lib/actions/applications";

export default function AgentPortalDashboard() {
  const [metrics, setMetrics] = React.useState([
    { title: "Total Active Students", value: "—", trend: "", trendUp: true, icon: <Users className="h-5 w-5" /> },
    { title: "Pending Actions", value: "—", trend: "", trendUp: false, icon: <AlertCircle className="h-5 w-5" /> },
    { title: "Visas Approved", value: "—", trend: "", trendUp: true, icon: <CheckCircle className="h-5 w-5" /> },
    { title: "Expected Commission", value: "—", trend: "", trendUp: true, icon: <TrendingUp className="h-5 w-5" /> },
  ]);

  async function load() {
    const [studentCount, appCounts, pendingCount] = await Promise.all([
      getStudentCount(),
      getApplicationCounts(),
      getPendingActionCount(),
    ]);

    const visaApproved = appCounts.byStage.find((s) => s.stage === "visa_approved")?.count ?? 0;
    const totalApps = appCounts.total;

    setMetrics([
      { title: "Total Active Students", value: String(studentCount), trend: `${totalApps} applications`, trendUp: true, icon: <Users className="h-5 w-5" /> },
      { title: "Pending Actions", value: String(pendingCount), trend: "needs attention", trendUp: false, icon: <AlertCircle className="h-5 w-5" /> },
      { title: "Visas Approved", value: String(visaApproved), trend: `${Math.round((visaApproved / totalApps) * 100)}% success rate`, trendUp: true, icon: <CheckCircle className="h-5 w-5" /> },
      { title: "Expected Commission", value: `${visaApproved} completed`, trend: `${totalApps - visaApproved} in progress`, trendUp: true, icon: <TrendingUp className="h-5 w-5" /> },
    ]);
  }

  React.useEffect(() => {
    load();
    const onVisible = () => { if (document.visibilityState === "visible") load(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-700 mt-1">
            Welcome back, Sarah. Here&apos;s what&apos;s happening with your applications.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="gap-1 bg-neutral-100 text-neutral-700 border border-neutral-200">
            <TrendingUp className="h-3 w-3 text-green-600" />
            <span>+12% vs last month</span>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <KanbanBoard />
        </div>

        <div className="lg:col-span-1">
          <AttentionList />
        </div>
      </div>
    </div>
  );
}
