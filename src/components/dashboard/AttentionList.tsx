"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, Clock, FileText, Upload, User, CheckCircle, ExternalLink } from "lucide-react";

interface AttentionItem {
  id: number;
  student: string;
  action: string;
  urgency: "high" | "medium" | "low";
  dueDate: string;
  college?: string;
  course?: string;
}

const mockAttentionItems: AttentionItem[] = [
  {
    id: 1,
    student: "Rahul Sharma",
    action: "Upload Passport Copy",
    urgency: "high",
    dueDate: "Today",
    college: "University of Melbourne",
    course: "Master of Data Science",
  },
  {
    id: 2,
    student: "Priya Patel",
    action: "Submit Financial Documents",
    urgency: "medium",
    dueDate: "Tomorrow",
    college: "UNSW Sydney",
    course: "Bachelor of Engineering",
  },
  {
    id: 3,
    student: "Amit Kumar",
    action: "Visa Interview Preparation",
    urgency: "high",
    dueDate: "In 2 days",
    college: "Monash University",
    course: "MBA",
  },
  {
    id: 4,
    student: "Sneha Reddy",
    action: "College Selection Confirmation",
    urgency: "low",
    dueDate: "This week",
    college: "University of Sydney",
    course: "Master of IT",
  },
  {
    id: 5,
    student: "Vikram Singh",
    action: "Medical Examination Booking",
    urgency: "high",
    dueDate: "Today",
    college: "RMIT University",
    course: "Bachelor of Business",
  },
  {
    id: 6,
    student: "Anita Joshi",
    action: "English Test Score Submission",
    urgency: "medium",
    dueDate: "In 3 days",
    college: "University of Queensland",
    course: "Master of Public Health",
  },
];

const urgencyConfig = {
  high: { color: "bg-red-100 text-red-700", icon: AlertCircle, label: "Urgent" },
  medium: { color: "bg-amber-100 text-amber-700", icon: Clock, label: "Soon" },
  low: { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Later" },
};

const actionIcons: Record<string, React.ReactNode> = {
  "Upload Passport Copy": <Upload className="h-3 w-3" />,
  "Submit Financial Documents": <FileText className="h-3 w-3" />,
  "Visa Interview Preparation": <User className="h-3 w-3" />,
  "College Selection Confirmation": <CheckCircle className="h-3 w-3" />,
  "Medical Examination Booking": <AlertCircle className="h-3 w-3" />,
  "English Test Score Submission": <FileText className="h-3 w-3" />,
};

export function AttentionList() {
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
          {mockAttentionItems.map((item) => {
            const config = urgencyConfig[item.urgency];
            const Icon = config.icon;
            const actionIcon = actionIcons[item.action] || <FileText className="h-3 w-3" />;

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
                        <span className="font-medium text-sm text-neutral-900">{item.student}</span>
                        <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0.5", config.color)}>
                          {config.label}
                        </Badge>
                      </div>
                      <Badge variant="secondary" className="text-[10px] whitespace-nowrap !text-neutral-900">
                        Due: {item.dueDate}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-neutral-700">
                      <span className="flex items-center gap-1">{actionIcon} {item.action}</span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <ExternalLink className="h-3 w-3" />
                        {item.college}
                      </span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <User className="h-3 w-3" />
                        {item.course}
                      </span>
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
