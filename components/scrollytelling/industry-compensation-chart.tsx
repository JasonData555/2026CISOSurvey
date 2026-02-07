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

const industryData = [
  { industry: "Consumer Software & Internet", base: 365, bonus: 105, equity: 458, total: 928, description: "Consumer-facing software and internet services" },
  { industry: "Media / Entertainment", base: 354, bonus: 125, equity: 403, total: 882, description: "Media production and entertainment industry" },
  { industry: "Logistics / Transportation", base: 299, bonus: 95, equity: 470, total: 864, description: "Supply chain, logistics, and transportation" },
  { industry: "Enterprise Software", base: 336, bonus: 120, equity: 406, total: 862, description: "B2B software and SaaS platforms" },
  { industry: "FinTech", base: 355, bonus: 145, equity: 331, total: 831, description: "Financial technology and digital payments" },
  { industry: "Cloud Security", base: 311, bonus: 105, equity: 403, total: 819, description: "Cloud security products and services" },
  { industry: "Artificial Intelligence (AI)", base: 320, bonus: 113, equity: 343, total: 776, description: "AI/ML products and research companies" },
  { industry: "Food & Beverage", base: 298, bonus: 135, equity: 329, total: 762, description: "Food production and beverage companies" },
  { industry: "BioTech & Pharma", base: 318, bonus: 117, equity: 315, total: 750, description: "Biotechnology and pharmaceutical industry" },
  { industry: "Energy & Utilities", base: 345, bonus: 135, equity: 257, total: 737, description: "Energy production and utility services" },
  { industry: "Manufacturing", base: 331, bonus: 114, equity: 255, total: 700, description: "Industrial and consumer goods manufacturing" },
  { industry: "Cloud Infrastructure", base: 274, bonus: 82, equity: 343, total: 699, description: "Cloud infrastructure and platform providers" },
  { industry: "Insurance", base: 290, bonus: 176, equity: 222, total: 688, description: "Insurance and risk management" },
  { industry: "Banking / Financial Services", base: 316, bonus: 157, equity: 202, total: 675, description: "Traditional banking and financial services" },
  { industry: "Aerospace & Defense", base: 303, bonus: 39, equity: 333, total: 675, description: "Aerospace and defense contractors" },
  { industry: "Healthcare", base: 312, bonus: 109, equity: 252, total: 673, description: "Hospitals, health systems, and providers" },
  { industry: "Consumer Packaged Goods", base: 289, bonus: 101, equity: 251, total: 641, description: "Consumer products and packaged goods" },
  { industry: "HealthTech", base: 277, bonus: 60, equity: 303, total: 640, description: "Healthcare technology and digital health" },
  { industry: "Retail", base: 339, bonus: 121, equity: 178, total: 638, description: "E-commerce and traditional retail" },
  { industry: "Telecommunications", base: 288, bonus: 114, equity: 227, total: 629, description: "Telecom carriers and communications" },
  { industry: "Industrial / Manufacturing", base: 325, bonus: 116, equity: 167, total: 608, description: "Industrial equipment manufacturing" },
  { industry: "Other", base: 298, bonus: 98, equity: 188, total: 584, description: "Other industry verticals" },
  { industry: "EdTech & Education", base: 273, bonus: 71, equity: 229, total: 573, description: "Education technology and institutions" },
  { industry: "Big Data / Analytics", base: 300, bonus: 72, equity: 193, total: 565, description: "Data analytics and business intelligence" },
  { industry: "Legal", base: 347, bonus: 57, equity: 150, total: 554, description: "Legal services and law firms" },
  { industry: "Leisure / Hospitality", base: 261, bonus: 69, equity: 119, total: 449, description: "Hotels, resorts, and hospitality" },
  { industry: "Professional Services", base: 321, bonus: 86, equity: 0, total: 407, description: "Consulting and professional services" },
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

export function IndustryCompensationChart({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const animationDuration = prefersReducedMotion ? 0 : (isVisible ? 800 : 0);

  // Bar height for consistent sizing
  const barHeight = 24;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      {/* Legend - positioned above chart */}
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#003087]" />
          <span className="text-xs text-muted-foreground">Base Salary</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#0055c4]" />
          <span className="text-xs text-muted-foreground">Bonus</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#737373]" />
          <span className="text-xs text-muted-foreground">Equity/RSUs</span>
        </div>
      </div>

      <div className="h-[900px] md:h-[1080px] w-full" role="img" aria-label="Stacked bar chart showing CISO total compensation across 27 industries including base salary, bonus, and equity. Consumer Software & Internet leads at $928K total, Professional Services lowest at $407K.">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={industryData}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={true} vertical={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "#525252" }}
              tickFormatter={(value) => `$${value}K`}
              axisLine={{ stroke: "#e5e5e5" }}
              tickLine={false}
              domain={[0, 1000]}
            />
            <YAxis
              type="category"
              dataKey="industry"
              tick={{
                fontSize: 11,
                fill: "#525252",
                fontWeight: 500,
              }}
              axisLine={false}
              tickLine={false}
              width={200}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 48, 135, 0.04)" }} wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }} allowEscapeViewBox={{ x: true, y: false }} />
            <Bar
              dataKey="base"
              stackId="a"
              fill="#003087"
              name="Base Salary"
              barSize={barHeight}
              animationBegin={0}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="bonus"
              stackId="a"
              fill="#0055c4"
              name="Bonus"
              barSize={barHeight}
              animationBegin={prefersReducedMotion ? 0 : 200}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="equity"
              stackId="a"
              fill="#737373"
              name="Equity/RSUs"
              barSize={barHeight}
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
          <span className="font-bold text-primary">Consumer Software & Internet</span> leads at $928K total compensation,
          driven by the highest equity packages ($458K avg).
          <span className="font-bold text-primary"> Media/Entertainment</span> ($882K) and <span className="font-bold text-primary">Logistics/Transportation</span> ($864K) follow closely.
          Professional Services trails at $407K with minimal equity, reflecting partnership compensation models.
        </p>
      </div>
    </div>
  );
}
