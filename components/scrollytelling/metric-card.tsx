"use client";

import React from "react"

import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

type Sentiment = "good" | "bad" | "warning" | "neutral";

interface MetricCardProps {
  value: string;
  label: string;
  sentiment?: Sentiment;
  className?: string;
}

export function MetricCard({
  value,
  label,
  sentiment = "neutral",
  className,
}: MetricCardProps) {
  const sentimentStyles: Record<Sentiment, string> = {
    good: "",
    bad: "",
    warning: "",
    neutral: "",
  };

  const sentimentValueColor: Record<Sentiment, string> = {
    good: "text-[#059669]",
    bad: "text-[#c41e3a]",
    warning: "text-[#d97706]",
    neutral: "text-[#003087]",
  };

  const SentimentIcon = {
    good: ArrowUp,
    bad: ArrowDown,
    warning: Minus,
    neutral: null,
  }[sentiment];

  return (
    <div
      className={cn(
        "bg-card p-6 border border-border transition-all duration-200 hover:border-primary",
        sentimentStyles[sentiment],
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={cn("metric-value", sentimentValueColor[sentiment])}>
          {value}
        </span>
        {SentimentIcon && (
          <SentimentIcon
            className={cn("w-5 h-5 mt-2", sentimentValueColor[sentiment])}
          />
        )}
      </div>
      <p className="metric-label mt-3">{label}</p>
    </div>
  );
}

interface StatGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4 | 6;
  className?: string;
}

export function StatGrid({ children, columns = 3, className }: StatGridProps) {
  const colStyles = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  };

  return (
    <div className={cn("grid gap-4", colStyles[columns], className)}>
      {children}
    </div>
  );
}
