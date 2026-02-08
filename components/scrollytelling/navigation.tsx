"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: "about", label: "About" },
  { id: "executive-summary", label: "Summary" },
  { id: "compensation", label: "Compensation" },
  { id: "reporting-structure", label: "Reporting" },
  { id: "liability-protection", label: "Liability" },
  { id: "team-dynamics", label: "Teams" },
  { id: "functional-responsibilities", label: "Responsibilities" },
  { id: "ai-governance", label: "AI" },
  { id: "threat-landscape", label: "Threats" },
  { id: "nextgen-leaders", label: "NextGen" },
  { id: "international", label: "International" },
  { id: "recommendations", label: "Strategy" },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Find active section
      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-sm border-b border-border"
          : "bg-transparent"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1" role="list">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "px-3 py-2 text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded",
                  activeSection === item.id
                    ? isScrolled
                      ? "text-primary"
                      : "text-white"
                    : isScrolled
                      ? "text-muted-foreground hover:text-foreground"
                      : "text-white/70 hover:text-white"
                )}
                aria-label={`Navigate to ${item.label} section`}
                aria-current={activeSection === item.id ? "page" : undefined}
                role="listitem"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button - RIGHT SIDE */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "lg:hidden p-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded",
              isScrolled ? "text-foreground" : "text-white"
            )}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="lg:hidden pb-4 border-t border-border/50 bg-background"
            role="menu"
            aria-label="Mobile navigation menu"
          >
            <div className="flex flex-col pt-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "px-4 py-3 text-sm font-medium text-left transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset",
                    activeSection === item.id
                      ? "text-primary bg-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  role="menuitem"
                  aria-label={`Navigate to ${item.label} section`}
                  aria-current={activeSection === item.id ? "page" : undefined}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
