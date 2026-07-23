"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IndianRupee, TrendingUp, TrendingDown, Download } from "lucide-react";
import { getApplications, getApplicationCounts } from "@/lib/actions/applications";
import { getStudentCount } from "@/lib/actions/students";

const COMMISSION_PER_VISA = 15000;
const COMMISSION_PER_OFFER = 8000;
const COMMISSION_PER_APPLICATION = 3000;

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

  React.useEffect(() => {
    async function load() {
      const [apps, appCounts, studentCount] = await Promise.all([
        getApplications(),
        getApplicationCounts(),
        getStudentCount(),
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
        let commission = 0;
        if (app.stage === "visa_approved") {
          commission = COMMISSION_PER_VISA;
          approvedCount++;
        } else if (app.stage === "offer_received") {
          commission = COMMISSION_PER_OFFER;
        } else if (app.stage === "application_submitted") {
          commission = COMMISSION_PER_APPLICATION;
        }

        totalExpected += commission;

        if (app.stage === "visa_approved") {
          received += commission;
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
    }
    load();
  }, []);

  const collectionRate = stats.totalExpected > 0 ? ((stats.received / stats.totalExpected) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Commission Tracking</h1>
          <p className="text-neutral-700">Monitor your earnings and pending payments</p>
        </div>
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700">Total Expected</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">₹{stats.totalExpected.toLocaleString("en-IN")}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-amber-100 text-blue-600">
                <IndianRupee className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-green-600">
              <TrendingUp className="h-4 w-4" /> Based on application pipeline
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700">Received</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">₹{stats.received.toLocaleString("en-IN")}</p>
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
                <p className="text-3xl font-bold text-neutral-900 mt-1">₹{stats.pending.toLocaleString("en-IN")}</p>
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
                <p className="text-3xl font-bold text-neutral-900 mt-1">₹{stats.thisMonth.toLocaleString("en-IN")}</p>
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
          <CardTitle className="text-sm font-semibold text-neutral-900">Commission Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-neutral-200 p-4">
              <p className="text-sm font-medium text-neutral-700">Visa Approved</p>
              <p className="text-2xl font-bold text-green-600 mt-1">₹{COMMISSION_PER_VISA.toLocaleString("en-IN")}</p>
              <p className="text-xs text-neutral-700 mt-1">Per successful placement</p>
            </div>
            <div className="rounded-lg border border-neutral-200 p-4">
              <p className="text-sm font-medium text-neutral-700">Offer Received</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">₹{COMMISSION_PER_OFFER.toLocaleString("en-IN")}</p>
              <p className="text-xs text-neutral-700 mt-1">Per offer letter</p>
            </div>
            <div className="rounded-lg border border-neutral-200 p-4">
              <p className="text-sm font-medium text-neutral-700">Application Submitted</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">₹{COMMISSION_PER_APPLICATION.toLocaleString("en-IN")}</p>
              <p className="text-xs text-neutral-700 mt-1">Per application</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
