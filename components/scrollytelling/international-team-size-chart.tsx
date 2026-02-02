"use client";

import { useState, useEffect, useRef } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Team size comparison data: International vs North America
const teamSizeData = [
  {
    companySize: "<500",
    international: 6,
    northAmerica: 12,
    label: "Under 500",
  },
  {
    companySize: "500-1K",
    international: 9,
    northAmerica: 28,
    label: "500-999",
  },
  {
    companySize: "1K-5K",
    international: 19,
    northAmerica: 104,
    label: "1K-4.9K",
  },
  {
    companySize: "5K-10K",
    international: 25,
    northAmerica: 192,
    label: "5K-9.9K",
  },
  {
    companySize: "10K+",
    international: 150,
    northAmerica: 129,
    label: "10K+",
    crossover: true,
  },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    dataKey: string;
    payload: typeof teamSizeData[0];
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const international = payload.find(p => p.dataKey === "international")?.value;
  const northAmerica = payload.find(p => p.dataKey === "northAmerica")?.value;
  const data = payload[0]?.payload;

  return (
    <div className="bg-card border border-border shadow-xl ring-1 ring-black/5 p-4 max-w-xs">
      <p className="font-semibold text-foreground text-sm mb-1">{data.label} employees</p>
      <div className="space-y-2 mt-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#525252]" />
            <span className="text-xs text-muted-foreground">International</span>
          </div>
          <span className="text-sm font-bold text-foreground">{international} staff</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#003087]" />
            <span className="text-xs text-muted-foreground">North America</span>
          </div>
          <span className="text-sm font-bold text-foreground">{northAmerica} staff</span>
        </div>
        {data.crossover && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-[#059669]">Crossover point:</span> International teams{" "}
              <span className="font-semibold">16% larger</span> at enterprise scale
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function InternationalTeamSizeChart({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const animationDuration = prefersReducedMotion ? 0 : (isVisible ? 1000 : 0);

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
      {/* Chart Header */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          Security Team Scaling: International vs. North America
        </h4>
        <p className="text-xs text-muted-foreground/70">
          Average team size by company employee count showing divergence and crossover patterns
        </p>
      </div>

      {/* Area Chart */}
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={teamSizeData}
            margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
          >
            <defs>
              <linearGradient id="internationalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#525252" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#525252" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="northAmericaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#003087" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#003087" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis
              dataKey="companySize"
              tick={{ fontSize: 11, fill: "#525252" }}
              axisLine={{ stroke: "#e5e5e5" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#525252" }}
              label={{ value: "Team Size", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "#525252" } }}
              axisLine={{ stroke: "#e5e5e5" }}
              tickLine={false}
              domain={[0, 200]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="line"
              wrapperStyle={{ fontSize: "12px" }}
            />

            {/* North America Area (behind) */}
            <Area
              type="monotone"
              dataKey="northAmerica"
              name="North America"
              stroke="#003087"
              strokeWidth={2.5}
              fill="url(#northAmericaGradient)"
              animationBegin={prefersReducedMotion ? 0 : 300}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />

            {/* International Area (in front) */}
            <Area
              type="monotone"
              dataKey="international"
              name="International"
              stroke="#525252"
              strokeWidth={2.5}
              fill="url(#internationalGradient)"
              animationBegin={0}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Key Insight */}
      <div className="mt-8 border-l-4 border-l-[#003087] bg-accent p-4">
        <p className="text-sm text-foreground font-medium">
          <span className="font-bold text-[#525252]">Divergence at mid-market:</span> International teams
          remain smaller through 1K-5K employees (19 vs 104 staff), but at{" "}
          <span className="font-bold text-[#059669]">10K+ scale</span>, international teams are{" "}
          <span className="font-bold">16% larger</span> (150 vs 129)—suggesting less security federation
          and more persistent centralization in international markets.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="p-4 border border-border shadow-sm">
          <p className="text-2xl font-bold text-[#525252]">19</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Int'l Mid-Market (1K-5K)</p>
        </div>
        <div className="p-4 border border-border shadow-sm">
          <p className="text-2xl font-bold text-[#003087]">104</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">NA Mid-Market</p>
        </div>
        <div className="p-4 border border-border shadow-sm border-l-4 border-l-[#059669]">
          <p className="text-2xl font-bold text-[#059669]">150</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Int'l Enterprise (10K+)</p>
        </div>
        <div className="p-4 border border-border shadow-sm border-l-4 border-l-[#059669]">
          <p className="text-2xl font-bold text-[#059669]">+16%</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Enterprise Size Difference</p>
        </div>
      </div>
    </div>
  );
}
