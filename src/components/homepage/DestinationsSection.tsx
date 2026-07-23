"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";

const destinations = [
  { country: "United States", description: "Home to Ivy League and top-ranked research institutions. 2-year post-study work visa.", image: "/images/dest-usa.jpg", stats: "4,000+ Universities" },
  { country: "United Kingdom", description: "World-heritage universities with 2-year Graduate Route visa. Rich academic tradition.", image: "/images/dest-uk.jpg", stats: "QS Top 100: 18 Uni" },
  { country: "Canada", description: "Welcoming immigration policies, 3-year PGWP, affordable tuition.", image: "/images/dest-canada.jpg", stats: "98% Visa Success" },
  { country: "Australia", description: "8 universities in top 100 QS rankings. 2-4 year post-study work rights.", image: "/images/dest-australia.jpg", stats: "Group of 8" },
  { country: "Germany", description: "Tuition-free public universities. Strong industry connections. 18-month job seeker visa.", image: "/images/dest-germany.jpg", stats: "€0 Tuition" },
];

export function DestinationsSection() {
  return (
    <section id="destinations" className="py-20 lg:py-32 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">Top Destinations</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Discover world-class education in these popular study locations
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 md:gap-12">
          {destinations.map((dest) => (
            <div
              key={dest.country}
              className="w-full max-w-md md:max-w-lg relative rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={dest.image}
                  alt={dest.country}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-blue-400" />
                    <span className="text-xs font-medium tracking-wide uppercase text-white/70">{dest.stats}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{dest.country}</h3>
                  <p className="text-sm text-white/80 leading-relaxed">{dest.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
