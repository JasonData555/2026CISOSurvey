"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "primary" | "muted";
}

export function SectionWrapper({
  id,
  children,
  className,
  variant = "default",
}: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.05 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const variantStyles = {
    default: "bg-background",
    primary: "bg-primary text-primary-foreground",
    muted: "bg-muted",
  };

  return (
    <section
      id={id}
      ref={ref}
      className={cn(
        "min-h-screen py-20 md:py-32",
        variantStyles[variant],
        className
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-6xl px-6 md:px-8 transition-all",
          prefersReducedMotion ? "duration-0" : "duration-700",
          isVisible
            ? "opacity-100 translate-y-0"
            : prefersReducedMotion
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
        )}
      >
        {children}
      </div>
    </section>
  );
}

interface ContentRowProps {
  children: ReactNode;
  className?: string;
}

export function ContentRow({ children, className }: ContentRowProps) {
  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12", className)}>
      {children}
    </div>
  );
}

interface PrimaryColumnProps {
  children: ReactNode;
  className?: string;
}

export function PrimaryColumn({ children, className }: PrimaryColumnProps) {
  return (
    <div className={cn("lg:col-span-8 space-y-6", className)}>
      {children}
    </div>
  );
}

interface SidebarColumnProps {
  children: ReactNode;
  className?: string;
}

export function SidebarColumn({ children, className }: SidebarColumnProps) {
  return (
    <div className={cn("lg:col-span-4 space-y-4", className)}>
      {children}
    </div>
  );
}
