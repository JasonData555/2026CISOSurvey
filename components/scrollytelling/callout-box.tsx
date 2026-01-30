import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CalloutBoxProps {
  children: ReactNode;
  variant?: "default" | "insight" | "warning";
  className?: string;
}

export function CalloutBox({
  children,
  variant = "default",
  className,
}: CalloutBoxProps) {
  const variantStyles = {
    default: "bg-accent border-l-primary",
    insight: "bg-[#003087]/5 border-l-[#003087]",
    warning: "bg-[#d97706]/5 border-l-[#d97706]",
  };

  return (
    <div
      className={cn(
        "border-l-4 p-6 my-8",
        variantStyles[variant],
        className
      )}
    >
      <div className="text-foreground font-medium leading-relaxed">
        {children}
      </div>
    </div>
  );
}

interface KeyTakeawayProps {
  items: string[];
  title?: string;
  className?: string;
}

export function KeyTakeaways({
  items,
  title = "Key Takeaways",
  className,
}: KeyTakeawayProps) {
  return (
    <div
      className={cn(
        "bg-[#003087] text-white p-8 my-8",
        className
      )}
    >
      <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/70 mb-4">
        {title}
      </h4>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-xs font-bold bg-white/10">
              {index + 1}
            </span>
            <span className="text-white/90 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
