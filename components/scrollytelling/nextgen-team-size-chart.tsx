"use client";

import React from "react"

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Shield, Cloud, Code, FileCheck, Users, Fingerprint } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface FunctionData {
  name: string;
  teamSize: number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  category: "technical" | "operational";
}

const nextGenFunctions: FunctionData[] = [
  {
    name: "Security Operations",
    teamSize: 35,
    icon: Shield,
    description: "SOC, incident response, and threat hunting",
    category: "operational",
  },
  {
    name: "GRC",
    teamSize: 28,
    icon: FileCheck,
    description: "Governance, risk management, and compliance",
    category: "operational",
  },
  {
    name: "Identity & Access",
    teamSize: 22,
    icon: Fingerprint,
    description: "IAM, PAM, and identity governance",
    category: "technical",
  },
  {
    name: "Cloud Security",
    teamSize: 18,
    icon: Cloud,
    description: "Cloud infrastructure and workload protection",
    category: "technical",
  },
  {
    name: "Security Engineering",
    teamSize: 15,
    icon: Code,
    description: "Security tooling and automation",
    category: "technical",
  },
  {
    name: "AppSec",
    teamSize: 12,
    icon: Code,
    description: "Application security and secure development",
    category: "technical",
  },
];

export function NextGenTeamSizeChart({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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

  const maxTeamSize = Math.max(...nextGenFunctions.map((f) => f.teamSize));

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      {/* Category Legend */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary" />
          <span className="text-xs text-muted-foreground">Technical Functions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#737373]" />
          <span className="text-xs text-muted-foreground">Operational Functions</span>
        </div>
      </div>

      {/* Team Size Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {nextGenFunctions.map((func, index) => {
          const Icon = func.icon;
          const isHovered = hoveredIndex === index;
          const barWidth = (func.teamSize / maxTeamSize) * 100;

          return (
            <div
              key={func.name}
              className={cn(
                "bg-card border border-border p-4 transition-all cursor-pointer",
                prefersReducedMotion ? "duration-0" : "duration-300",
                isHovered && "border-primary shadow-md"
              )}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                opacity: isVisible ? 1 : prefersReducedMotion ? 1 : 0,
                transform: isVisible || prefersReducedMotion ? "translateY(0)" : "translateY(20px)",
                transition: prefersReducedMotion
                  ? "none"
                  : `opacity 0.5s ease ${index * 80}ms, transform 0.5s ease ${index * 80}ms`,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-10 h-10 flex items-center justify-center transition-colors",
                    func.category === "technical" ? "bg-primary/10" : "bg-[#737373]/10"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      func.category === "technical" ? "text-primary" : "text-[#737373]"
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{func.name}</p>
                  <p
                    className={cn(
                      "text-2xl font-bold mt-1",
                      func.category === "technical" ? "text-primary" : "text-[#737373]"
                    )}
                  >
                    {func.teamSize}
                  </p>
                  <p className="text-xs text-muted-foreground">avg direct reports</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-muted mt-3 overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all ease-out",
                    prefersReducedMotion ? "duration-0" : "duration-1000",
                    func.category === "technical" ? "bg-primary" : "bg-[#737373]"
                  )}
                  style={{
                    width: isVisible ? `${barWidth}%` : "0%",
                    transitionDelay: prefersReducedMotion ? "0ms" : `${index * 100 + 300}ms`,
                  }}
                />
              </div>

              {/* Description on hover */}
              <div
                className={cn(
                  "overflow-hidden transition-all",
                  prefersReducedMotion ? "duration-0" : "duration-300",
                  isHovered ? "max-h-12 mt-3 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <p className="text-xs text-muted-foreground">{func.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Row */}
      <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-border">
        <div className="text-center">
          <p className="text-3xl font-bold text-primary">12-35</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Direct Report Range</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-foreground">22</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Average Team Size</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-[#737373]">35</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Max (SecOps)</p>
        </div>
      </div>

      {/* Key Insight */}
      <div className="mt-6 border-l-4 border-primary bg-accent p-4">
        <p className="text-sm text-foreground font-medium">
          <span className="font-bold text-primary">Security Operations</span> leaders manage the largest teams at 35 
          direct reports, while <span className="font-bold text-primary">AppSec</span> and technical functions 
          maintain lean, highly specialized teams averaging 12-18 personnel.
        </p>
      </div>
    </div>
  );
}
