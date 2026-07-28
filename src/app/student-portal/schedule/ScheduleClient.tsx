"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, BookOpen, Calendar } from "lucide-react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatTime(timeStr: string) {
  const [hours, minutes] = timeStr.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

function getEventTypeColor(type: string) {
  switch (type) {
    case "class": return "bg-blue-100 text-blue-700 border-blue-200";
    case "lab": return "bg-green-100 text-green-700 border-green-200";
    case "office_hour": return "bg-purple-100 text-purple-700 border-purple-200";
    case "exam": return "bg-red-100 text-red-700 border-red-200";
    default: return "bg-neutral-100 text-neutral-700 border-neutral-200";
  }
}

interface ScheduleItem {
  schedules: {
    id: string;
    courseId: string;
    title: string;
    description: string | null;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    location: string | null;
    type: string;
    startDate: string | null;
    endDate: string | null;
    isActive: boolean;
  };
  courses: {
    id: string;
    title: string;
  };
}

interface ScheduleClientProps {
  schedule: ScheduleItem[];
}

export function ScheduleClient({ schedule }: ScheduleClientProps) {
  const today = new Date().getDay();

  // Group by day
  const groupedByDay: Record<number, ScheduleItem[]> = {};
  for (let i = 0; i < 7; i++) {
    groupedByDay[i] = schedule
      .filter((item) => item.schedules.dayOfWeek === i)
      .sort((a, b) => a.schedules.startTime.localeCompare(b.schedules.startTime));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schedule</h1>
          <p className="text-neutral-600 mt-1">Your weekly class timetable</p>
        </div>
        <Badge variant="outline" className="gap-1 px-3 py-1.5">
          <Calendar className="h-4 w-4" />
          {DAYS[today]}
        </Badge>
      </div>

      {/* Weekly View */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {DAYS.map((day, index) => {
          const dayClasses = groupedByDay[index] || [];
          const isToday = index === today;

          return (
            <div key={day} className="space-y-2">
              <div className={`text-center py-2 rounded-lg ${isToday ? "bg-blue-600 text-white" : "bg-neutral-100 text-neutral-700"}`}>
                <p className="text-xs font-medium">{DAY_ABBR[index]}</p>
                <p className="text-lg font-bold">{dayClasses.length}</p>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {dayClasses.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400 text-xs">
                    No classes
                  </div>
                ) : (
                  dayClasses.map((item) => (
                    <Card
                      key={item.schedules.id}
                      className={`hover:shadow-md transition-shadow ${isToday ? "border-blue-200 ring-1 ring-blue-100" : ""}`}
                    >
                      <CardContent className="p-2.5">
                        <Badge className={`text-[9px] mb-1 ${getEventTypeColor(item.schedules.type)}`} variant="outline">
                          {item.schedules.type}
                        </Badge>
                        <p className="text-xs font-medium text-neutral-900 line-clamp-2 leading-tight">
                          {item.schedules.title}
                        </p>
                        <p className="text-[10px] text-neutral-500 mt-1">
                          {formatTime(item.schedules.startTime)} - {formatTime(item.schedules.endTime)}
                        </p>
                        {item.schedules.location && (
                          <p className="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-2.5 w-2.5" />
                            {item.schedules.location}
                          </p>
                        )}
                        <p className="text-[10px] text-blue-600 mt-1 truncate">{item.courses.title}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* List View */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">All Classes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {schedule.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500">No classes scheduled</p>
              <p className="text-xs text-neutral-400 mt-1">Your schedule will appear here once classes are assigned</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {DAYS.map((day, index) => {
                const dayClasses = groupedByDay[index] || [];
                if (dayClasses.length === 0) return null;

                return (
                  <div key={day}>
                    <div className={`px-4 py-2 ${index === today ? "bg-blue-50" : "bg-neutral-50"}`}>
                      <p className={`text-xs font-semibold ${index === today ? "text-blue-700" : "text-neutral-600"}`}>
                        {day} {index === today && "(Today)"}
                      </p>
                    </div>
                    {dayClasses.map((item) => (
                      <div key={item.schedules.id} className="flex items-center gap-4 px-4 py-3 hover:bg-neutral-50 transition-colors">
                        <div className="text-center min-w-[70px]">
                          <p className="text-sm font-semibold text-neutral-900">{formatTime(item.schedules.startTime)}</p>
                          <p className="text-[10px] text-neutral-500">{formatTime(item.schedules.endTime)}</p>
                        </div>
                        <div className="h-8 w-1 rounded-full bg-blue-600" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900">{item.schedules.title}</p>
                          <p className="text-xs text-neutral-500">{item.courses.title}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {item.schedules.location && (
                            <Badge variant="outline" className="text-xs gap-1">
                              <MapPin className="h-3 w-3" />
                              {item.schedules.location}
                            </Badge>
                          )}
                          <Badge className={`text-xs ${getEventTypeColor(item.schedules.type)}`} variant="outline">
                            {item.schedules.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
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
