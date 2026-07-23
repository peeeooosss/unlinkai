"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, GraduationCap, Building2, Globe } from "lucide-react";

const patternStyle = {
  backgroundImage: "url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%233b82f6\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
  opacity: 0.5,
};

const stats = [
  { value: "15,000+", label: "Students Placed" },
  { value: "500+", label: "Partner Colleges" },
  { value: "50+", label: "Countries" },
  { value: "98%", label: "Visa Success Rate" },
];

const floatingLabels = [
  { name: "Stanford", country: "USA", top: "8%", right: "-5%" },
  { name: "Oxford", country: "UK", bottom: "20%", left: "-8%" },
  { name: "TU Munich", country: "DE", top: "50%", right: "-10%" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-amber-50" />
      <div className="absolute inset-0" style={patternStyle} aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-amber-100/50" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              Powered by UniLinkAI
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-6">
              Your Bridge to{" "}
              <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                Global Education
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-600 mb-8 max-w-xl">
              Streamline international admissions with AI-powered matching, document handling, and visa intelligence. One platform for students, agents, and universities.
            </p>

            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center lg:justify-start gap-4 mb-12">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg shadow-lg shadow-blue-600/20">
                  Get Started
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg">
                  Agent Login
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm text-neutral-500">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-blue-600" aria-hidden="true" />
                <span>Trusted by 500+ Universities</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-500" aria-hidden="true" />
                <span>15,000+ Students Placed</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" aria-hidden="true" />
                <span>98% Visa Success Rate</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero-students.jpg"
                alt="International students on university campus"
                width={600}
                height={450}
                className="w-full h-auto object-cover"
                priority
              />
              {floatingLabels.map((label) => (
                <div
                  key={label.name}
                  className="absolute bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm shadow-sm animate-[orbFloat_6s_ease-in-out_infinite]"
                  style={{ top: label.top, right: label.right, bottom: label.bottom, left: label.left }}
                >
                  <span className="text-blue-700 font-semibold">{label.name}</span>
                  <span className="text-slate-400 ml-2">{label.country}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-4 bg-white rounded-2xl shadow-md border border-neutral-100 hover:shadow-lg transition-shadow"
                >
                  <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-neutral-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
}
