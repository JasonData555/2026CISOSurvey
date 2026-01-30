"use client";

import { cn } from "@/lib/utils";
import { BarChart3, PieChart, TrendingUp, LineChart, GitBranch, Users } from "lucide-react";

type ChartType = "bar" | "pie" | "line" | "trend" | "sankey" | "team";

interface ChartPlaceholderProps {
  id: string;
  title: string;
  description?: string;
  type?: ChartType;
  height?: "sm" | "md" | "lg";
  className?: string;
}

const iconMap: Record<ChartType, typeof BarChart3> = {
  bar: BarChart3,
  pie: PieChart,
  line: LineChart,
  trend: TrendingUp,
  sankey: GitBranch,
  team: Users,
};

const heightMap = {
  sm: "h-48",
  md: "h-64",
  lg: "h-96",
};

export function ChartPlaceholder({
  id,
  title,
  description,
  type = "bar",
  height = "md",
  className,
}: ChartPlaceholderProps) {
  const Icon = iconMap[type];

  return (
    <div
      id={id}
      className={cn(
        "border border-dashed border-border bg-muted/30 flex flex-col items-center justify-center p-6",
        heightMap[height],
        className
      )}
    >
      <Icon className="w-10 h-10 text-muted-foreground/50 mb-3" />
      <p className="text-sm font-medium text-muted-foreground text-center">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground/70 text-center mt-1 max-w-xs">
          {description}
        </p>
      )}
    </div>
  );
}
