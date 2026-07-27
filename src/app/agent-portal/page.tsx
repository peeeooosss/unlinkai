"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Users, AlertCircle, CheckCircle, TrendingUp, Clock } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AttentionList } from "@/components/dashboard/AttentionList";
import { Badge } from "@/components/ui/badge";
import { getStudentCount } from "@/lib/actions/students";
import { getApplications, getApplicationCounts, getPendingActionCount } from "@/lib/actions/applications";
import { useAuth } from "@/hooks/use-auth";
import universities from "@/lib/data/universities.json";

const KanbanBoard = dynamic(() => import("@/components/dashboard/KanbanBoard").then((m) => m.KanbanBoard), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 rounded-xl border border-neutral-200 bg-white">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-blue-600 mx-auto mb-3" />
        <p className="text-sm text-neutral-500">Loading pipeline...</p>
      </div>
    </div>
  ),
});

const COMMISSION_RATES: Record<string, number> = {
  Undergraduate: 0.08,
  Postgraduate: 0.12,
  PhD: 0.10,
};

function findCourseTuition(universityName: string, courseName: string): number {
  for (const region of Object.values(universities)) {
    const uni = region.find((u) => u.name === universityName);
    if (uni) {
      const course = uni.courses.find((c) => c.name === courseName);
      if (course?.fee) return course.fee;
    }
  }
  return 0;
}

const STALE_MS = 30_000;

export default function AgentPortalDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = React.useState([
    { title: "Total Active Students", value: "—", trend: "", trendUp: true, icon: <Users className="h-5 w-5" /> },
    { title: "Pending Actions", value: "—", trend: "", trendUp: false, icon: <AlertCircle className="h-5 w-5" /> },
    { title: "Visas Approved", value: "—", trend: "", trendUp: true, icon: <CheckCircle className="h-5 w-5" /> },
    { title: "Expected Commission", value: "—", trend: "", trendUp: true, icon: <TrendingUp className="h-5 w-5" /> },
  ]);
  const lastFetchRef = React.useRef(0);

  async function load() {
    const now = Date.now();
    if (now - lastFetchRef.current < STALE_MS) return;
    lastFetchRef.current = now;

    try {
      const [studentCount, apps, appCounts, pendingCount] = await Promise.all([
        getStudentCount(),
        getApplications(),
        getApplicationCounts(),
        getPendingActionCount(),
      ]);

      const visaApproved = appCounts.byStage.find((s) => s.stage === "visa_approved")?.count ?? 0;
      const totalApps = appCounts.total;

      let expectedCommission = 0;
      for (const app of apps) {
        const tuition = findCourseTuition(app.university, app.course);
        const rate = COMMISSION_RATES[app.course?.includes("PhD") ? "PhD" : app.course?.includes("Bachelor") || app.course?.includes("Undergraduate") ? "Undergraduate" : "Postgraduate"] ?? 0.10;
        expectedCommission += tuition * rate;
      }

      setMetrics([
        { title: "Total Active Students", value: String(studentCount), trend: `${totalApps} applications`, trendUp: true, icon: <Users className="h-5 w-5" /> },
        { title: "Pending Actions", value: String(pendingCount), trend: "needs attention", trendUp: false, icon: <AlertCircle className="h-5 w-5" /> },
        { title: "Visas Approved", value: String(visaApproved), trend: totalApps > 0 ? `${Math.round((visaApproved / totalApps) * 100)}% success rate` : "no data yet", trendUp: true, icon: <CheckCircle className="h-5 w-5" /> },
        { title: "Expected Commission", value: `$${expectedCommission.toLocaleString()}`, trend: `${totalApps - visaApproved} in progress`, trendUp: true, icon: <TrendingUp className="h-5 w-5" /> },
      ]);
    } catch {
      // keep current metrics
    }
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
            Welcome back, {user?.name ?? "Agent"}. Here&apos;s what&apos;s happening with your applications.
          </p>
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
