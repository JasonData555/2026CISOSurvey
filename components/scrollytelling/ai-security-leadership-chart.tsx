"use client";

import { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const data = [
  {
    category: "Dedicated Leader",
    categoryShort: "Dedicated\nLeader",
    private: 6,
    public: 13,
    description: "Organizations with a dedicated AI security leader in place",
  },
  {
    category: "CISO Leading",
    categoryShort: "CISO\nLeading",
    private: 22,
    public: 21,
    description: "CISO personally leading the AI security function",
  },
  {
    category: "No Plan",
    categoryShort: "No\nPlan",
    private: 66,
    public: 53,
    description: "No AI security leadership strategy in place",
  },
];

// Color palette matching Swiss modernism / royal blue theme
const COLORS = {
  private: "#003087", // Royal blue (primary)
  public: "#0055c4", // Lighter blue (chart-2)
  privateHover: "#001d52",
  publicHover: "#003d8f",
  grid: "#e5e5e5",
  text: "#525252",
  background: "#ffffff",
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    dataKey: string;
    payload: (typeof data)[0];
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const item = payload[0]?.payload;

  return (
    <div className="bg-card border border-border shadow-xl ring-1 ring-black/5 p-4 max-w-xs">
      <p className="text-sm font-semibold text-foreground mb-1">{label}</p>
      <p className="text-xs text-muted-foreground mb-3">{item?.description}</p>
      <div className="space-y-2">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 inline-block"
                style={{
                  backgroundColor:
                    entry.dataKey === "private" ? COLORS.private : COLORS.public,
                }}
              />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {entry.dataKey === "private" ? "Private" : "Public"}
              </span>
            </div>
            <span className="text-sm font-bold text-foreground">
              {entry.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface AISecurityLeadershipChartProps {
  className?: string;
}

export function AISecurityLeadershipChart({
  className,
}: AISecurityLeadershipChartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const animationDuration = prefersReducedMotion ? 0 : (isVisible ? 800 : 0);

  // Mobile detection for responsive labels
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            AI Security Leadership Status
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Percentage of organizations by leadership approach
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-4 inline-block"
              style={{ backgroundColor: COLORS.private }}
            />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Private
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-4 inline-block"
              style={{ backgroundColor: COLORS.public }}
            />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Public
            </span>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-64 sm:h-72 md:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            barGap={8}
            barCategoryGap="20%"
          >
            <XAxis
              dataKey="category"
              axisLine={{ stroke: COLORS.grid }}
              tickLine={false}
              tick={{
                fontSize: isMobile ? 10 : 12,
                fontWeight: 500,
                fill: COLORS.text,
              }}
              dy={10}
              interval={0}
            />
            <YAxis
              domain={[0, 70]}
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 11,
                fill: COLORS.text,
              }}
              tickFormatter={(value) => `${value}%`}
              width={45}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(0, 48, 135, 0.05)" }}
            />
            
            <Bar
              dataKey="private"
              name="Private"
              maxBarSize={60}
              animationBegin={0}
              animationDuration={animationDuration}
              animationEasing="ease-out"
              onMouseEnter={(_, index) => setHoveredBar(`private-${index}`)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`private-${index}`}
                  fill={
                    hoveredBar === `private-${index}`
                      ? COLORS.privateHover
                      : COLORS.private
                  }
                  style={{
                    transition: "fill 0.2s ease",
                    cursor: "pointer",
                  }}
                />
              ))}
            </Bar>

            <Bar
              dataKey="public"
              name="Public"
              maxBarSize={60}
              animationBegin={prefersReducedMotion ? 0 : 200}
              animationDuration={animationDuration}
              animationEasing="ease-out"
              onMouseEnter={(_, index) => setHoveredBar(`public-${index}`)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`public-${index}`}
                  fill={
                    hoveredBar === `public-${index}`
                      ? COLORS.publicHover
                      : COLORS.public
                  }
                  style={{
                    transition: "fill 0.2s ease",
                    cursor: "pointer",
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Key Insight Callout */}
      <div className="mt-6 border-l-4 border-l-[#c41e3a] bg-[#fef2f2] p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              Leadership Vacuum Identified
            </p>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Only <span className="font-bold text-[#c41e3a]">6%</span> of private
              and <span className="font-bold text-[#c41e3a]">13%</span> of public
              companies have dedicated AI security leaders. Two-thirds of private
              organizations have no AI security leadership strategy.
            </p>
          </div>
        </div>
      </div>

      {/* Data Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {data.map((item, index) => (
          <div
            key={item.category}
            className={cn(
              "p-4 border border-border shadow-sm transition-all duration-200 hover:border-primary cursor-default",
              index === 0 && "border-l-4 border-l-[#c41e3a]"
            )}
          >
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              {item.category}
            </p>
            <div className="flex items-baseline gap-3">
              <div>
                <span
                  className="text-2xl font-bold"
                  style={{ color: COLORS.private }}
                >
                  {item.private}%
                </span>
                <span className="text-xs text-muted-foreground ml-1">Priv</span>
              </div>
              <div>
                <span
                  className="text-2xl font-bold"
                  style={{ color: COLORS.public }}
                >
                  {item.public}%
                </span>
                <span className="text-xs text-muted-foreground ml-1">Pub</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
