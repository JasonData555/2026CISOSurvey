"use client";

import { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { Slider } from "@/components/ui/slider";
import { Users } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface TeamSizeData {
  companySize: string;
  employees: string;
  teamSize: number;
  index: number;
}

const teamSizeByCompanyData: TeamSizeData[] = [
  {
    companySize: "<500",
    employees: "Under 500",
    teamSize: 6,
    index: 0,
  },
  {
    companySize: "500-999",
    employees: "500-999",
    teamSize: 5,
    index: 1,
  },
  {
    companySize: "1K-5K",
    employees: "1,000-4,999",
    teamSize: 22,
    index: 2,
  },
  {
    companySize: "5K-10K",
    employees: "5,000-9,999",
    teamSize: 49,
    index: 3,
  },
  {
    companySize: "10K+",
    employees: "10,000+",
    teamSize: 72,
    index: 4,
  },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: TeamSizeData;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-card border border-border p-4 shadow-lg min-w-[200px]">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
        {data.employees} Employees
      </p>
      <p className="text-2xl font-bold text-primary">{data.teamSize}</p>
      <p className="text-sm text-muted-foreground">avg direct reports</p>
    </div>
  );
}

interface DetailsCardProps {
  data: TeamSizeData;
  isActive: boolean;
  prefersReducedMotion: boolean;
}

function DetailsCard({ data, isActive, prefersReducedMotion }: DetailsCardProps) {
  return (
    <div
      className={cn(
        "transition-all ease-out",
        prefersReducedMotion ? "duration-0" : "duration-500",
        isActive
          ? "opacity-100 translate-y-0"
          : prefersReducedMotion
            ? "opacity-100 translate-y-0 pointer-events-none absolute"
            : "opacity-0 translate-y-4 pointer-events-none absolute"
      )}
    >
      {isActive && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-muted text-foreground">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {data.employees} Employees
              </p>
              <h4 className="text-xl font-bold text-foreground">
                Company Size: {data.companySize}
              </h4>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold tracking-tight text-primary">
              {data.teamSize}
            </span>
            <span className="text-lg text-muted-foreground font-medium">
              avg. direct reports
            </span>
          </div>

          <p className="text-muted-foreground leading-relaxed max-w-md">
            {data.index === 4
              ? "At enterprise scale, NextGen security leaders manage the largest teams, reflecting mature security programs with specialized roles."
              : data.index === 0
                ? "Startup-stage security leaders manage lean teams, often wearing multiple hats and focusing on foundational security."
                : "Team sizes scale with organizational complexity as security programs mature and specialize."}
          </p>
        </div>
      )}
    </div>
  );
}

export function NextGenTeamSizeChart({ className }: { className?: string }) {
  const [activeIndex, setActiveIndex] = useState(4); // Start at largest company size
  const prefersReducedMotion = useReducedMotion();

  const activeData = useMemo(() => teamSizeByCompanyData[activeIndex], [activeIndex]);

  const handleSliderChange = useCallback((value: number[]) => {
    setActiveIndex(value[0]);
  }, []);

  return (
    <div className={cn("space-y-8", className)}>
      {/* Main Chart Area */}
      <div className="relative">
        <div className="h-80 md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={teamSizeByCompanyData}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient id="nextGenTeamSizeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#003087" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#003087" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="companySize"
                tick={{ fill: "#525252", fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: "#e5e5e5" }}
                tickLine={{ stroke: "#e5e5e5" }}
              />

              <YAxis
                tick={{ fill: "#525252", fontSize: 12 }}
                axisLine={{ stroke: "#e5e5e5" }}
                tickLine={{ stroke: "#e5e5e5" }}
                domain={[0, 80]}
                ticks={[0, 20, 40, 60, 80]}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#003087", strokeWidth: 1, strokeDasharray: "4 4" }}
              />

              <Line
                type="monotone"
                dataKey="teamSize"
                stroke="#003087"
                strokeWidth={3}
                dot={{ fill: "#ffffff", stroke: "#003087", strokeWidth: 2, r: 6 }}
                activeDot={{ fill: "#003087", stroke: "#ffffff", strokeWidth: 3, r: 8 }}
                animationDuration={prefersReducedMotion ? 0 : 1000}
              />

              {/* Highlight active point */}
              <ReferenceDot
                x={activeData.companySize}
                y={activeData.teamSize}
                r={8}
                fill="#003087"
                stroke="#ffffff"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Y-axis label */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
            Avg. Team Size
          </span>
        </div>
      </div>

      {/* Interactive Slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground">Company Size</span>
          <span className="text-xs text-muted-foreground">Drag to explore team scaling</span>
        </div>

        <Slider
          value={[activeIndex]}
          onValueChange={handleSliderChange}
          max={4}
          min={0}
          step={1}
          className="cursor-pointer"
          aria-label={`Company size selector. Current selection: ${activeData.employees} employees, ${activeData.teamSize} direct reports. Use arrow keys to navigate.`}
        />

        {/* Phase labels under slider */}
        <div className="flex justify-between text-xs text-muted-foreground">
          {teamSizeByCompanyData.map((data, i) => (
            <button
              key={data.companySize}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "transition-colors cursor-pointer px-1 py-0.5 -mx-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded",
                i === activeIndex
                  ? "text-primary font-semibold"
                  : "hover:text-foreground"
              )}
              aria-label={`${data.employees} employees, ${data.teamSize} direct reports`}
              aria-pressed={i === activeIndex}
            >
              {data.companySize}
            </button>
          ))}
        </div>
      </div>

      {/* Details Card */}
      <div className="border border-border bg-card p-6 min-h-[180px] relative overflow-hidden">
        {teamSizeByCompanyData.map((data, i) => (
          <DetailsCard
            key={data.companySize}
            data={data}
            isActive={i === activeIndex}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>

      {/* Phase Timeline (Desktop) */}
      <div className="hidden md:block">
        <div className="flex items-stretch">
          {teamSizeByCompanyData.map((data, i) => {
            const isActive = i === activeIndex;
            const isPeak = i === 4; // 10K+ is the peak

            return (
              <button
                key={data.companySize}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "flex-1 p-4 border transition-all cursor-pointer text-left group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset",
                  isActive
                    ? isPeak
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-accent border-primary"
                    : "border-border hover:border-muted-foreground/30 bg-card",
                  i > 0 && "-ml-px"
                )}
                aria-label={`${data.employees} employees, ${data.teamSize} direct reports`}
                aria-pressed={isActive}
              >
                <p
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wider mb-1",
                    isActive
                      ? isPeak
                        ? "text-primary-foreground/70"
                        : "text-primary/70"
                      : "text-muted-foreground"
                  )}
                >
                  {data.companySize}
                </p>
                <p
                  className={cn(
                    "text-2xl font-bold",
                    isActive
                      ? isPeak
                        ? "text-primary-foreground"
                        : "text-primary"
                      : "text-foreground group-hover:text-primary transition-colors"
                  )}
                >
                  {data.teamSize}
                </p>
                <p
                  className={cn(
                    "text-xs mt-1 line-clamp-1",
                    isActive
                      ? isPeak
                        ? "text-primary-foreground/80"
                        : "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {data.employees}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
