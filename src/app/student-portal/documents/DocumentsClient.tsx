"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface DocumentData {
  id: string;
  studentId: string;
  applicationId: string | null;
  type: string;
  fileName: string;
  uploadedAt: string;
  verified: boolean;
}

interface StudentData {
  id: string;
  passportNumber: string | null;
  passportExpiry: string | null;
  nationality: string | null;
}

interface DocumentsClientProps {
  documents: DocumentData[];
  student: StudentData;
}

const documentTypes: Record<string, { label: string; color: string }> = {
  passport: { label: "Passport", color: "text-blue-500" },
  visa: { label: "Visa", color: "text-green-500" },
  transcript: { label: "Transcript", color: "text-purple-500" },
  recommendation: { label: "Recommendation Letter", color: "text-orange-500" },
  essay: { label: "Personal Statement", color: "text-pink-500" },
  financial: { label: "Financial Document", color: "text-yellow-500" },
  other: { label: "Other", color: "text-gray-500" },
};

export function DocumentsClient({ documents, student }: DocumentsClientProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Documents</h1>
        <p className="text-muted-foreground">Manage your visa, passport, and application documents</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Passport Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Passport Number</span>
              <span className="font-medium">{student.passportNumber || "Not provided"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expiry Date</span>
              <span className="font-medium">{student.passportExpiry || "Not provided"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nationality</span>
              <span className="font-medium">{student.nationality || "Not provided"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Documents</span>
              <span className="font-medium">{documents.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Verified</span>
              <span className="font-medium text-green-600">{documents.filter(d => d.verified).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pending Review</span>
              <span className="font-medium text-yellow-600">{documents.filter(d => !d.verified).length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No documents uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => {
                const typeInfo = documentTypes[doc.type] || documentTypes.other;
                return (
                  <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <FileText className={`h-5 w-5 ${typeInfo.color}`} />
                      <div>
                        <p className="font-medium">{doc.fileName}</p>
                        <p className="text-sm text-muted-foreground">{typeInfo.label} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Badge variant={doc.verified ? "default" : "secondary"} className="gap-1">
                      {doc.verified ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {doc.verified ? "Verified" : "Pending"}
                    </Badge>
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
