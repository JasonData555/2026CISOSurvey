"use client";

import React from "react"

import { useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface FlowData {
  source: string;
  target: string;
  value2024: number;
  value2025: number;
  value2026: number;
  yoyChange: number;
}

interface TooltipData {
  source: string;
  target: string;
  year: string;
  value: number;
  yoyChange: number;
  x: number;
  y: number;
}

type CompanyType = "public" | "private";

// Data based on the report: CTO/Engineering line ascendancy
const privateCompanyData: FlowData[] = [
  { source: "CISO", target: "CTO/Engineering", value2024: 25, value2025: 28, value2026: 30, yoyChange: 5 },
  { source: "CISO", target: "CIO", value2024: 20, value2025: 21, value2026: 22, yoyChange: 2 },
  { source: "CISO", target: "CEO", value2024: 20, value2025: 18, value2026: 16, yoyChange: -4 },
  { source: "CISO", target: "CFO", value2024: 12, value2025: 11, value2026: 10, yoyChange: -2 },
  { source: "CISO", target: "General Counsel", value2024: 10, value2025: 10, value2026: 10, yoyChange: 0 },
  { source: "CISO", target: "Other", value2024: 13, value2025: 12, value2026: 12, yoyChange: -1 },
];

const publicCompanyData: FlowData[] = [
  { source: "CISO", target: "CTO/Engineering", value2024: 28, value2025: 30, value2026: 32, yoyChange: 4 },
  { source: "CISO", target: "CIO", value2024: 30, value2025: 32, value2026: 34, yoyChange: 4 },
  { source: "CISO", target: "CEO", value2024: 12, value2025: 10, value2026: 8, yoyChange: -4 },
  { source: "CISO", target: "CFO", value2024: 10, value2025: 9, value2026: 8, yoyChange: -2 },
  { source: "CISO", target: "General Counsel", value2024: 8, value2025: 8, value2026: 8, yoyChange: 0 },
  { source: "CISO", target: "Other", value2024: 12, value2025: 11, value2026: 10, yoyChange: -2 },
];

const years = ["2024", "2025", "2026"] as const;

const targetColors: Record<string, { base: string; highlight: string }> = {
  "CTO/Engineering": { base: "#003087", highlight: "#0055c4" }, // Royal blue - highlighted
  "CIO": { base: "#404040", highlight: "#525252" },
  "CEO": { base: "#737373", highlight: "#8a8a8a" },
  "CFO": { base: "#a3a3a3", highlight: "#b5b5b5" },
  "General Counsel": { base: "#c7c7c7", highlight: "#d4d4d4" },
  "Other": { base: "#e5e5e5", highlight: "#ebebeb" },
};

export function ReportingStructureSankeyChart({ className }: { className?: string }) {
  const [companyType, setCompanyType] = useState<CompanyType>("private");
  const [hoveredFlow, setHoveredFlow] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const data = companyType === "private" ? privateCompanyData : publicCompanyData;

  const chartConfig = useMemo(() => {
    const width = 950;
    const height = 400;
    const padding = { top: 40, right: 220, bottom: 40, left: 80 };
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    
    // Column positions for the 3 years
    const columnX = years.map((_, i) => padding.left + (i * innerWidth) / 2);
    
    return { width, height, padding, innerWidth, innerHeight, columnX };
  }, []);

  // Calculate flow paths and node positions
  const { flows, yearNodes } = useMemo(() => {
    const { padding, innerHeight, columnX } = chartConfig;
    
    // Calculate the total for each year to normalize
    const totals = {
      "2024": data.reduce((sum, d) => sum + d.value2024, 0),
      "2025": data.reduce((sum, d) => sum + d.value2025, 0),
      "2026": data.reduce((sum, d) => sum + d.value2026, 0),
    };
    
    // Build nodes for each year column
    const yearNodes: Record<string, { y: number; height: number; target: string; value: number }[]> = {};
    
    years.forEach((year) => {
      let currentY = padding.top;
      const yearData = data.map((d) => ({
        target: d.target,
        value: year === "2024" ? d.value2024 : year === "2025" ? d.value2025 : d.value2026,
      }));
      
      // Sort by value descending for visual hierarchy
      yearData.sort((a, b) => b.value - a.value);
      
      yearNodes[year] = yearData.map((item) => {
        const nodeHeight = (item.value / totals[year]) * innerHeight;
        const node = {
          ...item,
          y: currentY,
          height: nodeHeight,
        };
        currentY += nodeHeight + 4; // 4px gap between nodes
        return node;
      });
    });
    
    // Build flows between consecutive years
    const flows: Array<{
      id: string;
      target: string;
      sourceYear: string;
      targetYear: string;
      sourceY: number;
      sourceHeight: number;
      targetY: number;
      targetHeight: number;
      sourceX: number;
      targetX: number;
      value: number;
      yoyChange: number;
    }> = [];
    
    for (let i = 0; i < years.length - 1; i++) {
      const sourceYear = years[i];
      const targetYear = years[i + 1];
      
      data.forEach((item) => {
        const sourceNode = yearNodes[sourceYear].find((n) => n.target === item.target);
        const targetNode = yearNodes[targetYear].find((n) => n.target === item.target);
        
        if (sourceNode && targetNode) {
          flows.push({
            id: `${item.target}-${sourceYear}-${targetYear}`,
            target: item.target,
            sourceYear,
            targetYear,
            sourceY: sourceNode.y,
            sourceHeight: sourceNode.height,
            targetY: targetNode.y,
            targetHeight: targetNode.height,
            sourceX: columnX[i],
            targetX: columnX[i + 1],
            value: targetNode.value,
            yoyChange: item.yoyChange / 2, // Per-year change (total is 2-year change)
          });
        }
      });
    }
    
    return { flows, yearNodes };
  }, [data, chartConfig]);

  // Generate curved path for flow
  const generateFlowPath = useCallback((
    sourceX: number,
    sourceY: number,
    sourceHeight: number,
    targetX: number,
    targetY: number,
    targetHeight: number
  ) => {
    const midX = (sourceX + targetX) / 2;
    
    // Create a smooth curved path from source to target
    return `
      M ${sourceX + 8} ${sourceY}
      C ${midX} ${sourceY}, ${midX} ${targetY}, ${targetX - 8} ${targetY}
      L ${targetX - 8} ${targetY + targetHeight}
      C ${midX} ${targetY + targetHeight}, ${midX} ${sourceY + sourceHeight}, ${sourceX + 8} ${sourceY + sourceHeight}
      Z
    `;
  }, []);

  const handleFlowHover = useCallback((
    flow: typeof flows[0],
    event: React.MouseEvent
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const svgRect = event.currentTarget.closest("svg")?.getBoundingClientRect();
    
    if (svgRect) {
      setHoveredFlow(flow.id);
      setTooltip({
        source: "CISO",
        target: flow.target,
        year: flow.targetYear,
        value: flow.value,
        yoyChange: flow.yoyChange,
        x: event.clientX - svgRect.left,
        y: event.clientY - svgRect.top - 80,
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredFlow(null);
    setTooltip(null);
  }, []);

  const { width, height, padding, columnX } = chartConfig;

  return (
    <div className={cn("w-full", className)}>
      {/* Toggle Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-1 p-1 bg-muted w-full sm:w-auto" role="tablist" aria-label="Company type selector">
          <button
            onClick={() => setCompanyType("private")}
            className={cn(
              "flex-1 sm:flex-none px-4 py-2 text-sm font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              companyType === "private"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            role="tab"
            aria-selected={companyType === "private"}
            aria-controls="sankey-chart"
            tabIndex={companyType === "private" ? 0 : -1}
          >
            Private Companies
          </button>
          <button
            onClick={() => setCompanyType("public")}
            className={cn(
              "flex-1 sm:flex-none px-4 py-2 text-sm font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              companyType === "public"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            role="tab"
            aria-selected={companyType === "public"}
            aria-controls="sankey-chart"
            tabIndex={companyType === "public" ? 0 : -1}
          >
            Public Companies
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3" style={{ backgroundColor: "#003087" }} />
            <span className="hidden sm:inline">CTO/Engineering (Highlighted)</span>
            <span className="sm:hidden">CTO/Eng</span>
          </div>
        </div>
      </div>

      {/* Mobile scroll hint */}
      <div className="sm:hidden text-xs text-muted-foreground text-center mb-2 flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01" />
        </svg>
        <span>Swipe to explore timeline</span>
      </div>

      {/* Sankey Chart */}
      <div className="relative w-full overflow-x-auto" id="sankey-chart" role="tabpanel">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[600px]"
          style={{ maxHeight: "450px" }}
          role="img"
          aria-label={`Sankey diagram showing CISO reporting structure trends for ${companyType} companies from 2024 to 2026. ${
            companyType === "private"
              ? "CTO/Engineering reporting line growing from 25% to 30%, while CEO reporting line declining from 20% to 16%."
              : "CTO/Engineering reporting line growing from 28% to 32%, CIO reporting line growing from 30% to 34%, while CEO reporting line declining from 12% to 8%."
          } Hover over flows to see detailed year-over-year changes.`}
        >
          {/* Year Labels */}
          {years.map((year, i) => (
            <text
              key={year}
              x={columnX[i]}
              y={padding.top - 16}
              textAnchor="middle"
              className="fill-foreground text-sm font-semibold"
            >
              {year}
            </text>
          ))}

          {/* Flow Paths */}
          {flows.map((flow) => {
            const isHighlighted = flow.target === "CTO/Engineering";
            const isHovered = hoveredFlow === flow.id;
            const colors = targetColors[flow.target];
            
            return (
              <path
                key={flow.id}
                d={generateFlowPath(
                  flow.sourceX,
                  flow.sourceY,
                  flow.sourceHeight,
                  flow.targetX,
                  flow.targetY,
                  flow.targetHeight
                )}
                fill={isHovered ? colors.highlight : colors.base}
                opacity={
                  hoveredFlow === null
                    ? isHighlighted
                      ? 0.9
                      : 0.6
                    : isHovered
                    ? 0.95
                    : 0.25
                }
                style={{
                  cursor: "pointer",
                  transition: prefersReducedMotion ? "none" : "opacity 0.2s ease, fill 0.2s ease",
                }}
                onMouseMove={(e) => handleFlowHover(flow, e)}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}

          {/* Node Rectangles */}
          {years.map((year, yearIndex) =>
            yearNodes[year].map((node) => {
              const isHighlighted = node.target === "CTO/Engineering";
              const colors = targetColors[node.target];
              
              return (
                <g key={`${year}-${node.target}`}>
                  <rect
                    x={columnX[yearIndex] - 8}
                    y={node.y}
                    width={16}
                    height={Math.max(node.height - 4, 2)}
                    fill={colors.base}
                    stroke={isHighlighted ? "#001a4d" : "none"}
                    strokeWidth={isHighlighted ? 2 : 0}
                  />
                  {/* Value labels on the right of the last column */}
                  {yearIndex === years.length - 1 && (
                    <text
                      x={columnX[yearIndex] + 20}
                      y={node.y + (node.height - 4) / 2 + 4}
                      className="fill-foreground text-xs font-medium"
                      dominantBaseline="middle"
                    >
                      {node.target} ({node.value}%)
                    </text>
                  )}
                </g>
              );
            })
          )}

          {/* Source Label (CISO) */}
          <text
            x={padding.left - 50}
            y={padding.top + chartConfig.innerHeight / 2}
            textAnchor="middle"
            className="fill-foreground text-sm font-semibold"
            transform={`rotate(-90, ${padding.left - 50}, ${padding.top + chartConfig.innerHeight / 2})`}
          >
            CISO Reports To
          </text>
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute z-50 pointer-events-none bg-card border border-border shadow-lg p-4 min-w-[200px]"
            style={{
              left: Math.min(tooltip.x, width - 220),
              top: Math.max(tooltip.y, 10),
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-3 h-3"
                style={{ backgroundColor: targetColors[tooltip.target].base }}
              />
              <span className="font-semibold text-foreground">{tooltip.target}</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Year:</span>
                <span className="font-medium text-foreground">{tooltip.year}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Percentage:</span>
                <span className="font-medium text-foreground">{tooltip.value}%</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">YoY Change:</span>
                <span
                  className={cn(
                    "font-semibold",
                    tooltip.yoyChange > 0
                      ? "text-success"
                      : tooltip.yoyChange < 0
                      ? "text-destructive"
                      : "text-muted-foreground"
                  )}
                >
                  {tooltip.yoyChange > 0 ? "+" : ""}
                  {(tooltip.yoyChange * 2).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Reporting Lines
        </div>
        <div className="flex flex-wrap gap-4">
          {Object.entries(targetColors).map(([target, colors]) => (
            <div key={target} className="flex items-center gap-2">
              <div
                className="w-4 h-3"
                style={{ backgroundColor: colors.base }}
              />
              <span
                className={cn(
                  "text-sm",
                  target === "CTO/Engineering"
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {target}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Insight */}
      <div className="mt-6 p-4 bg-accent border-l-4 border-primary">
        <p className="text-sm text-foreground font-medium">
          {companyType === "private" ? (
            <>
              Private company CISOs show the strongest momentum toward CTO reporting with{" "}
              <span className="text-primary font-bold">+5%</span> year-over-year growth,
              signaling security's evolution from risk management to technical enablement.
            </>
          ) : (
            <>
              Public company CISOs maintain dual technical reporting with{" "}
              <span className="text-primary font-bold">32% CTO</span> and{" "}
              <span className="text-primary font-bold">34% CIO</span> lines,
              reflecting both engineering integration and traditional IT governance needs.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
