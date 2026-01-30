"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const budgetMeasures = [
  { measure: "Risk Quantification", percentage: 68, description: "Financial impact analysis of potential security incidents" },
  { measure: "Compliance Requirements", percentage: 62, description: "Regulatory mandates and audit findings" },
  { measure: "Incident Costs", percentage: 54, description: "Historical breach and incident response costs" },
  { measure: "Industry Benchmarks", percentage: 48, description: "Peer company security spending comparisons" },
  { measure: "Threat Intelligence", percentage: 42, description: "Emerging threat landscape and attack trends" },
  { measure: "Security Maturity Scores", percentage: 38, description: "Framework-based maturity assessments" },
  { measure: "Board/Audit Committee Requests", percentage: 32, description: "Direct governance-driven requirements" },
  { measure: "Insurance Requirements", percentage: 28, description: "Cyber insurance policy mandates" },
];

export function BudgetJustificationChart({ className }: { className?: string }) {
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

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      <div className="space-y-3">
        {budgetMeasures.map((item, index) => {
          const isTop = index < 2;
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={item.measure}
              className={cn(
                "relative bg-card border border-border p-4 transition-all cursor-pointer",
                prefersReducedMotion ? "duration-0" : "duration-300",
                isHovered && "border-primary bg-accent/30"
              )}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                opacity: isVisible ? 1 : prefersReducedMotion ? 1 : 0,
                transform: isVisible || prefersReducedMotion ? "translateX(0)" : "translateX(-20px)",
                transition: prefersReducedMotion
                  ? "none"
                  : `opacity 0.5s ease ${index * 50}ms, transform 0.5s ease ${index * 50}ms`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-xs font-bold w-6 h-6 flex items-center justify-center",
                      isTop ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className={cn("font-medium text-sm", isTop ? "text-foreground" : "text-muted-foreground")}>
                    {item.measure}
                  </span>
                </div>
                <span className={cn("text-lg font-bold", isTop ? "text-primary" : "text-foreground")}>
                  {item.percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all ease-out",
                    prefersReducedMotion ? "duration-0" : "duration-1000",
                    isTop ? "bg-primary" : "bg-[#737373]"
                  )}
                  style={{
                    width: isVisible ? `${item.percentage}%` : "0%",
                    transitionDelay: prefersReducedMotion ? "0ms" : `${index * 100 + 200}ms`,
                  }}
                />
              </div>

              {/* Description on hover */}
              <div
                className={cn(
                  "overflow-hidden transition-all",
                  prefersReducedMotion ? "duration-0" : "duration-300",
                  isHovered ? "max-h-12 mt-2 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Insight */}
      <div className="mt-8 border-l-4 border-primary bg-accent p-4">
        <p className="text-sm text-foreground font-medium">
          <span className="font-bold text-primary">Risk quantification</span> (68%) and{" "}
          <span className="font-bold text-primary">compliance requirements</span> (62%) dominate budget 
          justification approaches, reflecting the shift toward business-aligned security value articulation.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-muted/50">
          <p className="text-2xl font-bold text-primary">68%</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Use Risk Quant</p>
        </div>
        <div className="text-center p-4 bg-muted/50">
          <p className="text-2xl font-bold text-foreground">62%</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Cite Compliance</p>
        </div>
        <div className="text-center p-4 bg-muted/50">
          <p className="text-2xl font-bold text-foreground">54%</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Reference Incidents</p>
        </div>
      </div>
    </div>
  );
}
