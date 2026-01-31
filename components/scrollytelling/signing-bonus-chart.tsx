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

const signingBonusData = [
  {
    category: "Offered Bonus",
    public: 52,
    private: 29,
    publicLabel: "52%",
    privateLabel: "29%",
  },
  {
    category: "Avg Amount ($K)",
    public: 184,
    private: 102,
    publicLabel: "$184K",
    privateLabel: "$102K",
  },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    dataKey: string;
    payload: (typeof signingBonusData)[0];
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-card border border-border shadow-xl ring-1 ring-black/5 p-4">
      <p className="font-semibold text-foreground text-sm mb-3">{label}</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#003087]" />
            <span className="text-xs text-muted-foreground">Public</span>
          </div>
          <span className="font-mono font-bold text-foreground">
            {label === "Offered Bonus" ? `${data.public}%` : `$${data.public}K`}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#737373]" />
            <span className="text-xs text-muted-foreground">Private</span>
          </div>
          <span className="font-mono font-bold text-foreground">
            {label === "Offered Bonus" ? `${data.private}%` : `$${data.private}K`}
          </span>
        </div>
      </div>
    </div>
  );
}

export function SigningBonusChart({ className }: { className?: string }) {
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
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-card border border-border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-[#003087]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Public Companies
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-primary">52%</p>
            <p className="text-sm text-muted-foreground">offer signing bonuses</p>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-2xl font-bold text-foreground">$184K</p>
            <p className="text-xs text-muted-foreground">average bonus amount</p>
          </div>
        </div>
        <div className="bg-card border border-border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-[#737373]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Private Companies
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-[#737373]">29%</p>
            <p className="text-sm text-muted-foreground">offer signing bonuses</p>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-2xl font-bold text-foreground">$102K</p>
            <p className="text-xs text-muted-foreground">average bonus amount</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-56 sm:h-64 md:h-72 w-full" role="img" aria-label="Bar chart comparing signing bonus offerings: Public companies 52% offer bonuses averaging $184K, Private companies 29% offer bonuses averaging $102K">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={signingBonusData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            barCategoryGap="30%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 12, fill: "#525252" }}
              tickLine={false}
              axisLine={{ stroke: "#0a0a0a", strokeWidth: 2 }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#525252" }}
              tickLine={false}
              axisLine={false}
              domain={[0, 200]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 48, 135, 0.04)" }} wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }} allowEscapeViewBox={{ x: false, y: true }} />
            <Bar
              dataKey="public"
              name="Public"
              fill="#003087"
              animationBegin={0}
              animationDuration={animationDuration}
            />
            <Bar
              dataKey="private"
              name="Private"
              fill="#737373"
              animationBegin={prefersReducedMotion ? 0 : 200}
              animationDuration={animationDuration}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Key Insight */}
      <div className="mt-6 border-l-4 border-primary bg-accent p-4">
        <p className="text-sm text-foreground font-medium">
          Public companies offer signing bonuses <span className="font-bold text-primary">79%</span> more frequently
          and at <span className="font-bold text-primary">80%</span> higher amounts than private counterparts,
          reflecting the need to offset equity cliff risk and accelerate candidate decisions.
        </p>
      </div>
    </div>
  );
}
