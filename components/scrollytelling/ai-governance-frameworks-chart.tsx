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
import { useIsMobile } from "@/hooks/use-mobile";

interface FrameworkData {
  framework: string;
  shortLabel: string;
  private: number;
  public: number;
  isLeading?: boolean;
}

const frameworkData: FrameworkData[] = [
  { framework: "NIST AI Risk Management Framework (AI RMF)", shortLabel: "NIST AI RMF", private: 57, public: 67 },
  { framework: "EU AI Act requirements (compliance-driven)", shortLabel: "EU AI Act", private: 15, public: 23 },
  { framework: "ISO/IEC 23894 (AI Risk Management)", shortLabel: "ISO/IEC 23894", private: 22, public: 18 },
  { framework: "Internal / proprietary AI risk framework", shortLabel: "Internal Framework", private: 18, public: 17 },
  { framework: "OECD AI Principles / other international guidelines", shortLabel: "OECD AI Principles", private: 2, public: 1 },
  { framework: "Other framework", shortLabel: "Other", private: 11, public: 9 },
  { framework: "None at this time", shortLabel: "None", private: 20, public: 14 },
];

interface AIGovernanceFrameworksChartProps {
  className?: string;
}

export function AIGovernanceFrameworksChart({ className }: AIGovernanceFrameworksChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  // Intersection observer for scroll-triggered animation
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

  // Chart dimensions
  const chartHeight = 500;
  const rowHeight = 65;
  const barHeight = 22;
  const barGap = 5;
  const chartWidth = 700;
  const labelColumnWidth = 150;
  const barAreaWidth = chartWidth - labelColumnWidth - 60;

  // Scale function
  const getBarWidth = (value: number) => (value / 100) * barAreaWidth;

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev === null ? 0 : Math.min(prev + 1, frameworkData.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev === null ? frameworkData.length - 1 : Math.max(prev - 1, 0)
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
          AI Governance Frameworks in Use or Planned
        </h4>
        <p className="text-xs text-muted-foreground/70">
          The NIST AI RMF has emerged as the leading framework
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: "#737373" }} />
          <span className="text-sm md:text-xs text-muted-foreground font-medium">Private</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: "#003087" }} />
          <span className="text-sm md:text-xs text-muted-foreground font-medium">Public</span>
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
          aria-label="Grouped horizontal bar chart comparing AI governance framework adoption between private and public companies. NIST AI RMF is the leading framework at 57% for private and 67% for public companies. Use arrow keys to navigate frameworks."
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
                    className="fill-muted-foreground"
                    style={{ fontSize: isMobile ? 13 : 12 }}
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
              className="fill-muted-foreground"
              style={{ fontSize: isMobile ? 13 : 12 }}
            >
              0%
            </text>

            {/* Data rows */}
            {frameworkData.map((item, index) => {
              const yPosition = index * rowHeight + 10;
              const privateWidth = getBarWidth(item.private);
              const publicWidth = getBarWidth(item.public);
              const isActive = activeIndex === index;
              const isLeading = item.isLeading;

              // Colors
              const privateColor = isLeading ? "#525252" : "#737373";
              const publicColor = isLeading ? "#003087" : "#0055c4";

              return (
                <g
                  key={item.framework}
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
                      fill={isLeading ? "#f0f9ff" : "#f8fafc"}
                      className={cn(
                        "transition-opacity",
                        prefersReducedMotion ? "duration-0" : "duration-200"
                      )}
                    />
                  )}

                  {/* Leading framework indicator */}
                  {isLeading && (
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
                      "transition-opacity",
                      prefersReducedMotion ? "duration-0" : "duration-500",
                      isVisible ? "opacity-100" : "opacity-0"
                    )}
                    fill={isLeading ? "#0a0a0a" : "#525252"}
                    fontWeight={isLeading ? 600 : 500}
                    style={{
                      fontSize: isMobile ? 14 : 13,
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
                      <p className="font-semibold">{item.framework}</p>
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
                      <p className="font-semibold">{item.framework}</p>
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
                {frameworkData[activeIndex].framework}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {frameworkData[activeIndex].isLeading
                  ? "Leading AI governance framework adopted by organizations"
                  : "AI governance framework adoption comparison between company structures"}
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: frameworkData[activeIndex].isLeading ? "#525252" : "#737373" }}>
                  {frameworkData[activeIndex].private}%
                </p>
                <p className="text-xs text-muted-foreground">Private</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: frameworkData[activeIndex].isLeading ? "#003087" : "#0055c4" }}>
                  {frameworkData[activeIndex].public}%
                </p>
                <p className="text-xs text-muted-foreground">Public</p>
              </div>
              <div className="text-center">
                <p className={cn(
                  "text-2xl font-bold",
                  frameworkData[activeIndex].public > frameworkData[activeIndex].private ? "text-[#003087]" : "text-[#737373]"
                )}>
                  {frameworkData[activeIndex].public > frameworkData[activeIndex].private ? "+" : ""}
                  {frameworkData[activeIndex].public - frameworkData[activeIndex].private}%
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
          <strong className="text-primary">Key finding:</strong> NIST AI RMF dominates with{" "}
          <strong className="text-foreground">57-67% adoption</strong>, while 14-20% of organizations have no AI governance framework in place.
        </p>
      </div>
    </div>
  );
}
