"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 py-20 lg:py-32">
      <div className="absolute inset-0 opacity-10">
        <Image
          src="/images/campus-life-8.jpg"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Begin Your Global Education Journey?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of students and agents who trust UniLinkAI for their international education needs.
            Start free today — no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto gap-2 bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 text-lg shadow-xl">
                Get Started Free
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg">
                Talk to an Advisor
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-blue-200/60 text-sm">
            No credit card required. Free profile assessment included.
          </p>
        </div>
      </div>
    </section>
  );
}
