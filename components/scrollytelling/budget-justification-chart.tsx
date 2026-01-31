"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const budgetMeasures = [
  { measure: "Business Impact", percentage: 69, description: "Demonstrating how security enables business outcomes and growth" },
  { measure: "Attack Surface Expansion", percentage: 58, description: "Quantifying risk from growing digital footprint and threat exposure" },
  { measure: "Compliance and Regulatory Mandates", percentage: 49, description: "Meeting regulatory requirements and avoiding fines" },
  { measure: "Financial Metrics and ROI", percentage: 42, description: "Risk-based financial analysis and return on investment calculations" },
  { measure: "Revenue Percentage Allocation", percentage: 10, description: "Percentage of company revenue allocated to security" },
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
          const isTop = index < 3;
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={item.measure}
              className={cn(
                "relative bg-card border border-border shadow-sm p-4 transition-all cursor-pointer",
                prefersReducedMotion ? "duration-0" : "duration-300",
                isHovered && "border-primary bg-accent/30 shadow-md -translate-y-0.5"
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
          Only 10% use percentage-of-revenue models, indicating CISO sophistication in tying security to business value rather than arbitrary formulas.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-muted/50">
          <p className="text-2xl font-bold text-primary">69%</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Business Impact</p>
        </div>
        <div className="text-center p-4 bg-muted/50">
          <p className="text-2xl font-bold text-foreground">58%</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Attack Surface</p>
        </div>
        <div className="text-center p-4 bg-muted/50">
          <p className="text-2xl font-bold text-foreground">49%</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Compliance</p>
        </div>
      </div>
    </div>
  );
}
