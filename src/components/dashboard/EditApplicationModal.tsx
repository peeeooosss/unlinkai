"use client";

import { useState } from "react";
import { X, Pencil, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateApplication } from "@/lib/actions/applications";
import { STAGE_ORDER, STAGE_LABELS, type Stage } from "@/lib/db/schema";

interface Application {
  id: string;
  studentId: string;
  university: string;
  course: string;
  stage: string;
  accommodation?: string | null;
  insurance?: string | null;
}

interface EditApplicationModalProps {
  application: Application;
  onUpdated?: () => void;
}

export function EditApplicationModal({ application, onUpdated }: EditApplicationModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [university, setUniversity] = useState(application.university);
  const [course, setCourse] = useState(application.course);
  const [stage, setStage] = useState<Stage>(application.stage as Stage);
  const [accommodation, setAccommodation] = useState<string | null>(application.accommodation || null);
  const [insurance, setInsurance] = useState<string | null>(application.insurance || null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      await updateApplication(application.id, {
        university,
        course,
        stage,
        accommodation: accommodation || undefined,
        insurance: insurance || undefined,
      });
      setOpen(false);
      onUpdated?.();
    } catch {
      setError("Failed to update. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className="h-8 w-8 p-0 text-neutral-500 hover:text-neutral-900">
        <Pencil className="h-3.5 w-3.5" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-neutral-200">
          <div>
            <h3 className="font-semibold text-neutral-900">Edit Application</h3>
            <p className="text-xs text-neutral-500 mt-0.5">{application.id}</p>
          </div>
          <button onClick={() => setOpen(false)} className="p-1 hover:bg-neutral-100 rounded-lg">
            <X className="h-4 w-4 text-neutral-500" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 text-xs px-3 py-2 rounded-lg border border-red-200">{error}</div>
          )}
          <div>
            <Label className="text-xs font-medium text-neutral-600 mb-1 block">University</Label>
            <Input value={university} onChange={(e) => setUniversity(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs font-medium text-neutral-600 mb-1 block">Course</Label>
            <Input value={course} onChange={(e) => setCourse(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs font-medium text-neutral-600 mb-1 block">Stage</Label>
            <div className="flex flex-wrap gap-2">
              {STAGE_ORDER.map((s) => (
                <button
                  key={s}
                  onClick={() => setStage(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    stage === s ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  {STAGE_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-xs font-medium text-neutral-600 mb-1 block">Accommodation</Label>
            <div className="flex gap-2">
              {["yes", "no"].map((v) => (
                <button
                  key={v}
                  onClick={() => setAccommodation(v)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    accommodation === v ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  {v === "yes" ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-xs font-medium text-neutral-600 mb-1 block">Insurance (IHS / OSHC)</Label>
            <div className="flex gap-2">
              {[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "na", label: "N/A" }].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setInsurance(opt.value)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    insurance === opt.value ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-5 border-t border-neutral-200">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" className="bg-neutral-900 text-white hover:bg-neutral-800" onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Check className="h-3.5 w-3.5 mr-1" /> Save</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
