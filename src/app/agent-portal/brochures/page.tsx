"use client";

import * as React from "react";
import { AlertCircle, FileDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AgentBrochuresPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">University Brochures</h1>
        <p className="text-neutral-600 mt-1">
          Download and share university brochures across all partner countries.
        </p>
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-100">
              <FileDown className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <CardTitle className="text-amber-800">Coming Soon</CardTitle>
              <CardDescription className="text-amber-700">
                Brochure downloads are being prepared. PDF files will be available in a future update.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg border border-amber-200">
              <Badge className="bg-red-100 text-red-700 mb-2">UK</Badge>
              <p className="text-sm text-neutral-700">12 universities</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-amber-200">
              <Badge className="bg-blue-100 text-blue-700 mb-2">Europe</Badge>
              <p className="text-sm text-neutral-700">15 universities</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-amber-200">
              <Badge className="bg-green-100 text-green-700 mb-2">Australia</Badge>
              <p className="text-sm text-neutral-700">10 universities</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-amber-200">
              <Badge className="bg-purple-100 text-purple-700 mb-2">Singapore</Badge>
              <p className="text-sm text-neutral-700">6 universities</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-amber-200">
              <Badge className="bg-cyan-100 text-cyan-700 mb-2">New Zealand</Badge>
              <p className="text-sm text-neutral-700">8 universities</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-amber-200">
              <Badge className="bg-amber-100 text-amber-700 mb-2">Mauritius</Badge>
              <p className="text-sm text-neutral-700">5 universities</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-amber-200">
              <Badge className="bg-emerald-100 text-emerald-700 mb-2">Dubai</Badge>
              <p className="text-sm text-neutral-700">7 universities</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-white rounded-lg border border-neutral-200">
            <AlertCircle className="h-4 w-4 text-amber-600 inline-block mr-2" />
            <span className="text-sm text-neutral-700">
              <strong>Note:</strong> Brochure PDF files are not yet uploaded. The download links currently point to <code className="bg-amber-100 px-1 rounded">/brochures/[filename].pdf</code> which will 404. This feature will be enabled once PDF assets are available.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}