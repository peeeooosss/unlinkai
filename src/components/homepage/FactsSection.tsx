"use client";

import Image from "next/image";
import { Languages, Globe, Brain } from "lucide-react";

const facts = [
  { number: "6M+", label: "International students studying worldwide as of 2024" },
  { number: "300B+", label: "Global international education market value in USD" },
  { number: "85%", label: "Students report significant career growth after studying abroad" },
  { number: "92%", label: "Would recommend studying abroad to other students" },
  { number: "25%", label: "Higher average salary compared to non-international peers" },
  { number: "150+", label: "Countries offering programs for international students" },
];

const insights = [
  { icon: Languages, title: "Language Advantage", description: "95% of employers value bilingual candidates. Immersion is the fastest path to fluency." },
  { icon: Globe, title: "Global Network", description: "Build lifelong connections across continents. 78% of international alumni maintain cross-border relationships." },
  { icon: Brain, title: "Cognitive Growth", description: "Research shows studying abroad enhances creativity, problem-solving, and adaptability by up to 40%." },
];

export function FactsSection() {
  return (
    <section id="facts" className="py-20 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">Why Study Abroad?</h2>
            <p className="text-lg text-neutral-600 max-w-lg">
              The numbers speak for themselves. International education transforms careers, perspectives, and earning potential.
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/dest-uk.jpg"
              alt="Study abroad"
              width={600}
              height={300}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-transparent" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="text-center p-7 bg-neutral-50 rounded-2xl border border-neutral-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">{fact.number}</div>
              <div className="text-sm text-neutral-600 leading-relaxed">{fact.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {insights.map((insight) => (
            <div key={insight.title} className="flex gap-4 items-start p-5 bg-neutral-50 rounded-2xl border border-neutral-200 hover:border-blue-200 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <insight.icon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900 mb-1">{insight.title}</h4>
                <p className="text-neutral-600 text-sm leading-relaxed">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
