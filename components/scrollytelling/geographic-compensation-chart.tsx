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

const geoCompensationData = [
  { city: "Seattle", base: 369, bonus: 143, equity: 526, total: 1038, description: "Pacific Northwest tech hub, headquarters for major cloud providers" },
  { city: "Bay Area", base: 365, bonus: 119, equity: 480, total: 964, description: "Silicon Valley and San Francisco metropolitan area" },
  { city: "Remote", base: 297, bonus: 154, equity: 381, total: 833, description: "Location-independent roles with distributed teams" },
  { city: "Austin", base: 334, bonus: 121, equity: 335, total: 789, description: "Texas tech corridor with growing enterprise presence" },
  { city: "Boston", base: 323, bonus: 120, equity: 345, total: 788, description: "Northeast biotech and financial services hub" },
  { city: "Los Angeles", base: 350, bonus: 136, equity: 294, total: 780, description: "Entertainment, media, and aerospace industries" },
  { city: "DMV", base: 329, bonus: 127, equity: 290, total: 746, description: "Washington DC, Maryland, Virginia metro area" },
  { city: "Tel Aviv", base: 249, bonus: 53, equity: 427, total: 729, description: "Global cybersecurity and startup ecosystem" },
  { city: "NYC Metro", base: 322, bonus: 180, equity: 216, total: 718, description: "Financial services and media industry concentration" },
  { city: "San Diego", base: 311, bonus: 68, equity: 338, total: 716, description: "Biotech, defense, and telecommunications" },
  { city: "Denver", base: 288, bonus: 76, equity: 340, total: 705, description: "Mountain West tech and aerospace corridor" },
  { city: "Chicago", base: 317, bonus: 130, equity: 235, total: 682, description: "Midwest financial and industrial hub" },
  { city: "Atlanta", base: 334, bonus: 118, equity: 225, total: 677, description: "Southeast business and logistics hub" },
  { city: "Miami", base: 337, bonus: 111, equity: 206, total: 655, description: "Latin America gateway with growing tech presence" },
  { city: "Dallas", base: 302, bonus: 114, equity: 236, total: 652, description: "Texas enterprise and telecommunications center" },
  { city: "Philadelphia", base: 274, bonus: 71, equity: 300, total: 645, description: "Healthcare, pharma, and financial services" },
  { city: "Phoenix", base: 350, bonus: 119, equity: 170, total: 638, description: "Southwest growth market with semiconductor presence" },
  { city: "Las Vegas", base: 303, bonus: 82, equity: 223, total: 607, description: "Gaming, hospitality, and growing tech sector" },
  { city: "Houston", base: 302, bonus: 98, equity: 191, total: 591, description: "Energy sector and healthcare systems" },
  { city: "Columbus", base: 270, bonus: 104, equity: 207, total: 581, description: "Midwest insurance and retail headquarters" },
  { city: "Charlotte", base: 304, bonus: 145, equity: 91, total: 540, description: "Southeast banking and financial center" },
  { city: "Minneapolis", base: 278, bonus: 72, equity: 185, total: 535, description: "Healthcare, retail, and financial services" },
  { city: "Salt Lake City", base: 237, bonus: 63, equity: 225, total: 525, description: "Silicon Slopes tech ecosystem" },
  { city: "Kansas City", base: 260, bonus: 79, equity: 98, total: 437, description: "Midwest agricultural and financial services" },
  { city: "Raleigh-Durham", base: 259, bonus: 69, equity: 84, total: 413, description: "Research Triangle technology corridor" },
  { city: "London", base: 258, bonus: 74, equity: 77, total: 409, description: "European financial and tech hub" },
  { city: "Nashville", base: 261, bonus: 74, equity: 52, total: 387, description: "Healthcare industry and emerging tech scene" },
];

// Mobile-friendly abbreviated labels
const mobileLabels: Record<string, string> = {
  "Raleigh-Durham": "Raleigh-Dur",
  "Salt Lake City": "Salt Lake",
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    dataKey: string;
    payload: (typeof geoCompensationData)[0];
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

export function GeographicCompensationChart({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const animationDuration = prefersReducedMotion ? 0 : (isVisible ? 800 : 0);

  // Bar height for consistent sizing
  const barHeight = 24;

  // Mobile detection for responsive layout
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

      <div className="h-[900px] md:h-[1080px] w-full" role="img" aria-label="Stacked bar chart showing CISO total compensation across 27 cities including base salary, bonus, and equity. Seattle leads at $1,038K total, Nashville lowest at $387K. The chart illustrates a 2.7× compensation spread between highest and lowest-paying markets.">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={geoCompensationData}
            layout="vertical"
            margin={{ top: 10, right: 5, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={true} vertical={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "#525252" }}
              tickFormatter={(value) => `$${value}K`}
              axisLine={{ stroke: "#e5e5e5" }}
              tickLine={false}
              domain={[0, 1100]}
            />
            <YAxis
              type="category"
              dataKey="city"
              tick={{
                fontSize: isMobile ? 11 : 12,
                fill: "#525252",
                fontWeight: 500,
                textAnchor: "start",
                dx: isMobile ? -95 : -195,
              }}
              axisLine={false}
              tickLine={false}
              width={isMobile ? 100 : 200}
              tickFormatter={isMobile ? (value) => mobileLabels[value] ?? value : undefined}
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

      {/* Key Insight */}
      <div className="mt-6 border-l-4 border-primary bg-accent p-4">
        <p className="text-sm text-foreground font-medium">
          <span className="font-bold text-primary">Secondary markets show compressed arbitrage:</span> Markets such as Austin, Denver, and Miami increasingly price near coastal compensation levels, indicating that geographic arbitrage advantages have narrowed as both companies and senior security talent have relocated to the same secondary hubs.
        </p>
      </div>
    </div>
  );
}
