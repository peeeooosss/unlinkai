"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, FileUp, X } from "lucide-react";
import { addDocument } from "@/lib/actions/documents";

interface AddDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  applicationId?: string;
  onDocumentAdded?: () => void;
}

const docTypes = [
  { value: "passport", label: "Passport Copy" },
  { value: "financial", label: "Financial Documents" },
  { value: "scores", label: "Test Scores" },
  { value: "medical", label: "Medical Exam" },
  { value: "other", label: "Other" },
];

export function AddDocumentModal({ open, onOpenChange, studentId, applicationId, onDocumentAdded }: AddDocumentModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [form, setForm] = React.useState({
    type: "passport",
    fileName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fileName) return;

    setLoading(true);
    setError("");
    try {
      await addDocument({
        studentId,
        applicationId,
        type: form.type,
        fileName: form.fileName,
      });
      setForm({ type: "passport", fileName: "" });
      onOpenChange(false);
      onDocumentAdded?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-white border-black">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-neutral-900">
            <FileUp className="h-5 w-5 text-blue-600" />
            Add Document
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <X className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-neutral-900">Document Type</Label>
            <select
              value={form.type}
              onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
              className="w-full h-10 rounded-md border border-black bg-white px-3 text-sm text-neutral-900"
            >
              {docTypes.map((dt) => (
                <option key={dt.value} value={dt.value}>{dt.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fileName" className="text-sm font-semibold text-neutral-900">File Name *</Label>
            <Input id="fileName" placeholder="e.g. passport_scan.pdf" value={form.fileName} onChange={(e) => setForm((prev) => ({ ...prev, fileName: e.target.value }))} required className="bg-white border-black text-neutral-900 placeholder:text-neutral-500" />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading || !form.fileName}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</> : "Add Document"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
