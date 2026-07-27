"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertCircle, Info, Megaphone, Calendar } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  priority: string;
  courseId: string | null;
  isPublished: boolean;
  publishedAt: string;
  expiresAt: string | null;
  createdBy: string;
  createdAt: string;
}

interface AnnouncementsClientProps {
  announcements: Announcement[];
}

const typeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  general: { icon: <Megaphone className="h-5 w-5" />, color: "text-blue-500" },
  course: { icon: <Info className="h-5 w-5" />, color: "text-green-500" },
  assignment: { icon: <Calendar className="h-5 w-5" />, color: "text-orange-500" },
  urgent: { icon: <AlertCircle className="h-5 w-5" />, color: "text-red-500" },
};

export function AnnouncementsClient({ announcements }: AnnouncementsClientProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Announcements</h1>
        <p className="text-muted-foreground">Stay updated with the latest news</p>
      </div>

      {announcements.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium">No announcements</h3>
            <p className="text-muted-foreground">Check back later for updates</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => {
            const config = typeConfig[a.type] || typeConfig.general;
            return (
              <Card key={a.id} className={a.priority === "high" ? "border-red-500/50" : ""}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 ${config.color}`}>
                      {config.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{a.title}</h3>
                        {a.priority === "high" && <Badge variant="destructive">Important</Badge>}
                        <Badge variant="outline">{a.type}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{a.content}</p>
                      <p className="text-sm text-muted-foreground">
                        Posted on {new Date(a.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
