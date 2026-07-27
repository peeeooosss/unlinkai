"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

interface AttendanceRecord {
  id: string;
  courseId: string;
  studentId: string;
  date: string;
  status: string;
}

interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  percentage: number;
}

interface AttendanceClientProps {
  records: AttendanceRecord[];
  stats: AttendanceStats | null;
}

const statusConfig: Record<string, { label: string; variant: "default" | "destructive" | "secondary" | "outline"; icon: React.ReactNode }> = {
  present: { label: "Present", variant: "default", icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
  absent: { label: "Absent", variant: "destructive", icon: <XCircle className="h-4 w-4 text-red-500" /> },
  late: { label: "Late", variant: "secondary", icon: <Clock className="h-4 w-4 text-yellow-500" /> },
  excused: { label: "Excused", variant: "outline", icon: <AlertTriangle className="h-4 w-4 text-blue-500" /> },
};

export function AttendanceClient({ records, stats }: AttendanceClientProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attendance</h1>
        <p className="text-muted-foreground">Track your class attendance</p>
      </div>

      {stats && (
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Present</CardTitle>
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-green-600">{stats.present}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-red-600">{stats.absent}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Late</CardTitle>
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-yellow-600">{stats.late}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{stats.percentage}%</div></CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <div className="text-center py-8">
              <CalendarDays className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No attendance records yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((record) => {
                const config = statusConfig[record.status] || statusConfig.present;
                return (
                  <div key={record.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      {config.icon}
                      <div>
                        <p className="font-medium">{new Date(record.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                      </div>
                    </div>
                    <Badge variant={config.variant}>{config.label}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
