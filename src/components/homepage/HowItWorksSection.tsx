"use client";

import Image from "next/image";
import { MessageCircle, ListChecks, Send, Plane } from "lucide-react";

const steps = [
  { icon: MessageCircle, number: "01", title: "Consultation", description: "Free 1-on-1 session to understand your goals, profile, and preferences." },
  { icon: ListChecks, number: "02", title: "University Shortlist", description: "Curated list of programs matching your aspirations, budget, and eligibility." },
  { icon: Send, number: "03", title: "Application", description: "End-to-end support: documents, essays, LORs, and submissions." },
  { icon: Plane, number: "04", title: "Visa & Departure", description: "Visa guidance, accommodation, pre-departure orientation, and airport pickup." },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">Your Journey, Simplified</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">Four simple steps to your dream university abroad.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/hero-students.jpg"
                alt="Student journey"
                width={600}
                height={320}
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-full bg-blue-600/80 flex items-center justify-center">
                  <span className="text-sm">&#9654;</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Watch Student Journey</p>
                  <p className="text-white/60 text-xs">From application to arrival</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl overflow-hidden h-32 relative">
                <Image src="/images/campus-life-5.jpg" alt="Campus" fill className="object-cover" />
              </div>
              <div className="rounded-xl overflow-hidden h-32 relative">
                <Image src="/images/campus-life-6.jpg" alt="Campus" fill className="object-cover" />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {steps.map((step) => (
              <div key={step.number} className="relative bg-white rounded-2xl p-6 border border-neutral-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <span className="absolute top-4 right-4 text-4xl font-bold text-blue-50">{step.number}</span>
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-blue-50 border-2 border-blue-500 mb-4">
                  <step.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg text-neutral-900 mb-2">{step.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
