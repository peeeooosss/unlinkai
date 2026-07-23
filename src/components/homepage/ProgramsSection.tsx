"use client";

import Image from "next/image";
import { GraduationCap, ScrollText, Briefcase, ArrowRight, Languages, FileCheck } from "lucide-react";

const programs = [
  { icon: GraduationCap, title: "Undergraduate", description: "Bachelor's degree programs across Arts, Science, Engineering, and Business at top global universities.", image: "/images/campus-life-1.jpg" },
  { icon: ScrollText, title: "Master's & PhD", description: "Postgraduate research and taught programs with scholarship guidance and funding support.", image: "/images/campus-life-2.jpg" },
  { icon: Briefcase, title: "MBA", description: "World-class business education with GMAT waiver options at accredited institutions.", image: "/images/campus-life-3.jpg" },
  { icon: ArrowRight, title: "Pathway Programs", description: "Foundation and diploma courses that guarantee progression to degree programs.", image: "/images/campus-life-4.jpg" },
  { icon: Languages, title: "Language Prep", description: "IELTS, TOEFL, PTE coaching with guaranteed score improvement strategies.", image: "/images/campus-life-5.jpg" },
  { icon: FileCheck, title: "Visa & Immigration", description: "End-to-end visa application support with 98% success rate.", image: "/images/campus-life-6.jpg" },
];

export function ProgramsSection() {
  return (
    <section id="programs" className="py-20 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">Programs We Offer</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Comprehensive programs tailored to your academic goals and career aspirations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <div
              key={program.title}
              className="group bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-neutral-200"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={program.image}
                  alt={program.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm">
                    <program.icon className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg text-neutral-900 mb-2">{program.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed mb-3">{program.description}</p>
                <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
                  Learn More <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
