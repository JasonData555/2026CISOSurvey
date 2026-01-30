"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface ConfidenceSegment {
  label: string;
  privateValue: number;
  publicValue: number;
  color: string;
  icon: typeof ShieldCheck;
  description: string;
}

const confidenceData: ConfidenceSegment[] = [
  {
    label: "Very Confident",
    privateValue: 16,
    publicValue: 16,
    color: "#003087", // Royal blue - confident
    icon: ShieldCheck,
    description: "Full confidence in technical assessment capability",
  },
  {
    label: "Somewhat Confident",
    privateValue: 45,
    publicValue: 48,
    color: "#d97706", // Amber - warning
    icon: ShieldAlert,
    description: "Partial confidence, gaps in assessment process",
  },
  {
    label: "Not Confident",
    privateValue: 35,
    publicValue: 34,
    color: "#c41e3a", // Red - danger
    icon: ShieldX,
    description: "Lack of confidence in technical evaluation",
  },
];

interface ConfidenceMeterBarProps {
  label: string;
  segments: { value: number; color: string; label: string }[];
  isVisible: boolean;
  delay: number;
  prefersReducedMotion: boolean;
}

function ConfidenceMeterBar({ label, segments, isVisible, delay, prefersReducedMotion }: ConfidenceMeterBarProps) {
  const [animatedWidths, setAnimatedWidths] = useState<number[]>(
    prefersReducedMotion ? segments.map((s) => s.value) : segments.map(() => 0)
  );

  useEffect(() => {
    if (isVisible && !prefersReducedMotion) {
      const timer = setTimeout(() => {
        setAnimatedWidths(segments.map((s) => s.value));
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, segments, delay, prefersReducedMotion]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="text-xs text-muted-foreground">
          {100 - segments[0].value}% lack full confidence
        </span>
      </div>
      <TooltipProvider delayDuration={0}>
        <div className="relative h-12 bg-muted/50 border border-border overflow-hidden flex">
          {segments.map((segment, index) => (
            <Tooltip key={segment.label}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "h-full flex items-center justify-center transition-all ease-out cursor-pointer hover:brightness-110",
                    prefersReducedMotion ? "duration-0" : "duration-1000"
                  )}
                  style={{
                    width: `${animatedWidths[index]}%`,
                    backgroundColor: segment.color,
                    transitionDelay: prefersReducedMotion ? "0ms" : `${index * 150}ms`,
                  }}
                >
                  {animatedWidths[index] > 10 && (
                    <span
                      className="text-xs font-bold text-white drop-shadow-sm"
                      style={{
                        opacity: animatedWidths[index] > 0 ? 1 : 0,
                        transition: prefersReducedMotion ? "none" : "opacity 0.3s ease-out",
                        transitionDelay: prefersReducedMotion ? "0ms" : `${600 + index * 150}ms`,
                      }}
                    >
                      {segment.value}%
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-foreground text-background border-none px-3 py-2"
              >
                <p className="font-semibold">{segment.label}</p>
                <p className="text-sm opacity-80">{segment.value}% of CISOs</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}

interface ConfidenceMeterVisualizationProps {
  className?: string;
}

export function ConfidenceMeterVisualization({ className }: ConfidenceMeterVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSegment, setActiveSegment] = useState<number | null>(null);
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

  const privateSegments = confidenceData.map((d) => ({
    value: d.privateValue,
    color: d.color,
    label: d.label,
  }));

  const publicSegments = confidenceData.map((d) => ({
    value: d.publicValue,
    color: d.color,
    label: d.label,
  }));

  return (
    <div
      ref={containerRef}
      className={cn("space-y-8", className)}
    >
      {/* Header with key insight */}
      <div className="flex items-center gap-4 pb-4 border-b border-border">
        <div className="flex items-center justify-center w-14 h-14 bg-[#c41e3a]/10 border border-[#c41e3a]/20">
          <ShieldAlert className="w-7 h-7 text-[#c41e3a]" />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-foreground">Technical Assessment Capability</h4>
          <p className="text-sm text-muted-foreground">
            Confidence in recruiting team&apos;s ability to assess technical depth
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
          <span className="text-4xl font-bold text-[#c41e3a]">85%</span>
          <span className="text-lg font-medium text-foreground">of security leaders</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          lack full confidence in their internal recruiting team&apos;s technical assessment capability
        </p>
      </div>

      {/* Confidence meter bars */}
      <div className="space-y-6">
        <ConfidenceMeterBar
          label="Private Companies"
          segments={privateSegments}
          isVisible={isVisible}
          delay={200}
          prefersReducedMotion={prefersReducedMotion}
        />
        <ConfidenceMeterBar
          label="Public Companies"
          segments={publicSegments}
          isVisible={isVisible}
          delay={400}
          prefersReducedMotion={prefersReducedMotion}
        />
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        {confidenceData.map((segment, index) => {
          const Icon = segment.icon;
          return (
            <button
              key={segment.label}
              className={cn(
                "flex flex-col items-center p-4 transition-all cursor-pointer border border-transparent hover:border-border hover:bg-muted/30",
                prefersReducedMotion ? "duration-0" : "duration-200",
                activeSegment === index && "border-border bg-muted/30"
              )}
              onMouseEnter={() => setActiveSegment(index)}
              onMouseLeave={() => setActiveSegment(null)}
            >
              <div
                className="w-10 h-10 flex items-center justify-center mb-2"
                style={{ backgroundColor: `${segment.color}15` }}
              >
                <Icon className="w-5 h-5" style={{ color: segment.color }} />
              </div>
              <span className="text-xs font-semibold text-foreground text-center">
                {segment.label}
              </span>
              <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                <span>Pvt: {segment.privateValue}%</span>
                <span className="text-border">|</span>
                <span>Pub: {segment.publicValue}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail panel for active segment */}
      <div
        className={cn(
          "overflow-hidden transition-all",
          prefersReducedMotion ? "duration-0" : "duration-300",
          activeSegment !== null ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {activeSegment !== null && (
          <div
            className="p-4 border-l-4"
            style={{
              borderColor: confidenceData[activeSegment].color,
              backgroundColor: `${confidenceData[activeSegment].color}08`,
            }}
          >
            <p className="text-sm text-foreground font-medium">
              {confidenceData[activeSegment].label}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {confidenceData[activeSegment].description}
            </p>
          </div>
        )}
      </div>

      {/* Additional context */}
      <div className="text-xs text-muted-foreground pt-2 border-t border-border">
        <p>
          Only <strong className="text-foreground">16%</strong> of CISOs express high confidence. 
          The majority report &quot;somewhat confident&quot; (45-48%), while 34-35% admit lacking confidence entirely.
        </p>
      </div>
    </div>
  );
}
