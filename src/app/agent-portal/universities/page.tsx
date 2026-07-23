"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  GraduationCap,
  Search,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Building2,
  BookOpen,
  Layers,
  Globe,
  Award,
  Briefcase,
  Banknote,
  Clock,
} from "lucide-react";
import universities from "@/lib/data/universities.json";

type Region = keyof typeof universities;

interface CourseEntry {
  name: string;
  level: string;
  department: string;
  duration: string;
  fee: number;
  currency: string;
  symbol: string;
  intakes: string[];
}

interface UniEntry {
  name: string;
  logo?: string;
  website?: string;
  about?: string;
  address: string;
  city?: string;
  country: string;
  region: string;
  ranking?: { qs?: number | null; the?: number | null; note?: string };
  admissions?: {
    ielts?: number | null;
    toefl?: number | null;
    pte?: number | null;
    gre?: number | null;
    gmat?: number | null;
    minGpa?: string;
    applicationFee?: { amount: number; currency: string; symbol: string };
    applicationDeadline?: string;
    notes?: string;
  };
  costs?: {
    livingCostMonthly?: { amount: number; currency: string; symbol: string };
    accommodationMonthly?: { amount: number; currency: string; symbol: string };
    scholarships?: { available: boolean; details?: string };
  };
  visa?: {
    postStudyWorkVisa: boolean;
    postStudyWorkDuration?: string;
    workHoursDuringStudy?: number;
  };
  courses: CourseEntry[];
}

const allIntakes = ["January", "February", "March", "May", "July", "September", "October", "November"];

const levelTabs = [
  { key: "all", label: "All Levels", icon: Layers },
  { key: "undergraduate", label: "UG (Undergraduate)", icon: BookOpen },
  { key: "postgraduate", label: "PG (Postgraduate)", icon: GraduationCap },
  { key: "phd", label: "PhD / Doctorate", icon: GraduationCap },
] as const;

type LevelKey = typeof levelTabs[number]["key"];

const commissionRates: Record<string, number> = {
  Undergraduate: 8,
  Postgraduate: 12,
};

const intakeColors: Record<string, string> = {
  January: "bg-blue-100 text-blue-700",
  February: "bg-blue-100 text-blue-700",
  March: "bg-teal-100 text-teal-700",
  May: "bg-green-100 text-green-700",
  July: "bg-amber-100 text-amber-700",
  September: "bg-purple-100 text-purple-700",
  October: "bg-purple-100 text-purple-700",
  November: "bg-rose-100 text-rose-700",
};

const countryBadge: Record<string, string> = {
  UK: "bg-red-100 text-red-700",
  Europe: "bg-blue-100 text-blue-700",
  Australia: "bg-green-100 text-green-700",
  Singapore: "bg-purple-100 text-purple-700",
  "New Zealand": "bg-cyan-100 text-cyan-700",
  Mauritius: "bg-amber-100 text-amber-700",
  Dubai: "bg-emerald-100 text-emerald-700",
};

const departmentColors: Record<string, string> = {
  "Business & Management": "from-blue-500 to-blue-600",
  "Computer Science & IT": "from-violet-500 to-purple-600",
  "Engineering": "from-orange-500 to-amber-600",
  "Finance & Economics": "from-emerald-500 to-green-600",
  "Marketing & Media": "from-pink-500 to-rose-600",
  "Hospitality & Tourism": "from-cyan-500 to-teal-600",
  "Education": "from-yellow-500 to-amber-600",
  "Conservation & Environment": "from-lime-500 to-green-600",
  "Creative Arts & Design": "from-fuchsia-500 to-pink-600",
  "Psychology & Social Sciences": "from-indigo-500 to-blue-600",
  "Science": "from-teal-500 to-cyan-600",
  "Aviation & Aerospace": "from-sky-500 to-blue-600",
  "Health Sciences": "from-rose-500 to-red-600",
  "Law": "from-slate-500 to-gray-600",
};

const departmentIcons: Record<string, string> = {
  "Business & Management": "M",
  "Computer Science & IT": "CS",
  "Engineering": "E",
  "Finance & Economics": "F",
  "Marketing & Media": "M",
  "Hospitality & Tourism": "H",
  "Education": "E",
  "Conservation & Environment": "C",
  "Creative Arts & Design": "D",
  "Psychology & Social Sciences": "P",
  "Science": "S",
  "Aviation & Aerospace": "A",
  "Health Sciences": "HS",
  "Law": "L",
};

function getAllDepartments(): string[] {
  const set = new Set<string>();
  for (const unis of Object.values(universities) as UniEntry[][]) {
    for (const uni of unis) {
      for (const c of uni.courses) set.add(c.department);
    }
  }
  return Array.from(set).sort();
}

const allDepartments = getAllDepartments();

interface DeptGroup {
  department: string;
  universities: {
    name: string;
    address: string;
    region: Region;
    courses: CourseEntry[];
  }[];
  courseCount: number;
}

function getDeptGroups(levelFilter: LevelKey, search: string, countryFilter: string, intakeFilter: string): DeptGroup[] {
  const deptMap = new Map<string, DeptGroup>();

  for (const [region, unis] of Object.entries(universities) as [Region, UniEntry[]][]) {
    if (countryFilter !== "all" && region !== countryFilter) continue;

    for (const uni of unis) {
      const matchingCourses = uni.courses.filter((c) => {
        const matchLevel = levelFilter === "all" || c.level.toLowerCase() === levelFilter;
        const q = search.toLowerCase();
        const matchSearch = !q ||
          c.name.toLowerCase().includes(q) ||
          c.department.toLowerCase().includes(q) ||
          uni.name.toLowerCase().includes(q);
        const matchIntake = intakeFilter === "all" || c.intakes.some((i) => i.toLowerCase() === intakeFilter);
        return matchLevel && matchSearch && matchIntake;
      });

      if (matchingCourses.length === 0) continue;

      for (const c of matchingCourses) {
        if (!deptMap.has(c.department)) {
          deptMap.set(c.department, { department: c.department, universities: [], courseCount: 0 });
        }
        const group = deptMap.get(c.department)!;
        const existingUni = group.universities.find((u) => u.name === uni.name);
        if (existingUni) {
          existingUni.courses.push(c);
        } else {
          group.universities.push({ name: uni.name, address: uni.address, region, courses: [c] });
        }
        group.courseCount++;
      }
    }
  }

  return Array.from(deptMap.values()).sort((a, b) => b.courseCount - a.courseCount);
}

interface FlatRow {
  university: string;
  address: string;
  country: Region;
  course: string;
  level: string;
  department: string;
  duration: string;
  intakes: string[];
  fee: number;
  currency: string;
  symbol: string;
}

function flattenAll(): FlatRow[] {
  const rows: FlatRow[] = [];
  for (const [region, unis] of Object.entries(universities) as [Region, UniEntry[]][]) {
    for (const uni of unis) {
      for (const c of uni.courses) {
        rows.push({
          university: uni.name,
          address: uni.address,
          country: region,
          course: c.name,
          level: c.level,
          department: c.department,
          duration: c.duration,
          intakes: c.intakes,
          fee: c.fee,
          currency: c.currency,
          symbol: c.symbol,
        });
      }
    }
  }
  return rows;
}

const allRows = flattenAll();

export default function AgentUniversitiesPage() {
  const [levelFilter, setLevelFilter] = React.useState<LevelKey>("all");
  const [search, setSearch] = React.useState("");
  const [countryFilter, setCountryFilter] = React.useState("all");
  const [intakeFilter, setIntakeFilter] = React.useState("all");
  const [deptFilter, setDeptFilter] = React.useState("all");
  const [expandedDepts, setExpandedDepts] = React.useState<Set<string>>(new Set());
  const [expandedUnis, setExpandedUnis] = React.useState<Set<string>>(new Set());
  const [selectedUni, setSelectedUni] = React.useState<UniEntry & { region: Region } | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const regions = Object.keys(universities) as Region[];

  const findUni = (name: string): (UniEntry & { region: Region }) | null => {
    for (const [region, unis] of Object.entries(universities) as [Region, UniEntry[]][]) {
      for (const uni of unis) {
        if (uni.name === name) return { ...uni, region };
      }
    }
    return null;
  };

  const openUniDetail = (name: string) => {
    const uni = findUni(name);
    if (uni) {
      setSelectedUni(uni);
      setSheetOpen(true);
    }
  };

  const deptGroups = React.useMemo(
    () => getDeptGroups(levelFilter, search, countryFilter, intakeFilter),
    [levelFilter, search, countryFilter, intakeFilter]
  );

  const filteredDepts = React.useMemo(() => {
    if (deptFilter === "all") return deptGroups;
    return deptGroups.filter((g) => g.department === deptFilter);
  }, [deptGroups, deptFilter]);

  const tableRows = React.useMemo(() => {
    return allRows.filter((row) => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        row.university.toLowerCase().includes(q) ||
        row.course.toLowerCase().includes(q) ||
        row.department.toLowerCase().includes(q) ||
        row.address.toLowerCase().includes(q) ||
        row.country.toLowerCase().includes(q);
      const matchCountry = countryFilter === "all" || row.country === countryFilter;
      const matchLevel = levelFilter === "all" || row.level.toLowerCase() === levelFilter;
      const matchIntake = intakeFilter === "all" || row.intakes.some((i) => i.toLowerCase() === intakeFilter);
      const matchDept = deptFilter === "all" || row.department === deptFilter;
      return matchSearch && matchCountry && matchLevel && matchIntake && matchDept;
    });
  }, [search, countryFilter, levelFilter, intakeFilter, deptFilter]);

  const toggleDept = (dept: string) => {
    setExpandedDepts((prev) => {
      const next = new Set(prev);
      if (next.has(dept)) next.delete(dept);
      else next.add(dept);
      return next;
    });
  };

  const toggleUniKey = (key: string) => {
    setExpandedUnis((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const showDeptView = levelFilter !== "all";

  const totalCourses = showDeptView
    ? filteredDepts.reduce((s, g) => s + g.courseCount, 0)
    : tableRows.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">University & Course Search</h1>
          <p className="text-neutral-600 mt-1">
            Search by level, department, country, and intake to shortlist the best fit
          </p>
        </div>
        <Badge variant="secondary" className="text-xs !text-neutral-900 w-fit">
          {totalCourses} course{totalCourses !== 1 ? "s" : ""} found
        </Badge>
      </div>

      {/* Level Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {levelTabs.map((tab) => {
          const Icon = tab.icon;
          const active = levelFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => { setLevelFilter(tab.key); setDeptFilter("all"); setExpandedDepts(new Set()); setExpandedUnis(new Set()); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all border ${
                active
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-700 border-black hover:bg-neutral-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filters Row */}
      <Card className="border-black">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                placeholder="Search universities, courses, departments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white border-black text-neutral-900 placeholder:text-neutral-500"
              />
            </div>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="h-10 rounded-md border border-black bg-white px-3 text-sm text-neutral-900"
            >
              <option value="all">All Countries</option>
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <select
              value={intakeFilter}
              onChange={(e) => setIntakeFilter(e.target.value)}
              className="h-10 rounded-md border border-black bg-white px-3 text-sm text-neutral-900"
            >
              <option value="all">All Intakes</option>
              {allIntakes.map((i) => (
                <option key={i} value={i.toLowerCase()}>{i}</option>
              ))}
            </select>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="h-10 rounded-md border border-black bg-white px-3 text-sm text-neutral-900"
            >
              <option value="all">All Departments</option>
              {allDepartments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Department View (when a level is selected) */}
      {showDeptView ? (
        <div className="space-y-4">
          {filteredDepts.length === 0 ? (
            <Card className="border-black">
              <CardContent className="p-12 text-center">
                <GraduationCap className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500">No departments match your filters</p>
                <p className="text-sm text-neutral-400 mt-1">Try adjusting the level, country, or search terms</p>
              </CardContent>
            </Card>
          ) : (
            filteredDepts.map((group) => {
              const isExpanded = expandedDepts.has(group.department);
              const gradientClass = departmentColors[group.department] || "from-neutral-500 to-neutral-600";
              const deptInitials = departmentIcons[group.department] || group.department[0];

              return (
                <Card key={group.department} className="border-black overflow-hidden">
                  <button
                    onClick={() => toggleDept(group.department)}
                    className="w-full text-left"
                  >
                    <div className={`bg-gradient-to-r ${gradientClass} p-4`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                            {deptInitials}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-lg">{group.department}</h3>
                            <p className="text-white/80 text-sm">
                              {group.courseCount} course{group.courseCount !== 1 ? "s" : ""} across {group.universities.length} universit{group.universities.length !== 1 ? "ies" : "y"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-white/20 text-white border-white/30 text-xs">
                            {levelFilter === "undergraduate" ? "UG" : levelFilter === "postgraduate" ? "PG" : "PhD"}
                          </Badge>
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-white" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <CardContent className="p-0 divide-y divide-neutral-200">
                      {group.universities.map((uni) => {
                        const uniKey = `${group.department}-${uni.name}`;
                        const isUniExpanded = expandedUnis.has(uniKey);

                        return (
                          <div key={uni.name}>
                            <button
                              onClick={() => toggleUniKey(uniKey)}
                              className="w-full text-left p-4 hover:bg-neutral-50 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-md bg-neutral-100 flex items-center justify-center">
                                    <Building2 className="h-4 w-4 text-neutral-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-neutral-900">{uni.name}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <Badge className={`text-[10px] ${countryBadge[uni.region] || "bg-neutral-100 text-neutral-700"}`}>
                                        {uni.region}
                                      </Badge>
                                      <span className="text-xs text-neutral-500 flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        <span className="line-clamp-1 max-w-[180px]">{uni.address}</span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs border-black text-neutral-700">
                                    {uni.courses.length} course{uni.courses.length !== 1 ? "s" : ""}
                                  </Badge>
                                  {isUniExpanded ? (
                                    <ChevronDown className="h-4 w-4 text-neutral-400" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                                  )}
                                </div>
                              </div>
                            </button>

                            {isUniExpanded && (
                              <div className="bg-neutral-50 px-4 pb-4 space-y-2">
                                <div className="flex gap-2 mb-3">
                                  <Link
                                    href={`/agent-portal/programs?university=${encodeURIComponent(uni.name)}`}
                                  >
                                    <Button size="sm" variant="outline" className="h-7 text-xs border-black text-neutral-900 hover:bg-neutral-100">
                                      <BookOpen className="h-3 w-3 mr-1" />
                                      View Programs
                                    </Button>
                                  </Link>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs border-black text-neutral-900 hover:bg-neutral-100"
                                    onClick={() => openUniDetail(uni.name)}
                                  >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    Details
                                  </Button>
                                </div>
                                {uni.courses.map((c) => {
                                  const pct = commissionRates[c.level] || 10;

                                  return (
                                    <div key={c.name} className="bg-white border border-neutral-200 rounded-lg p-3">
                                      <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                          <p className="font-medium text-neutral-900 text-sm">{c.name}</p>
                                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                            <Badge className="text-[10px] bg-neutral-100 text-neutral-700">{c.level}</Badge>
                                            <span className="text-[10px] text-neutral-500">{c.duration}</span>
                                            <span className="text-xs font-medium text-neutral-900">{c.symbol}{c.fee.toLocaleString()}/yr</span>
                                          </div>
                                          <div className="flex flex-wrap gap-1 mt-2">
                                            {c.intakes.map((intake) => (
                                              <Badge key={intake} className={`text-[10px] ${intakeColors[intake] || "bg-neutral-100 text-neutral-700"}`}>
                                                <Calendar className="h-2.5 w-2.5 mr-0.5" />
                                                {intake}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                          <p className="text-green-700 font-semibold text-sm">{pct}%</p>
                                          <p className="text-[10px] text-neutral-500">commission</p>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 text-[10px] border-black text-neutral-900 hover:bg-neutral-100 mt-1"
                                          >
                                            <ExternalLink className="h-3 w-3 mr-1" />
                                            Apply
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </CardContent>
                  )}
                </Card>
              );
            })
          )}
        </div>
      ) : (
        /* Flat Table View (All Levels) */
        <Card className="border-black">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black bg-neutral-100">
                    <th className="text-left p-3 font-semibold text-neutral-900">University & Country</th>
                    <th className="text-left p-3 font-semibold text-neutral-900">Course, Dept & Level</th>
                    <th className="text-left p-3 font-semibold text-neutral-900">Intakes</th>
                    <th className="text-left p-3 font-semibold text-neutral-900">Tuition Fee</th>
                    <th className="text-left p-3 font-semibold text-neutral-900">Commission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {tableRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center">
                        <GraduationCap className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
                        <p className="text-neutral-500">No results match your filters</p>
                      </td>
                    </tr>
                  ) : (
                    tableRows.map((row, i) => {
                      const pct = commissionRates[row.level] || 10;

                      return (
                        <tr key={i} className="hover:bg-neutral-50">
                          <td className="p-3">
                            <p className="font-medium text-neutral-900">{row.university}</p>
                            <div className="flex items-center gap-1 text-xs text-neutral-600 mt-0.5">
                              <MapPin className="h-3 w-3" />
                              <span className="line-clamp-1 max-w-[200px]">{row.address}</span>
                            </div>
                            <div className="flex gap-1 mt-2">
                              <Link
                                href={`/agent-portal/programs?university=${encodeURIComponent(row.university)}`}
                              >
                                <Button size="sm" variant="outline" className="h-6 text-[10px] border-black text-neutral-900 hover:bg-neutral-100">
                                  <BookOpen className="h-2.5 w-2.5 mr-0.5" />
                                  Programs
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 text-[10px] border-black text-neutral-900 hover:bg-neutral-100"
                                onClick={() => openUniDetail(row.university)}
                              >
                                Details
                              </Button>
                            </div>
                          </td>
                          <td className="p-3">
                            <p className="text-neutral-900 font-medium">{row.course}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className="text-[10px] bg-violet-100 text-violet-700">{row.department}</Badge>
                              <Badge className="text-[10px] bg-neutral-100 text-neutral-700">{row.level}</Badge>
                              <span className="text-[10px] text-neutral-500">{row.duration}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {row.intakes.map((intake) => (
                                <Badge key={intake} className={`text-[10px] ${intakeColors[intake] || "bg-neutral-100 text-neutral-700"}`}>
                                  <Calendar className="h-2.5 w-2.5 mr-0.5" />
                                  {intake}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="p-3 font-medium text-neutral-900">
                            {row.symbol}{row.fee.toLocaleString()}/yr
                          </td>
                          <td className="p-3">
                            <p className="text-green-700 font-semibold">{pct}%</p>
                            <p className="text-[10px] text-neutral-500 mt-0.5">of tuition</p>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* University Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedUni && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="text-xl">{selectedUni.name}</SheetTitle>
                <SheetDescription className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {selectedUni.address}, {selectedUni.region}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/agent-portal/programs?university=${encodeURIComponent(selectedUni.name)}`}
                    onClick={() => setSheetOpen(false)}
                  >
                    <Button size="sm" className="bg-neutral-900 text-white hover:bg-neutral-800">
                      <BookOpen className="h-4 w-4 mr-1.5" />
                      View Programs
                    </Button>
                  </Link>
                  {selectedUni.website && (
                    <a href={selectedUni.website} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="border-black">
                        <ExternalLink className="h-4 w-4 mr-1.5" />
                        Website
                      </Button>
                    </a>
                  )}
                </div>

                {/* About */}
                {selectedUni.about && (
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 mb-2">About</h4>
                    <p className="text-sm text-neutral-600">{selectedUni.about}</p>
                  </div>
                )}

                {/* Rankings */}
                {selectedUni.ranking && (selectedUni.ranking.qs || selectedUni.ranking.the) && (
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 mb-2">Rankings</h4>
                    <div className="flex gap-3">
                      {selectedUni.ranking.qs && (
                        <Badge variant="outline" className="text-sm border-black">
                          QS: #{selectedUni.ranking.qs}
                        </Badge>
                      )}
                      {selectedUni.ranking.the && (
                        <Badge variant="outline" className="text-sm border-black">
                          THE: #{selectedUni.ranking.the}
                        </Badge>
                      )}
                    </div>
                    {selectedUni.ranking.note && (
                      <p className="text-xs text-neutral-500 mt-1">{selectedUni.ranking.note}</p>
                    )}
                  </div>
                )}

                {/* Admissions */}
                {selectedUni.admissions && (
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 mb-2">Admissions</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedUni.admissions.ielts && (
                        <div className="bg-neutral-50 rounded-lg p-3">
                          <p className="text-xs text-neutral-500">IELTS</p>
                          <p className="text-lg font-bold text-neutral-900">{selectedUni.admissions.ielts}</p>
                        </div>
                      )}
                      {selectedUni.admissions.toefl && (
                        <div className="bg-neutral-50 rounded-lg p-3">
                          <p className="text-xs text-neutral-500">TOEFL</p>
                          <p className="text-lg font-bold text-neutral-900">{selectedUni.admissions.toefl}</p>
                        </div>
                      )}
                      {selectedUni.admissions.applicationFee && (
                        <div className="bg-neutral-50 rounded-lg p-3">
                          <p className="text-xs text-neutral-500">Application Fee</p>
                          <p className="text-lg font-bold text-neutral-900">
                            {selectedUni.admissions.applicationFee.symbol}{selectedUni.admissions.applicationFee.amount}
                          </p>
                        </div>
                      )}
                    </div>
                    {selectedUni.admissions.notes && (
                      <p className="text-xs text-neutral-500 mt-2">{selectedUni.admissions.notes}</p>
                    )}
                  </div>
                )}

                {/* Living Costs */}
                {selectedUni.costs && (
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 mb-2">Living Costs</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedUni.costs.livingCostMonthly && (
                        <div className="bg-neutral-50 rounded-lg p-3">
                          <p className="text-xs text-neutral-500">Monthly Living</p>
                          <p className="text-lg font-bold text-neutral-900">
                            {selectedUni.costs.livingCostMonthly.symbol}{selectedUni.costs.livingCostMonthly.amount.toLocaleString()}
                          </p>
                        </div>
                      )}
                      {selectedUni.costs.accommodationMonthly && (
                        <div className="bg-neutral-50 rounded-lg p-3">
                          <p className="text-xs text-neutral-500">Accommodation</p>
                          <p className="text-lg font-bold text-neutral-900">
                            {selectedUni.costs.accommodationMonthly.symbol}{selectedUni.costs.accommodationMonthly.amount.toLocaleString()}/mo
                          </p>
                        </div>
                      )}
                    </div>
                    {selectedUni.costs.scholarships?.available && (
                      <div className="mt-3 bg-amber-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-amber-600" />
                          <span className="text-sm font-medium text-amber-800">Scholarships Available</span>
                        </div>
                        {selectedUni.costs.scholarships.details && (
                          <p className="text-xs text-amber-700 mt-1">{selectedUni.costs.scholarships.details}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Visa */}
                {selectedUni.visa && (
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 mb-2">Work Visa</h4>
                    <div className="bg-neutral-50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-medium text-neutral-900">
                          {selectedUni.visa.postStudyWorkVisa ? "Post-Study Work Visa Available" : "No Post-Study Work Visa"}
                        </span>
                      </div>
                      {selectedUni.visa.postStudyWorkDuration && (
                        <p className="text-xs text-neutral-600 mt-1">{selectedUni.visa.postStudyWorkDuration}</p>
                      )}
                      {selectedUni.visa.workHoursDuringStudy && (
                        <p className="text-xs text-neutral-600">Work {selectedUni.visa.workHoursDuringStudy}hrs/week during study</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Courses */}
                {selectedUni.courses && selectedUni.courses.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 mb-2">Courses ({selectedUni.courses.length})</h4>
                    <div className="space-y-2">
                      {selectedUni.courses.map((course) => {
                        const pct = commissionRates[course.level] || 10;
                        return (
                          <div key={course.name} className="bg-neutral-50 rounded-lg p-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-neutral-900 text-sm">{course.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className="text-[10px] bg-neutral-200 text-neutral-700">{course.level}</Badge>
                                  <span className="text-xs text-neutral-500 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {course.duration}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-neutral-900">
                                  {course.symbol}{course.fee.toLocaleString()}/yr
                                </p>
                                <p className="text-xs text-green-700">{pct}% commission</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {course.intakes.map((intake) => (
                                <Badge key={intake} className={`text-[10px] ${intakeColors[intake] || "bg-neutral-100 text-neutral-700"}`}>
                                  <Calendar className="h-2.5 w-2.5 mr-0.5" />
                                  {intake}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
