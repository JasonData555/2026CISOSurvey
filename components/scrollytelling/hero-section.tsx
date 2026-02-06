"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToContent = () => {
    const element = document.getElementById("about");
    if (element) {
      element.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-[#003087] text-white overflow-hidden">
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-8 py-32">
        <div
          className={cn(
            "transition-all",
            prefersReducedMotion ? "duration-0" : "duration-1000 delay-100",
            isVisible
              ? "opacity-100 translate-y-0"
              : prefersReducedMotion
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
          )}
        >
          {/* Logo - Primary brand mark */}
          <div className="mb-6 md:mb-8">
            <Image
              src="/hitch-partners-logo.png"
              alt="Hitch Partners"
              height={48}
              width={163}
              className="h-8 md:h-10 lg:h-12 w-auto brightness-0 invert"
              priority
            />
          </div>

          {/* Eyebrow */}
          <p className="text-xs md:text-sm font-medium uppercase tracking-[0.2em] text-white/70 mb-6">
            Global Security Leadership Analysis
          </p>

          {/* Main Title */}
          <h1 className="text-white mb-8 max-w-4xl">
            2026 Global CISO
            <br />
            Leadership Report
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed mb-12">
            Executive analysis of compensation, reporting structures, AI governance,
            and strategic priorities across 625+ security leaders.
          </p>
        </div>

        {/* Key Stats Preview */}
        <div
          className={cn(
            "grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-8 transition-all",
            prefersReducedMotion ? "duration-0" : "duration-1000 delay-300",
            isVisible
              ? "opacity-100 translate-y-0"
              : prefersReducedMotion
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
          )}
        >
          <div className="border-l-2 border-white/30 pl-4">
            <span className="block text-3xl md:text-4xl font-bold tracking-tight">$128K</span>
            <span className="text-xs md:text-sm text-white/60 uppercase tracking-wide mt-1 block">
              Public-Private Gap
            </span>
          </div>
          <div className="border-l-2 border-white/30 pl-4">
            <span className="block text-3xl md:text-4xl font-bold tracking-tight">95%+</span>
            <span className="text-xs md:text-sm text-white/60 uppercase tracking-wide mt-1 block">
              AI Governance Immaturity
            </span>
          </div>
          <div className="border-l-2 border-white/30 pl-4 col-span-2 md:col-span-1">
            <span className="block text-3xl md:text-4xl font-bold tracking-tight">43%</span>
            <span className="text-xs md:text-sm text-white/60 uppercase tracking-wide mt-1 block">
              Third-Party Risk Priority
            </span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToContent}
        className={cn(
          "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all cursor-pointer hover:opacity-80",
          prefersReducedMotion ? "duration-0" : "duration-1000 delay-500",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        aria-label="Scroll to content"
      >
        <span className="text-xs uppercase tracking-widest text-white/50">Explore</span>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-white/50",
            !prefersReducedMotion && "animate-bounce"
          )}
        />
      </button>
    </section>
  );
}
