import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn("mb-12", className)}>
      {eyebrow && (
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-primary mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="text-foreground mb-4">{title}</h2>
      {description && (
        <p className="text-lead max-w-3xl">{description}</p>
      )}
    </header>
  );
}

interface SubsectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function SubsectionHeader({
  title,
  description,
  className,
}: SubsectionHeaderProps) {
  return (
    <header className={cn("mb-6", className)}>
      <h3 className="text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </header>
  );
}
