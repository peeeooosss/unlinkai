"use client";

import * as React from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getApplications } from "@/lib/actions/applications";
import { getStudents } from "@/lib/actions/students";
import { getDocumentsByStudents } from "@/lib/actions/documents";
import { updateApplicationStage } from "@/lib/actions/applications";
import { STAGE_ORDER, STAGE_LABELS, type Stage } from "@/lib/db/schema";
import { StudentDetailModal } from "./StudentDetailModal";
import { ChevronDown, ChevronRight, FileText, CheckCircle2, Clock, Mail, Phone, Globe, GraduationCap, User } from "lucide-react";

interface KanbanCard {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  nationality: string;
  passportNumber: string | null;
  educationLevel: string;
  university: string;
  course: string;
  priority: "high" | "medium" | "low";
  documents: { id: string; type: string; fileName: string; verified: boolean }[];
}

interface KanbanColumn {
  id: Stage;
  title: string;
  color: string;
  cards: KanbanCard[];
}

const columnConfig: Record<Stage, { color: string; bg: string }> = {
  lead: { color: "bg-neutral-500", bg: "bg-neutral-50" },
  application_submitted: { color: "bg-blue-500", bg: "bg-blue-50/50" },
  offer_received: { color: "bg-amber-500", bg: "bg-amber-50/50" },
  visa_processing: { color: "bg-purple-500", bg: "bg-purple-50/50" },
  visa_approved: { color: "bg-green-500", bg: "bg-green-50/50" },
};

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-green-100 text-green-700",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function ExpandableCard({ card, onOpenModal }: { card: KanbanCard; onOpenModal: () => void }) {
  const [showDetails, setShowDetails] = React.useState(false);
  const [showDocs, setShowDocs] = React.useState(false);

  const verifiedCount = card.documents.filter((d) => d.verified).length;
  const totalCount = card.documents.length;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden hover:border-blue-300 transition-all shadow-sm hover:shadow-md">
      <div
        className="p-3 cursor-pointer"
        onClick={onOpenModal}
      >
        <div className="flex items-start gap-2.5 mb-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-white">{getInitials(card.studentName)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-900 truncate">{card.studentName}</p>
            <p className="text-[11px] text-neutral-600 truncate">{card.university}</p>
            <p className="text-[11px] text-neutral-500 truncate">{card.course}</p>
          </div>
          <Badge className={`text-[10px] px-1.5 py-0 flex-shrink-0 ${priorityColors[card.priority]}`}>
            {card.priority}
          </Badge>
        </div>
      </div>

      <div className="border-t border-neutral-100">
        <button
          onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
        >
          {showDetails ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          <User className="h-3 w-3" />
          Student Details
        </button>
        {showDetails && (
          <div className="px-3 pb-2 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px]">
              <Mail className="h-3 w-3 text-neutral-400" />
              <span className="text-neutral-700 truncate">{card.studentEmail}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <Phone className="h-3 w-3 text-neutral-400" />
              <span className="text-neutral-700">{card.studentPhone}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <Globe className="h-3 w-3 text-neutral-400" />
              <span className="text-neutral-700">{card.nationality}</span>
            </div>
            {card.passportNumber && (
              <div className="flex items-center gap-1.5 text-[11px]">
                <FileText className="h-3 w-3 text-neutral-400" />
                <span className="text-neutral-700">{card.passportNumber}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-[11px]">
              <GraduationCap className="h-3 w-3 text-neutral-400" />
              <span className="text-neutral-700">{card.educationLevel}</span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-neutral-100">
        <button
          onClick={(e) => { e.stopPropagation(); setShowDocs(!showDocs); }}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
        >
          {showDocs ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          <FileText className="h-3 w-3" />
          Documents
          {totalCount > 0 && (
            <Badge variant="secondary" className="ml-auto text-[9px] h-4 px-1 !text-neutral-900">
              {verifiedCount}/{totalCount}
            </Badge>
          )}
        </button>
        {showDocs && (
          <div className="px-3 pb-2 space-y-1">
            {totalCount === 0 ? (
              <p className="text-[11px] text-neutral-400 italic">No documents uploaded</p>
            ) : (
              card.documents.map((doc) => (
                <div key={doc.id} className="flex items-center gap-1.5 text-[11px]">
                  {doc.verified ? (
                    <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                  ) : (
                    <Clock className="h-3 w-3 text-amber-500 flex-shrink-0" />
                  )}
                  <span className="text-neutral-700 truncate flex-1">{doc.type}</span>
                  <span className="text-neutral-500 truncate max-w-[80px]">{doc.fileName}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard() {
  const [columns, setColumns] = React.useState<KanbanColumn[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedStudentId, setSelectedStudentId] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  React.useEffect(() => {
    loadBoard();
  }, []);

  async function loadBoard() {
    setLoading(true);
    const [apps, studs] = await Promise.all([getApplications(), getStudents()]);
    const studentMap = new Map(studs.map((s) => [s.id, s]));

    const studentIds = studs.map((s) => s.id);
    const allDocs = await getDocumentsByStudents(studentIds);
    const docsMap = new Map<string, typeof allDocs>();
    for (const doc of allDocs) {
      const existing = docsMap.get(doc.studentId) || [];
      existing.push(doc);
      docsMap.set(doc.studentId, existing);
    }

    const kanbanCards: KanbanCard[] = apps.map((app) => {
      const student = studentMap.get(app.studentId);
      const docs = docsMap.get(app.studentId) || [];
      return {
        id: app.id,
        studentId: app.studentId,
        studentName: student?.name || "Unknown",
        studentEmail: student?.email || "",
        studentPhone: student?.phone || "",
        nationality: student?.nationality || "",
        passportNumber: student?.passportNumber ?? null,
        educationLevel: student?.educationLevel || "",
        university: app.university,
        course: app.course,
        priority: "medium" as const,
        documents: docs.map((d) => ({ id: d.id, type: d.type, fileName: d.fileName, verified: !!d.verified })) as KanbanCard["documents"],
      };
    });

    const cols: KanbanColumn[] = STAGE_ORDER.map((stage) => ({
      id: stage,
      title: STAGE_LABELS[stage],
      color: columnConfig[stage].color,
      cards: kanbanCards.filter((c) => {
        const app = apps.find((a) => a.id === c.id);
        return app?.stage === stage;
      }),
    }));

    setColumns(cols);
    setLoading(false);
  }

  async function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newStage = destination.droppableId as Stage;
    const oldStage = source.droppableId as Stage;

    const newColumns = columns.map((col) => {
      if (col.id === source.droppableId) {
        const newCards = [...col.cards];
        const [moved] = newCards.splice(source.index, 1);
        if (source.droppableId === destination.droppableId) {
          newCards.splice(destination.index, 0, moved);
        }
        return { ...col, cards: newCards };
      }
      if (col.id === destination.droppableId) {
        const newCards = [...col.cards];
        const moved = columns.find((c) => c.id === source.droppableId)?.cards[source.index];
        if (moved) {
          newCards.splice(destination.index, 0, moved);
        }
        return { ...col, cards: newCards };
      }
      return col;
    });

    setColumns(newColumns);

    if (oldStage !== newStage) {
      await updateApplicationStage(draggableId, newStage);
    }
  }

  function handleCardClick(studentId: string) {
    setSelectedStudentId(studentId);
    setModalOpen(true);
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-blue-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-neutral-900">Application Pipeline</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {columns.map((column) => (
                <div key={column.id} className="flex-shrink-0 w-72">
                  <div className={`rounded-lg p-2 ${columnConfig[column.id].bg}`}>
                    <div className="flex items-center justify-between mb-2 px-1">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${column.color}`} />
                        <span className="text-xs font-semibold text-neutral-700">
                          {column.title}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs h-5 px-1.5 !text-neutral-900">
                        {column.cards.length}
                      </Badge>
                    </div>

                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`space-y-2 min-h-[60px] rounded-md p-1 transition-colors ${
                            snapshot.isDraggingOver ? "bg-blue-50" : ""
                          }`}
                        >
                          {column.cards.map((card, index) => (
                            <Draggable key={card.id} draggableId={card.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`${
                                    snapshot.isDragging ? "shadow-lg rotate-1" : ""
                                  }`}
                                >
                                  <ExpandableCard
                                    card={card}
                                    onOpenModal={() => handleCardClick(card.studentId)}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              ))}
            </div>
          </DragDropContext>
        </CardContent>
      </Card>

      <StudentDetailModal
        studentId={selectedStudentId}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
