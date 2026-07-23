"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
  description?: string;
}

export function MetricCard({ title, value, trend, trendUp, icon, description }: MetricCardProps) {
  return (
    <Card className="h-full bg-white border-neutral-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-700 mb-1">{title}</p>
            <p className="text-3xl font-bold text-neutral-900">{value}</p>
            {description && <p className="mt-1 text-sm text-neutral-700">{description}</p>}
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-amber-50 ring-1 ring-blue-200/50 text-neutral-700">
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className={cn(
            "text-sm font-medium flex items-center gap-1",
            trendUp ? "text-green-600" : "text-red-600"
          )}>
            {trendUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {trend}
          </span>
          <span className="text-sm text-neutral-700">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
}
