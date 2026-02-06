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

// All 22 CISO functional responsibilities by international percentage
const responsibilitiesData = [
  {
    name: "TPRM",
    percentage: 85,
    naPercentage: 41,
    gap: 44,
    fill: "#c0a8a8",
    description: "Third-party risk management - vendor security assessments, supply chain risk. Driven by GDPR, NIS2, and DORA regulatory requirements.",
  },
  {
    name: "Cloud Security",
    percentage: 80,
    naPercentage: 90,
    gap: -10,
    fill: "#7c9bb5",
    description: "AWS, Azure, GCP security architecture and governance",
  },
  {
    name: "Incident Response",
    percentage: 80,
    naPercentage: 93,
    gap: -13,
    fill: "#667b8f",
    description: "24/7 security event response, forensics, and incident management",
  },
  {
    name: "Corporate/IT Security",
    percentage: 75,
    naPercentage: 88,
    gap: -13,
    fill: "#87a58e",
    description: "Enterprise IT infrastructure, endpoint, and network security",
  },
  {
    name: "SecOps",
    percentage: 75,
    naPercentage: 89,
    gap: -14,
    fill: "#a8c5a0",
    description: "Security operations center, threat monitoring, and detection engineering",
  },
  {
    name: "IAM",
    percentage: 73,
    naPercentage: 77,
    gap: -4,
    fill: "#d9cf97",
    description: "Identity and access management - SSO, MFA, privileged access",
  },
  {
    name: "Privacy",
    percentage: 73,
    naPercentage: 58,
    gap: 15,
    fill: "#d4c684",
    description: "GDPR compliance, data protection, privacy engineering. Strong DPO (Data Protection Officer) integration in international markets.",
  },
  {
    name: "ProdSec/AppSec",
    percentage: 68,
    naPercentage: 74,
    gap: -6,
    fill: "#c9b8a0",
    description: "Application security, secure SDLC, product security reviews",
  },
  {
    name: "AI Data Protection",
    percentage: 65,
    naPercentage: 83,
    gap: -18,
    fill: "#e89f6f",
    description: "AI/ML data governance, model security, training data protection",
  },
  {
    name: "AI Threat Intel & IR",
    percentage: 55,
    naPercentage: 71,
    gap: -16,
    fill: "#9fa5a0",
    description: "AI-powered threat intelligence and incident response automation",
  },
  {
    name: "GRC",
    percentage: 53,
    naPercentage: 82,
    gap: -29,
    fill: "#e6b369",
    description: "Governance, risk, and compliance program management",
  },
  {
    name: "AI/ML SecEng",
    percentage: 38,
    naPercentage: 55,
    gap: -17,
    fill: "#88c7a8",
    description: "ML model security, adversarial testing, secure AI infrastructure",
  },
  {
    name: "Enterprise Risk",
    percentage: 38,
    naPercentage: 43,
    gap: -5,
    fill: "#6db3b8",
    description: "Enterprise-wide risk assessment and management",
  },
  {
    name: "Governance & Risk",
    percentage: 35,
    naPercentage: 67,
    gap: -32,
    fill: "#c7a3d4",
    description: "Risk governance frameworks and board reporting",
  },
  {
    name: "IT/BizApps",
    percentage: 30,
    naPercentage: 34,
    gap: -4,
    fill: "#b8ba5f",
    description: "Business application security - Salesforce, Workday, etc.",
  },
  {
    name: "Physical Security / Exec Protection",
    percentage: 28,
    naPercentage: 27,
    gap: 1,
    fill: "#9db85f",
    description: "Physical security controls and executive protection programs. Minimal regional variation.",
  },
  {
    name: "Infra Eng",
    percentage: 23,
    naPercentage: 23,
    gap: 0,
    fill: "#e6c163",
    description: "Infrastructure engineering and secure infrastructure design. Globally consistent responsibility.",
  },
  {
    name: "Post-Quantum Cryptography",
    percentage: 18,
    naPercentage: 23,
    gap: -5,
    fill: "#f2e063",
    description: "Quantum-resistant cryptography and post-quantum migration planning. Higher NA adoption.",
  },
  {
    name: "AI Safety & Reliability",
    percentage: 15,
    naPercentage: 32,
    gap: -17,
    fill: "#b3b3e6",
    description: "AI system safety and reliability engineering. NA leads due to larger AI development footprint.",
  },
  {
    name: "AI Ethics",
    percentage: 15,
    naPercentage: 30,
    gap: -15,
    fill: "#a8d4e0",
    description: "AI ethics frameworks and responsible AI governance. NA more mature in AI ethics programs.",
  },
  {
    name: "Fraud",
    percentage: 10,
    naPercentage: 18,
    gap: -8,
    fill: "#63a3a8",
    description: "Fraud detection and prevention programs. Often separate from CISO in international markets.",
  },
  {
    name: "Other",
    percentage: 5,
    naPercentage: 7,
    gap: -2,
    fill: "#b8b8b8",
    description: "Other specialized security functions and emerging responsibilities.",
  },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: typeof responsibilitiesData[0];
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const gapColor = data.gap > 0 ? "#059669" : "#d97706";
  const gapText = data.gap > 0 ? `+${data.gap}pp higher` : `${Math.abs(data.gap)}pp lower`;

  return (
    <div className="bg-card border border-border shadow-xl ring-1 ring-black/5 p-4 max-w-sm">
      <p className="text-sm font-semibold text-foreground mb-1">{data.name}</p>
      <p className="text-xs text-muted-foreground mb-3">{data.description}</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">International:</span>
          <span className="text-sm font-bold text-foreground">{data.percentage}%</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">North America:</span>
          <span className="text-sm font-bold text-foreground">{data.naPercentage}%</span>
        </div>
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Gap: <span className="font-semibold" style={{ color: gapColor }}>{gapText}</span> than NA
          </p>
        </div>
      </div>
    </div>
  );
}

export function InternationalResponsibilitiesChart({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const animationDuration = prefersReducedMotion ? 0 : (isVisible ? 800 : 0);

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
      {/* Chart Header */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          Functions Under International CISO Direct Responsibility
        </h4>
        <p className="text-xs text-muted-foreground/70">
          All 22 functions showing regulatory-driven priorities: TPRM (85%), Privacy (73%)
        </p>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="h-[700px] md:h-[880px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={responsibilitiesData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 180, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={false} vertical={true} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: "#525252" }}
              tickFormatter={(value) => `${value}%`}
              axisLine={{ stroke: "#e5e5e5" }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12, fill: "#525252", fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              width={170}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 48, 135, 0.04)" }} />

            <Bar
              dataKey="percentage"
              animationBegin={0}
              animationDuration={animationDuration}
              animationEasing="ease-out"
              maxBarSize={18}
              radius={[0, 4, 4, 0]}
            >
              {responsibilitiesData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  opacity={entry.gap > 10 ? 1 : 0.8}
                  stroke={entry.gap > 10 ? "#059669" : "none"}
                  strokeWidth={entry.gap > 10 ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="border-l-4 border-l-[#c0a8a8] bg-accent p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            TPRM (Third-Party Risk)
          </p>
          <p className="text-sm text-foreground font-medium">
            <span className="text-2xl font-bold text-[#c0a8a8]">85%</span> international vs{" "}
            <span className="text-xl font-bold text-muted-foreground">41%</span> NA
            <span className="block text-xs text-muted-foreground mt-2">
              +44pp gap driven by GDPR, NIS2, and DORA regulatory emphasis
            </span>
          </p>
        </div>
        <div className="border-l-4 border-l-[#d4c684] bg-accent p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Privacy
          </p>
          <p className="text-sm text-foreground font-medium">
            <span className="text-2xl font-bold text-[#d4c684]">73%</span> international vs{" "}
            <span className="text-xl font-bold text-muted-foreground">58%</span> NA
            <span className="block text-xs text-muted-foreground mt-2">
              +15pp gap reflecting GDPR enforcement and DPO reporting structures
            </span>
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="p-4 border border-border shadow-sm">
          <p className="text-2xl font-bold text-foreground">10</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Avg Functions Per CISO</p>
        </div>
        <div className="p-4 border border-border shadow-sm">
          <p className="text-2xl font-bold text-foreground">12</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">North America Avg</p>
        </div>
        <div className="p-4 border border-border shadow-sm border-l-4 border-l-[#c0a8a8]">
          <p className="text-2xl font-bold text-[#c0a8a8]">85%</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">TPRM Ownership</p>
        </div>
        <div className="p-4 border border-border shadow-sm border-l-4 border-l-[#d4c684]">
          <p className="text-2xl font-bold text-[#d4c684]">73%</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Privacy Ownership</p>
        </div>
      </div>
    </div>
  );
}
