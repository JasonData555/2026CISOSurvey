"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface DataPoint {
  label: string;
  shortLabel: string;
  ceo: number;
  cio: number;
  employees: string;
}

const data: DataPoint[] = [
  { label: "<500 employees", shortLabel: "<500", ceo: 32, cio: 7, employees: "Under 500" },
  { label: "500-1K employees", shortLabel: "500-1K", ceo: 28, cio: 12, employees: "500 to 1,000" },
  { label: "1K-2.5K employees", shortLabel: "1K-2.5K", ceo: 22, cio: 20, employees: "1,000 to 2,500" },
  { label: "2.5K-5K employees", shortLabel: "2.5K-5K", ceo: 15, cio: 30, employees: "2,500 to 5,000" },
  { label: "5K-10K employees", shortLabel: "5K-10K", ceo: 8, cio: 38, employees: "5,000 to 10,000" },
  { label: "10K+ employees", shortLabel: "10K+", ceo: 3, cio: 47, employees: "Over 10,000" },
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
  const paddingLeft = 80;
  const paddingRight = 60;

  const maxValue = 50;
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
        "relative w-full bg-card border border-border shadow-sm p-6 md:p-8",
        className
      )}
    >
      {/* Chart Title */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          Reporting by Company Size
        </h4>
        <p className="text-xs text-muted-foreground/70">
          CEO and CIO reporting follows a predictable correlation with organizational scale
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
          {[0, 10, 20, 30, 40, 50].map((tick) => (
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

          {/* CEO Slope Line with Animation */}
          <path
            d={data
              .map((point, index) => {
                const x = (paddingLeft / 600) * 600 + (index / (data.length - 1)) * (600 - paddingLeft - paddingRight);
                const y = getY(point.ceo);
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

          {/* CIO Slope Line with Animation */}
          <path
            d={data
              .map((point, index) => {
                const x = (paddingLeft / 600) * 600 + (index / (data.length - 1)) * (600 - paddingLeft - paddingRight);
                const y = getY(point.cio);
                return `${index === 0 ? "M" : "L"} ${x} ${y}`;
              })
              .join(" ")}
            fill="none"
            stroke="#d97706"
            strokeWidth="2.5"
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
                : "stroke-dashoffset 1.5s ease-out 0.3s, opacity 0.3s ease-out",
            }}
          />

          {/* Gradient Fills Under Lines */}
          <defs>
            <linearGradient id="slopeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#003087" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#003087" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="cioGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`
              ${data
                .map((point, index) => {
                  const x = paddingLeft + (index / (data.length - 1)) * (600 - paddingLeft - paddingRight);
                  const y = getY(point.ceo);
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
          <path
            d={`
              ${data
                .map((point, index) => {
                  const x = paddingLeft + (index / (data.length - 1)) * (600 - paddingLeft - paddingRight);
                  const y = getY(point.cio);
                  return `${index === 0 ? "M" : "L"} ${x} ${y}`;
                })
                .join(" ")}
              L ${600 - paddingRight} ${chartHeight - paddingBottom}
              L ${paddingLeft} ${chartHeight - paddingBottom}
              Z
            `}
            fill="url(#cioGradient)"
            className={cn(
              "transition-opacity",
              prefersReducedMotion ? "duration-0" : "duration-1000 delay-800",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          />

          {/* Data Points */}
          {data.map((point, index) => {
            const x = paddingLeft + (index / (data.length - 1)) * (600 - paddingLeft - paddingRight);
            const y = getY(point.ceo);
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
                    x={index === 0 ? x + 16 : x - 16}
                    y={y - 20}
                    textAnchor={index === 0 ? "start" : "end"}
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
                    {point.ceo}%
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

          {/* CIO Data Points and Labels */}
          {data.map((point, index) => {
            const x = paddingLeft + (index / (data.length - 1)) * (600 - paddingLeft - paddingRight);
            const y = getY(point.cio);
            const isHovered = hoveredIndex === index;
            const isEndpoint = index === 0 || index === data.length - 1;

            return (
              <g key={`cio-${index}`}>
                {/* Outer ring for CIO endpoints */}
                {isEndpoint && (
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 14 : 12}
                    fill="none"
                    stroke="#d97706"
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

                {/* Main CIO data point */}
                <circle
                  cx={x}
                  cy={y}
                  r={isEndpoint ? (isHovered ? 8 : 6) : (isHovered ? 7 : 5)}
                  fill={isEndpoint ? "#d97706" : "#ffffff"}
                  stroke="#d97706"
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

                {/* CIO Value Labels for Endpoints - positioned ABOVE the data point */}
                {isEndpoint && (
                  <text
                    x={index === 0 ? x + 20 : x - 16}
                    y={index === 0 ? y - 10 : y - 15}
                    textAnchor={index === 0 ? "start" : "end"}
                    className={cn(
                      "fill-[#d97706] font-bold transition-all",
                      prefersReducedMotion ? "duration-0" : "duration-300",
                      isVisible ? "opacity-100" : "opacity-0"
                    )}
                    style={{
                      fontSize: isHovered ? "20px" : "18px",
                      transitionDelay: prefersReducedMotion ? "0ms" : `${index * 100 + 1000}ms`,
                    }}
                  >
                    {point.cio}%
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIndex !== null && hoveredIndex !== 0 && hoveredIndex !== data.length - 1 && (
          <div
            className="absolute pointer-events-none z-10 bg-card border border-border shadow-xl ring-1 ring-black/5 p-3 transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${(paddingLeft / 600) * 100 + (hoveredIndex / (data.length - 1)) * ((600 - paddingLeft - paddingRight) / 600) * 100}%`,
              top: `${(getY(data[hoveredIndex].ceo) / chartHeight) * 100 - 4}%`,
            }}
          >
            <p className="text-xs font-semibold text-foreground mb-2">{data[hoveredIndex].employees}</p>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#003087]" />
                  <span className="text-xs text-muted-foreground">CEO</span>
                </div>
                <span className="text-sm font-bold text-foreground">{data[hoveredIndex].ceo}%</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#d97706]" />
                  <span className="text-xs text-muted-foreground">CIO</span>
                </div>
                <span className="text-sm font-bold text-foreground">{data[hoveredIndex].cio}%</span>
              </div>
            </div>
            {/* Tooltip Arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-border" />
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div className="grid grid-cols-2 gap-6 mt-8 pt-6 border-t border-border">
        {/* CEO Legend */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="block w-2 h-8 bg-[#003087]" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">CEO</p>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-mono text-foreground">32%</span>
                <span className="text-xs text-muted-foreground">to</span>
                <span className="text-sm font-mono text-foreground">3%</span>
              </div>
              <p className="text-xs text-[#c41e3a] font-medium mt-1">-91% decline</p>
            </div>
          </div>
        </div>

        {/* CIO Legend */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="block w-2 h-8 bg-[#d97706]" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">CIO</p>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-mono text-foreground">7%</span>
                <span className="text-xs text-muted-foreground">to</span>
                <span className="text-sm font-mono text-foreground">47%</span>
              </div>
              <p className="text-xs text-[#059669] font-medium mt-1">+571% increase</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
