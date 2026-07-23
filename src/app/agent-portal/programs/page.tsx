"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Calendar,
  GraduationCap,
  Clock,
  Banknote,
  BookOpen,
  Building2,
  ExternalLink,
  ChevronDown,
  SlidersHorizontal,
  X,
  Briefcase,
  Award,
  Globe,
  ChevronRight,
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
  requirements?: {
    ielts?: number | null;
    toefl?: number | null;
    minGpa?: string;
  };
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
  ranking?: { qs?: number | null; the?: number | null };
  admissions?: {
    ielts?: number | null;
    toefl?: number | null;
    applicationFee?: { amount: number; currency: string; symbol: string };
  };
  costs?: {
    livingCostMonthly?: { amount: number; currency: string; symbol: string };
    scholarships?: { available: boolean; details?: string };
  };
  visa?: {
    postStudyWorkVisa: boolean;
    postStudyWorkDuration?: string;
    workHoursDuringStudy?: number;
  };
  courses: CourseEntry[];
}

interface FlatProgram {
  universityName: string;
  universityAddress: string;
  universityCountry: string;
  universityCity?: string;
  region: Region;
  ranking?: { qs?: number | null; the?: number | null };
  scholarships: boolean;
  scholarshipDetails?: string;
  postStudyWorkVisa: boolean;
  workVisaDuration?: string;
  workHoursDuringStudy?: number;
  livingCostMonthly?: number;
  livingCostSymbol?: string;
  courseName: string;
  level: string;
  department: string;
  duration: string;
  fee: number;
  currency: string;
  symbol: string;
  intakes: string[];
  ielts?: number | null;
  toefl?: number | null;
}

function flattenPrograms(): FlatProgram[] {
  const rows: FlatProgram[] = [];
  for (const [region, unis] of Object.entries(universities) as [Region, UniEntry[]][]) {
    for (const uni of unis) {
      for (const c of uni.courses) {
        rows.push({
          universityName: uni.name,
          universityAddress: uni.address,
          universityCountry: uni.country,
          universityCity: uni.city,
          region,
          ranking: uni.ranking,
          scholarships: uni.costs?.scholarships?.available ?? false,
          scholarshipDetails: uni.costs?.scholarships?.details,
          postStudyWorkVisa: uni.visa?.postStudyWorkVisa ?? false,
          workVisaDuration: uni.visa?.postStudyWorkDuration,
          workHoursDuringStudy: uni.visa?.workHoursDuringStudy,
          livingCostMonthly: uni.costs?.livingCostMonthly?.amount,
          livingCostSymbol: uni.costs?.livingCostMonthly?.symbol,
          courseName: c.name,
          level: c.level,
          department: c.department,
          duration: c.duration,
          fee: c.fee,
          currency: c.currency,
          symbol: c.symbol,
          intakes: c.intakes,
          ielts: c.requirements?.ielts ?? uni.admissions?.ielts ?? null,
          toefl: c.requirements?.toefl ?? uni.admissions?.toefl ?? null,
        });
      }
    }
  }
  return rows;
}

const allPrograms = flattenPrograms();

const regions = Object.keys(universities) as Region[];
const allIntakes = ["January", "February", "March", "May", "July", "September", "October", "November"];
const allLevels = ["Undergraduate", "Postgraduate", "PhD"];

function getAllDepartments(): string[] {
  const set = new Set<string>();
  for (const p of allPrograms) set.add(p.department);
  return Array.from(set).sort();
}
const allDepartments = getAllDepartments();

const budgetRanges = [
  { label: "All Budgets", min: 0, max: Infinity },
  { label: "Under £10k / €12k", min: 0, max: 10000 },
  { label: "£10k – £20k / €12k – €24k", min: 10000, max: 20000 },
  { label: "£20k – £35k / €24k – €42k", min: 20000, max: 35000 },
  { label: "£35k – £50k / €42k – €60k", min: 35000, max: 50000 },
  { label: "Over £50k / €60k", min: 50000, max: Infinity },
] as const;

const ieltsOptions = [5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0];

const levelBadgeColors: Record<string, string> = {
  Undergraduate: "bg-blue-100 text-blue-700",
  Postgraduate: "bg-purple-100 text-purple-700",
  PhD: "bg-amber-100 text-amber-700",
};

const countryBadgeColors: Record<string, string> = {
  UK: "bg-red-100 text-red-700",
  Europe: "bg-blue-100 text-blue-700",
  Australia: "bg-green-100 text-green-700",
  Singapore: "bg-purple-100 text-purple-700",
  "New Zealand": "bg-cyan-100 text-cyan-700",
  Mauritius: "bg-amber-100 text-amber-700",
  Dubai: "bg-emerald-100 text-emerald-700",
};

const countryFlags: Record<string, string> = {
  UK: "🇬🇧",
  Europe: "🇪🇺",
  Australia: "🇦🇺",
  Singapore: "🇸🇬",
  "New Zealand": "🇳🇿",
  Mauritius: "🇲🇺",
  Dubai: "🇦🇪",
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

const departmentColors: Record<string, string> = {
  "Business & Management": "from-blue-500 to-blue-600",
  "Computer Science & IT": "from-violet-500 to-purple-600",
  Engineering: "from-orange-500 to-amber-600",
  "Finance & Economics": "from-emerald-500 to-green-600",
  "Marketing & Media": "from-pink-500 to-rose-600",
  "Hospitality & Tourism": "from-cyan-500 to-teal-600",
  Education: "from-yellow-500 to-amber-600",
  "Conservation & Environment": "from-lime-500 to-green-600",
  "Creative Arts & Design": "from-fuchsia-500 to-pink-600",
  "Psychology & Social Sciences": "from-indigo-500 to-blue-600",
  Science: "from-teal-500 to-cyan-600",
  "Aviation & Aerospace": "from-sky-500 to-blue-600",
  "Health Sciences": "from-rose-500 to-red-600",
  "Law": "from-slate-500 to-gray-600",
};

function computeCommission(level: string, fee: number, currency: string): number {
  const rate = level === "Undergraduate" ? 0.08 : level === "Postgraduate" ? 0.12 : 0.10;
  return Math.round(fee * rate);
}

function ProgramsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = React.useState(searchParams.get("search") || "");
  const [countryFilter, setCountryFilter] = React.useState(searchParams.get("country") || "all");
  const [levelFilter, setLevelFilter] = React.useState(searchParams.get("level") || "all");
  const [deptFilter, setDeptFilter] = React.useState(searchParams.get("department") || "all");
  const [budgetFilter, setBudgetFilter] = React.useState(Number(searchParams.get("budget")) || 0);
  const [maxIelts, setMaxIelts] = React.useState(Number(searchParams.get("ielts")) || 0);
  const [intakeFilter, setIntakeFilter] = React.useState(searchParams.get("intake") || "all");
  const [scholarshipOnly, setScholarshipOnly] = React.useState(searchParams.get("scholarship") === "true");
  const [workVisaOnly, setWorkVisaOnly] = React.useState(searchParams.get("workvisa") === "true");
  const [showFilters, setShowFilters] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<"fee-asc" | "fee-desc" | "ranking" | "name">("ranking");

  const filtered = React.useMemo(() => {
    return allPrograms.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !p.universityName.toLowerCase().includes(q) &&
          !p.courseName.toLowerCase().includes(q) &&
          !p.department.toLowerCase().includes(q) &&
          !p.universityCity?.toLowerCase().includes(q) &&
          !p.universityCountry.toLowerCase().includes(q)
        ) return false;
      }
      if (countryFilter !== "all" && p.region !== countryFilter) return false;
      if (levelFilter !== "all" && p.level !== levelFilter) return false;
      if (deptFilter !== "all" && p.department !== deptFilter) return false;
      if (budgetFilter > 0) {
        const range = budgetRanges[budgetFilter];
        if (range && (p.fee < range.min || p.fee >= range.max)) return false;
      }
      if (maxIelts > 0 && p.ielts !== null && p.ielts !== undefined && p.ielts > maxIelts) return false;
      if (intakeFilter !== "all" && !p.intakes.some((i) => i.toLowerCase() === intakeFilter)) return false;
      if (scholarshipOnly && !p.scholarships) return false;
      if (workVisaOnly && !p.postStudyWorkVisa) return false;
      return true;
    });
  }, [search, countryFilter, levelFilter, deptFilter, budgetFilter, maxIelts, intakeFilter, scholarshipOnly, workVisaOnly]);

  const sorted = React.useMemo(() => {
    const copy = [...filtered];
    switch (sortBy) {
      case "fee-asc":
        copy.sort((a, b) => a.fee - b.fee);
        break;
      case "fee-desc":
        copy.sort((a, b) => b.fee - a.fee);
        break;
      case "ranking":
        copy.sort((a, b) => (a.ranking?.qs ?? 9999) - (b.ranking?.qs ?? 9999));
        break;
      case "name":
        copy.sort((a, b) => a.universityName.localeCompare(b.universityName));
        break;
    }
    return copy;
  }, [filtered, sortBy]);

  const activeFilterCount = [
    countryFilter !== "all",
    levelFilter !== "all",
    deptFilter !== "all",
    budgetFilter > 0,
    maxIelts > 0,
    intakeFilter !== "all",
    scholarshipOnly,
    workVisaOnly,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch("");
    setCountryFilter("all");
    setLevelFilter("all");
    setDeptFilter("all");
    setBudgetFilter(0);
    setMaxIelts(0);
    setIntakeFilter("all");
    setScholarshipOnly(false);
    setWorkVisaOnly(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Programs</h1>
          <p className="text-neutral-600 mt-1">
            Browse and filter programs across all partner universities
          </p>
        </div>
        <Badge variant="secondary" className="text-xs !text-neutral-900 w-fit">
          {sorted.length} program{sorted.length !== 1 ? "s" : ""} found
        </Badge>
      </div>

      {/* Search + Filter Toggle */}
      <Card className="border-black">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                placeholder="Search programs, universities, departments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white border-black text-neutral-900 placeholder:text-neutral-500"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`border-black shrink-0 ${showFilters ? "bg-neutral-900 text-white" : "text-neutral-900 hover:bg-neutral-100"}`}
            >
              <SlidersHorizontal className="h-4 w-4 mr-1.5" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-1.5 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-white text-neutral-900 rounded-full">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="h-10 rounded-md border border-black bg-white px-3 text-sm text-neutral-900"
            >
              <option value="ranking">Ranking</option>
              <option value="fee-asc">Fee: Low → High</option>
              <option value="fee-desc">Fee: High → Low</option>
              <option value="name">Name</option>
            </select>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="h-10 rounded-md border border-black bg-white px-3 text-sm text-neutral-900"
              >
                <option value="all">All Regions</option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {countryFlags[r]} {r}
                  </option>
                ))}
              </select>

              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="h-10 rounded-md border border-black bg-white px-3 text-sm text-neutral-900"
              >
                <option value="all">All Levels</option>
                {allLevels.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>

              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="h-10 rounded-md border border-black bg-white px-3 text-sm text-neutral-900"
              >
                <option value="all">All Departments</option>
                {allDepartments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <select
                value={budgetFilter}
                onChange={(e) => setBudgetFilter(Number(e.target.value))}
                className="h-10 rounded-md border border-black bg-white px-3 text-sm text-neutral-900"
              >
                {budgetRanges.map((r, i) => (
                  <option key={i} value={i}>
                    {r.label}
                  </option>
                ))}
              </select>

              <select
                value={maxIelts}
                onChange={(e) => setMaxIelts(Number(e.target.value))}
                className="h-10 rounded-md border border-black bg-white px-3 text-sm text-neutral-900"
              >
                <option value={0}>Any IELTS Score</option>
                {ieltsOptions.map((s) => (
                  <option key={s} value={s}>
                    Max IELTS {s}
                  </option>
                ))}
              </select>

              <select
                value={intakeFilter}
                onChange={(e) => setIntakeFilter(e.target.value)}
                className="h-10 rounded-md border border-black bg-white px-3 text-sm text-neutral-900"
              >
                <option value="all">All Intakes</option>
                {allIntakes.map((i) => (
                  <option key={i} value={i.toLowerCase()}>
                    {i}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setScholarshipOnly(!scholarshipOnly)}
                className={`h-10 rounded-md border px-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  scholarshipOnly
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-white text-neutral-900 border-black hover:bg-neutral-100"
                }`}
              >
                <Award className="h-4 w-4" />
                Scholarships Only
              </button>

              <button
                onClick={() => setWorkVisaOnly(!workVisaOnly)}
                className={`h-10 rounded-md border px-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  workVisaOnly
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-white text-neutral-900 border-black hover:bg-neutral-100"
                }`}
              >
                <Briefcase className="h-4 w-4" />
                Work Visa Only
              </button>
            </div>
          )}

          {activeFilterCount > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-neutral-500">Active filters:</span>
              {countryFilter !== "all" && (
                <Badge variant="secondary" className="text-[10px] gap-1">
                  {countryFilter}
                  <button onClick={() => setCountryFilter("all")}><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {levelFilter !== "all" && (
                <Badge variant="secondary" className="text-[10px] gap-1">
                  {levelFilter}
                  <button onClick={() => setLevelFilter("all")}><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {deptFilter !== "all" && (
                <Badge variant="secondary" className="text-[10px] gap-1">
                  {deptFilter}
                  <button onClick={() => setDeptFilter("all")}><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {budgetFilter > 0 && (
                <Badge variant="secondary" className="text-[10px] gap-1">
                  {budgetRanges[budgetFilter].label}
                  <button onClick={() => setBudgetFilter(0)}><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {maxIelts > 0 && (
                <Badge variant="secondary" className="text-[10px] gap-1">
                  IELTS ≤ {maxIelts}
                  <button onClick={() => setMaxIelts(0)}><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {intakeFilter !== "all" && (
                <Badge variant="secondary" className="text-[10px] gap-1">
                  {intakeFilter}
                  <button onClick={() => setIntakeFilter("all")}><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {scholarshipOnly && (
                <Badge variant="secondary" className="text-[10px] gap-1">
                  Scholarships
                  <button onClick={() => setScholarshipOnly(false)}><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {workVisaOnly && (
                <Badge variant="secondary" className="text-[10px] gap-1">
                  Work Visa
                  <button onClick={() => setWorkVisaOnly(false)}><X className="h-3 w-3" /></button>
                </Badge>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-blue-600 hover:underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Program Cards Grid */}
      {sorted.length === 0 ? (
        <Card className="border-black">
          <CardContent className="p-16 text-center">
            <GraduationCap className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-neutral-900 mb-1">No programs found</p>
            <p className="text-sm text-neutral-500">Try adjusting your filters or search terms</p>
            <Button variant="outline" size="sm" className="mt-4 border-black" onClick={clearFilters}>
              Clear all filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {sorted.map((program, i) => {
            const commission = computeCommission(program.level, program.fee, program.currency);
            const gradientClass = departmentColors[program.department] || "from-neutral-500 to-neutral-600";
            const qsRank = program.ranking?.qs;

            return (
              <Card key={i} className="border-black overflow-hidden hover:shadow-lg transition-shadow group flex flex-col">
                {/* Department Header */}
                <div className={`bg-gradient-to-r ${gradientClass} px-5 py-3 flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-white/80" />
                    <span className="text-white text-sm font-medium">{program.department}</span>
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30 text-[10px]">
                    {program.level}
                  </Badge>
                </div>

                <CardContent className="p-5 flex-1 flex flex-col">
                  {/* University */}
                  <div className="mb-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-neutral-900 leading-tight group-hover:text-blue-600 transition-colors">
                        {program.universityName}
                      </h3>
                      {qsRank && (
                        <Badge variant="outline" className="text-[10px] border-black shrink-0">
                          QS #{qsRank}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-600 mt-1">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="line-clamp-1">{program.universityAddress}, {program.universityCity || program.universityCountry}</span>
                    </div>
                    <Badge className={`mt-2 text-[10px] ${countryBadgeColors[program.region] || "bg-neutral-100 text-neutral-700"}`}>
                      {countryFlags[program.region]} {program.region}
                    </Badge>
                  </div>

                  {/* Course Name */}
                  <div className="bg-neutral-50 rounded-lg p-3 mb-3">
                    <p className="font-medium text-neutral-900 text-sm">{program.courseName}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-neutral-600">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {program.duration}
                      </span>
                      {program.ielts !== null && program.ielts !== undefined && (
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          IELTS {program.ielts}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Fee + Commission */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-neutral-500">Annual Tuition</p>
                      <p className="text-lg font-bold text-neutral-900">
                        {program.symbol}{program.fee.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-neutral-500">Your Commission</p>
                      <p className="text-lg font-bold text-green-700">
                        {program.symbol}{commission.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Intakes */}
                  <div className="mb-3">
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1.5">Intakes</p>
                    <div className="flex flex-wrap gap-1">
                      {program.intakes.map((intake) => (
                        <Badge
                          key={intake}
                          className={`text-[10px] ${intakeColors[intake] || "bg-neutral-100 text-neutral-700"}`}
                        >
                          <Calendar className="h-2.5 w-2.5 mr-0.5" />
                          {intake}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Badges Row */}
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {program.scholarships && (
                      <Badge className="text-[10px] bg-amber-100 text-amber-700">
                        <Award className="h-2.5 w-2.5 mr-0.5" />
                        Scholarships
                      </Badge>
                    )}
                    {program.postStudyWorkVisa && (
                      <Badge className="text-[10px] bg-emerald-100 text-emerald-700">
                        <Briefcase className="h-2.5 w-2.5 mr-0.5" />
                        Post-Study Work Visa
                      </Badge>
                    )}
                    {program.livingCostMonthly && (
                      <Badge variant="outline" className="text-[10px] border-neutral-200 text-neutral-600">
                        <Banknote className="h-2.5 w-2.5 mr-0.5" />
                        {program.livingCostSymbol}{program.livingCostMonthly.toLocaleString()}/mo living
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ProgramsPage() {
  return (
    <React.Suspense fallback={<div className="flex items-center justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-blue-600" /></div>}>
      <ProgramsContent />
    </React.Suspense>
  );
}