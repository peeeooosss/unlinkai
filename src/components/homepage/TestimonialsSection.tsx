"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

const testimonials = [
  {
    name: "Priya Sharma",
    program: "Master of Data Science",
    university: "University of Melbourne",
    quote: "UniLinkAI matched me with a program I hadn't even considered. The AI recommendation was spot-on — Melbourne's curriculum aligned perfectly with my career goals. The entire application process took 3 weeks instead of 3 months.",
    image: "/images/grad-priya.jpg",
  },
  {
    name: "Ahmed Al-Rashid",
    program: "MBA",
    university: "University of Toronto",
    quote: "As a working professional, I had zero time to research universities. The smart matching engine gave me a shortlist of 5 programs in minutes. Got admitted to my top choice with full document automation.",
    image: "/images/grad-ahmed.jpg",
  },
  {
    name: "Maria Santos",
    program: "MSc Computer Science",
    university: "TU Munich",
    quote: "Germany's free tuition seemed too good to be true until UniLinkAI guided me through every step. The visa intelligence feature caught a document issue that could have caused rejection. Life-saving.",
    image: "/images/grad-maria.jpg",
  },
];

export function TestimonialsSection() {
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">Student Stories</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Real journeys, real outcomes. Hear from students who found their dream programs through UniLinkAI.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {testimonials.map((t) => (
                <div key={t.name} className="w-full flex-shrink-0 px-4">
                  <div className="bg-neutral-50 rounded-2xl p-8 md:p-10 border border-neutral-200">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-blue-500 ring-2 ring-blue-100">
                          <Image
                            src={t.image}
                            alt={t.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-base md:text-lg mb-6 italic text-neutral-700 leading-relaxed">
                          &ldquo;{t.quote}&rdquo;
                        </p>
                        <div>
                          <h4 className="font-semibold text-lg text-neutral-900">{t.name}</h4>
                          <p className="text-sm text-neutral-500">{t.program}</p>
                          <p className="text-sm text-blue-600 font-medium">{t.university}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 transition-colors text-neutral-700"
              aria-label="Previous testimonial"
            >
              &#8592;
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === active ? "bg-blue-600 scale-125" : "bg-neutral-300 hover:bg-neutral-400"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 transition-colors text-neutral-700"
              aria-label="Next testimonial"
            >
              &#8594;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
