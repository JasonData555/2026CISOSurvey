"use client";

import { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Compensation data from the report
const compensationData = [
  {
    category: "Total Comp",
    public: 814000,
    private: 686000,
    gap: 128000,
  },
  {
    category: "Base Salary",
    public: 385000,
    private: 342000,
    gap: 43000,
  },
  {
    category: "Bonus",
    public: 129000,
    private: 114000,
    gap: 15000,
  },
  {
    category: "Equity/RSUs",
    public: 300000,
    private: 230000,
    gap: 70000,
  },
];

// Gender pay gap data (simulated based on industry patterns)
const genderPayGapData = [
  {
    category: "Total Comp",
    publicMale: 830000,
    publicFemale: 768000,
    privateMale: 702000,
    privateFemale: 642000,
  },
  {
    category: "Base Salary",
    publicMale: 392000,
    publicFemale: 365000,
    privateMale: 350000,
    privateFemale: 318000,
  },
  {
    category: "Bonus",
    publicMale: 135000,
    publicFemale: 115000,
    privateMale: 120000,
    privateFemale: 98000,
  },
  {
    category: "Equity/RSUs",
    publicMale: 303000,
    publicFemale: 288000,
    privateMale: 232000,
    privateFemale: 226000,
  },
];

type ViewMode = "compensation" | "gender";

// YoY change data for Total Comp only
const yoyData: Record<string, { public: number; private: number }> = {
  "Total Comp": { public: 0, private: 4 },
};

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  return `$${(value / 1000).toFixed(0)}K`;
};

const formatFullCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const getYoYColor = (value: number): string => {
  if (value > 0) return "text-[#059669]";
  if (value < 0) return "text-[#c41e3a]";
  return "text-[#737373]";
};

const formatYoY = (value: number): string => {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value}% YoY`;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    fill: string;
    dataKey: string;
  }>;
  label?: string;
  viewMode: ViewMode;
}

function CustomTooltip({ active, payload, label, viewMode }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const getLabelName = (key: string) => {
    const labels: Record<string, string> = {
      public: "Public Company",
      private: "Private Company",
      publicMale: "Public - Male",
      publicFemale: "Public - Female",
      privateMale: "Private - Male",
      privateFemale: "Private - Female",
    };
    return labels[key] || key;
  };

  // Calculate gaps for gender view
  const calculateGap = () => {
    if (viewMode === "compensation" && payload.length >= 2) {
      const publicVal = payload.find((p) => p.dataKey === "public")?.value || 0;
      const privateVal = payload.find((p) => p.dataKey === "private")?.value || 0;
      return { label: "Gap", value: publicVal - privateVal };
    }
    if (viewMode === "gender" && payload.length >= 4) {
      const publicMale = payload.find((p) => p.dataKey === "publicMale")?.value || 0;
      const publicFemale = payload.find((p) => p.dataKey === "publicFemale")?.value || 0;
      const privateMale = payload.find((p) => p.dataKey === "privateMale")?.value || 0;
      const privateFemale = payload.find((p) => p.dataKey === "privateFemale")?.value || 0;
      return {
        publicGap: publicMale - publicFemale,
        privateGap: privateMale - privateFemale,
      };
    }
    return null;
  };

  const gap = calculateGap();

  return (
    <div className="bg-card border border-border shadow-xl ring-1 ring-black/5 p-4 max-w-xs">
      <p className="font-semibold text-foreground text-sm mb-3 pb-2 border-b border-border">
        {label}
      </p>
      <div className="space-y-2">
        {payload.map((entry, index) => {
          // Only show YoY for Total Comp in compensation view
          const showYoY = viewMode === "compensation" && label === "Total Comp";
          const isPublic = entry.dataKey === "public";
          const isPrivate = entry.dataKey === "private";
          const entryYoY = showYoY && label && yoyData[label]
            ? (isPublic ? yoyData[label].public : isPrivate ? yoyData[label].private : null)
            : null;

          return (
            <div key={index} className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3"
                  style={{ backgroundColor: entry.fill }}
                />
                <span className="text-xs text-muted-foreground">
                  {getLabelName(entry.dataKey)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-medium text-foreground">
                  {formatFullCurrency(entry.value)}
                </span>
                {entryYoY !== null && (
                  <span className={cn("text-xs font-medium whitespace-nowrap", getYoYColor(entryYoY))}>
                    {formatYoY(entryYoY)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {gap && viewMode === "compensation" && "value" in gap && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Compensation Gap
            </span>
            <span className="font-mono text-sm font-semibold text-[#d97706]">
              +{formatFullCurrency(gap.value)}
            </span>
          </div>
        </div>
      )}
      {gap && viewMode === "gender" && "publicGap" in gap && (
        <div className="mt-3 pt-3 border-t border-border space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Gender Pay Gap
          </p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Public</span>
            <span className="font-mono text-sm font-semibold text-[#d97706]">
              {formatFullCurrency(gap.publicGap)} ({((gap.publicGap / (payload.find(p => p.dataKey === "publicMale")?.value || 1)) * 100).toFixed(1)}%)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Private</span>
            <span className="font-mono text-sm font-semibold text-[#d97706]">
              {formatFullCurrency(gap.privateGap)} ({((gap.privateGap / (payload.find(p => p.dataKey === "privateMale")?.value || 1)) * 100).toFixed(1)}%)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function CompensationComparisonChart() {
  const [viewMode, setViewMode] = useState<ViewMode>("compensation");
  const [isVisible, setIsVisible] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const animationDuration = prefersReducedMotion ? 0 : 800;

  // Mobile detection for responsive layout
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  useEffect(() => {
    if (isVisible && animationProgress < 1) {
      const timer = setTimeout(() => {
        setAnimationProgress((prev) => Math.min(prev + 0.05, 1));
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [isVisible, animationProgress]);

  // Reset animation when view mode changes
  useEffect(() => {
    setAnimationProgress(0);
    const timer = setTimeout(() => setAnimationProgress(1), 50);
    return () => clearTimeout(timer);
  }, [viewMode]);

  return (
    <div ref={containerRef} className="w-full">
      {/* Segmented Control */}
      <div className="flex justify-center mb-8">
        <div className="flex sm:inline-flex bg-muted p-1 gap-1 w-full sm:w-auto" role="tablist" aria-label="Chart view selector">
          <button
            onClick={() => setViewMode("compensation")}
            role="tab"
            aria-selected={viewMode === "compensation"}
            aria-controls="compensation-chart"
            tabIndex={viewMode === "compensation" ? 0 : -1}
            className={cn(
              "flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              viewMode === "compensation"
                ? "bg-primary text-primary-foreground"
                : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/80 hover:scale-[1.02] active:scale-[0.98]"
            )}
          >
            Public vs Private
          </button>
          <button
            onClick={() => setViewMode("gender")}
            role="tab"
            aria-selected={viewMode === "gender"}
            aria-controls="compensation-chart"
            tabIndex={viewMode === "gender" ? 0 : -1}
            className={cn(
              "flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              viewMode === "gender"
                ? "bg-primary text-primary-foreground"
                : "bg-transparent text-muted-foreground hover:bg-muted/80 hover:scale-[1.02] active:scale-[0.98]"
            )}
          >
            Gender Pay Gap
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div
        id="compensation-chart"
        role="tabpanel"
        aria-label={viewMode === "compensation" ? "Public vs Private compensation comparison" : "Gender pay gap analysis"}
        className={cn(
          "h-72 sm:h-80 md:h-96 w-full transition-opacity duration-500",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      >
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === "compensation" ? (
            <BarChart
              data={compensationData}
              margin={{ top: 20, right: 30, left: isMobile ? 40 : 20, bottom: isMobile ? 60 : 20 }}
              barCategoryGap="20%"
            >
              <CartesianGrid
                strokeDasharray="none"
                stroke="#e5e5e5"
                vertical={false}
              />
              <XAxis
                dataKey="category"
                tick={{ fontSize: isMobile ? 11 : 12, fill: "#525252" }}
                tickLine={false}
                axisLine={{ stroke: "#0a0a0a", strokeWidth: 2 }}
                interval={0}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? "end" : "middle"}
                height={isMobile ? 60 : 30}
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fontSize: 12, fill: "#525252" }}
                tickLine={false}
                axisLine={false}
                width={70}
              />
              <Tooltip
                content={<CustomTooltip viewMode={viewMode} />}
                cursor={{ fill: "rgba(0, 48, 135, 0.04)" }}
                wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }}
                allowEscapeViewBox={{ x: false, y: true }}
              />
              <Legend
                verticalAlign="top"
                height={isMobile ? 48 : 36}
                wrapperStyle={{ paddingTop: isMobile ? 8 : 0, paddingBottom: isMobile ? 8 : 0 }}
                formatter={(value) => (
                  <span className={isMobile ? "text-xs text-foreground" : "text-sm text-foreground"}>
                    {value === "public" ? "Public Company" : "Private Company"}
                  </span>
                )}
              />
              <Bar
                dataKey="public"
                name="public"
                fill="#003087"
                animationBegin={0}
                animationDuration={animationDuration}
                animationEasing="ease-out"
              >
                {compensationData.map((_, index) => (
                  <Cell key={`cell-public-${index}`} fill="#003087" />
                ))}
              </Bar>
              <Bar
                dataKey="private"
                name="private"
                fill="#737373"
                animationBegin={prefersReducedMotion ? 0 : 200}
                animationDuration={animationDuration}
                animationEasing="ease-out"
              >
                {compensationData.map((_, index) => (
                  <Cell key={`cell-private-${index}`} fill="#737373" />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <BarChart
              data={genderPayGapData}
              margin={{ top: 20, right: 30, left: isMobile ? 40 : 20, bottom: isMobile ? 60 : 20 }}
              barCategoryGap="15%"
            >
              <CartesianGrid
                strokeDasharray="none"
                stroke="#e5e5e5"
                vertical={false}
              />
              <XAxis
                dataKey="category"
                tick={{ fontSize: isMobile ? 11 : 12, fill: "#525252" }}
                tickLine={false}
                axisLine={{ stroke: "#0a0a0a", strokeWidth: 2 }}
                interval={0}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? "end" : "middle"}
                height={isMobile ? 60 : 30}
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fontSize: 12, fill: "#525252" }}
                tickLine={false}
                axisLine={false}
                width={70}
              />
              <Tooltip
                content={<CustomTooltip viewMode={viewMode} />}
                cursor={{ fill: "rgba(0, 48, 135, 0.04)" }}
                wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }}
                allowEscapeViewBox={{ x: false, y: true }}
              />
              <Legend
                verticalAlign="top"
                height={isMobile ? 72 : 36}
                wrapperStyle={{ paddingTop: isMobile ? 16 : 0, paddingBottom: isMobile ? 8 : 0 }}
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    publicMale: "Public - Male",
                    publicFemale: "Public - Female",
                    privateMale: "Private - Male",
                    privateFemale: "Private - Female",
                  };
                  return (
                    <span className="text-xs text-foreground">
                      {labels[value] || value}
                    </span>
                  );
                }}
              />
              <Bar
                dataKey="publicMale"
                name="publicMale"
                fill="#003087"
                animationBegin={0}
                animationDuration={animationDuration}
                animationEasing="ease-out"
              />
              <Bar
                dataKey="publicFemale"
                name="publicFemale"
                fill="#0055c4"
                animationBegin={prefersReducedMotion ? 0 : 100}
                animationDuration={animationDuration}
                animationEasing="ease-out"
              />
              <Bar
                dataKey="privateMale"
                name="privateMale"
                fill="#404040"
                animationBegin={prefersReducedMotion ? 0 : 200}
                animationDuration={animationDuration}
                animationEasing="ease-out"
              />
              <Bar
                dataKey="privateFemale"
                name="privateFemale"
                fill="#737373"
                animationBegin={prefersReducedMotion ? 0 : 300}
                animationDuration={animationDuration}
                animationEasing="ease-out"
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Key Insight Callout */}
      <div className="mt-6 border-l-4 border-l-[#003087] bg-accent p-4">
        {viewMode === "compensation" ? (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Key Finding
              </p>
              <p className="text-sm text-foreground font-medium">
                Public company CISOs earn{" "}
                <span className="text-[#003087] font-semibold">$128K more</span>{" "}
                in total compensation, with equity driving the largest differential.
              </p>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-[#003087]">$814K</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Public Avg
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#737373]">$686K</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Private Avg
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Gender Pay Gap Analysis
              </p>
              <p className="text-sm text-foreground font-medium">
                Pay disparities persist across both sectors, with{" "}
                <span className="text-[#d97706] font-semibold">7-9%</span>{" "}
                gaps in total compensation between male and female CISOs.
              </p>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-[#003087]">7.5%</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Public Gap
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#404040]">8.5%</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Private Gap
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
