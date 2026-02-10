"use client";

import { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from "recharts";
import { Slider } from "@/components/ui/slider";
import { Building2, Users, Network, Crown, Layers } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface TeamSizeData {
  companySize: string;
  employees: string;
  teamSize: number;
  phase: string;
  phaseDescription: string;
  index: number;
}

const teamSizeData: TeamSizeData[] = [
  {
    companySize: "<500",
    employees: "Under 500",
    teamSize: 12,
    phase: "Startup Mode",
    phaseDescription: "Lean teams, generalist security roles. CISOs often hands-on with tactical execution. Direct CEO access common (32%).",
    index: 0,
  },
  {
    companySize: "500-1K",
    employees: "500-1,000",
    teamSize: 28,
    phase: "Early Scaling",
    phaseDescription: "Initial specialization begins. First dedicated hires for GRC, SecOps, and AppSec. Building foundational security program.",
    index: 1,
  },
  {
    companySize: "1K-2.5K",
    employees: "1,000-2,500",
    teamSize: 67,
    phase: "Centralization",
    phaseDescription: "Rapid team growth. Security becomes a centralized function with dedicated leadership. Investment in tooling accelerates.",
    index: 2,
  },
  {
    companySize: "2.5K-5K",
    employees: "2,500-5,000",
    teamSize: 142,
    phase: "Scaling Complexity",
    phaseDescription: "Sub-teams emerge under domain leads. Formal reporting structures solidify. Compliance demands intensify.",
    index: 3,
  },
  {
    companySize: "5K-10K",
    employees: "5,000-10,000",
    teamSize: 243,
    phase: "Peak Complexity",
    phaseDescription: "Maximum centralization achieved. Largest security teams at 243 personnel. Complexity outpaces informal controls.",
    index: 4,
  },
  {
    companySize: "10K+",
    employees: "Over 10,000",
    teamSize: 129,
    phase: "Federation",
    phaseDescription: "Team contracts 47% as security distributes into platform teams, IT functions, and enterprise risk. CISO shifts to governance role.",
    index: 5,
  },
];

const phaseIcons = {
  "Startup Mode": Building2,
  "Early Scaling": Users,
  "Centralization": Layers,
  "Scaling Complexity": Network,
  "Peak Complexity": Crown,
  "Federation": Network,
};

interface PhaseAnnotationProps {
  data: TeamSizeData;
  isActive: boolean;
  prefersReducedMotion: boolean;
}

function PhaseAnnotation({ data, isActive, prefersReducedMotion }: PhaseAnnotationProps) {
  const Icon = phaseIcons[data.phase as keyof typeof phaseIcons] || Users;

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
            <div className={cn(
              "w-12 h-12 flex items-center justify-center",
              data.phase === "Peak Complexity" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-foreground"
            )}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {data.employees} Employees
              </p>
              <h4 className={cn(
                "text-xl font-bold",
                data.phase === "Peak Complexity" ? "text-primary" : "text-foreground"
              )}>
                {data.phase}
              </h4>
            </div>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className={cn(
              "text-5xl font-bold tracking-tight",
              data.phase === "Peak Complexity" ? "text-primary" : "text-foreground"
            )}>
              {data.teamSize}
            </span>
            <span className="text-lg text-muted-foreground font-medium">
              avg. security personnel
            </span>
          </div>
          
          <p className="text-muted-foreground leading-relaxed max-w-md">
            {data.phaseDescription}
          </p>
          
          {data.phase === "Federation" && (
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <span className="text-warning font-bold text-lg">-47%</span>
              <span className="text-sm text-muted-foreground">
                team size decline due to distributed ownership
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

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
      <div className="mt-2 pt-2 border-t border-border">
        <p className="text-xs font-medium text-foreground">{data.phase}</p>
      </div>
    </div>
  );
}

export function TeamSizeScalingCurve() {
  const [activeIndex, setActiveIndex] = useState(4); // Start at peak
  const prefersReducedMotion = useReducedMotion();

  const activeData = useMemo(() => teamSizeData[activeIndex], [activeIndex]);
  
  const handleSliderChange = useCallback((value: number[]) => {
    setActiveIndex(value[0]);
  }, []);
  
  // Generate smooth curve data for the area chart
  const smoothCurveData = useMemo(() => {
    // Create more data points for a smoother curve
    const points: { x: number; y: number; label: string; originalData?: TeamSizeData }[] = [];
    
    // Interpolate between data points
    for (let i = 0; i < teamSizeData.length - 1; i++) {
      const current = teamSizeData[i];
      const next = teamSizeData[i + 1];
      
      // Add current point
      points.push({
        x: i,
        y: current.teamSize,
        label: current.companySize,
        originalData: current,
      });
      
      // Add interpolated points
      const steps = 3;
      for (let j = 1; j < steps; j++) {
        const t = j / steps;
        // Use cubic interpolation for smoother curve
        const y = current.teamSize + (next.teamSize - current.teamSize) * (3 * t * t - 2 * t * t * t);
        points.push({
          x: i + t,
          y: Math.round(y),
          label: "",
        });
      }
    }
    
    // Add last point
    const last = teamSizeData[teamSizeData.length - 1];
    points.push({
      x: teamSizeData.length - 1,
      y: last.teamSize,
      label: last.companySize,
      originalData: last,
    });
    
    return points;
  }, []);
  
  return (
    <div className="space-y-8">
      {/* Main Chart Area */}
      <div className="relative">
        <div className="h-80 md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={smoothCurveData}
              margin={{ top: 20, right: 20, left: 45, bottom: 20 }}
            >
              <defs>
                <linearGradient id="teamSizeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#003087" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#003087" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              
              <XAxis
                dataKey="x"
                type="number"
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
                tickFormatter={(value) => teamSizeData[value]?.companySize || ""}
                tick={{ fill: "#525252", fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: "#e5e5e5" }}
                tickLine={{ stroke: "#e5e5e5" }}
              />
              
              <YAxis
                tick={{ fill: "#525252", fontSize: 12 }}
                axisLine={{ stroke: "#e5e5e5" }}
                tickLine={{ stroke: "#e5e5e5" }}
                tickFormatter={(value) => value.toLocaleString()}
                domain={[0, 280]}
                ticks={[0, 50, 100, 150, 200, 250]}
              />
              
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ stroke: "#003087", strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              
              {/* Reference line at peak */}
              <ReferenceLine
                x={4}
                stroke="#003087"
                strokeDasharray="4 4"
                strokeWidth={1}
                label={{
                  value: "Peak: 243",
                  position: "top",
                  fill: "#003087",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              />
              
              <Area
                type="monotone"
                dataKey="y"
                stroke="#003087"
                strokeWidth={3}
                fill="url(#teamSizeGradient)"
                animationDuration={prefersReducedMotion ? 0 : 1000}
              />
              
              {/* Highlight active point */}
              <ReferenceDot
                x={activeIndex}
                y={activeData.teamSize}
                r={8}
                fill="#003087"
                stroke="#ffffff"
                strokeWidth={3}
              />
            </AreaChart>
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
          <span className="text-xs text-muted-foreground">Drag to explore scaling phases</span>
        </div>
        
        <Slider
          value={[activeIndex]}
          onValueChange={handleSliderChange}
          max={5}
          min={0}
          step={1}
          className="cursor-pointer"
          aria-label={`Company size selector. Current selection: ${activeData.employees} employees, ${activeData.teamSize} security personnel. Use arrow keys to navigate.`}
        />
        
        {/* Phase labels under slider */}
        <div className="flex justify-between text-xs text-muted-foreground">
          {teamSizeData.map((data, i) => (
            <button
              key={data.companySize}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "transition-colors cursor-pointer px-1 py-0.5 -mx-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded",
                i === activeIndex
                  ? "text-primary font-semibold"
                  : "hover:text-foreground"
              )}
              aria-label={`${data.employees} employees, ${data.teamSize} security personnel`}
              aria-pressed={i === activeIndex}
            >
              {data.companySize}
            </button>
          ))}
        </div>
      </div>
      
      {/* Phase Details Card */}
      <div className="border border-border bg-card p-6 min-h-[200px] relative overflow-hidden">
        {teamSizeData.map((data, i) => (
          <PhaseAnnotation
            key={data.companySize}
            data={data}
            isActive={i === activeIndex}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>
      
      {/* Phase Timeline */}
      <div className="hidden md:block">
        <div className="flex items-stretch">
          {teamSizeData.map((data, i) => {
            const isActive = i === activeIndex;
            const isPeak = data.phase === "Peak Complexity";
            
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
                aria-label={`${data.employees} employees, ${data.phase}, ${data.teamSize} security personnel`}
                aria-pressed={isActive}
              >
                <p className={cn(
                  "text-xs font-semibold uppercase tracking-wider mb-1",
                  isActive 
                    ? isPeak 
                      ? "text-primary-foreground/70" 
                      : "text-primary/70"
                    : "text-muted-foreground"
                )}>
                  {data.companySize}
                </p>
                <p className={cn(
                  "text-2xl font-bold",
                  isActive 
                    ? isPeak 
                      ? "text-primary-foreground" 
                      : "text-primary"
                    : "text-foreground group-hover:text-primary transition-colors"
                )}>
                  {data.teamSize}
                </p>
                <p className={cn(
                  "text-xs mt-1 line-clamp-1",
                  isActive 
                    ? isPeak 
                      ? "text-primary-foreground/80" 
                      : "text-foreground"
                    : "text-muted-foreground"
                )}>
                  {data.phase}
                </p>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Key Insight */}
      <div className="bg-accent border-l-4 border-primary p-4">
        <p className="text-sm text-foreground font-medium">
          <span className="font-bold">Key Insight:</span> Security teams peak at 5K-10K employees (243 personnel) 
          representing maximum centralization. Beyond 10K employees, teams contract 47% as organizations 
          federate security responsibilities across platform teams and business units.
        </p>
      </div>
    </div>
  );
}
