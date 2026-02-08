"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShieldX, ShieldCheck } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface PersonalLiabilityData {
  companyType: string;
  label: string;
  yes: number;
  no: number;
}

const personalLiabilityData: PersonalLiabilityData[] = [
  { companyType: "Private", label: "Privately Held Company", yes: 25.34, no: 74.66 },
  { companyType: "Public", label: "Publicly Traded Company", yes: 26.63, no: 73.37 },
];

interface LiabilityBarProps {
  data: PersonalLiabilityData;
  isVisible: boolean;
  delay: number;
  prefersReducedMotion: boolean;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}

function LiabilityBar({
  data,
  isVisible,
  delay,
  prefersReducedMotion,
  isHovered,
  onHover,
}: LiabilityBarProps) {
  const [animatedYes, setAnimatedYes] = useState(prefersReducedMotion ? data.yes : 0);
  const [animatedNo, setAnimatedNo] = useState(prefersReducedMotion ? data.no : 0);

  useEffect(() => {
    if (isVisible && !prefersReducedMotion) {
      const timer = setTimeout(() => {
        setAnimatedYes(data.yes);
        setAnimatedNo(data.no);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, data.yes, data.no, delay, prefersReducedMotion]);

  return (
    <div
      className={cn(
        "space-y-2 transition-all",
        prefersReducedMotion ? "duration-0" : "duration-200",
        isHovered && "scale-[1.01]"
      )}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">{data.label}</span>
        <span className="text-xs text-muted-foreground">
          <span className="text-[#c41e3a] font-semibold">{data.no.toFixed(1)}%</span> unprotected
        </span>
      </div>
      <TooltipProvider delayDuration={0}>
        <div
          className={cn(
            "relative h-14 bg-muted/30 border border-border overflow-hidden flex",
            isHovered && "ring-2 ring-primary/20"
          )}
        >
          {/* Yes segment (has coverage) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "h-full flex items-center justify-center transition-all ease-out cursor-pointer hover:brightness-110",
                  prefersReducedMotion ? "duration-0" : "duration-1000"
                )}
                style={{
                  width: `${animatedYes}%`,
                  backgroundColor: "#059669",
                  transitionDelay: prefersReducedMotion ? "0ms" : "0ms",
                }}
              >
                {animatedYes > 8 && (
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-white/90" />
                    <span
                      className="text-sm font-bold text-white drop-shadow-sm"
                      style={{
                        opacity: animatedYes > 0 ? 1 : 0,
                        transition: prefersReducedMotion ? "none" : "opacity 0.3s ease-out",
                        transitionDelay: prefersReducedMotion ? "0ms" : "600ms",
                      }}
                    >
                      {data.yes.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-[#059669] text-white border-none px-3 py-2"
            >
              <p className="font-semibold">Has Personal Liability Coverage</p>
              <p className="text-sm opacity-90">{data.yes.toFixed(1)}% of {data.companyType.toLowerCase()} company CISOs</p>
            </TooltipContent>
          </Tooltip>

          {/* No segment (lacks coverage) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "h-full flex items-center justify-center transition-all ease-out cursor-pointer hover:brightness-110",
                  prefersReducedMotion ? "duration-0" : "duration-1000"
                )}
                style={{
                  width: `${animatedNo}%`,
                  backgroundColor: "#c41e3a",
                  transitionDelay: prefersReducedMotion ? "0ms" : "150ms",
                }}
              >
                {animatedNo > 15 && (
                  <div className="flex items-center gap-1.5">
                    <ShieldX className="w-4 h-4 text-white/90" />
                    <span
                      className="text-sm font-bold text-white drop-shadow-sm"
                      style={{
                        opacity: animatedNo > 0 ? 1 : 0,
                        transition: prefersReducedMotion ? "none" : "opacity 0.3s ease-out",
                        transitionDelay: prefersReducedMotion ? "0ms" : "750ms",
                      }}
                    >
                      {data.no.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-[#c41e3a] text-white border-none px-3 py-2"
            >
              <p className="font-semibold">No Personal Liability Coverage</p>
              <p className="text-sm opacity-90">{data.no.toFixed(1)}% of {data.companyType.toLowerCase()} company CISOs</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}

interface PersonalLiabilityChartProps {
  className?: string;
}

export function PersonalLiabilityChart({ className }: PersonalLiabilityChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.4 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Calculate average lack of coverage
  const averageLackCoverage =
    personalLiabilityData.reduce((sum, d) => sum + d.no, 0) / personalLiabilityData.length;

  return (
    <div ref={containerRef} className={cn("space-y-6", className)}>
      {/* Header with key insight */}
      <div className="flex items-center gap-4 pb-4 border-b border-border">
        <div className="flex items-center justify-center w-14 h-14 bg-[#c41e3a]/10 border border-[#c41e3a]/20">
          <ShieldX className="w-7 h-7 text-[#c41e3a]" />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-foreground">Personal Liability Insurance</h4>
          <p className="text-sm text-muted-foreground">
            Individual coverage rates for security executives by company structure
          </p>
        </div>
      </div>

      {/* Key metric callout */}
      <div
        className={cn(
          "bg-[#c41e3a]/5 border-l-4 border-[#c41e3a] p-4 transition-all",
          prefersReducedMotion ? "duration-0" : "duration-700",
          isVisible
            ? "opacity-100 translate-x-0"
            : prefersReducedMotion
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-4"
        )}
      >
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-[#c41e3a]">~{Math.round(averageLackCoverage)}%</span>
          <span className="text-lg font-medium text-foreground">of CISOs</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          lack personal liability insurance coverage, regardless of company structure
        </p>
      </div>

      {/* Stacked percentage bars */}
      <div className="space-y-6">
        {personalLiabilityData.map((data, index) => (
          <LiabilityBar
            key={data.companyType}
            data={data}
            isVisible={isVisible}
            delay={200 + index * 200}
            prefersReducedMotion={prefersReducedMotion}
            isHovered={hoveredBar === index}
            onHover={(hovered) => setHoveredBar(hovered ? index : null)}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div className="flex items-center gap-3 p-3 bg-[#059669]/5 border border-[#059669]/20">
          <div className="flex items-center justify-center w-10 h-10 bg-[#059669]/10">
            <ShieldCheck className="w-5 h-5 text-[#059669]" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#059669]">
              Has Coverage
            </p>
            <p className="text-sm text-muted-foreground">
              ~26% of CISOs
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-[#c41e3a]/5 border border-[#c41e3a]/20">
          <div className="flex items-center justify-center w-10 h-10 bg-[#c41e3a]/10">
            <ShieldX className="w-5 h-5 text-[#c41e3a]" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#c41e3a]">
              No Coverage
            </p>
            <p className="text-sm text-muted-foreground">
              ~74% of CISOs
            </p>
          </div>
        </div>
      </div>

      {/* Comparison insight */}
      <div className="text-xs text-muted-foreground pt-2 border-t border-border">
        <p>
          <strong className="text-foreground">Sector comparison:</strong> Personal liability coverage rates are nearly identical between public ({personalLiabilityData[1].yes.toFixed(1)}%) and private ({personalLiabilityData[0].yes.toFixed(1)}%) companies—a difference of only <strong className="text-foreground">{Math.abs(personalLiabilityData[1].yes - personalLiabilityData[0].yes).toFixed(1)}%</strong>.
        </p>
      </div>
    </div>
  );
}
