"use client";

import { useEffect, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { TrendingUp, ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Compensation data showing year-over-year growth (indexed to 2022 = 100)
const compensationData = [
  { year: "2022", ciso: 100, nextgen: 100, cisoActual: 620, nextgenActual: 340 },
  { year: "2023", ciso: 105, nextgen: 108, cisoActual: 651, nextgenActual: 367 },
  { year: "2024", ciso: 109, nextgen: 118, cisoActual: 676, nextgenActual: 401 },
  { year: "2025", ciso: 113, nextgen: 129, cisoActual: 701, nextgenActual: 439 },
  { year: "2026", ciso: 118, nextgen: 142, cisoActual: 733, nextgenActual: 483 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      year: string;
      ciso: number;
      nextgen: number;
      cisoActual: number;
      nextgenActual: number;
    };
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const cisoGrowth = ((data.ciso - 100) / 100 * 100).toFixed(1);
  const nextgenGrowth = ((data.nextgen - 100) / 100 * 100).toFixed(1);

  return (
    <div className="bg-background border border-border p-4 shadow-lg">
      <p className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider border-b border-border pb-2">
        {label}
      </p>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#0055c4]" />
            <span className="text-muted-foreground text-sm">NextGen</span>
          </div>
          <div className="text-right">
            <p className="font-bold text-foreground">${data.nextgenActual}K</p>
            <p className="text-xs text-[#0055c4] flex items-center gap-1 justify-end">
              <ArrowUpRight className="w-3 h-3" />
              +{nextgenGrowth}% since 2022
            </p>
          </div>
        </div>
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#737373]" />
            <span className="text-muted-foreground text-sm">CISO</span>
          </div>
          <div className="text-right">
            <p className="font-bold text-foreground">${data.cisoActual}K</p>
            <p className="text-xs text-[#737373] flex items-center gap-1 justify-end">
              <ArrowUpRight className="w-3 h-3" />
              +{cisoGrowth}% since 2022
            </p>
          </div>
        </div>
      </div>
      {Number(nextgenGrowth) > Number(cisoGrowth) && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-[#0055c4] font-medium">
            NextGen growth outpacing CISO by +{(Number(nextgenGrowth) - Number(cisoGrowth)).toFixed(1)} pts
          </p>
        </div>
      )}
    </div>
  );
}

interface LegendProps {
  payload?: Array<{
    value: string;
    color: string;
    dataKey: string;
  }>;
}

function CustomLegend({ payload }: LegendProps) {
  if (!payload) return null;

  const labels: Record<string, string> = {
    nextgen: "NextGen Leaders",
    ciso: "CISOs",
  };

  return (
    <div className="flex justify-center gap-8 mt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 cursor-pointer group">
          <div
            className="w-4 h-1"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            {labels[entry.dataKey] || entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

interface NextGenVsCISOCompensationChartProps {
  className?: string;
}

export function NextGenVsCISOCompensationChart({ className }: NextGenVsCISOCompensationChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();

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
    if (isVisible && animationProgress < 100) {
      const timer = setTimeout(() => {
        setAnimationProgress((prev) => Math.min(prev + 2, 100));
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [isVisible, animationProgress]);

  // Calculate animated data based on progress
  const animatedData = compensationData.map((item, index) => {
    const progressThreshold = (index / (compensationData.length - 1)) * 100;
    const itemProgress = Math.max(0, Math.min(1, (animationProgress - progressThreshold + 20) / 20));
    
    return {
      ...item,
      ciso: 100 + (item.ciso - 100) * itemProgress,
      nextgen: 100 + (item.nextgen - 100) * itemProgress,
    };
  });

  // Calculate final growth rates for the summary
  const finalCisoGrowth = compensationData[compensationData.length - 1].ciso - 100;
  const finalNextgenGrowth = compensationData[compensationData.length - 1].nextgen - 100;
  const growthDelta = finalNextgenGrowth - finalCisoGrowth;

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      {/* Header with key insight */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Compensation Growth Index (2022 = 100)
          </h3>
          <p className="text-xs text-muted-foreground">
            Year-over-year total compensation trajectories
          </p>
        </div>
        <div
          className={cn(
            "flex items-center gap-2 bg-[#0055c4]/10 px-4 py-2 border-l-4 border-[#0055c4] transition-all",
            prefersReducedMotion ? "duration-0" : "duration-700",
            isVisible
              ? "opacity-100 translate-x-0"
              : prefersReducedMotion
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4"
          )}
        >
          <TrendingUp className="w-4 h-4 text-[#0055c4]" />
          <span className="text-sm font-semibold text-[#0055c4]">
            +{growthDelta}% gap widening
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={animatedData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="nextgenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0055c4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0055c4" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="cisoGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#737373" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#737373" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e5e5" 
              vertical={false}
            />
            <XAxis 
              dataKey="year" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#525252", fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#525252", fontSize: 12 }}
              domain={[95, 150]}
              ticks={[100, 110, 120, 130, 140, 150]}
              tickFormatter={(value) => `${value}`}
              dx={-10}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ stroke: "#003087", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <ReferenceLine 
              y={100} 
              stroke="#0a0a0a" 
              strokeWidth={1}
              label={{
                value: "Baseline (2022)",
                position: "left",
                fill: "#525252",
                fontSize: 10,
                fontWeight: 500,
              }}
            />
            {/* CISO Area - rendered first (below) */}
            <Area
              type="monotone"
              dataKey="ciso"
              stroke="#737373"
              strokeWidth={2}
              fill="url(#cisoGradient)"
              dot={{ fill: "#737373", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: "#737373", stroke: "#ffffff", strokeWidth: 2 }}
              name="ciso"
              isAnimationActive={false}
            />
            {/* NextGen Area - rendered second (on top, highlighted) */}
            <Area
              type="monotone"
              dataKey="nextgen"
              stroke="#0055c4"
              strokeWidth={3}
              fill="url(#nextgenGradient)"
              dot={{ fill: "#0055c4", strokeWidth: 0, r: 5 }}
              activeDot={{ r: 8, fill: "#0055c4", stroke: "#ffffff", strokeWidth: 2 }}
              name="nextgen"
              isAnimationActive={false}
            />
            <Legend content={<CustomLegend />} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats */}
      <div
        className={cn(
          "grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-border transition-all",
          prefersReducedMotion ? "duration-0" : "duration-700 delay-300",
          isVisible
            ? "opacity-100 translate-y-0"
            : prefersReducedMotion
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
        )}
      >
        <div className="group cursor-default">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold text-[#0055c4]">+{finalNextgenGrowth}%</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">since 2022</span>
          </div>
          <p className="text-sm text-muted-foreground">NextGen Total Comp Growth</p>
          <div className="h-1 w-full bg-muted mt-2 overflow-hidden">
            <div
              className={cn(
                "h-full bg-[#0055c4] transition-all ease-out",
                prefersReducedMotion ? "duration-0" : "duration-1000"
              )}
              style={{ width: isVisible ? `${(finalNextgenGrowth / 50) * 100}%` : "0%" }}
            />
          </div>
        </div>
        <div className="group cursor-default">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold text-[#737373]">+{finalCisoGrowth}%</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">since 2022</span>
          </div>
          <p className="text-sm text-muted-foreground">CISO Total Comp Growth</p>
          <div className="h-1 w-full bg-muted mt-2 overflow-hidden">
            <div
              className={cn(
                "h-full bg-[#737373] transition-all ease-out",
                prefersReducedMotion ? "duration-0" : "duration-1000"
              )}
              style={{ width: isVisible ? `${(finalCisoGrowth / 50) * 100}%` : "0%" }}
            />
          </div>
        </div>
      </div>

      {/* Key insight callout */}
      <div
        className={cn(
          "mt-6 p-4 bg-[#0055c4]/5 border-l-4 border-[#0055c4] transition-all",
          prefersReducedMotion ? "duration-0" : "duration-700 delay-500",
          isVisible
            ? "opacity-100 translate-y-0"
            : prefersReducedMotion
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
        )}
      >
        <p className="text-sm text-foreground">
          <span className="font-semibold">Key Insight:</span> NextGen compensation is growing at{" "}
          <span className="font-bold text-[#0055c4]">{((finalNextgenGrowth / finalCisoGrowth - 1) * 100).toFixed(0)}% faster</span>{" "}
          than CISO compensation, signaling market recognition of execution-layer talent scarcity. 
          This trend reflects the critical role Deputy CISOs and domain leaders play in bridging strategy with hands-on program delivery.
        </p>
      </div>
    </div>
  );
}
