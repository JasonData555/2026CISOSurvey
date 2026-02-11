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

interface GovernanceChallenge {
  challenge: string;
  shortLabel: string;
  private: number;
  public: number;
  isHighlight?: boolean;
}

const governanceData: GovernanceChallenge[] = [
  { challenge: "Shadow AI", shortLabel: "Shadow AI", private: 24, public: 28 },
  { challenge: "Defining clear accountability/ownership for AI risk across the business", shortLabel: "AI Accountability", private: 24, public: 23 },
  { challenge: "AI TPRM", shortLabel: "AI TPRM", private: 19, public: 16 },
  { challenge: "Ensuring transparency and explainability of AI-driven decisions", shortLabel: "Transparency", private: 11, public: 11 },
  { challenge: "Aligning AI security with enterprise risk management frameworks", shortLabel: "Risk Alignment", private: 9, public: 11 },
  { challenge: "Establishing regulatory compliance and auditability for AI systems", shortLabel: "Compliance", private: 8, public: 8 },
  { challenge: "Other", shortLabel: "Other", private: 5, public: 3 },
];

interface AIGovernanceChallengesByCompanyChartProps {
  className?: string;
}

export function AIGovernanceChallengesByCompanyChart({ className }: AIGovernanceChallengesByCompanyChartProps) {
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
  const barHeight = 48;
  const barGap = 12;
  const chartWidth = 700;
  const labelColumnWidth = 120;
  const centerX = 420;
  const maxBarWidth = 180;

  // Scale function (scale to 35% max for this data)
  const getBarWidth = (value: number) => (value / 35) * maxBarWidth;

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev === null ? 0 : Math.min(prev + 1, governanceData.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev === null ? governanceData.length - 1 : Math.max(prev - 1, 0)
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
          Greatest AI Governance Challenge
        </h4>
        <p className="text-xs text-muted-foreground/70">
          Comparing governance and risk management challenges between private and public companies
        </p>
      </div>

      {/* Butterfly Chart */}
      <TooltipProvider delayDuration={0}>
        <div
          className="relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          style={{ height: chartHeight }}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          role="img"
          aria-label="Butterfly chart comparing AI governance challenges between private and public companies. Shadow AI is the top challenge at 24% for private and 28% for public companies. Use arrow keys to navigate categories."
        >
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Axis labels */}
            <text
              x={centerX - maxBarWidth / 2 - 20}
              y={20}
              textAnchor="middle"
              className="fill-muted-foreground font-semibold uppercase tracking-wider"
              style={{ fontSize: isMobile ? 14 : 13 }}
            >
              Private
            </text>
            <text
              x={centerX + maxBarWidth / 2 + 20}
              y={20}
              textAnchor="middle"
              className="fill-muted-foreground font-semibold uppercase tracking-wider"
              style={{ fontSize: isMobile ? 14 : 13 }}
            >
              Public
            </text>

            {/* Center axis */}
            <line
              x1={centerX}
              y1={35}
              x2={centerX}
              y2={chartHeight - 35}
              stroke="#e5e5e5"
              strokeWidth="2"
            />

            {/* Grid lines */}
            {[10, 20, 30].map((tick) => {
              const offset = getBarWidth(tick);
              return (
                <g key={tick}>
                  {/* Left side grid */}
                  <line
                    x1={centerX - offset}
                    y1={35}
                    x2={centerX - offset}
                    y2={chartHeight - 35}
                    stroke="#f0f0f0"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                  {/* Right side grid */}
                  <line
                    x1={centerX + offset}
                    y1={35}
                    x2={centerX + offset}
                    y2={chartHeight - 35}
                    stroke="#f0f0f0"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                </g>
              );
            })}

            {/* Data rows */}
            {governanceData.map((item, index) => {
              const yPosition = 45 + index * (barHeight + barGap);
              const privateWidth = getBarWidth(item.private);
              const publicWidth = getBarWidth(item.public);
              const isActive = activeIndex === index;
              const isHighlight = item.isHighlight;

              // Colors - highlight rows get darker shades
              const privateColor = isHighlight ? "#525252" : "#737373";
              const publicColor = isHighlight ? "#003087" : "#0055c4";

              return (
                <g
                  key={item.challenge}
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
                      fill={isHighlight ? "#f0f9ff" : "#f8fafc"}
                      className={cn(
                        "transition-opacity",
                        prefersReducedMotion ? "duration-0" : "duration-200"
                      )}
                    />
                  )}

                  {/* Highlight indicator for top challenges */}
                  {isHighlight && (
                    <rect
                      x={0}
                      y={yPosition - 4}
                      width={4}
                      height={barHeight + 8}
                      fill="#003087"
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
                      "transition-opacity",
                      prefersReducedMotion ? "duration-0" : "duration-500",
                      isVisible ? "opacity-100" : "opacity-0"
                    )}
                    fill={isHighlight ? "#0a0a0a" : "#525252"}
                    fontWeight={isHighlight ? 600 : 500}
                    style={{
                      fontSize: isMobile ? 14 : 13,
                      transitionDelay: prefersReducedMotion
                        ? "0ms"
                        : `${index * 80 + 200}ms`,
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
                        rx={2}
                        className={cn(
                          "transition-all ease-out",
                          prefersReducedMotion ? "duration-0" : "duration-700",
                          isActive && "brightness-110"
                        )}
                        style={{
                          transitionDelay: prefersReducedMotion
                            ? "0ms"
                            : `${index * 80}ms`,
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      side="left"
                      className="bg-foreground text-background border-none px-3 py-2"
                    >
                      <p className="font-semibold">Private Companies</p>
                      <p className="text-sm opacity-80">{item.private}%</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Private value label */}
                  <text
                    x={privateWidth >= 40 ? centerX - privateWidth + 10 : centerX - privateWidth - 6}
                    y={yPosition + barHeight / 2 + 5}
                    textAnchor={privateWidth >= 40 ? "start" : "end"}
                    className={cn(
                      "font-bold transition-opacity",
                      prefersReducedMotion ? "duration-0" : "duration-500",
                      isVisible ? "opacity-100" : "opacity-0"
                    )}
                    fill={privateWidth >= 40 ? "#ffffff" : privateColor}
                    style={{
                      fontSize: isMobile ? 14 : 13,
                      transitionDelay: prefersReducedMotion
                        ? "0ms"
                        : `${index * 80 + 400}ms`,
                      textShadow: privateWidth >= 40 ? "0 1px 2px rgba(0,0,0,0.3)" : "none",
                    }}
                  >
                    {item.private}%
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
                        rx={2}
                        className={cn(
                          "transition-all ease-out",
                          prefersReducedMotion ? "duration-0" : "duration-700",
                          isActive && "brightness-110"
                        )}
                        style={{
                          transitionDelay: prefersReducedMotion
                            ? "0ms"
                            : `${index * 80 + 50}ms`,
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="bg-foreground text-background border-none px-3 py-2"
                    >
                      <p className="font-semibold">Public Companies</p>
                      <p className="text-sm opacity-80">{item.public}%</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Public value label */}
                  <text
                    x={publicWidth >= 40 ? centerX + publicWidth - 10 : centerX + publicWidth + 6}
                    y={yPosition + barHeight / 2 + 5}
                    textAnchor={publicWidth >= 40 ? "end" : "start"}
                    className={cn(
                      "font-bold transition-opacity",
                      prefersReducedMotion ? "duration-0" : "duration-500",
                      isVisible ? "opacity-100" : "opacity-0"
                    )}
                    fill={publicWidth >= 40 ? "#ffffff" : publicColor}
                    style={{
                      fontSize: isMobile ? 14 : 13,
                      transitionDelay: prefersReducedMotion
                        ? "0ms"
                        : `${index * 80 + 450}ms`,
                      textShadow: publicWidth >= 40 ? "0 1px 2px rgba(0,0,0,0.3)" : "none",
                    }}
                  >
                    {item.public}%
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
            {[30, 20, 10].map((tick) => {
              const offset = getBarWidth(tick);
              return (
                <g key={`label-${tick}`}>
                  <text
                    x={centerX - offset}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    className="fill-muted-foreground"
                    style={{ fontSize: isMobile ? 13 : 12 }}
                  >
                    {tick}%
                  </text>
                  <text
                    x={centerX + offset}
                    y={chartHeight - 8}
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
              x={centerX}
              y={chartHeight - 8}
              textAnchor="middle"
              className="fill-muted-foreground"
              style={{ fontSize: isMobile ? 13 : 12 }}
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
          activeIndex !== null ? "max-h-32 opacity-100 pt-4" : "max-h-0 opacity-0 pt-0"
        )}
      >
        {activeIndex !== null && (
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-4">
              <p className="text-sm font-semibold text-foreground">
                {governanceData[activeIndex].challenge}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {governanceData[activeIndex].isHighlight
                  ? "Top governance challenge requiring immediate focus"
                  : "Governance challenge comparison between company structures"}
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: governanceData[activeIndex].isHighlight ? "#525252" : "#737373" }}>
                  {governanceData[activeIndex].private}%
                </p>
                <p className="text-xs text-muted-foreground">Private</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: governanceData[activeIndex].isHighlight ? "#003087" : "#0055c4" }}>
                  {governanceData[activeIndex].public}%
                </p>
                <p className="text-xs text-muted-foreground">Public</p>
              </div>
              <div className="text-center">
                <p className={cn(
                  "text-2xl font-bold",
                  governanceData[activeIndex].public > governanceData[activeIndex].private ? "text-[#003087]" : "text-[#737373]"
                )}>
                  {governanceData[activeIndex].public > governanceData[activeIndex].private ? "+" : ""}
                  {governanceData[activeIndex].public - governanceData[activeIndex].private}%
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
          <strong className="text-primary">Key finding:</strong> Shadow AI and accountability definition are the{" "}
          <strong className="text-foreground">top two challenges</strong> for both company types, accounting for 48-51% of governance concerns.
        </p>
      </div>
    </div>
  );
}
