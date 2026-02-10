"use client";

import React, { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface MaturityData {
  level: string;
  value: number;
  description: string;
  color: string;
}

const maturityData: MaturityData[] = [
  {
    level: "Developing but Inconsistent",
    value: 52,
    description: "AI governance processes exist but lack consistency across the organization. Ad hoc implementation without standardized frameworks.",
    color: "#ea580c",
  },
  {
    level: "Establish and Repeatable",
    value: 25,
    description: "Documented AI governance frameworks with consistent enforcement. Clear policies and accountability structures in place.",
    color: "#16a34a",
  },
  {
    level: "Initial/Ad Hoc",
    value: 21,
    description: "Minimal or no formal AI governance. Reactive approach with limited oversight and documentation.",
    color: "#dc2626",
  },
  {
    level: "Optimized",
    value: 2,
    description: "Fully integrated AI governance with continuous improvement. Proactive risk management and stakeholder alignment.",
    color: "#003087",
  },
];

interface ActiveShapeProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: MaturityData;
  percent: number;
  value: number;
}

const renderActiveShape = (props: ActiveShapeProps) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{
          filter: "drop-shadow(0 4px 12px rgba(0, 48, 135, 0.3))",
          transition: "all 0.3s ease-out"
        }}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={innerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill="#ffffff"
      />
    </g>
  );
};

export function AIGovernanceChallengesChart({ className }: { className?: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev === null ? 0 : (prev + 1) % maturityData.length));
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (prev === null ? 0 : (prev - 1 + maturityData.length) % maturityData.length));
    } else if (event.key === "Escape") {
      event.preventDefault();
      setActiveIndex(null);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      // Enter/Space on focused chart starts navigation from first segment
      if (activeIndex === null) {
        setActiveIndex(0);
      }
    }
  };

  const activeMaturity = activeIndex !== null ? maturityData[activeIndex] : null;

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full bg-card border border-border shadow-sm p-6 md:p-8 transition-all",
        prefersReducedMotion ? "duration-0" : "duration-700",
        isVisible
          ? "opacity-100 translate-y-0"
          : prefersReducedMotion
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8",
        className
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Chart Container */}
        <div
          className="relative w-full aspect-square max-w-[400px] mx-auto lg:mx-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          role="img"
          aria-label={`AI Governance Maturity pie chart. 4 segments showing: Developing but Inconsistent ${maturityData[0].value}%, Establish and Repeatable ${maturityData[1].value}%, Initial/Ad Hoc ${maturityData[2].value}%, Optimized ${maturityData[3].value}%. Use arrow keys to navigate, Enter to select, Escape to deselect.`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex !== null ? activeIndex : undefined}
                activeShape={renderActiveShape}
                data={maturityData}
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                animationBegin={0}
                animationDuration={prefersReducedMotion ? 0 : (isVisible ? 1200 : 0)}
                animationEasing="ease-out"
                style={{ cursor: "pointer", outline: "none" }}
              >
                {maturityData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="transparent"
                    style={{
                      outline: "none",
                      transition: "opacity 0.2s ease"
                    }}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className={cn(
              "text-center transition-all duration-300",
              activeMaturity ? "opacity-0 scale-95" : "opacity-100 scale-100"
            )}>
              <span className="block text-4xl md:text-5xl font-bold text-[#ea580c] tracking-tight">
                52%
              </span>
              <span className="block text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-widest mt-2 max-w-[140px] leading-tight">
                Developing but Inconsistent
              </span>
            </div>

            {activeMaturity && (
              <div className={cn(
                "text-center transition-all duration-300 absolute",
                "opacity-100 scale-100"
              )}>
                <span className="block text-4xl md:text-5xl font-bold tracking-tight" style={{ color: activeMaturity.color }}>
                  {activeMaturity.value}%
                </span>
                <span className="block text-xs md:text-sm font-medium text-foreground uppercase tracking-widest mt-2 max-w-[140px] leading-tight">
                  {activeMaturity.level}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Legend and Details Panel */}
        <div className="space-y-6">
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
              Maturity Levels
            </h4>
            <div className="space-y-2">
              {maturityData.map((item, index) => (
                <button
                  key={item.level}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 p-3 transition-all duration-200 text-left group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
                    "hover:bg-muted/50 hover:shadow-sm transition-shadow",
                    activeIndex === index && "bg-muted shadow-sm"
                  )}
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  aria-label={`${item.level}: ${item.value}%`}
                  aria-pressed={activeIndex === index}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 flex-shrink-0 transition-transform duration-200 group-hover:scale-125"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className={cn(
                      "text-sm font-medium transition-colors duration-200",
                      activeIndex === index ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )}>
                      {item.level}
                    </span>
                  </div>
                  <span className={cn(
                    "text-sm font-bold tabular-nums transition-colors duration-200",
                    activeIndex === index ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {item.value}%
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Detail Card */}
          <div className={cn(
            "border-t border-border pt-6 transition-all duration-300",
            activeMaturity ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}>
            {activeMaturity && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-8"
                    style={{ backgroundColor: activeMaturity.color }}
                  />
                  <h5 className="text-lg font-semibold text-foreground">
                    {activeMaturity.level}
                  </h5>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-4">
                  {activeMaturity.description}
                </p>
                <div className="pl-4">
                  <div className="h-1 bg-muted overflow-hidden">
                    <div
                      className="h-full transition-all duration-500 ease-out"
                      style={{
                        width: `${activeMaturity.value * 4}%`,
                        backgroundColor: activeMaturity.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            {!activeMaturity && (
              <p className="text-sm text-muted-foreground italic">
                Hover over a segment or use arrow keys to see details
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Key Insight Footer */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-12 bg-[#ea580c]" />
            <div>
              <span className="block text-2xl font-bold text-[#ea580c]">73%</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Ad Hoc & Inconsistent</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed flex-1">
            73% lack mature AI governance (52% Developing but inconsistent + 21% Initial / ad hoc),
            with only 25% achieving Established and Repeatable processes and just 2% reaching Optimized maturity.
          </p>
        </div>
      </div>
    </div>
  );
}
