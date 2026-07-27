"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Upload, FileText, CheckCircle, Clock, ExternalLink, User } from "lucide-react";
import { getAttentionItems } from "@/lib/actions/attention";
import { cn } from "@/lib/utils";

interface AttentionItem {
  id: string;
  studentName: string;
  action: string;
  urgency: "high" | "medium" | "low";
  dueDate: string;
  college: string;
  course: string;
}

const urgencyConfig = {
  high: { color: "bg-red-100 text-red-700", icon: AlertCircle, label: "Urgent" },
  medium: { color: "bg-amber-100 text-amber-700", icon: Clock, label: "Soon" },
  low: { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Later" },
};

function getActionIcon(action: string) {
  if (action.toLowerCase().includes("document") || action.toLowerCase().includes("verif")) {
    return <FileText className="h-3 w-3" />;
  }
  if (action.toLowerCase().includes("stuck")) {
    return <AlertCircle className="h-3 w-3" />;
  }
  if (action.toLowerCase().includes("lead") || action.toLowerCase().includes("assessment")) {
    return <Upload className="h-3 w-3" />;
  }
  return <FileText className="h-3 w-3" />;
}

export function AttentionList() {
  const [items, setItems] = React.useState<AttentionItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        const data = await getAttentionItems();
        setItems(data);
      } catch (err) {
        console.error("Failed to load attention items:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            Needs Your Attention
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 animate-pulse bg-neutral-100 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            Needs Your Attention
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-neutral-500">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-neutral-300" />
          <p>All caught up! No urgent items.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-orange-500" />
          Needs Your Attention
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-neutral-200">
          {items.map((item) => {
            const config = urgencyConfig[item.urgency];
            const Icon = config.icon;

            return (
              <div
                key={item.id}
                className="p-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg flex-shrink-0", config.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-neutral-900">{item.studentName}</span>
                        <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0.5", config.color)}>
                          {config.label}
                        </Badge>
                      </div>
                      <Badge variant="secondary" className="text-[10px] whitespace-nowrap !text-neutral-900">
                        Due: {item.dueDate}
                      </Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-neutral-700">
                      <span className="flex items-center gap-1">{getActionIcon(item.action)} {item.action}</span>
                      {item.college && (
                        <span className="flex items-center gap-1 text-[11px]">
                          <ExternalLink className="h-3 w-3" />
                          {item.college}
                        </span>
                      )}
                      {item.course && (
                        <span className="flex items-center gap-1 text-[11px]">
                          <User className="h-3 w-3" />
                          {item.course}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-neutral-600 hover:text-neutral-800">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}