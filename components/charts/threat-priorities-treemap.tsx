"use client";

import { useState, useMemo } from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface ThreatData {
  name: string;
  value: number;
  description: string;
  fill: string;
}

const THREAT_DATA: ThreatData[] = [
  {
    name: "Third-party Risk",
    value: 43,
    description: "Supply chain vulnerabilities, vendor security gaps, and dependencies on external partners",
    fill: "#003087", // Primary royal blue - dominant
  },
  {
    name: "AI-enhanced Attacks",
    value: 22,
    description: "Sophisticated threats leveraging machine learning for evasion and automation",
    fill: "#0055c4", // Lighter blue
  },
  {
    name: "Cloud Misconfigurations",
    value: 15,
    description: "Security gaps from improper cloud infrastructure setup and access controls",
    fill: "#404040", // Dark gray
  },
  {
    name: "Insider Threats",
    value: 10,
    description: "Risks from employees, contractors, or partners with system access",
    fill: "#555555", // Darker gray for better contrast
  },
  {
    name: "Ransomware",
    value: 7,
    description: "Data encryption attacks demanding payment for restoration",
    fill: "#777777", // Darker gray for better contrast
  },
  {
    name: "Other Vectors",
    value: 3,
    description: "Phishing, social engineering, and emerging attack methods",
    fill: "#d4d4d4", // Lighter gray
  },
];

// Helper function to wrap labels into multiple lines for narrow boxes
const wrapLabel = (text: string, width: number): string[] => {
  const words = text.split(/[\s-]+/);

  // For wide boxes, return full text
  if (width >= 140 || words.length === 1) return [text];

  // For medium boxes, try to fit on one line with truncation
  if (width >= 100) {
    return [text.length > 14 ? text.slice(0, 12) + "..." : text];
  }

  // For narrow boxes (< 100), split into two lines if possible
  if (words.length >= 2) {
    const mid = Math.ceil(words.length / 2);
    return [
      words.slice(0, mid).join(" "),
      words.slice(mid).join(" ")
    ].filter(line => line.length > 0);
  }

  // Fallback: truncate single word
  return [text.length > 8 ? text.slice(0, 6) + "..." : text];
};

interface CustomContentProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  value?: number;
  fill?: string;
  depth?: number;
  index?: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isHovered?: boolean;
  prefersReducedMotion?: boolean;
}

const CustomTreemapContent = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  name,
  value,
  fill,
  depth,
  index,
  onMouseEnter,
  onMouseLeave,
  isHovered,
  prefersReducedMotion = false,
}: CustomContentProps) => {
  if (depth !== 1 || width < 1 || height < 1) return null;

  const showFullLabel = width > 70 && height > 50;
  const showValue = width > 40 && height > 35;
  const isLarge = width > 120 && height > 80;
  const isMedium = width > 80 && height > 60;
  const isDark = ["#003087", "#0055c4", "#404040", "#555555", "#777777", "#d4d4d4"].includes(fill || "");

  return (
    <g
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ cursor: "pointer" }}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke="#ffffff"
        strokeWidth={2}
        style={{
          transition: prefersReducedMotion ? "none" : "all 0.2s ease",
          filter: isHovered ? "brightness(1.15)" : "none",
          transform: isHovered ? `translate(${-1}px, ${-1}px)` : "none",
        }}
      />
      {showValue && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - (showFullLabel ? (isLarge ? 12 : isMedium ? 10 : 6) : 0)}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={isDark ? "#ffffff" : "#0a0a0a"}
            style={{
              fontSize: isLarge ? "1.75rem" : isMedium ? "1.25rem" : width > 60 ? "1rem" : "0.875rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              fontFamily: "Inter, Helvetica Neue, sans-serif",
            }}
          >
            {value}%
          </text>
          {showFullLabel && name && (() => {
            const lines = wrapLabel(name, width);
            const fontSize = isLarge ? "0.75rem" : isMedium ? "0.625rem" : "0.5rem";
            const lineHeight = isLarge ? 14 : isMedium ? 11 : 9;
            const baseY = y + height / 2 + (isLarge ? 16 : isMedium ? 12 : 8);
            // Adjust starting Y position for multi-line text
            const startY = lines.length > 1 ? baseY - lineHeight / 2 : baseY;

            return (
              <text
                x={x + width / 2}
                y={startY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isDark ? "rgba(255,255,255,0.85)" : "rgba(10,10,10,0.7)"}
                style={{
                  fontSize,
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                  fontFamily: "Inter, Helvetica Neue, sans-serif",
                }}
              >
                {lines.map((line, i) => (
                  <tspan
                    key={i}
                    x={x + width / 2}
                    dy={i === 0 ? 0 : lineHeight}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            );
          })()}
        </>
      )}
    </g>
  );
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ThreatData;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-card border border-border p-4 max-w-xs shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-3 h-3 flex-shrink-0"
          style={{ backgroundColor: data.fill }}
        />
        <span className="font-semibold text-foreground text-sm">{data.name}</span>
      </div>
      <div className="mb-2">
        <span className="text-2xl font-bold text-primary">{data.value}%</span>
        <span className="text-muted-foreground text-sm ml-1">of CISOs</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {data.description}
      </p>
    </div>
  );
};

interface ThreatPrioritiesTreemapProps {
  className?: string;
}

export function ThreatPrioritiesTreemap({ className }: ThreatPrioritiesTreemapProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const treemapData = useMemo(() => ({
    name: "threats",
    children: THREAT_DATA,
  }), []);

  return (
    <div className={cn("w-full", className)}>
      {/* Legend */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6" role="list" aria-label="Threat priorities legend">
        {THREAT_DATA.map((item, index) => (
          <button
            key={item.name}
            className={cn(
              "flex items-center gap-2 text-sm transition-opacity duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded px-1 py-0.5 -mx-1",
              hoveredIndex !== null && hoveredIndex !== index
                ? "opacity-40"
                : "opacity-100"
            )}
            onClick={() => setHoveredIndex(hoveredIndex === index ? null : index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            aria-label={`${item.name}: ${item.value}% of CISOs. ${item.description}`}
            aria-pressed={hoveredIndex === index}
            role="listitem"
          >
            <div
              className="w-3 h-3 flex-shrink-0"
              style={{ backgroundColor: item.fill }}
            />
            <span className="text-muted-foreground font-medium">
              {item.name}
            </span>
            <span className="text-foreground font-semibold">{item.value}%</span>
          </button>
        ))}
      </div>

      {/* Treemap Chart */}
      <div
        className="h-96 w-full"
        role="img"
        aria-label={`Threat priorities treemap showing: Third-party Risk ${THREAT_DATA[0].value}%, AI-enhanced Attacks ${THREAT_DATA[1].value}%, Cloud Misconfigurations ${THREAT_DATA[2].value}%, Insider Threats ${THREAT_DATA[3].value}%, Ransomware ${THREAT_DATA[4].value}%, Other Vectors ${THREAT_DATA[5].value}%. Hover or click legend items to highlight.`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={treemapData.children}
            dataKey="value"
            aspectRatio={4 / 3}
            stroke="#fff"
            content={({ x, y, width, height, name, value, fill, depth, index: itemIndex }) => (
              <CustomTreemapContent
                x={x}
                y={y}
                width={width}
                height={height}
                name={name}
                value={value}
                fill={fill}
                depth={depth}
                index={itemIndex}
                isHovered={hoveredIndex === itemIndex}
                onMouseEnter={() => setHoveredIndex(itemIndex ?? null)}
                onMouseLeave={() => setHoveredIndex(null)}
                prefersReducedMotion={prefersReducedMotion}
              />
            )}
          >
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
            />
          </Treemap>
        </ResponsiveContainer>
      </div>

      {/* Insight callout */}
      <div className="mt-6 border-l-4 border-primary bg-accent p-4">
        <p className="text-sm text-foreground font-medium">
          <span className="font-bold text-primary">Third-party risk</span> dominates 2026 priorities at {THREAT_DATA[0].value}%,
          nearly double AI-enhanced attacks ({THREAT_DATA[1].value}%). 
          This reflects growing supply chain complexity and recent high-profile vendor breaches.
        </p>
      </div>
    </div>
  );
}
