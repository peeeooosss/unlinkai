"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Users, Briefcase, GraduationCap, Building2, Brain, Zap, Shield, Globe } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Student Management",
    description: "Complete student CRM — manage profiles, track applications, upload documents, and monitor progress all in one place.",
    href: "#students",
    image: "/images/campus-life-1.jpg",
  },
  {
    icon: Briefcase,
    title: "Agent Dashboard",
    description: "Drag-and-drop Kanban board, commission tracking, real-time analytics, and automated stage updates.",
    href: "#opportunity",
    image: "/images/campus-life-2.jpg",
  },
  {
    icon: GraduationCap,
    title: "University Search",
    description: "Search 500+ partner universities. Filter by courses, intakes, programs, fees, and location to find the best fit.",
    href: "#courses",
    image: "/images/campus-life-3.jpg",
  },
  {
    icon: Building2,
    title: "Document Handling",
    description: "Upload, verify, and track student documents — passports, financials, test scores, and medical exams.",
    href: "#colleges",
    image: "/images/campus-life-4.jpg",
  },
];

const platformFeatures = [
  {
    icon: Brain,
    title: "Smart Matching",
    description: "AI analyzes 200+ data points to match students with best-fit universities with 94% accuracy.",
    image: "/images/campus-life-5.jpg",
  },
  {
    icon: Zap,
    title: "Auto Processing",
    description: "Document verification and application tracking automated end-to-end, reducing time by 70%.",
    image: "/images/campus-life-6.jpg",
  },
  {
    icon: Shield,
    title: "Visa Intelligence",
    description: "Predictive visa analytics with country-specific requirements, timelines, and 98% success rate.",
    image: "/images/campus-life-7.jpg",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Connect with agents and universities across 50+ countries with real-time data and updates.",
    image: "/images/campus-life-8.jpg",
  },
];

export function FeatureCards() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            Everything You Need for Global Education
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Whether you&apos;re a student dreaming of studying abroad or an agent building your education business,
            UniLinkAI provides the tools, network, and intelligence to succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-neutral-200 group"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm">
                    <feature.icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  </div>
                </div>
              </div>
              <CardContent className="p-5">
                <CardTitle className="text-lg font-semibold text-neutral-900 mb-2">{feature.title}</CardTitle>
                <p className="text-neutral-600 text-sm mb-3">{feature.description}</p>
                <a
                  href={feature.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Learn more
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              AI-Powered Platform
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-4">
              Powered by UniLinkAI
            </h3>
            <p className="text-neutral-600 mb-6">
              Our proprietary AI engine transforms how students discover universities and how agents manage their business.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /> 94% Match Accuracy</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> 70% Faster Processing</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /> Real-time Updates</div>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/campus-life-7.jpg"
              alt="UniLinkAI Platform"
              width={600}
              height={400}
              className="w-full h-72 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 text-xs font-medium text-blue-700 shadow-sm">
              AI Processing
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platformFeatures.map((feature) => (
            <div key={feature.title} className="text-center p-6 rounded-2xl hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 mb-4">
                <feature.icon className="h-7 w-7 text-blue-600" aria-hidden="true" />
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">{feature.title}</h4>
              <p className="text-sm text-neutral-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
