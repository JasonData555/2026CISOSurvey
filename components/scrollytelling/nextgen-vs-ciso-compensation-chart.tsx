"use client";

import { useEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// NextGen compensation data - Public vs Private
const nextgenCompensationData = [
  {
    category: "Total Comp",
    public: 634000,
    private: 496000,
    gap: 138000,
  },
  {
    category: "Base Salary",
    public: 303782,
    private: 266737,
    gap: 37045,
  },
  {
    category: "Bonus",
    public: 105790,
    private: 84313,
    gap: 21477,
  },
  {
    category: "Equity/RSUs",
    public: 224621,
    private: 144583,
    gap: 80038,
  },
];

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

// YoY change data for Total Comp only
const yoyData: Record<string, { public: number; private: number }> = {
  "Total Comp": { public: 5, private: 6 },
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
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const publicVal = payload.find((p) => p.dataKey === "public")?.value || 0;
  const privateVal = payload.find((p) => p.dataKey === "private")?.value || 0;
  const gap = publicVal - privateVal;

  return (
    <div className="bg-card border border-border shadow-xl ring-1 ring-black/5 p-4 max-w-xs">
      <p className="font-semibold text-foreground text-sm mb-3 pb-2 border-b border-border">
        {label}
      </p>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#003087]" />
            <span className="text-xs text-muted-foreground">Public</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-foreground text-sm">{formatFullCurrency(publicVal)}</span>
            {label === "Total Comp" && yoyData[label] && (
              <span className={cn("text-xs font-medium whitespace-nowrap", getYoYColor(yoyData[label].public))}>
                {formatYoY(yoyData[label].public)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#737373]" />
            <span className="text-xs text-muted-foreground">Private</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-foreground text-sm">{formatFullCurrency(privateVal)}</span>
            {label === "Total Comp" && yoyData[label] && (
              <span className={cn("text-xs font-medium whitespace-nowrap", getYoYColor(yoyData[label].private))}>
                {formatYoY(yoyData[label].private)}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Gap</span>
          <span className="font-mono font-bold text-primary text-sm">{formatFullCurrency(gap)}</span>
        </div>
        <div className="mt-2 h-1 bg-muted overflow-hidden">
          <div
            className="h-full bg-primary"
            style={{ width: `${(gap / publicVal) * 100}%` }}
          />
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

interface NextGenVsCISOCompensationChartProps {
  className?: string;
}

export function NextGenVsCISOCompensationChart({ className }: NextGenVsCISOCompensationChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const animationDuration = prefersReducedMotion ? 0 : (isVisible ? 800 : 0);

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

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      <div className="h-80 w-full" role="img" aria-label="Bar chart comparing NextGen compensation between public and private companies across total comp, base salary, bonus, and equity">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={nextgenCompensationData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            barGap={8}
            barCategoryGap="25%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 12, fill: "#525252", fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: "#0a0a0a", strokeWidth: 2 }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#525252" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrency}
              domain={[0, 700000]}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(0, 48, 135, 0.04)" }}
              wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }}
              allowEscapeViewBox={{ x: false, y: true }}
            />
            <Legend content={renderLegend} />
            <Bar
              dataKey="public"
              fill="#003087"
              name="Public Companies"
              animationBegin={0}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="private"
              fill="#737373"
              name="Private Companies"
              animationBegin={prefersReducedMotion ? 0 : 200}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Key insight callout */}
      <div className="mt-6 p-4 bg-accent border-l-4 border-primary">
        <p className="text-sm text-foreground">
          <span className="font-semibold">Key Insight:</span> The larger YoY compensation growth in NextGen roles compared to CISOs signals a fundamental market shift: execution capability now commands a higher premium than strategic oversight. As the CISO role increasingly emphasizes risk communication, board presentations, and stakeholder management, the market is bidding up the technical leaders who architect, build, and operate security programs.
        </p>
      </div>
    </div>
  );
}
