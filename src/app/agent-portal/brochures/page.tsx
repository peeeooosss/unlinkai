"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Share2, Search, Check } from "lucide-react";
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

export default function AgentBrochuresPage() {
  const [search, setSearch] = React.useState("");
  const [copied, setCopied] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    if (!search) return brochures;
    const q = search.toLowerCase();
    return brochures.filter(
      (b) =>
        b.country.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        (b.region && b.region.toLowerCase().includes(q))
    );
  }, [search]);

  const handleShare = (brochure: (typeof brochures)[number]) => {
    const url = `${window.location.origin}/brochures/${brochure.filename}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(brochure.country);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">University Brochures</h1>
        <p className="text-neutral-600 mt-1">
          Access and share university brochures across all countries.
        </p>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by country or region..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((brochure) => (
          <div
            key={brochure.country}
            className="group rounded-2xl overflow-hidden border border-neutral-200 bg-white hover:shadow-lg hover:border-blue-300 transition-all duration-300"
          >
            <div
              className={`h-32 bg-gradient-to-br ${
                countryGradients[brochure.country] || "from-blue-600 to-blue-800"
              } flex items-center justify-center relative`}
            >
              <span className="text-5xl" role="img" aria-label={brochure.country}>
                {brochure.flag}
              </span>
              <div className="absolute top-3 right-3">
                <Badge className="bg-white/90 text-neutral-900 text-xs font-semibold">
                  {brochure.universityCount} Universities
                </Badge>
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-bold text-lg text-neutral-900 mb-1">
                {brochure.country}
              </h3>
              {brochure.region && (
                <p className="text-xs text-neutral-500 mb-2">{brochure.region}</p>
              )}
              <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                {brochure.description}
              </p>

              <div className="flex gap-2">
                <a
                  href={`/brochures/${brochure.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download
                    <Download className="h-3 w-3 ml-auto" />
                  </Button>
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                  onClick={() => handleShare(brochure)}
                >
                  {copied === brochure.country ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-500">No brochures found matching your search.</p>
        </div>
      )}
    </div>
  );
}
