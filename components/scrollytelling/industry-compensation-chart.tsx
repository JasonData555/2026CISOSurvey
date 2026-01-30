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
} from "recharts";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const industryData = [
  { industry: "Technology", cash: 542, description: "Software, hardware, and tech services" },
  { industry: "Financial Services", cash: 528, description: "Banking, insurance, and investment" },
  { industry: "Healthcare", cash: 485, description: "Hospitals, pharma, and biotech" },
  { industry: "Retail", cash: 445, description: "E-commerce and traditional retail" },
  { industry: "Manufacturing", cash: 432, description: "Industrial and consumer goods" },
  { industry: "Energy", cash: 418, description: "Oil, gas, and utilities" },
  { industry: "Government", cash: 365, description: "Federal, state, and local agencies" },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: (typeof industryData)[0];
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-card border border-border p-4 shadow-lg max-w-xs">
      <p className="font-semibold text-foreground text-sm mb-1">{label}</p>
      <p className="text-xs text-muted-foreground mb-3">{data.description}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-primary">${data.cash}K</span>
        <span className="text-xs text-muted-foreground">Cash Compensation</span>
      </div>
    </div>
  );
}

export function IndustryCompensationChart({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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
      <div className="h-80 sm:h-96 md:h-[28rem] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={industryData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={true} vertical={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "#525252" }}
              tickFormatter={(value) => `$${value}K`}
              axisLine={{ stroke: "#e5e5e5" }}
              tickLine={false}
              domain={[0, 600]}
            />
            <YAxis
              type="category"
              dataKey="industry"
              tick={{ fontSize: 12, fill: "#525252", fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              width={90}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 48, 135, 0.04)" }} wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }} allowEscapeViewBox={{ x: true, y: false }} />
            <Bar
              dataKey="cash"
              animationBegin={0}
              animationDuration={animationDuration}
              animationEasing="ease-out"
              onMouseEnter={(_, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {industryData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index <= 1 ? "#003087" : "#737373"}
                  style={{
                    transition: "opacity 0.2s ease",
                    cursor: "pointer",
                    opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.5,
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#003087]" />
            <span className="text-xs text-muted-foreground">Top Paying Industries</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#737373]" />
            <span className="text-xs text-muted-foreground">Other Industries</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Cash Only (Base + Bonus)</span>
        </div>
      </div>

      {/* Key Insight */}
      <div className="mt-6 border-l-4 border-primary bg-accent p-4">
        <p className="text-sm text-foreground font-medium">
          <span className="font-bold text-primary">Technology</span> leads at $542K in cash compensation, 
          followed closely by <span className="font-bold text-primary">Financial Services</span> at $528K. 
          Government sector trails at $365K, reflecting budget constraints and different compensation structures.
        </p>
      </div>
    </div>
  );
}
