"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, AlertCircle, Download, Clock, CheckCircle } from "lucide-react";
import { getAdminCommissionStats } from "@/lib/actions/admin";
import { STAGE_LABELS, type Stage } from "@/lib/db/schema";

const stageColors: Record<string, string> = {
  lead: "bg-neutral-100 text-neutral-700",
  application_submitted: "bg-blue-100 text-blue-700",
  offer_received: "bg-amber-100 text-amber-700",
  visa_processing: "bg-purple-100 text-purple-700",
  visa_approved: "bg-green-100 text-green-700",
};

export default function AdminCommissionPage() {
  const [stats, setStats] = React.useState<Awaited<ReturnType<typeof getAdminCommissionStats>> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      try {
        const data = await getAdminCommissionStats();
        setStats(data);
      } catch {
        setError("Failed to load commission data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleExport = () => {
    if (!stats) return;
    const rows: string[][] = [
      ["Agent", "Applications", "Total Commission"],
      ...stats.byAgent.map((a) => [a.name, String(a.count), "$" + a.commission.toLocaleString()]),
      [],
      ["Stage", "Commission"],
      ...stats.byStage.map((s) => [STAGE_LABELS[s.stage as Stage] ?? s.stage, "$" + s.amount.toLocaleString()]),
      [],
      ["Total Expected", "$" + stats.totalExpected.toLocaleString()],
      ["Received (Visa Approved)", "$" + stats.totalReceived.toLocaleString()],
      ["Pending", "$" + stats.totalPending.toLocaleString()],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "commission-report-" + new Date().toISOString().split("T")[0] + ".csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-red-600 mx-auto mb-3" />
          <p className="text-sm text-neutral-500">Loading commission data...</p>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Commission Overview</h1>
          <p className="text-neutral-600 mt-1">Revenue tracking across all agents and applications</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700">Total Expected</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">
                  ${stats.totalExpected.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3 text-xs text-neutral-600">{stats.totalApplications} applications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700">Received</p>
                <p className="text-3xl font-bold text-green-700 mt-1">
                  ${stats.totalReceived.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-100 text-green-600">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3 text-xs text-neutral-600">Visa approved applications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700">Pending</p>
                <p className="text-3xl font-bold text-amber-700 mt-1">
                  ${stats.totalPending.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
                <Clock className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3 text-xs text-neutral-600">Awaiting visa approval</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-neutral-900">By Agent</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {stats.byAgent.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-neutral-500">No agents with applications</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-200">
                {[...stats.byAgent]
                  .sort((a, b) => b.commission - a.commission)
                  .map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-xs">
                          {agent.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{agent.name}</p>
                          <p className="text-xs text-neutral-500">{agent.count} application{agent.count !== 1 ? "s" : ""}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-neutral-900">${agent.commission.toLocaleString()}</p>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-neutral-900">By Pipeline Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.byStage.map((stage) => {
                const pct = stats.totalExpected > 0 ? Math.round((stage.amount / stats.totalExpected) * 100) : 0;
                return (
                  <div key={stage.stage} className="flex items-center gap-3">
                    <div className="flex items-center gap-2 w-40">
                      <span className={`inline-block w-2 h-2 rounded-full ${stageColors[stage.stage]?.includes("green") ? "bg-green-500" : stageColors[stage.stage]?.includes("amber") ? "bg-amber-500" : stageColors[stage.stage]?.includes("purple") ? "bg-purple-500" : stageColors[stage.stage]?.includes("blue") ? "bg-blue-500" : "bg-neutral-400"}`} />
                      <span className="text-xs font-medium text-neutral-700 truncate">
                        {STAGE_LABELS[stage.stage as Stage]}
                      </span>
                    </div>
                    <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full transition-all"
                        style={{ width: pct + "%" }}
                      />
                    </div>
                    <span className="text-xs font-medium text-neutral-900 w-20 text-right">
                      ${stage.amount.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
