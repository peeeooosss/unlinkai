"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Search, AlertCircle, Users, X } from "lucide-react";
import { getAllStudentsWithAgent } from "@/lib/actions/admin";
import { timeAgo } from "@/lib/time-ago";

export default function AdminStudentsPage() {
  const [students, setStudents] = React.useState<Awaited<ReturnType<typeof getAllStudentsWithAgent>>>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [agentFilter, setAgentFilter] = React.useState<string>("all");

  React.useEffect(() => {
    async function load() {
      try {
        const data = await getAllStudentsWithAgent();
        setStudents(data);
      } catch {
        setError("Failed to load students");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const agents = React.useMemo(() => {
    const map = new Map<string, { name: string; count: number }>();
    for (const s of students) {
      if (!s.agentId) continue;
      const existing = map.get(s.agentId);
      if (existing) {
        existing.count++;
      } else {
        map.set(s.agentId, { name: s.agentName ?? "Unknown", count: 1 });
      }
    }
    return Array.from(map.entries()).map(([id, data]) => ({ id, ...data }));
  }, [students]);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.nationality.toLowerCase().includes(q);
    const matchesAgent = agentFilter === "all" || s.agentId === agentFilter;
    return matchesSearch && matchesAgent;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-red-600 mx-auto mb-3" />
          <p className="text-sm text-neutral-500">Loading students...</p>
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
        <h1 className="text-2xl font-bold text-neutral-900">All Students</h1>
        <p className="text-neutral-600 mt-1">Browse all students across every agent</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Total Students</p>
                <p className="text-2xl font-bold text-neutral-900">{students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-red-100 text-red-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Active Agents</p>
                <p className="text-2xl font-bold text-neutral-900">{agents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Draft Profiles</p>
                <p className="text-2xl font-bold text-neutral-900">{students.filter((s) => s.status === "draft").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-sm font-semibold text-neutral-900">Student Directory</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search by name, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-black bg-white text-neutral-900 placeholder:text-neutral-500 w-48 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2">
                    <X className="h-3 w-3 text-neutral-400 hover:text-neutral-600" />
                  </button>
                )}
              </div>
              <select
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                className="py-1.5 px-2 text-xs rounded-lg border border-black bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="all">All Agents</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>{a.name} ({a.count})</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="h-10 w-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm text-neutral-700">{search || agentFilter !== "all" ? "No students match your filters" : "No students yet"}</p>
              {(search || agentFilter !== "all") && (
                <button onClick={() => { setSearch(""); setAgentFilter("all"); }} className="text-xs text-red-600 hover:text-red-700 mt-1">Clear filters</button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {filtered.map((student) => (
                <div key={student.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                      {student.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-neutral-900">{student.name}</p>
                        {student.status === "draft" && (
                          <Badge className="bg-amber-100 text-amber-700 text-[10px]">Draft</Badge>
                        )}
                      </div>
                      <p className="text-xs text-neutral-600">{student.email} · {student.nationality}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="outline" className="text-xs">{student.educationLevel}</Badge>
                    <Badge className="bg-red-50 text-red-700 text-xs">{student.agentName ?? "Unassigned"}</Badge>
                    <span className="text-xs text-neutral-600">Added {timeAgo(student.createdAt)}</span>
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
