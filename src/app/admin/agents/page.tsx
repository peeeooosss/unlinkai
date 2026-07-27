"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, AlertCircle, Mail, Calendar } from "lucide-react";
import { getAgents } from "@/lib/actions/admin";
import { timeAgo } from "@/lib/time-ago";

export default function AdminAgentsPage() {
  const [agents, setAgents] = React.useState<Awaited<ReturnType<typeof getAgents>>>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      try {
        const data = await getAgents();
        setAgents(data);
      } catch {
        setError("Failed to load agents");
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
          <p className="text-sm text-neutral-500">Loading agents...</p>
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
        <h1 className="text-2xl font-bold text-neutral-900">Agent Management</h1>
        <p className="text-neutral-600 mt-1">Overview of all registered agents and their student counts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-red-100 text-red-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Total Agents</p>
                <p className="text-2xl font-bold text-neutral-900">{agents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Total Students</p>
                <p className="text-2xl font-bold text-neutral-900">{agents.reduce((sum, a) => sum + a.studentCount, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-green-100 text-green-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Avg Students/Agent</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {agents.length > 0 ? Math.round(agents.reduce((sum, a) => sum + a.studentCount, 0) / agents.length) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-neutral-900">All Agents</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {agents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-10 w-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm text-neutral-700">No agents registered yet</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-sm">
                      {agent.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{agent.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-neutral-600 flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {agent.email}
                        </span>
                        <span className="text-xs text-neutral-600 flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Joined {timeAgo(agent.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-100 text-blue-700">
                      {agent.studentCount} student{agent.studentCount !== 1 ? "s" : ""}
                    </Badge>
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
