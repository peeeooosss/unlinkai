"use client";

import Image from "next/image";
import { GraduationCap, Globe, Users } from "lucide-react";

const images = [
  "/images/campus-life-1.jpg",
  "/images/campus-life-2.jpg",
  "/images/campus-life-3.jpg",
  "/images/campus-life-4.jpg",
  "/images/campus-life-5.jpg",
  "/images/campus-life-6.jpg",
  "/images/campus-life-7.jpg",
  "/images/campus-life-8.jpg",
];

const features = [
  { icon: GraduationCap, title: "Academic Excellence", description: "Access world-class faculty, cutting-edge research facilities, and internationally recognized degrees." },
  { icon: Globe, title: "Cultural Immersion", description: "Experience new cultures, languages, and perspectives that broaden your worldview." },
  { icon: Users, title: "Global Network", description: "Build lifelong connections with students and professionals from over 150 countries." },
];

export function StudentLifeSection() {
  return (
    <section id="student-life" className="py-20 lg:py-32 bg-neutral-900 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-blue-400 text-sm font-medium mb-6">
            Student Life
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Experience the World</h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Studying abroad is more than academics. It&apos;s about building a global network, discovering new cultures, and creating memories that last a lifetime.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {images.map((src, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden aspect-[4/3] group">
              <Image
                src={src}
                alt="Campus life"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-neutral-900/20 group-hover:bg-transparent transition-colors" />
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-blue-500/20">
                <feature.icon className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">{feature.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
