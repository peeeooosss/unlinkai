"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText } from "lucide-react";
import brochures from "@/lib/data/brochures.json";

const countryGradients: Record<string, string> = {
  UK: "from-red-600 via-red-500 to-blue-600",
  Europe: "from-blue-600 via-blue-500 to-yellow-500",
  Australia: "from-green-600 via-green-500 to-yellow-500",
  Singapore: "from-red-500 via-red-400 to-white",
  "New Zealand": "from-blue-700 via-blue-600 to-red-600",
  Mauritius: "from-blue-600 via-blue-500 to-red-500",
  Dubai: "from-green-600 via-green-500 to-red-600",
};

export function BrochureSection() {
  return (
    <section id="brochures" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200">
            Free Downloads
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            University Brochures by <span className="text-blue-600">Country</span>
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
            Download comprehensive brochures for universities across your preferred study destination. Browse courses, fees, and campus details.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {brochures.map((brochure) => (
            <div
              key={brochure.country}
              className="group relative rounded-2xl overflow-hidden border border-neutral-200 bg-white hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`h-36 bg-gradient-to-br ${
                  countryGradients[brochure.country] || "from-blue-600 to-blue-800"
                } flex items-center justify-center relative`}
              >
                <span className="text-6xl" role="img" aria-label={brochure.country}>
                  {brochure.flag}
                </span>
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white/90 text-neutral-900 text-xs font-semibold">
                    {brochure.universityCount} Universities
                  </Badge>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg text-neutral-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {brochure.country}
                </h3>
                {brochure.region && (
                  <p className="text-xs text-neutral-500 mb-2">{brochure.region}</p>
                )}
                <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                  {brochure.description}
                </p>

                <a
                  href={`/brochures/${brochure.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 group-hover:border-blue-400"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download Brochure
                    <Download className="h-3 w-3 ml-auto" />
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
