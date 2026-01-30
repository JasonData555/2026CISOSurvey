"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface DataPoint {
  label: string;
  shortLabel: string;
  value: number;
  employees: string;
}

const data: DataPoint[] = [
  { label: "<500 employees", shortLabel: "<500", value: 32, employees: "Under 500" },
  { label: "500-1K employees", shortLabel: "500-1K", value: 22, employees: "500 to 1,000" },
  { label: "1K-2.5K employees", shortLabel: "1K-2.5K", value: 14, employees: "1,000 to 2,500" },
  { label: "2.5K-5K employees", shortLabel: "2.5K-5K", value: 9, employees: "2,500 to 5,000" },
  { label: "5K-10K employees", shortLabel: "5K-10K", value: 6, employees: "5,000 to 10,000" },
  { label: "10K+ employees", shortLabel: "10K+", value: 3, employees: "Over 10,000" },
];

export function CEOReportingSlopeChart({ className }: { className?: string }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Intersection observer for scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
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

  // Chart dimensions
  const chartHeight = 280;
  const chartWidth = 100; // percentage-based
  const paddingTop = 50;
  const paddingBottom = 60;
  const paddingLeft = 60;
  const paddingRight = 60;

  const maxValue = 35;
  const minValue = 0;

  // Calculate Y position based on value
  const getY = (value: number) => {
    const range = maxValue - minValue;
    const availableHeight = chartHeight - paddingTop - paddingBottom;
    return paddingTop + (1 - (value - minValue) / range) * availableHeight;
  };

  // Calculate X position based on index
  const getX = (index: number) => {
    const availableWidth = chartWidth - ((paddingLeft + paddingRight) / 600) * 100;
    const startX = (paddingLeft / 600) * 100;
    return startX + (index / (data.length - 1)) * availableWidth;
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full bg-card border border-border p-6 md:p-8",
        className
      )}
    >
      {/* Chart Title */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          CEO Reporting by Company Size
        </h4>
        <p className="text-xs text-muted-foreground/70">
          Percentage of CISOs reporting directly to CEO
        </p>
      </div>

      {/* SVG Chart */}
      <div className="relative" style={{ height: chartHeight }}>
        <svg
          viewBox={`0 0 600 ${chartHeight}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Slope chart showing CEO reporting trends declining as company size increases: 32% at under 500 employees, 22% at 500-1K, 14% at 1K-2.5K, 9% at 2.5K-5K, 6% at 5K-10K, and 3% at over 10K employees. Hover over data points for details."
        >
          {/* Y-Axis Grid Lines */}
          {[0, 10, 20, 30].map((tick) => (
            <g key={tick}>
              <line
                x1={paddingLeft}
                y1={getY(tick)}
                x2={600 - paddingRight}
                y2={getY(tick)}
                stroke="#e5e5e5"
                strokeWidth="1"
                strokeDasharray={tick === 0 ? "0" : "4,4"}
              />
              <text
                x={paddingLeft - 12}
                y={getY(tick) + 4}
                textAnchor="end"
                className="fill-muted-foreground text-[11px] font-medium"
              >
                {tick}%
              </text>
            </g>
          ))}

          {/* X-Axis Line */}
          <line
            x1={paddingLeft}
            y1={chartHeight - paddingBottom}
            x2={600 - paddingRight}
            y2={chartHeight - paddingBottom}
            stroke="#0a0a0a"
            strokeWidth="2"
          />

          {/* Main Slope Line with Animation */}
          <path
            d={data
              .map((point, index) => {
                const x = (paddingLeft / 600) * 600 + (index / (data.length - 1)) * (600 - paddingLeft - paddingRight);
                const y = getY(point.value);
                return `${index === 0 ? "M" : "L"} ${x} ${y}`;
              })
              .join(" ")}
            fill="none"
            stroke="#003087"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              "transition-all ease-out",
              prefersReducedMotion ? "duration-0" : "duration-1000",
              isVisible ? "opacity-100" : "opacity-0"
            )}
            style={{
              strokeDasharray: prefersReducedMotion ? 0 : 1000,
              strokeDashoffset: prefersReducedMotion ? 0 : (isVisible ? 0 : 1000),
              transition: prefersReducedMotion
                ? "none"
                : "stroke-dashoffset 1.5s ease-out, opacity 0.3s ease-out",
            }}
          />

          {/* Gradient Fill Under Line */}
          <defs>
            <linearGradient id="slopeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#003087" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#003087" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`
              ${data
                .map((point, index) => {
                  const x = paddingLeft + (index / (data.length - 1)) * (600 - paddingLeft - paddingRight);
                  const y = getY(point.value);
                  return `${index === 0 ? "M" : "L"} ${x} ${y}`;
                })
                .join(" ")}
              L ${600 - paddingRight} ${chartHeight - paddingBottom}
              L ${paddingLeft} ${chartHeight - paddingBottom}
              Z
            `}
            fill="url(#slopeGradient)"
            className={cn(
              "transition-opacity",
              prefersReducedMotion ? "duration-0" : "duration-1000 delay-500",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          />

          {/* Data Points */}
          {data.map((point, index) => {
            const x = paddingLeft + (index / (data.length - 1)) * (600 - paddingLeft - paddingRight);
            const y = getY(point.value);
            const isHovered = hoveredIndex === index;
            const isEndpoint = index === 0 || index === data.length - 1;

            return (
              <g key={index}>
                {/* Hover Target Area - larger invisible area for easier interaction */}
                <circle
                  cx={x}
                  cy={y}
                  r={24}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* Outer ring for endpoints */}
                {isEndpoint && (
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 14 : 12}
                    fill="none"
                    stroke="#003087"
                    strokeWidth="2"
                    className={cn(
                      "transition-all",
                      prefersReducedMotion ? "duration-0" : "duration-300",
                      isVisible ? "opacity-100" : "opacity-0"
                    )}
                    style={{
                      transitionDelay: prefersReducedMotion ? "0ms" : `${index * 100 + 800}ms`,
                    }}
                  />
                )}

                {/* Main data point */}
                <circle
                  cx={x}
                  cy={y}
                  r={isEndpoint ? (isHovered ? 8 : 6) : (isHovered ? 7 : 5)}
                  fill={isEndpoint ? "#003087" : "#ffffff"}
                  stroke="#003087"
                  strokeWidth={isEndpoint ? 0 : 2}
                  className={cn(
                    "transition-all cursor-pointer",
                    prefersReducedMotion ? "duration-0" : "duration-300",
                    isVisible ? "opacity-100" : "opacity-0"
                  )}
                  style={{
                    transitionDelay: prefersReducedMotion ? "0ms" : `${index * 100 + 800}ms`,
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* Value Labels for Endpoints (always visible) */}
                {isEndpoint && (
                  <text
                    x={x}
                    y={y - 24}
                    textAnchor="middle"
                    className={cn(
                      "fill-[#003087] font-bold transition-all",
                      prefersReducedMotion ? "duration-0" : "duration-300",
                      isVisible ? "opacity-100" : "opacity-0"
                    )}
                    style={{
                      fontSize: isHovered ? "20px" : "18px",
                      transitionDelay: prefersReducedMotion ? "0ms" : `${index * 100 + 1000}ms`,
                    }}
                  >
                    {point.value}%
                  </text>
                )}

                {/* X-Axis Labels */}
                <text
                  x={x}
                  y={chartHeight - paddingBottom + 24}
                  textAnchor="middle"
                  className={cn(
                    "fill-muted-foreground text-[11px] font-medium transition-all",
                    prefersReducedMotion ? "duration-0" : "duration-300",
                    isHovered && "fill-[#003087] font-semibold"
                  )}
                >
                  {point.shortLabel}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIndex !== null && hoveredIndex !== 0 && hoveredIndex !== data.length - 1 && (
          <div
            className="absolute pointer-events-none z-10 bg-[#0a0a0a] text-white px-4 py-3 shadow-lg transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${(paddingLeft / 600) * 100 + (hoveredIndex / (data.length - 1)) * ((600 - paddingLeft - paddingRight) / 600) * 100}%`,
              top: `${(getY(data[hoveredIndex].value) / chartHeight) * 100 - 4}%`,
            }}
          >
            <div className="text-lg font-bold text-white">{data[hoveredIndex].value}%</div>
            <div className="text-xs text-white/80 whitespace-nowrap">
              {data[hoveredIndex].employees}
            </div>
            {/* Tooltip Arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#0a0a0a]" />
          </div>
        )}
      </div>

      {/* Key Insight Footer */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#003087] rounded-full" />
              <span className="text-xs text-muted-foreground font-medium">Start: 32%</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-8 h-0.5" viewBox="0 0 32 2">
                <line x1="0" y1="1" x2="32" y2="1" stroke="#003087" strokeWidth="2" />
              </svg>
              <span className="text-xs text-muted-foreground font-medium">Decline Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-[#003087] rounded-full" />
              <span className="text-xs text-muted-foreground font-medium">End: 3%</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-[#c41e3a]">-91%</span>
            <span className="text-xs text-muted-foreground ml-2 uppercase tracking-wider">Total Decline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
