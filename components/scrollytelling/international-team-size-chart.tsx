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
} from "recharts";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// International team size data by company size
const teamSizeData = [
  {
    companySize: "<500",
    international: 6,
    label: "Under 500",
  },
  {
    companySize: "500-1K",
    international: 9,
    label: "500-999",
  },
  {
    companySize: "1K-5K",
    international: 19,
    label: "1K-4.9K",
  },
  {
    companySize: "5K-10K",
    international: 25,
    label: "5K-9.9K",
  },
  {
    companySize: "10K+",
    international: 150,
    label: "10K+",
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

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const international = payload.find(p => p.dataKey === "international")?.value;
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

            {/* International Area */}
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

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="p-4 border border-border shadow-sm">
          <p className="text-2xl font-bold text-[#525252]">6</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Startup (&lt;500)</p>
        </div>
        <div className="p-4 border border-border shadow-sm">
          <p className="text-2xl font-bold text-[#525252]">19</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Mid-Market (1K-5K)</p>
        </div>
        <div className="p-4 border border-border shadow-sm">
          <p className="text-2xl font-bold text-[#525252]">25</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Growth (5K-10K)</p>
        </div>
        <div className="p-4 border border-border shadow-sm border-l-4 border-l-[#059669]">
          <p className="text-2xl font-bold text-[#059669]">150</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Enterprise (10K+)</p>
        </div>
      </div>
    </div>
  );
}
