"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GraduationCap, MapPin, Globe, ArrowRight, Search, Award, Briefcase, BookOpen } from "lucide-react";
import universities from "@/lib/data/universities.json";

const countryFlags: Record<string, string> = {
  UK: "🇬🇧",
  Europe: "🇪🇺",
  Australia: "🇦🇺",
  Singapore: "🇸🇬",
  "New Zealand": "🇳🇿",
  Mauritius: "🇲🇺",
  Dubai: "🇦🇪",
};

const countryColors: Record<string, string> = {
  UK: "from-red-600 to-blue-600",
  Europe: "from-blue-600 to-yellow-500",
  Australia: "from-green-600 to-yellow-500",
  Singapore: "from-red-500 to-white",
  "New Zealand": "from-blue-700 to-red-600",
  Mauritius: "from-blue-600 to-red-500",
  Dubai: "from-green-600 to-red-600",
};

type Region = keyof typeof universities;
const regions = Object.keys(universities) as Region[];

export default function CollegesPage() {
  const [search, setSearch] = React.useState("");
  const [activeTab, setActiveTab] = React.useState(regions[0]);

  const filtered = React.useMemo(() => {
    const list = universities[activeTab as keyof typeof universities] || [];
    if (!search) return list;
    return list.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.address.toLowerCase().includes(search.toLowerCase())
    );
  }, [activeTab, search]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-white/5 opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white/10 text-white border-white/20 text-xs">Partner Network</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Global Universities at Your <span className="text-amber-400">Fingertips</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl">
              We connect students to top institutions across 7 regions worldwide. From UK universities to Australian colleges — find the perfect fit for your study abroad journey.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/login">
                <Button className="bg-white text-blue-800 hover:bg-blue-50 font-semibold">
                  Start as Agent <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/#features">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { label: "Universities", value: Object.values(universities).flat().length + "+" },
              { label: "Countries", value: "7" },
              { label: "Programs", value: "500+" },
              { label: "Students Placed", value: "10,000+" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-bold text-neutral-900">{stat.value}</p>
                <p className="text-sm text-neutral-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Universities by Country */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">Explore Our Partner Universities</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Browse institutions across the globe. Select a region to discover universities, courses, and admission details.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Region)}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0">
              {regions.map((region) => (
                <TabsTrigger
                  key={region}
                  value={region}
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white border border-neutral-200 rounded-full px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  {countryFlags[region]} {region}
                  <Badge variant="secondary" className="ml-2 text-[10px] h-4 px-1.5 bg-white/20 text-current">
                    {universities[region as keyof typeof universities]?.length || 0}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search universities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-full border border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {regions.map((region) => (
            <TabsContent key={region} value={region} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((uni, i) => {
                  const courses = uni.courses?.slice(0, 3) || [];
                  const hasScholarships = uni.costs?.scholarships?.available;
                  const hasWorkVisa = uni.visa?.postStudyWorkVisa;
                  const qsRank = uni.ranking?.qs;
                  const livingCost = uni.costs?.livingCostMonthly;

                  return (
                    <div
                      key={i}
                      className="group border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all bg-white"
                    >
                      {/* Campus Image Placeholder */}
                      <div className={`h-40 bg-gradient-to-br ${countryColors[region] || "from-blue-600 to-blue-800"} flex items-center justify-center relative`}>
                        <GraduationCap className="h-16 w-16 text-white/30" />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-white/90 text-neutral-900 text-xs font-semibold">
                            {countryFlags[region]} {region}
                          </Badge>
                        </div>
                        {qsRank && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-black/70 text-white text-xs font-semibold">
                              QS #{qsRank}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="font-semibold text-neutral-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {uni.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-sm text-neutral-600 mb-3">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span className="line-clamp-1">{uni.address}</span>
                        </div>

                        {/* Real Course Names */}
                        {courses.length > 0 && (
                          <div className="mb-3">
                            <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1.5">Programs</p>
                            <div className="space-y-1">
                              {courses.map((course) => (
                                <div key={course.name} className="flex items-center gap-1.5 text-xs text-neutral-700">
                                  <BookOpen className="h-3 w-3 shrink-0 text-neutral-400" />
                                  <span className="line-clamp-1">{course.name}</span>
                                </div>
                              ))}
                              {(uni.courses?.length || 0) > 3 && (
                                <p className="text-[10px] text-blue-600">+{(uni.courses?.length || 0) - 3} more programs</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Indicators */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {hasScholarships && (
                            <Badge className="text-[10px] bg-amber-100 text-amber-700">
                              <Award className="h-2.5 w-2.5 mr-0.5" />
                              Scholarships
                            </Badge>
                          )}
                          {hasWorkVisa && (
                            <Badge className="text-[10px] bg-emerald-100 text-emerald-700">
                              <Briefcase className="h-2.5 w-2.5 mr-0.5" />
                              Work Visa
                            </Badge>
                          )}
                          {livingCost && (
                            <Badge variant="outline" className="text-[10px] border-neutral-200 text-neutral-600">
                              {livingCost.symbol}{livingCost.amount.toLocaleString()}/mo
                            </Badge>
                          )}
                        </div>

                        <Link href="/login">
                          <Button variant="outline" size="sm" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 group-hover:border-blue-400">
                            View Details <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <Globe className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-500">No universities found matching your search.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find the Right University?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join UniLinkAI as a partner agent and access our complete university network with commission tracking and student management tools.
          </p>
          <Link href="/login">
            <Button className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8">
              Get Started as an Agent <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
