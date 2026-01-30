"use client";

import React from "react"

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  GitBranch,
  Brain,
  Shield,
  Network,
  Users,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  X,
} from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface Imperative {
  id: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: React.ElementType;
  metric: {
    value: string;
    label: string;
    sentiment: "good" | "bad" | "warning" | "neutral";
  };
  implementationSteps: string[];
  relatedInsights: string[];
  priority: "critical" | "high" | "medium";
}

const imperatives: Imperative[] = [
  {
    id: 1,
    title: "Close the Compensation Gap",
    shortDescription:
      "The $128K public-private delta creates retention risk for private company CISOs.",
    fullDescription:
      "Private boards should benchmark equity grants against public comparables and implement cash bonus multipliers to offset liquidity differences. The widening compensation gap threatens talent retention and may force private companies to over-index on equity promises that may never materialize.",
    icon: DollarSign,
    metric: {
      value: "$128K",
      label: "Public-Private Compensation Gap",
      sentiment: "warning",
    },
    implementationSteps: [
      "Benchmark equity grants against public company comparables",
      "Implement cash bonus multipliers for liquidity offset",
      "Establish transparent compensation review cycles",
      "Create retention packages tied to company milestones",
    ],
    relatedInsights: [
      "Public CISOs average $814K total compensation",
      "Private CISOs average $686K total compensation",
      "Equity comprises 40%+ of public CISO packages",
    ],
    priority: "critical",
  },
  {
    id: 2,
    title: "Navigate CTO-Line Reporting",
    shortDescription:
      "With 30-32% of CISOs reporting to CTOs, security must demonstrate technical enablement value.",
    fullDescription:
      "Establish joint OKRs with engineering leadership, embed security in developer workflows, and measure security as platform capability, not overhead. The shift toward technical reporting lines requires CISOs to speak the language of engineering velocity and product delivery.",
    icon: GitBranch,
    metric: {
      value: "30-32%",
      label: "CTO/Engineering Reporting Dominance",
      sentiment: "neutral",
    },
    implementationSteps: [
      "Establish joint OKRs with engineering leadership",
      "Embed security champions in development teams",
      "Implement security as code in CI/CD pipelines",
      "Measure and report security as platform capability",
    ],
    relatedInsights: [
      "+5% YOY growth in private CISOs reporting to CTO",
      "CIO reporting remains at 22-34%",
      "CEO access drops to 3% at 10K+ employees",
    ],
    priority: "high",
  },
  {
    id: 3,
    title: "Mature AI Governance",
    shortDescription:
      "95%+ organizations lack mature AI governance frameworks despite accelerating adoption.",
    fullDescription:
      "Designate AI security ownership, implement shadow AI detection, establish vendor AI risk assessment criteria, and adopt baseline frameworks (NIST AI RMF minimum). The governance gap represents the most significant structural vulnerability facing CISOs in 2026.",
    icon: Brain,
    metric: {
      value: "95%+",
      label: "AI Governance Immaturity",
      sentiment: "bad",
    },
    implementationSteps: [
      "Designate dedicated AI security ownership",
      "Deploy shadow AI detection and monitoring",
      "Establish vendor AI risk assessment criteria",
      "Adopt NIST AI RMF as baseline framework",
      "Create AI-specific incident response playbooks",
    ],
    relatedInsights: [
      "Only 6% of private companies have AI security leaders",
      "24% cite shadow AI as top governance challenge",
      "85% lack confidence in technical assessment capability",
    ],
    priority: "critical",
  },
  {
    id: 4,
    title: "Secure Liability Protection",
    shortDescription:
      "36% of private company CISOs operate without any executive liability protection.",
    fullDescription:
      "Mandate combined D&O plus indemnification policies, and consider personal liability insurance for CISOs managing high-risk domains. Increasing regulatory scrutiny and personal liability exposure make this an existential requirement for security executives.",
    icon: Shield,
    metric: {
      value: "36%",
      label: "Private CISOs Without Protection",
      sentiment: "bad",
    },
    implementationSteps: [
      "Mandate combined D&O and indemnification policies",
      "Negotiate liability caps in employment agreements",
      "Consider personal liability insurance",
      "Document risk acceptance decisions formally",
    ],
    relatedInsights: [
      "Only 15% of private CISOs have comprehensive protection",
      "Public CISOs fare better at 20% unprotected",
      "25% have personal liability insurance",
    ],
    priority: "critical",
  },
  {
    id: 5,
    title: "Manage Third-Party Risk",
    shortDescription:
      "Third-party risk ranks as the #1 security priority for 43% of respondents.",
    fullDescription:
      "Modernize TPRM programs with continuous monitoring, automate vendor security assessments, and establish tiered risk frameworks that match vendor criticality to assessment rigor. Supply chain attacks and vendor compromises remain the most likely breach vector.",
    icon: Network,
    metric: {
      value: "43%",
      label: "Third-Party Risk as #1 Priority",
      sentiment: "warning",
    },
    implementationSteps: [
      "Implement continuous vendor monitoring",
      "Automate security questionnaire processes",
      "Establish tiered risk assessment frameworks",
      "Create vendor incident response protocols",
      "Build contractual security requirements",
    ],
    relatedInsights: [
      "AI-enhanced attacks rank #2 concern",
      "Cloud misconfigurations complete top 3",
      "19% cite AI TPRM as governance challenge",
    ],
    priority: "high",
  },
  {
    id: 6,
    title: "Develop NextGen Pipeline",
    shortDescription:
      "NextGen compensation growth outpacing CISO increases signals execution-layer talent scarcity.",
    fullDescription:
      "Invest in domain-specific leadership development, create clear CISO succession pathways, and structure NextGen equity packages to retain high-performers through exit events. The next generation of security leaders will determine organizational security posture for the next decade.",
    icon: Users,
    metric: {
      value: "YOY+",
      label: "NextGen Comp Outpacing CISO Growth",
      sentiment: "neutral",
    },
    implementationSteps: [
      "Create domain-specific leadership programs",
      "Establish clear CISO succession pathways",
      "Structure equity with retention vesting",
      "Provide board exposure opportunities",
      "Fund external leadership development",
    ],
    relatedInsights: [
      "NextGen leaders manage 12-35 direct reports",
      "Deputy CISOs bridge strategy and execution",
      "Public companies use equity-heavy retention",
    ],
    priority: "high",
  },
];

const priorityConfig = {
  critical: {
    label: "Critical",
    color: "bg-[#c41e3a]",
    textColor: "text-[#c41e3a]",
    borderColor: "border-[#c41e3a]",
  },
  high: {
    label: "High",
    color: "bg-[#d97706]",
    textColor: "text-[#d97706]",
    borderColor: "border-[#d97706]",
  },
  medium: {
    label: "Medium",
    color: "bg-[#003087]",
    textColor: "text-[#003087]",
    borderColor: "border-[#003087]",
  },
};

interface ImperativeCardProps {
  imperative: Imperative;
  isExpanded: boolean;
  onToggle: () => void;
  isVisible: boolean;
  index: number;
  prefersReducedMotion: boolean;
}

function ImperativeCard({
  imperative,
  isExpanded,
  onToggle,
  isVisible,
  index,
  prefersReducedMotion,
}: ImperativeCardProps) {
  const Icon = imperative.icon;
  const priority = priorityConfig[imperative.priority];
  const sentimentColors = {
    good: "text-[#059669] border-[#059669]",
    bad: "text-[#c41e3a] border-[#c41e3a]",
    warning: "text-[#d97706] border-[#d97706]",
    neutral: "text-[#003087] border-[#003087]",
  };

  return (
    <div
      className={cn(
        "bg-card border border-border transition-all overflow-hidden",
        prefersReducedMotion ? "duration-0" : "duration-500",
        isExpanded ? "col-span-1 md:col-span-2" : "",
        isVisible
          ? "opacity-100 translate-y-0"
          : prefersReducedMotion
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
      )}
      style={{
        transitionDelay: prefersReducedMotion ? "0ms" : `${index * 100}ms`,
      }}
    >
      {/* Card Header - Always Visible */}
      <button
        onClick={onToggle}
        className="w-full text-left p-6 cursor-pointer hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-start gap-4">
          {/* Number Badge */}
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary text-primary-foreground font-bold text-xl">
            {imperative.id}
          </div>

          <div className="flex-1 min-w-0">
            {/* Priority Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-white",
                  priority.color
                )}
              >
                {priority.label}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
              <Icon className="w-5 h-5 text-primary flex-shrink-0" />
              {imperative.title}
            </h3>

            {/* Short Description */}
            <p className="text-muted-foreground text-sm leading-relaxed">
              {imperative.shortDescription}
            </p>

            {/* Metric Preview */}
            <div className="mt-4 flex items-center gap-3">
              <span
                className={cn(
                  "text-2xl font-bold",
                  sentimentColors[imperative.metric.sentiment].split(" ")[0]
                )}
              >
                {imperative.metric.value}
              </span>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {imperative.metric.label}
              </span>
            </div>
          </div>

          {/* Expand/Collapse Icon */}
          <div
            className={cn(
              "flex-shrink-0 w-8 h-8 flex items-center justify-center transition-transform",
              prefersReducedMotion ? "duration-0" : "duration-300",
              isExpanded ? "rotate-180" : ""
            )}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      <div
        className={cn(
          "overflow-hidden transition-all",
          prefersReducedMotion ? "duration-0" : "duration-500",
          isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-6 pb-6 pt-2 border-t border-border">
          {/* Full Description */}
          <p className="text-foreground leading-relaxed mb-6">
            {imperative.fullDescription}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Implementation Steps */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Implementation Steps
              </h4>
              <ul className="space-y-2">
                {imperative.implementationSteps.map((step, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-muted text-xs font-medium">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Related Insights */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Related Data Points
              </h4>
              <ul className="space-y-2">
                {imperative.relatedInsights.map((insight, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm"
                  >
                    <AlertTriangle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProgressTrackerProps {
  imperatives: Imperative[];
  expandedId: number | null;
  onSelect: (id: number) => void;
}

function ProgressTracker({ imperatives, expandedId, onSelect }: ProgressTrackerProps) {
  return (
    <div className="hidden lg:flex flex-col gap-2 sticky top-32">
      <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-2">
        Roadmap Progress
      </h4>
      {imperatives.map((imp) => {
        const Icon = imp.icon;
        const isActive = expandedId === imp.id;
        const priority = priorityConfig[imp.priority];

        return (
          <button
            key={imp.id}
            onClick={() => onSelect(imp.id)}
            className={cn(
              "flex items-center gap-3 p-2 text-left transition-all duration-200 cursor-pointer",
              isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <span
              className={cn(
                "w-6 h-6 flex items-center justify-center text-xs font-bold",
                isActive ? "bg-white/20" : "bg-muted"
              )}
            >
              {imp.id}
            </span>
            <Icon className={cn("w-4 h-4", isActive ? "" : priority.textColor)} />
            <span className="text-sm font-medium truncate">{imp.title}</span>
          </button>
        );
      })}
    </div>
  );
}

export function StrategicImperativesRoadmap() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate cards in sequence
            imperatives.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => new Set([...prev, index]));
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleToggle = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const criticalCount = imperatives.filter((i) => i.priority === "critical").length;
  const highCount = imperatives.filter((i) => i.priority === "high").length;

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border p-4">
          <div className="text-3xl font-bold text-primary">{imperatives.length}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
            Strategic Imperatives
          </div>
        </div>
        <div className="bg-card border border-border p-4">
          <div className="text-3xl font-bold text-[#c41e3a]">{criticalCount}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
            Critical Priority
          </div>
        </div>
        <div className="bg-card border border-border p-4">
          <div className="text-3xl font-bold text-[#d97706]">{highCount}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
            High Priority
          </div>
        </div>
        <div className="bg-card border border-border p-4">
          <div className="text-3xl font-bold text-[#003087]">2026</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
            Target Year
          </div>
        </div>
      </div>

      {/* Main Grid with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Progress Tracker Sidebar */}
        <div className="lg:col-span-3">
          <ProgressTracker
            imperatives={imperatives}
            expandedId={expandedId}
            onSelect={handleToggle}
          />
        </div>

        {/* Cards Grid */}
        <div className="lg:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {imperatives.map((imperative, index) => (
              <ImperativeCard
                key={imperative.id}
                imperative={imperative}
                isExpanded={expandedId === imperative.id}
                onToggle={() => handleToggle(imperative.id)}
                isVisible={visibleCards.has(index)}
                index={index}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary text-primary-foreground p-8 mt-12">
        <div className="max-w-2xl">
          <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/70 mb-4">
            Key Insight
          </h4>
          <p className="text-lg font-medium leading-relaxed text-white">
            Organizations face converging pressures: compensation inflation, AI governance
            immaturity, liability exposure gaps, and third-party risk concentration.
            Success requires parallel investment in NextGen talent development and
            structural security program maturity.
          </p>
        </div>
      </div>
    </div>
  );
}
