"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IndianRupee, TrendingUp, TrendingDown, Download, AlertCircle } from "lucide-react";
import { getApplications, getApplicationCounts } from "@/lib/actions/applications";
import universities from "@/lib/data/universities.json";

const COMMISSION_RATES = {
  Undergraduate: 0.08,
  Postgraduate: 0.12,
  PhD: 0.10,
};

function findCourseTuition(universityName: string, courseName: string): number {
  for (const region of Object.values(universities)) {
    const uni = region.find((u) => u.name === universityName);
    if (uni) {
      const course = uni.courses.find((c) => c.name === courseName);
      if (course && course.fee) return course.fee;
    }
  }
  return 0;
}

export default function CommissionPage() {
  const [stats, setStats] = React.useState({
    totalExpected: 0,
    received: 0,
    pending: 0,
    thisMonth: 0,
    approvedCount: 0,
    pendingCount: 0,
    thisMonthCount: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      try {
        setError(null);
        const [apps, appCounts] = await Promise.all([
          getApplications(),
          getApplicationCounts(),
        ]);

        let totalExpected = 0;
        let received = 0;
        let pending = 0;
        let thisMonth = 0;
        let approvedCount = 0;
        let pendingCount = 0;
        let thisMonthCount = 0;

        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

        for (const app of apps) {
          const tuition = findCourseTuition(app.university, app.course);
          const rate = COMMISSION_RATES[app.course?.includes("PhD") ? "PhD" : app.course?.includes("Bachelor") || app.course?.includes("Undergraduate") ? "Undergraduate" : "Postgraduate"] ?? 0.10;
          const commission = tuition * rate;

          totalExpected += commission;

          if (app.stage === "visa_approved") {
            received += commission;
            approvedCount++;
          } else {
            pending += commission;
            pendingCount++;
          }

          if (app.updatedAt.startsWith(currentMonth)) {
            thisMonth += commission;
            thisMonthCount++;
          }
        }

        setStats({
          totalExpected,
          received,
          pending,
          thisMonth,
          approvedCount,
          pendingCount,
          thisMonthCount,
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load commission data");
        setLoading(false);
      }
    }
    load();
  }, []);

  const collectionRate = stats.totalExpected > 0 ? ((stats.received / stats.totalExpected) * 100).toFixed(1) : "0";

  const handleExport = () => {
    const csv = [
      ["Metric", "Value"],
      ["Total Expected Commission", `₹${stats.totalExpected.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
      ["Received", `₹${stats.received.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
      ["Pending", `₹${stats.pending.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
      ["This Month", `₹${stats.thisMonth.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
      ["Collection Rate", `${collectionRate}%`],
      ["Approved Count", String(stats.approvedCount)],
      ["Pending Count", String(stats.pendingCount)],
      ["This Month Count", String(stats.thisMonthCount)],
    ].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `commission-report-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-blue-600 mx-auto mb-3" />
          <p className="text-sm text-neutral-500">Loading commission data...</p>
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
          <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Commission Tracking</h1>
          <p className="text-neutral-700">Monitor your earnings and pending payments</p>
        </div>
        <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" /> Export Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700">Total Expected</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">₹{stats.totalExpected.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-amber-100 text-blue-600">
                <IndianRupee className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-green-600">
              <TrendingUp className="h-4 w-4" /> Based on tuition % (UG: 8%, PG: 12%, PhD: 10%)
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700">Received</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">₹{stats.received.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-100 text-green-600">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 text-sm text-neutral-700">{collectionRate}% collected</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700">Pending</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">₹{stats.pending.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
                <TrendingDown className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 text-sm text-neutral-700">{stats.pendingCount} applications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700">This Month</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">₹{stats.thisMonth.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <IndianRupee className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 text-sm text-neutral-700">{stats.thisMonthCount} applications updated</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-neutral-900">Commission Rates (Percentage of Tuition Fee)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-neutral-200 p-4">
              <p className="text-sm font-medium text-neutral-700">Undergraduate</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">8%</p>
              <p className="text-xs text-neutral-700 mt-1">of tuition fee</p>
            </div>
            <div className="rounded-lg border border-neutral-200 p-4">
              <p className="text-sm font-medium text-neutral-700">Postgraduate</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">12%</p>
              <p className="text-xs text-neutral-700 mt-1">of tuition fee</p>
            </div>
            <div className="rounded-lg border border-neutral-200 p-4">
              <p className="text-sm font-medium text-neutral-700">PhD / Doctorate</p>
              <p className="text-2xl font-bold text-green-600 mt-1">10%</p>
              <p className="text-xs text-neutral-700 mt-1">of tuition fee</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}