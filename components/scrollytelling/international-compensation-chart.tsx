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

// International compensation data (reordered: Total Comp first)
const internationalData = [
  {
    category: "Total Comp",
    value: 468665,
    label: "$469K",
    highlight: true,
  },
  {
    category: "Base Salary",
    value: 242996,
    label: "$243K",
  },
  {
    category: "Bonus",
    value: 73887,
    label: "$74K",
  },
  {
    category: "Equity/RSUs",
    value: 151782,
    label: "$152K",
  },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    dataKey: string;
    payload: typeof internationalData[0];
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-card border border-border shadow-xl ring-1 ring-black/5 p-4 max-w-xs">
      <p className="font-semibold text-foreground text-sm mb-3">{label}</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#003087]" />
            <span className="text-xs text-muted-foreground">International</span>
          </div>
          <span className="text-sm font-bold text-foreground">
            {data.label}
          </span>
        </div>
      </div>
    </div>
  );
}

// Currency formatter for Y-axis
const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  return `$${Math.round(value / 1000)}K`;
};

export function InternationalCompensationChart({ className }: { className?: string }) {
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
          International CISO Compensation Breakdown
        </h4>
        <p className="text-xs text-muted-foreground/70">
          Total compensation analysis by component
        </p>
      </div>

      {/* Bar Chart */}
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={internationalData}
            margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={true} vertical={false} />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 11, fill: "#525252" }}
              axisLine={{ stroke: "#e5e5e5" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#525252" }}
              tickFormatter={formatCurrency}
              axisLine={{ stroke: "#e5e5e5" }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 48, 135, 0.04)" }} />

            <Bar
              dataKey="value"
              name="International"
              fill="#003087"
              maxBarSize={40}
              animationBegin={0}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Key Insight */}
      <div className="mt-8 border-l-4 border-l-[#003087] bg-accent p-4">
        <p className="text-sm text-foreground font-medium">
          International CISOs earn <span className="font-bold text-[#003087]">$469K</span> in total compensation,
          composed of <span className="font-bold text-[#003087]">$243K</span> base salary (52%),{" "}
          <span className="font-bold text-[#003087]">$74K</span> bonus (16%), and{" "}
          <span className="font-bold text-[#003087]">$152K</span> in equity (32%). Equity represents nearly
          one-third of total compensation, highlighting the importance of long-term incentive alignment.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="p-4 border border-border shadow-sm border-l-4 border-l-[#003087]">
          <p className="text-2xl font-bold text-[#003087]">$469K</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Total Compensation</p>
        </div>
        <div className="p-4 border border-border shadow-sm">
          <p className="text-2xl font-bold text-foreground">$243K</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Base Salary</p>
        </div>
        <div className="p-4 border border-border shadow-sm">
          <p className="text-2xl font-bold text-foreground">$74K</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Bonus</p>
        </div>
        <div className="p-4 border border-border shadow-sm">
          <p className="text-2xl font-bold text-foreground">$152K</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Equity/RSUs</p>
        </div>
      </div>
    </div>
  );
}
