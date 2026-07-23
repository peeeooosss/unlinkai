"use client";

const universities = [
  "Harvard University",
  "University of Oxford",
  "Stanford University",
  "MIT",
  "University of Cambridge",
  "Imperial College London",
  "Yale University",
  "Princeton University",
  "Columbia University",
  "UC Berkeley",
  "University of Edinburgh",
  "McGill University",
  "University of Sydney",
  "KAIST",
  "ANU",
  "University of Melbourne",
  "TU Munich",
  "ETH Zurich",
  "University of Toronto",
  "UBC",
];

export function TrustedBy() {
  const doubled = [...universities, ...universities];

  return (
    <section className="py-10 border-y border-neutral-100 overflow-hidden bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
        <p className="text-center text-xs font-medium tracking-widest uppercase text-neutral-400">
          Trusted by Leading Universities
        </p>
      </div>
      <div className="relative w-full overflow-hidden">
        <div className="flex items-center gap-16 animate-marquee whitespace-nowrap">
          {doubled.map((name, i) => (
            <span
              key={i}
              className="font-heading text-xl sm:text-2xl flex-shrink-0 text-neutral-300 hover:text-neutral-400 transition-colors"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
