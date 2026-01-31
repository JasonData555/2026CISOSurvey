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
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const industryData = [
  { industry: "Technology", base: 385, bonus: 129, equity: 300, total: 814, description: "Software, hardware, and tech services" },
  { industry: "Financial Services", base: 370, bonus: 125, equity: 280, total: 775, description: "Banking, insurance, and investment" },
  { industry: "Healthcare", base: 350, bonus: 115, equity: 220, total: 685, description: "Hospitals, pharma, and biotech" },
  { industry: "Retail", base: 340, bonus: 100, equity: 180, total: 620, description: "E-commerce and traditional retail" },
  { industry: "Manufacturing", base: 335, bonus: 95, equity: 160, total: 590, description: "Industrial and consumer goods" },
  { industry: "Energy", base: 325, bonus: 90, equity: 150, total: 565, description: "Oil, gas, and utilities" },
  { industry: "Government", base: 310, bonus: 55, equity: 0, total: 365, description: "Federal, state, and local agencies" },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    dataKey: string;
    payload: (typeof industryData)[0];
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-card border border-border shadow-xl ring-1 ring-black/5 p-4 max-w-xs">
      <p className="font-semibold text-foreground text-sm mb-1">{label}</p>
      <p className="text-xs text-muted-foreground mb-3">{data.description}</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#003087]" />
            <span className="text-xs text-muted-foreground">Base Salary</span>
          </div>
          <span className="font-mono font-bold text-foreground text-sm">${data.base}K</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#0055c4]" />
            <span className="text-xs text-muted-foreground">Bonus</span>
          </div>
          <span className="font-mono font-bold text-foreground text-sm">${data.bonus}K</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#737373]" />
            <span className="text-xs text-muted-foreground">Equity/RSUs</span>
          </div>
          <span className="font-mono font-bold text-foreground text-sm">${data.equity}K</span>
        </div>
        <div className="pt-2 border-t border-border flex items-center justify-between gap-4">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Total</span>
          <span className="font-mono font-bold text-primary text-lg">${data.total}K</span>
        </div>
      </div>
    </div>
  );
}

const renderLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex items-center justify-center gap-6 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div className="w-3 h-3" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export function IndustryCompensationChart({ className }: { className?: string }) {
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
      <div className="h-80 sm:h-96 md:h-[28rem] w-full" role="img" aria-label="Stacked bar chart showing CISO compensation by industry including base salary, bonus, and equity. Technology leads at $814K total, Government lowest at $365K.">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={industryData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={true} vertical={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "#525252" }}
              tickFormatter={(value) => `$${value}K`}
              axisLine={{ stroke: "#e5e5e5" }}
              tickLine={false}
              domain={[0, 900]}
            />
            <YAxis
              type="category"
              dataKey="industry"
              tick={{ fontSize: 12, fill: "#525252", fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              width={110}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 48, 135, 0.04)" }} wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }} allowEscapeViewBox={{ x: true, y: false }} />
            <Legend content={renderLegend} />
            <Bar
              dataKey="base"
              stackId="a"
              fill="#003087"
              name="Base Salary"
              animationBegin={0}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="bonus"
              stackId="a"
              fill="#0055c4"
              name="Bonus"
              animationBegin={prefersReducedMotion ? 0 : 200}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="equity"
              stackId="a"
              fill="#737373"
              name="Equity/RSUs"
              animationBegin={prefersReducedMotion ? 0 : 400}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footnote */}
      <p className="text-xs text-muted-foreground italic mt-4">* Industry category is self reported</p>

      {/* Key Insight */}
      <div className="mt-6 border-l-4 border-primary bg-accent p-4">
        <p className="text-sm text-foreground font-medium">
          <span className="font-bold text-primary">Technology</span> leads at $814K total compensation (base + bonus + equity),
          followed by <span className="font-bold text-primary">Financial Services</span> at $775K.
          Government sector trails at $365K with zero equity, reflecting budget constraints and different compensation structures.
        </p>
      </div>
    </div>
  );
}
