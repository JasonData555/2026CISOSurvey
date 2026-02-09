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

interface AIConcern {
  concern: string;
  shortLabel: string;
  private: number;
  public: number;
  isTopConcern?: boolean;
}

const aiConcernsData: AIConcern[] = [
  { concern: "Data exposure/privacy breaches", shortLabel: "Data Exposure", private: 72, public: 80, isTopConcern: true },
  { concern: "Shadow AI usage bypassing security controls", shortLabel: "Shadow AI Bypass", private: 46, public: 53, isTopConcern: true },
  { concern: "Integration with critical systems creating attack vectors", shortLabel: "Attack Vectors", private: 38, public: 43 },
  { concern: "Dependency on AI vendors with unclear security practices", shortLabel: "Vendor Security", private: 25, public: 18 },
  { concern: "Regulatory compliance violations", shortLabel: "Compliance", private: 21, public: 18 },
  { concern: "Intellectual property theft through AI platforms", shortLabel: "IP Theft", private: 16, public: 14 },
  { concern: "AI decision-making in security tools creating blind spots", shortLabel: "Blind Spots", private: 15, public: 12 },
  { concern: "AI-generated content being used in social engineering attacks", shortLabel: "Social Engineering", private: 12, public: 16 },
  { concern: "Other Concern", shortLabel: "Other", private: 2, public: 1 },
];

interface AIConcernsByCompanyChartProps {
  className?: string;
}

export function AIConcernsByCompanyChart({ className }: AIConcernsByCompanyChartProps) {
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
  const chartHeight = 520;
  const rowHeight = 50;
  const barHeight = 18;
  const barGap = 4;
  const chartWidth = 700;
  const labelColumnWidth = 140;
  const barAreaWidth = chartWidth - labelColumnWidth - 60;

  // Scale function
  const getBarWidth = (value: number) => (value / 100) * barAreaWidth;

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev === null ? 0 : Math.min(prev + 1, aiConcernsData.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev === null ? aiConcernsData.length - 1 : Math.max(prev - 1, 0)
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
          Greatest Concerns Regarding AI Tools Use
        </h4>
        <p className="text-xs text-muted-foreground/70">
          Security concerns about AI tool adoption in private vs public companies
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: "#737373" }} />
          <span className="text-xs text-muted-foreground font-medium">Private</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: "#003087" }} />
          <span className="text-xs text-muted-foreground font-medium">Public</span>
        </div>
      </div>

      {/* Grouped Bar Chart */}
      <TooltipProvider delayDuration={0}>
        <div
          className="relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          style={{ height: chartHeight }}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          role="img"
          aria-label="Grouped horizontal bar chart comparing AI tool concerns between private and public companies. Data exposure is the top concern at 72% for private and 80% for public companies. Use arrow keys to navigate categories."
        >
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Grid lines */}
            {[25, 50, 75, 100].map((tick) => {
              const xPos = labelColumnWidth + getBarWidth(tick);
              return (
                <g key={tick}>
                  <line
                    x1={xPos}
                    y1={0}
                    x2={xPos}
                    y2={chartHeight - 30}
                    stroke="#f0f0f0"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                  <text
                    x={xPos}
                    y={chartHeight - 10}
                    textAnchor="middle"
                    className="fill-muted-foreground text-[10px]"
                  >
                    {tick}%
                  </text>
                </g>
              );
            })}
            <text
              x={labelColumnWidth}
              y={chartHeight - 10}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              0%
            </text>

            {/* Data rows */}
            {aiConcernsData.map((item, index) => {
              const yPosition = index * rowHeight + 10;
              const privateWidth = getBarWidth(item.private);
              const publicWidth = getBarWidth(item.public);
              const isActive = activeIndex === index;
              const isTopConcern = item.isTopConcern;

              // Colors
              const privateColor = isTopConcern ? "#525252" : "#737373";
              const publicColor = isTopConcern ? "#003087" : "#0055c4";

              return (
                <g
                  key={item.concern}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Row highlight background */}
                  {isActive && (
                    <rect
                      x={0}
                      y={yPosition - 4}
                      width={chartWidth}
                      height={rowHeight}
                      fill={isTopConcern ? "#f0f9ff" : "#f8fafc"}
                      className={cn(
                        "transition-opacity",
                        prefersReducedMotion ? "duration-0" : "duration-200"
                      )}
                    />
                  )}

                  {/* Top concern indicator */}
                  {isTopConcern && (
                    <rect
                      x={0}
                      y={yPosition - 4}
                      width={4}
                      height={rowHeight}
                      fill="#003087"
                      className={cn(
                        "transition-opacity",
                        prefersReducedMotion ? "duration-0" : "duration-500",
                        isVisible ? "opacity-100" : "opacity-0"
                      )}
                    />
                  )}

                  {/* Category label */}
                  <text
                    x={labelColumnWidth - 12}
                    y={yPosition + rowHeight / 2}
                    textAnchor="end"
                    dominantBaseline="middle"
                    className={cn(
                      "text-[11px] transition-opacity",
                      prefersReducedMotion ? "duration-0" : "duration-500",
                      isVisible ? "opacity-100" : "opacity-0"
                    )}
                    fill={isTopConcern ? "#0a0a0a" : "#525252"}
                    fontWeight={isTopConcern ? 600 : 500}
                    style={{
                      transitionDelay: prefersReducedMotion
                        ? "0ms"
                        : `${index * 50 + 200}ms`,
                    }}
                  >
                    {item.shortLabel}
                  </text>

                  {/* Private bar (top bar in pair) */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <rect
                        x={labelColumnWidth}
                        y={yPosition + 4}
                        width={isVisible ? privateWidth : 0}
                        height={barHeight}
                        fill={privateColor}
                        rx={2}
                        className={cn(
                          "transition-all ease-out",
                          prefersReducedMotion ? "duration-0" : "duration-700",
                          isActive && "brightness-110"
                        )}
                        style={{
                          transitionDelay: prefersReducedMotion
                            ? "0ms"
                            : `${index * 50}ms`,
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-foreground text-background border-none px-3 py-2"
                    >
                      <p className="font-semibold">{item.concern}</p>
                      <p className="text-sm opacity-80">Private: {item.private}%</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Public bar (bottom bar in pair) */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <rect
                        x={labelColumnWidth}
                        y={yPosition + 4 + barHeight + barGap}
                        width={isVisible ? publicWidth : 0}
                        height={barHeight}
                        fill={publicColor}
                        rx={2}
                        className={cn(
                          "transition-all ease-out",
                          prefersReducedMotion ? "duration-0" : "duration-700",
                          isActive && "brightness-110"
                        )}
                        style={{
                          transitionDelay: prefersReducedMotion
                            ? "0ms"
                            : `${index * 50 + 50}ms`,
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="bg-foreground text-background border-none px-3 py-2"
                    >
                      <p className="font-semibold">{item.concern}</p>
                      <p className="text-sm opacity-80">Public: {item.public}%</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Invisible hit area for hover */}
                  <rect
                    x={0}
                    y={yPosition - 4}
                    width={chartWidth}
                    height={rowHeight}
                    fill="transparent"
                  />
                </g>
              );
            })}
          </svg>
        </div>
      </TooltipProvider>

      {/* Detail panel for active item */}
      <div
        className={cn(
          "overflow-hidden transition-all border-t border-border mt-4",
          prefersReducedMotion ? "duration-0" : "duration-300",
          activeIndex !== null ? "max-h-32 opacity-100 pt-4" : "max-h-0 opacity-0 pt-0"
        )}
      >
        {activeIndex !== null && (
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-4">
              <p className="text-sm font-semibold text-foreground">
                {aiConcernsData[activeIndex].concern}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {aiConcernsData[activeIndex].isTopConcern
                  ? "Top security concern requiring priority attention"
                  : "Security concern comparison between company structures"}
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: aiConcernsData[activeIndex].isTopConcern ? "#525252" : "#737373" }}>
                  {aiConcernsData[activeIndex].private}%
                </p>
                <p className="text-xs text-muted-foreground">Private</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: aiConcernsData[activeIndex].isTopConcern ? "#003087" : "#0055c4" }}>
                  {aiConcernsData[activeIndex].public}%
                </p>
                <p className="text-xs text-muted-foreground">Public</p>
              </div>
              <div className="text-center">
                <p className={cn(
                  "text-2xl font-bold",
                  aiConcernsData[activeIndex].public > aiConcernsData[activeIndex].private ? "text-[#003087]" : "text-[#737373]"
                )}>
                  {aiConcernsData[activeIndex].public > aiConcernsData[activeIndex].private ? "+" : ""}
                  {aiConcernsData[activeIndex].public - aiConcernsData[activeIndex].private}%
                </p>
                <p className="text-xs text-muted-foreground">Delta</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer insight */}
      <div className="text-xs text-muted-foreground pt-4 border-t border-border mt-4">
        <p>
          <strong className="text-primary">Key finding:</strong> Public companies show{" "}
          <strong className="text-foreground">8% higher concern</strong> about data exposure and privacy breaches, reflecting increased regulatory scrutiny and stakeholder expectations.
        </p>
      </div>
    </div>
  );
}
