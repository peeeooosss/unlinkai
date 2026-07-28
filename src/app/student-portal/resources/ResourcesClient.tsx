"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  FolderOpen,
  FileText,
  Video,
  Link2,
  BookOpen,
  Download,
  ExternalLink,
  Search,
  Filter,
  Star,
  Clock,
} from "lucide-react";

function getResourceIcon(type: string) {
  switch (type) {
    case "file": return <FileText className="h-5 w-5" />;
    case "video": return <Video className="h-5 w-5" />;
    case "link": return <Link2 className="h-5 w-5" />;
    case "book": return <BookOpen className="h-5 w-5" />;
    default: return <FileText className="h-5 w-5" />;
  }
}

function getResourceColor(type: string) {
  switch (type) {
    case "file": return "bg-blue-100 text-blue-600";
    case "video": return "bg-purple-100 text-purple-600";
    case "link": return "bg-green-100 text-green-600";
    case "book": return "bg-amber-100 text-amber-600";
    default: return "bg-neutral-100 text-neutral-600";
  }
}

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays > 0) return `${diffDays}d ago`;
  return "Today";
}

interface ResourceItem {
  id: string;
  courseId: string;
  moduleId: string | null;
  title: string;
  description: string | null;
  type: string;
  url: string | null;
  fileUrl: string | null;
  isRequired: boolean;
  orderIndex: number;
  createdAt: string;
  courseTitle: string;
  moduleTitle: string | null;
}

interface ResourcesClientProps {
  resources: ResourceItem[];
}

export function ResourcesClient({ resources }: ResourcesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const courses = Array.from(new Set(resources.map(r => ({ id: r.courseId, title: r.courseTitle }))));
  const uniqueCourses = courses.filter((c, i, arr) => arr.findIndex(x => x.id === c.id) === i);

  const types = Array.from(new Set(resources.map(r => r.type)));

  const filtered = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesCourse = filterCourse === "all" || r.courseId === filterCourse;
    const matchesType = filterType === "all" || r.type === filterType;
    return matchesSearch && matchesCourse && matchesType;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Resources</h1>
        <p className="text-neutral-600 mt-1">Study materials, documents, and helpful links</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterCourse} onValueChange={setFilterCourse}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {uniqueCourses.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map(t => (
              <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Resources Grid */}
      {filtered.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FolderOpen className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-neutral-600 mb-1">No resources found</h3>
            <p className="text-sm text-neutral-500">
              {resources.length === 0
                ? "Resources will appear here once your instructors add them"
                : "Try adjusting your filters"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((resource) => (
            <Card key={resource.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl ${getResourceColor(resource.type)}`}>
                    {getResourceIcon(resource.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-neutral-900 truncate">{resource.title}</h3>
                      {resource.isRequired && (
                        <Badge className="text-[9px] bg-red-100 text-red-700">Required</Badge>
                      )}
                    </div>
                    {resource.description && (
                      <p className="text-xs text-neutral-500 line-clamp-2 mb-2">{resource.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                      <Badge variant="outline" className="text-[9px]">{resource.courseTitle}</Badge>
                      {resource.moduleTitle && (
                        <span className="truncate">{resource.moduleTitle}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-neutral-400 mt-1">
                      <Clock className="h-3 w-3" />
                      {timeAgo(resource.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  {resource.url && (
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        Open Link
                      </a>
                    </Button>
                  )}
                  {resource.fileUrl && (
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <a href={resource.fileUrl} download>
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Download
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
