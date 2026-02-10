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
} from "recharts";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const companyColors = {
  public: "#003087",
  private: "#737373",
};

const boardReportingData = [
  {
    frequency: "Quarterly",
    public: 63,
    publicYoY: 4,
    private: 39,
    privateYoY: 3,
    description: "Board meetings held quarterly",
  },
  {
    frequency: "Semi-annually",
    public: 16,
    publicYoY: 5,
    private: 14,
    privateYoY: 3,
    description: "Board meetings held twice per year",
  },
  {
    frequency: "Annually",
    public: 10,
    publicYoY: 2,
    private: 14,
    privateYoY: 7,
    description: "Board meetings held once per year",
  },
  {
    frequency: "Per request",
    public: 3,
    publicYoY: -1,
    private: 17,
    privateYoY: 6,
    description: "CISO reports only when requested",
  },
  {
    frequency: "Does not report",
    public: 9,
    publicYoY: -9,
    private: 15,
    privateYoY: -19,
    description: "No formal board reporting",
  },
].map(item => ({
  ...item,
  gap: item.public - item.private,
  gapLeader: item.public > item.private ? "Public" : "Private"
}));

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    dataKey: string;
    payload: typeof boardReportingData[0];
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const gap = Math.abs(data.gap);
  const leader = data.gapLeader;

  return (
    <div className="bg-card border border-border shadow-xl ring-1 ring-black/5 p-4 max-w-xs">
      <p className="font-semibold text-foreground text-sm mb-1">{label}</p>
      <p className="text-xs text-muted-foreground mb-3">{data.description}</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#003087]" />
            <span className="text-xs text-muted-foreground">Public</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">{data.public}%</span>
            <span className={cn(
              "text-xs font-medium",
              data.publicYoY > 0 ? "text-[#059669]" : data.publicYoY < 0 ? "text-[#c41e3a]" : "text-[#737373]"
            )}>
              {data.publicYoY > 0 ? "+" : ""}{data.publicYoY}%
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#737373]" />
            <span className="text-xs text-muted-foreground">Private</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">{data.private}%</span>
            <span className={cn(
              "text-xs font-medium",
              data.privateYoY > 0 ? "text-[#059669]" : data.privateYoY < 0 ? "text-[#c41e3a]" : "text-[#737373]"
            )}>
              {data.privateYoY > 0 ? "+" : ""}{data.privateYoY}%
            </span>
          </div>
        </div>
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {leader} companies lead by <span className="font-semibold text-foreground">{gap}pp</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export function BoardReportingChart({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const animationDuration = prefersReducedMotion ? 0 : (isVisible ? 800 : 0);

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
          CISO Reporting to Board of Directors
        </h4>
        <p className="text-xs text-muted-foreground/70">
          Reporting frequency by company type with year-over-year changes
        </p>
      </div>

      {/* Lollipop Diverging Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={boardReportingData}
            layout="vertical"
            margin={{ top: 20, right: 80, left: 80, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={false} vertical={true} />
            <XAxis
              type="number"
              domain={[0, 70]}
              ticks={[0, 20, 40, 60]}
              tick={{ fontSize: 11, fill: "#525252" }}
              tickFormatter={(value) => `${value}%`}
              axisLine={{ stroke: "#e5e5e5" }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="frequency"
              tick={{ fontSize: 12, fill: "#525252", fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 48, 135, 0.04)" }} />

            <Bar
              dataKey="public"
              name="Public"
              fill={companyColors.public}
              maxBarSize={20}
              animationBegin={0}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />

            <Bar
              dataKey="private"
              name="Private"
              fill={companyColors.private}
              maxBarSize={20}
              opacity={0.7}
              animationBegin={prefersReducedMotion ? 0 : 200}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-8 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#003087] rounded-full" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Public Companies
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#737373] rounded-full opacity-70" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Private Companies
          </span>
        </div>
      </div>

      {/* Key Insight */}
      <div className="mt-8 border-l-4 border-l-[#003087] bg-accent p-4">
        <p className="text-sm text-foreground font-medium">
          <span className="font-bold text-[#003087]">63% of public</span> vs{" "}
          <span className="font-bold text-[#737373]">39% of private</span> companies report quarterly
          — a <span className="font-bold text-primary">24 percentage point gap</span>.
          Private companies show <span className="font-bold text-[#c41e3a]">-19% YoY decline</span> in board reporting overall.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="p-4 border border-border shadow-sm">
          <p className="text-2xl font-bold text-[#003087]">63%</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Public Quarterly</p>
          <p className="text-xs text-[#059669] font-medium mt-1">+4% YoY</p>
        </div>
        <div className="p-4 border border-border shadow-sm">
          <p className="text-2xl font-bold text-[#737373]">39%</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Private Quarterly</p>
          <p className="text-xs text-[#059669] font-medium mt-1">+3% YoY</p>
        </div>
        <div className="p-4 border border-border shadow-sm border-l-4 border-l-[#c41e3a]">
          <p className="text-2xl font-bold text-[#c41e3a]">9%</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Public Does not report</p>
          <p className="text-xs text-[#c41e3a] font-medium mt-1">-9% YoY</p>
        </div>
        <div className="p-4 border border-border shadow-sm border-l-4 border-l-[#c41e3a]">
          <p className="text-2xl font-bold text-[#c41e3a]">15%</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Private Does not report</p>
          <p className="text-xs text-[#c41e3a] font-medium mt-1">-19% YoY</p>
        </div>
      </div>
    </div>
  );
}
