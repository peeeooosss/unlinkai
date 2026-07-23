"use client";

import Image from "next/image";

const galleryImages = [
  "/images/hero-students.jpg",
  "/images/dest-usa.jpg",
  "/images/dest-uk.jpg",
  "/images/campus-life-1.jpg",
  "/images/campus-life-2.jpg",
  "/images/dest-canada.jpg",
  "/images/campus-life-3.jpg",
  "/images/dest-australia.jpg",
  "/images/campus-life-4.jpg",
  "/images/dest-germany.jpg",
  "/images/campus-life-5.jpg",
  "/images/grad-priya.jpg",
];

export function GalleryStrip() {
  return (
    <section className="py-8 overflow-hidden bg-neutral-50">
      <div className="flex gap-4 animate-gallery-scroll">
        {[...galleryImages, ...galleryImages].map((src, i) => (
          <div key={i} className="relative flex-shrink-0 h-64 w-96 rounded-xl overflow-hidden">
            <Image
              src={src}
              alt="Gallery"
              fill
              className="object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
