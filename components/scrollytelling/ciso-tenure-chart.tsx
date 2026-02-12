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

interface TenureData {
  companySize: string;
  shortLabel: string;
  tenureMonths: number;
}

const tenureData: TenureData[] = [
  { companySize: "< 500 employees", shortLabel: "<500", tenureMonths: 28 },
  { companySize: "500 - 999 employees", shortLabel: "500-999", tenureMonths: 32 },
  { companySize: "1,000 - 4,999 employees", shortLabel: "1K-5K", tenureMonths: 45 },
  { companySize: "5,000 - 9,999 employees", shortLabel: "5K-10K", tenureMonths: 47 },
  { companySize: "10,000+ employees", shortLabel: "10K+", tenureMonths: 43 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: TenureData;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const years = (data.tenureMonths / 12).toFixed(1);

  return (
    <div className="bg-card border border-border shadow-xl ring-1 ring-black/5 p-4 min-w-[180px]">
      <p className="font-semibold text-foreground text-sm mb-2">{data.companySize}</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">Average Tenure</span>
          <span className="font-mono font-bold text-primary text-lg">{data.tenureMonths} mo</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">In Years</span>
          <span className="font-mono text-foreground text-sm">{years} yrs</span>
        </div>
      </div>
    </div>
  );
}

export function CISOTenureChart({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const animationDuration = prefersReducedMotion ? 0 : isVisible ? 800 : 0;

  // Mobile detection for responsive layout
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Intersection observer for scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      <div
        className="h-[280px] md:h-[320px] w-full"
        role="img"
        aria-label="Horizontal bar chart showing average CISO tenure by company size. Tenure ranges from 28 months at companies under 500 employees to a peak of 47 months at mid-market firms (5,000-9,999 employees), then decreases to 43 months at enterprises over 10,000 employees."
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={tenureData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e5e5"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "#525252" }}
              tickFormatter={(value) => `${value} mo`}
              axisLine={{ stroke: "#e5e5e5" }}
              tickLine={false}
              domain={[0, 60]}
              ticks={[0, 15, 30, 45, 60]}
            />
            <YAxis
              type="category"
              dataKey="companySize"
              tick={{
                fontSize: isMobile ? 11 : 12,
                fill: "#525252",
                fontWeight: 500,
                textAnchor: "start",
                dx: isMobile ? -115 : -165,
              }}
              axisLine={false}
              tickLine={false}
              width={isMobile ? 120 : 170}
              tickFormatter={isMobile ? (value) => {
                const item = tenureData.find((d) => d.companySize === value);
                return item?.shortLabel ?? value;
              } : undefined}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(0, 48, 135, 0.04)" }}
              wrapperStyle={{ zIndex: 1000, pointerEvents: "none" }}
              allowEscapeViewBox={{ x: true, y: false }}
            />
            <Bar
              dataKey="tenureMonths"
              barSize={32}
              fill="#003087"
              animationBegin={0}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Key Insight */}
      <div className="mt-6 border-l-4 border-primary bg-accent p-4">
        <p className="text-sm text-foreground font-medium">
          CISOs at sub-500 employee companies average just <strong className="text-primary">28 months</strong> tenure in their current role
          (40% shorter than the 47-month average at mid-market firms). The CISO at this stage is often
          under-resourced, under-scoped, and positioned as a checkbox rather than a function.
        </p>
      </div>
    </div>
  );
}
