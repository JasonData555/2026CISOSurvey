"use client";

import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface FunctionData {
  name: string;
  percentage: number;
  category: string;
  description: string;
  fill: string;
}

const FUNCTION_DATA: FunctionData[] = [
  {
    name: "Incident Response",
    percentage: 93,
    category: "operational",
    fill: "#667b8f",
    description: "24/7 security event response, forensics, and incident management"
  },
  {
    name: "Cloud Security",
    percentage: 90,
    category: "operational",
    fill: "#7c9bb5",
    description: "Multi-cloud security architecture, controls, and compliance"
  },
  {
    name: "SecOps",
    percentage: 89,
    category: "operational",
    fill: "#a8c5a0",
    description: "Security operations center, monitoring, and threat detection"
  },
  {
    name: "IT",
    percentage: 88,
    category: "operational",
    fill: "#87a58e",
    description: "Enterprise IT security, endpoint protection, and network security"
  },
  {
    name: "Privacy",
    percentage: 85,
    category: "risk-compliance",
    fill: "#d4c684",
    description: "Data privacy, GDPR/CCPA compliance, and privacy engineering"
  },
  {
    name: "AI Data Protection",
    percentage: 83,
    category: "ai-security",
    fill: "#e89f6f",
    description: "Securing AI training data, model protection, and AI data governance"
  },
  {
    name: "GRC",
    percentage: 82,
    category: "risk-compliance",
    fill: "#e6b369",
    description: "Governance, risk management, and compliance programs"
  },
  {
    name: "TPRM",
    percentage: 82,
    category: "risk-compliance",
    fill: "#c0a8a8",
    description: "Third-party risk management and vendor security assessments"
  },
  {
    name: "IAM",
    percentage: 77,
    category: "infrastructure",
    fill: "#d9cf97",
    description: "Identity and access management, authentication, and authorization"
  },
  {
    name: "ProdSec / AppSec",
    percentage: 74,
    category: "operational",
    fill: "#c9b8a0",
    description: "Product security, application security, and secure development"
  },
  {
    name: "AI Threat Intel & IR",
    percentage: 71,
    category: "ai-security",
    fill: "#9fa5a0",
    description: "AI-powered threat intelligence and AI-specific incident response"
  },
  {
    name: "Governance & Risk",
    percentage: 67,
    category: "risk-compliance",
    fill: "#c7a3d4",
    description: "Enterprise risk governance and strategic risk management"
  },
  {
    name: "AI / ML SecEng",
    percentage: 55,
    category: "ai-security",
    fill: "#88c7a8",
    description: "AI/ML security engineering and adversarial ML defense"
  },
  {
    name: "Enterprise Risk",
    percentage: 43,
    category: "risk-compliance",
    fill: "#6db3b8",
    description: "Enterprise-wide risk assessment and business continuity"
  },
  {
    name: "Business Applications",
    percentage: 34,
    category: "infrastructure",
    fill: "#b8ba5f",
    description: "IT operations and business application security"
  },
  {
    name: "AI Safety & Reliability",
    percentage: 32,
    category: "ai-security",
    fill: "#b3b3e6",
    description: "AI system safety, reliability engineering, and fault tolerance"
  },
  {
    name: "AI Ethics",
    percentage: 30,
    category: "ai-security",
    fill: "#a8d4e0",
    description: "AI ethics frameworks, fairness, and responsible AI governance"
  },
  {
    name: "Physical Security / Exec Protection",
    percentage: 27,
    category: "other",
    fill: "#9db85f",
    description: "Physical security controls and executive protection programs"
  },
  {
    name: "Post-Quantum Cryptography",
    percentage: 23,
    category: "emerging",
    fill: "#f2e063",
    description: "Quantum-resistant cryptography and post-quantum migration"
  },
  {
    name: "Infra Eng",
    percentage: 23,
    category: "infrastructure",
    fill: "#e6c163",
    description: "Infrastructure engineering and secure infrastructure design"
  },
  {
    name: "Fraud",
    percentage: 18,
    category: "other",
    fill: "#63a3a8",
    description: "Fraud detection, prevention, and investigation programs"
  },
  {
    name: "Other",
    percentage: 7,
    category: "other",
    fill: "#b8b8b8",
    description: "Other specialized security functions and emerging responsibilities"
  },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: FunctionData;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-card border border-border shadow-xl ring-1 ring-black/5 p-4 max-w-xs">
      <p className="font-semibold text-foreground mb-1">{data.name}</p>
      <p className="text-2xl font-bold text-primary mb-2">{data.percentage}%</p>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {data.description}
      </p>
    </div>
  );
};

interface FunctionalResponsibilitiesChartProps {
  className?: string;
}

export function FunctionalResponsibilitiesChart({ className }: FunctionalResponsibilitiesChartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Intersection observer for animation trigger
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
      <ResponsiveContainer width="100%" height={700}>
        <BarChart
          data={FUNCTION_DATA}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 180, bottom: 5 }}
        >
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            stroke="#737373"
            style={{ fontSize: '13px' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={170}
            stroke="#737373"
            tick={{ fontSize: 13 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 48, 135, 0.05)" }} />
          <Bar
            dataKey="percentage"
            radius={[0, 4, 4, 0]}
            animationBegin={0}
            animationDuration={prefersReducedMotion ? 0 : 800}
            animationEasing="ease-out"
            isAnimationActive={isVisible}
          >
            {FUNCTION_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
