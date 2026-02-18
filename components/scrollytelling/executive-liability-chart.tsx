"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface LiabilityCategory {
  category: string;
  shortLabel: string;
  private: number;
  public: number;
  isWarning?: boolean;
}

const liabilityData: LiabilityCategory[] = [
  { category: "D&O Policy only", shortLabel: "D&O Policy", private: 31.51, public: 44.57 },
  { category: "Corporate Indemnification only", shortLabel: "Indemnification", private: 6.51, public: 9.78 },
  { category: "Both policies", shortLabel: "Both Policies", private: 15.41, public: 21.74 },
  { category: "Neither (NO coverage)", shortLabel: "Neither", private: 36.30, public: 19.57, isWarning: true },
  { category: "Not Sure", shortLabel: "Not Sure", private: 10.27, public: 4.35 },
];

interface ExecutiveLiabilityChartProps {
  className?: string;
}

export function ExecutiveLiabilityChart({ className }: ExecutiveLiabilityChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Intersection observer for scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Chart dimensions
  const chartHeight = 460;
  const barHeight = 52;
  const barGap = 14;
  const chartWidth = 700; // Expanded from 600 to accommodate left labels
  const labelColumnWidth = 130; // Left column for category labels
  const centerX = 430; // Center of chart area (labelColumnWidth + 300)
  const maxBarWidth = 200; // Max width for bars on each side

  // Find max value for scaling
  const maxValue = Math.max(
    ...liabilityData.flatMap((d) => [d.private, d.public])
  );

  // Scale function
  const getBarWidth = (value: number) => (value / 50) * maxBarWidth; // Scale to 50% max

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev === null ? 0 : Math.min(prev + 1, liabilityData.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev === null ? liabilityData.length - 1 : Math.max(prev - 1, 0)
      );
    } else if (e.key === "Escape") {
      setFocusedIndex(null);
    }
  };

  const activeIndex = hoveredIndex ?? focusedIndex;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full bg-card border border-border shadow-sm p-6 md:p-8",
        className
      )}
    >
      {/* Chart Header */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          CISO Liability Protection
        </h4>
        <p className="text-xs text-muted-foreground/70">
          Comparing D&O and indemnification policy coverage between private and public companies
        </p>
      </div>

      {/* Butterfly Chart */}
      <TooltipProvider delayDuration={0}>
        <div
          className="relative focus:outline-none"
          style={{ height: chartHeight }}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          role="img"
          aria-label="Butterfly chart comparing executive liability protection coverage between private and public companies. 36% of private CISOs and 20% of public CISOs have no coverage. Use arrow keys to navigate categories."
        >
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Axis labels */}
            <text
              x={centerX - maxBarWidth - 20}
              y={20}
              textAnchor="middle"
              className="fill-muted-foreground text-[11px] font-semibold uppercase tracking-wider"
            >
              Private
            </text>
            <text
              x={centerX + maxBarWidth + 20}
              y={20}
              textAnchor="middle"
              className="fill-muted-foreground text-[11px] font-semibold uppercase tracking-wider"
            >
              Public
            </text>

            {/* Center axis */}
            <line
              x1={centerX}
              y1={35}
              x2={centerX}
              y2={chartHeight - 45}
              stroke="#e5e5e5"
              strokeWidth="2"
            />

            {/* Grid lines */}
            {[10, 20, 30, 40].map((tick) => {
              const offset = getBarWidth(tick);
              return (
                <g key={tick}>
                  {/* Left side grid */}
                  <line
                    x1={centerX - offset}
                    y1={35}
                    x2={centerX - offset}
                    y2={chartHeight - 45}
                    stroke="#f0f0f0"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                  {/* Right side grid */}
                  <line
                    x1={centerX + offset}
                    y1={35}
                    x2={centerX + offset}
                    y2={chartHeight - 45}
                    stroke="#f0f0f0"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                </g>
              );
            })}

            {/* Data rows */}
            {liabilityData.map((item, index) => {
              const yPosition = 45 + index * (barHeight + barGap);
              const privateWidth = getBarWidth(item.private);
              const publicWidth = getBarWidth(item.public);
              const isActive = activeIndex === index;
              const isWarning = item.isWarning;

              // Colors based on warning status
              const privateColor = isWarning ? "#404040" : "#737373";
              const publicColor = isWarning ? "#0055c4" : "#003087";

              return (
                <g
                  key={item.category}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Row highlight background */}
                  {isActive && (
                    <rect
                      x={10}
                      y={yPosition - 4}
                      width={chartWidth - 20}
                      height={barHeight + 8}
                      fill={isWarning ? "#fef2f2" : "#f8fafc"}
                      className={cn(
                        "transition-opacity",
                        prefersReducedMotion ? "duration-0" : "duration-200"
                      )}
                    />
                  )}

                  {/* Warning indicator for "Neither" row */}
                  {isWarning && (
                    <rect
                      x={0}
                      y={yPosition - 4}
                      width={6}
                      height={barHeight + 8}
                      fill="#c41e3a"
                      className={cn(
                        "transition-opacity",
                        prefersReducedMotion ? "duration-0" : "duration-500",
                        isVisible ? "opacity-100" : "opacity-0"
                      )}
                    />
                  )}

                  {/* Category label - LEFT aligned */}
                  <text
                    x={labelColumnWidth - 8}
                    y={yPosition + barHeight / 2 + 5}
                    textAnchor="end"
                    className={cn(
                      "text-[14px] transition-opacity",
                      prefersReducedMotion ? "duration-0" : "duration-500",
                      isVisible ? "opacity-100" : "opacity-0"
                    )}
                    fill={isWarning ? "#0a0a0a" : "#525252"}
                    fontWeight={isWarning ? 600 : 500}
                    style={{
                      transitionDelay: prefersReducedMotion
                        ? "0ms"
                        : `${index * 100 + 200}ms`,
                    }}
                  >
                    {item.shortLabel}
                  </text>

                  {/* Private bar (extends left from center) */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <rect
                        x={centerX - (isVisible ? privateWidth : 0)}
                        y={yPosition}
                        width={isVisible ? privateWidth : 0}
                        height={barHeight}
                        fill={privateColor}
                        className={cn(
                          "transition-all ease-out",
                          prefersReducedMotion ? "duration-0" : "duration-700",
                          isActive && "brightness-110"
                        )}
                        style={{
                          transitionDelay: prefersReducedMotion
                            ? "0ms"
                            : `${index * 100}ms`,
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      side="left"
                      className="bg-foreground text-background border-none px-3 py-2"
                    >
                      <p className="font-semibold">Private Companies</p>
                      <p className="text-sm opacity-80">{item.private.toFixed(1)}%</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Private value label - inside bar with white text */}
                  <text
                    x={privateWidth >= 50 ? centerX - privateWidth + 12 : centerX - privateWidth - 8}
                    y={yPosition + barHeight / 2 + 5}
                    textAnchor={privateWidth >= 50 ? "start" : "end"}
                    className={cn(
                      "text-[14px] font-bold transition-opacity",
                      prefersReducedMotion ? "duration-0" : "duration-500",
                      isVisible ? "opacity-100" : "opacity-0"
                    )}
                    fill={privateWidth >= 50 ? "#ffffff" : privateColor}
                    style={{
                      transitionDelay: prefersReducedMotion
                        ? "0ms"
                        : `${index * 100 + 400}ms`,
                      textShadow: privateWidth >= 50 ? "0 1px 2px rgba(0,0,0,0.3)" : "none",
                    }}
                  >
                    {item.private.toFixed(1)}%
                  </text>

                  {/* Public bar (extends right from center) */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <rect
                        x={centerX}
                        y={yPosition}
                        width={isVisible ? publicWidth : 0}
                        height={barHeight}
                        fill={publicColor}
                        className={cn(
                          "transition-all ease-out",
                          prefersReducedMotion ? "duration-0" : "duration-700",
                          isActive && "brightness-110"
                        )}
                        style={{
                          transitionDelay: prefersReducedMotion
                            ? "0ms"
                            : `${index * 100 + 50}ms`,
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="bg-foreground text-background border-none px-3 py-2"
                    >
                      <p className="font-semibold">Public Companies</p>
                      <p className="text-sm opacity-80">{item.public.toFixed(1)}%</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Public value label - inside bar with white text */}
                  <text
                    x={publicWidth >= 50 ? centerX + publicWidth - 12 : centerX + publicWidth + 8}
                    y={yPosition + barHeight / 2 + 5}
                    textAnchor={publicWidth >= 50 ? "end" : "start"}
                    className={cn(
                      "text-[14px] font-bold transition-opacity",
                      prefersReducedMotion ? "duration-0" : "duration-500",
                      isVisible ? "opacity-100" : "opacity-0"
                    )}
                    fill={publicWidth >= 50 ? "#ffffff" : publicColor}
                    style={{
                      transitionDelay: prefersReducedMotion
                        ? "0ms"
                        : `${index * 100 + 450}ms`,
                      textShadow: publicWidth >= 50 ? "0 1px 2px rgba(0,0,0,0.3)" : "none",
                    }}
                  >
                    {item.public.toFixed(1)}%
                  </text>

                  {/* Invisible hit area for hover */}
                  <rect
                    x={10}
                    y={yPosition - 4}
                    width={chartWidth - 20}
                    height={barHeight + 8}
                    fill="transparent"
                  />
                </g>
              );
            })}

            {/* X-axis percentage labels */}
            {[40, 30, 20, 10].map((tick) => {
              const offset = getBarWidth(tick);
              return (
                <g key={`label-${tick}`}>
                  <text
                    x={centerX - offset}
                    y={chartHeight - 5}
                    textAnchor="middle"
                    className="fill-muted-foreground text-[10px]"
                  >
                    {tick}%
                  </text>
                  <text
                    x={centerX + offset}
                    y={chartHeight - 5}
                    textAnchor="middle"
                    className="fill-muted-foreground text-[10px]"
                  >
                    {tick}%
                  </text>
                </g>
              );
            })}
            <text
              x={centerX}
              y={chartHeight - 5}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              0%
            </text>
          </svg>
        </div>
      </TooltipProvider>

      {/* Detail panel for active item */}
      <div
        className={cn(
          "overflow-hidden transition-all border-t border-border mt-4",
          prefersReducedMotion ? "duration-0" : "duration-300",
          activeIndex !== null ? "max-h-24 opacity-100 pt-4" : "max-h-0 opacity-0 pt-0"
        )}
      >
        {activeIndex !== null && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {liabilityData[activeIndex].category}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {liabilityData[activeIndex].isWarning
                  ? "Critical protection gap requiring immediate attention"
                  : "Coverage comparison between company structures"}
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: liabilityData[activeIndex].isWarning ? "#404040" : "#737373" }}>
                  {liabilityData[activeIndex].private.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">Private</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: liabilityData[activeIndex].isWarning ? "#0055c4" : "#003087" }}>
                  {liabilityData[activeIndex].public.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">Public</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer insight */}
      <div className="text-xs text-muted-foreground pt-4 border-t border-border mt-4">
        <p>
          <strong className="text-[#c41e3a]">Key finding:</strong> Private company CISOs are{" "}
          <strong className="text-foreground">85% more likely</strong> to have no executive liability protection compared to their public company peers.
        </p>
      </div>
    </div>
  );
}
