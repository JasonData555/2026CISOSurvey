# CISO Leadership Survey 2026 - Project Guide

## Project Overview

**Purpose**: Interactive data-driven presentation of the 2026 Global CISO Leadership Survey results
**Audience**: CISOs, VCs, Board Members, Private Equity Partners, Security Executives
**Deployment**: Live on Vercel with automatic deployments from GitHub
**Repository**: https://github.com/JasonData555/2026CISOSurvey

### Survey Context
- **Sample Size**: 625+ information security executives
- **Collection Period**: Q4 2025 – Q1 2026
- **Geographic Focus**: North America (with global comparison data)
- **Key Themes**: Compensation, Reporting Structures, Team Dynamics, AI Governance, Threat Landscape

---

## Technical Stack

### Core Framework
- **Next.js**: 16.1.6 (with Turbopack)
- **React**: 19.2.0
- **TypeScript**: ^5

### UI Libraries
- **Radix UI**: Complete component primitives (Accordion, Dialog, Slider, Toast, etc.)
- **Tailwind CSS**: v4.1.9 (latest version with native CSS layer support)
- **Lucide React**: Icon library (^0.454.0)
- **class-variance-authority**: Component variant management

### Data Visualization
- **Recharts**: 2.15.4 (all charts except custom Sankey)
- **Custom SVG**: Sankey diagram (reporting-structure-sankey.tsx)

### Analytics & Performance
- **Vercel Analytics**: 1.3.1 (integrated in app/layout.tsx)
- **next-themes**: Dark/light mode support (^0.4.6)

### Key Dependencies
```json
{
  "recharts": "2.15.4",           // Data visualization
  "lucide-react": "^0.454.0",     // Icons
  "tailwind-merge": "^3.3.1",     // className utility
  "class-variance-authority": "^0.7.1", // Component variants
  "@vercel/analytics": "1.3.1"    // Analytics
}
```

---

## Design System

### 🎨 Visual Identity: Swiss Modernism

**Core Principles**:
1. **Clarity over decoration**: Prioritize readability and information hierarchy
2. **Grid-based layouts**: Use Next.js responsive grid (ContentRow, PrimaryColumn, SidebarColumn)
3. **Generous whitespace**: Section padding, consistent spacing scale
4. **Typography as primary visual element**: No decorative graphics beyond data visualization
5. **Functional color usage**: Color conveys meaning (sentiment, data relationships)

### Color Palette

#### Primary Colors
```css
/* Royal Blue - Primary brand color */
--primary: #003087
--primary-light: #0055c4
--primary-foreground: #ffffff

/* Usage: CTAs, chart accents, interactive states, key metrics */
```

#### Neutral Grays
```css
--foreground: #0a0a0a          /* Body text */
--muted-foreground: #525252    /* Secondary text, labels */
--muted: #f5f5f5               /* Backgrounds, subtle highlights */
--border: #e5e5e5              /* Dividers, chart axes */
--card: #ffffff                /* Card backgrounds */
--background: #ffffff          /* Page background */

/* Gray Scale (for charts) */
#404040  /* Dark gray - high contrast data */
#555555  /* Medium-dark gray - WCAG AA compliant */
#737373  /* Medium gray - secondary data */
#a3a3a3  /* Light gray - tertiary data */
#c4c4c4  /* Very light gray - minimal emphasis */
#e0e0e0  /* Lightest gray - background elements */
```

#### Sentiment Colors
```css
--good: #16a34a       /* Positive metrics (green) */
--warning: #ea580c    /* Warning metrics (orange) */
--bad: #dc2626        /* Negative metrics (red) */
--neutral: #525252    /* Neutral metrics (gray) */
```

**CRITICAL**: Do NOT change the base color palette. When adding new chart colors, use existing palette values or extend within the same hue families.

### Typography

#### Font Family
```css
font-family: Inter, system-ui, -apple-system, sans-serif;
```

**Inter** provides excellent readability at small sizes and professional appearance for executive audiences.

#### Type Scale (Using `clamp()` for Fluid Sizing)

```css
/* Headings */
.text-6xl  → clamp(3rem, 5vw, 4rem)      /* Hero titles */
.text-5xl  → clamp(2.5rem, 4vw, 3rem)    /* Section titles */
.text-4xl  → clamp(2rem, 3vw, 2.5rem)    /* Subsection titles */
.text-3xl  → clamp(1.5rem, 2vw, 2rem)    /* Card titles */
.text-2xl  → clamp(1.25rem, 1.5vw, 1.5rem) /* Metric values */
.text-xl   → clamp(1.125rem, 1.2vw, 1.25rem) /* Labels */

/* Body Text */
.text-base → 1rem (16px)                 /* Standard body text */
.text-sm   → 0.875rem (14px)             /* Secondary text */
.text-xs   → 0.75rem (12px)              /* Labels, captions */

/* Special Classes */
.text-lead → 1.125rem (18px), leading-relaxed  /* Intro paragraphs */
```

#### Font Weights
```css
font-weight: 400  /* Regular - body text */
font-weight: 500  /* Medium - labels, UI elements */
font-weight: 600  /* Semibold - subsection headers */
font-weight: 700  /* Bold - section headers, metrics */
```

#### Line Height Standards
```css
.leading-tight     → 1.1     /* Large display numbers */
.leading-normal    → 1.5     /* Body text */
.leading-relaxed   → 1.625   /* Readable paragraphs */
```

### Spacing Scale

Consistent spacing using Tailwind's default 4px base scale:

```css
/* Padding/Margin Values */
p-2  → 0.5rem (8px)    /* Tight spacing */
p-4  → 1rem (16px)     /* Standard spacing */
p-6  → 1.5rem (24px)   /* Card/component padding */
p-8  → 2rem (32px)     /* Section padding (mobile) */
p-12 → 3rem (48px)     /* Section padding (desktop) */
p-16 → 4rem (64px)     /* Major section spacing */

/* Gaps */
gap-2  → 8px   /* Tight element spacing */
gap-4  → 16px  /* Standard element spacing */
gap-6  → 24px  /* Component spacing */
gap-8  → 32px  /* Section spacing */
```

### Component Styling Patterns

#### Cards
```tsx
className="bg-card border border-border p-6 shadow-sm"
```

#### Section Wrappers
```tsx
<SectionWrapper variant="default">  {/* White background */}
<SectionWrapper variant="muted">    {/* Light gray background */}
```

#### Interactive States
```tsx
// Hover states
"hover:bg-muted hover:text-foreground transition-colors duration-200"

// Focus states (accessibility)
"focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"

// Active states
"aria-pressed={isActive}"
"bg-primary text-primary-foreground" // Active
"bg-muted text-muted-foreground"     // Inactive
```

---

## File Structure

### Directory Organization

```
/app
  ├── layout.tsx              # Root layout with Analytics
  ├── page.tsx                # Main presentation page (8 sections)
  ├── globals.css             # Tailwind imports, custom CSS
  └── fonts/                  # Font files (if self-hosted)

/components
  ├── ui/                     # Radix UI primitives (DO NOT EDIT)
  │   ├── button.tsx
  │   ├── slider.tsx
  │   ├── accordion.tsx
  │   └── ...
  │
  ├── charts/                 # Reusable chart components
  │   └── threat-priorities-treemap.tsx
  │
  └── scrollytelling/         # Section-specific components
      ├── navigation.tsx                         # Fixed nav bar
      ├── hero-section.tsx                       # Landing hero
      ├── section-wrapper.tsx                    # Layout containers
      ├── section-header.tsx                     # Section titles
      ├── metric-card.tsx                        # Stat cards
      ├── callout-box.tsx                        # Insight boxes
      ├── footer.tsx                             # Footer
      │
      # Chart Components (22 total)
      ├── compensation-comparison-chart.tsx      # Section 01
      ├── industry-compensation-chart.tsx
      ├── signing-bonus-chart.tsx
      ├── reporting-structure-sankey.tsx         # Section 02
      ├── ceo-reporting-slope-chart.tsx
      ├── team-size-scaling-curve.tsx            # Section 03
      ├── functional-responsibilities-chart.tsx  # Section 04
      ├── ai-security-leadership-chart.tsx       # Section 05
      ├── confidence-meter-visualization.tsx
      ├── ai-governance-challenges-chart.tsx
      ├── threat-priorities-treemap.tsx          # Section 06
      ├── budget-justification-chart.tsx
      ├── nextgen-vs-ciso-compensation-chart.tsx # Section 07
      ├── nextgen-team-size-chart.tsx
      └── strategic-imperatives-roadmap.tsx      # Section 08

/hooks
  └── use-reduced-motion.tsx  # Accessibility hook for animations

/lib
  └── utils.ts                # cn() utility for className merging

/public
  └── (static assets if needed)
```

### Key File Purposes

**app/page.tsx** (430 lines)
- **Purpose**: Main presentation orchestration
- **Structure**: 8 sections (Executive Summary → Recommendations)
- **Pattern**: SectionWrapper > SectionHeader > ContentRow > Charts + Sidebar
- **IMPORTANT**: This is where all textual content lives

**components/scrollytelling/section-wrapper.tsx**
- **Purpose**: Consistent section layouts and spacing
- **Exports**: SectionWrapper, ContentRow, PrimaryColumn, SidebarColumn
- **Variants**: `default` (white bg), `muted` (gray bg)

**components/scrollytelling/section-header.tsx**
- **Purpose**: Section titles and descriptions
- **Pattern**: Eyebrow (small label) → Title (large) → Description (paragraph)

**components/scrollytelling/metric-card.tsx**
- **Purpose**: Stat cards with sentiment colors
- **Variants**: `good`, `warning`, `bad`, `neutral`
- **Layout**: Large number + label + optional sentiment icon

---

## UX/UI Consistency Guidelines

### Making Textual Changes

When updating content in **app/page.tsx**, follow these strict rules:

#### 1. Section Headers

**Pattern to Maintain**:
```tsx
<SectionHeader
  eyebrow="Section 01"           // Sequential numbering
  title="Two to Four Words"      // Short, punchy
  description="One clear sentence explaining the section's insight." // 15-25 words
/>
```

**Rules**:
- **Eyebrow**: Always use "Section XX" format (01-08)
- **Title**: Keep under 5 words, avoid jargon
- **Description**: Single sentence, 15-25 words, focus on the "so what"

#### 2. Subsection Headers

**Pattern to Maintain**:
```tsx
<SubsectionHeader
  title="Descriptive Chart Title"           // 3-6 words
  description="What this chart reveals."    // 10-15 words
/>
```

**Rules**:
- **Title**: Describe WHAT the chart shows
- **Description**: Explain WHY it matters

#### 3. Metric Cards

**Pattern to Maintain**:
```tsx
<MetricCard
  value="$128K"              // Number + unit
  label="Gap Description"    // 2-5 words
  sentiment="warning"        // good | warning | bad | neutral
/>
```

**Rules**:
- **Value**: Always include units ($, %, K, +, -)
- **Label**: Concise noun phrase, no verbs
- **Sentiment**: Must match data implication
  - `good`: Positive outcome (high confidence, strong protection)
  - `warning`: Concerning trend (gaps, risks, declines)
  - `bad`: Critical issue (low adoption, high vulnerability)
  - `neutral`: Factual data point (neither good nor bad)

#### 4. Callout Boxes

**Pattern to Maintain**:
```tsx
<CalloutBox variant="insight">
  Single focused insight. Keep to 20-35 words. One idea per box.
</CalloutBox>
```

**Variants**:
- `insight`: Default (blue accent) - Key findings, actionable insights
- `warning`: Orange accent - Risks, gaps, concerns
- `default`: Gray accent - Contextual information

**Rules**:
- One insight per box (don't combine multiple ideas)
- Use active voice
- Keep under 40 words
- End with period (not exclamation points unless truly exceptional)

#### 5. Body Text Paragraphs

**Pattern to Maintain**:
```tsx
<p className="text-muted-foreground leading-relaxed">
  Paragraph text here. 2-4 sentences maximum. Use <strong>bold</strong>
  for key terms only (1-2 per paragraph).
</p>
```

**Rules**:
- **className**: Always use `text-muted-foreground leading-relaxed`
- **Length**: 2-4 sentences (40-80 words)
- **Bold**: Reserve `<strong>` for critical terms (no more than 2 per paragraph)
- **Tone**: Professional, data-driven, avoid hyperbole

#### 6. Intro Paragraphs (`.text-lead`)

**Pattern to Maintain**:
```tsx
<p className="text-lead max-w-3xl">
  Opening paragraph that sets context for the section. Slightly longer
  than body text, but still concise.
</p>
```

**Rules**:
- Only use at the START of major sections
- 2-3 sentences (50-80 words)
- Sets the stage for data that follows

### Typography Hierarchy Rules

**DO**:
```tsx
// Correct hierarchy
<SectionHeader title="Major Finding" />         // text-5xl, bold
<SubsectionHeader title="Chart Title" />        // text-2xl, semibold
<p className="text-base">Body text</p>          // text-base, regular
```

**DON'T**:
```tsx
// WRONG - Inconsistent sizing
<h2 className="text-3xl">Section Title</h2>     // Use SectionHeader instead
<p className="text-lg font-bold">Body</p>       // Don't bold body text
```

### Color Usage Rules

**DO**:
```tsx
// Correct color application
<MetricCard sentiment="warning" />              // Sentiment colors
<span className="text-primary">Key stat</span> // Primary blue for emphasis
<div className="bg-muted">Background</div>      // Muted gray for containers
```

**DON'T**:
```tsx
// WRONG - Arbitrary colors
<span className="text-red-600">Warning</span>   // Use sentiment="warning" instead
<div className="bg-blue-100">Card</div>         // Use bg-card or bg-muted
```

### Spacing Consistency

**DO**:
```tsx
// Correct spacing patterns
<ContentRow className="mb-16">                  // 64px bottom margin between subsections
<div className="space-y-6">                     // 24px vertical spacing within components
<div className="p-6">                           // 24px padding for cards
```

**DON'T**:
```tsx
// WRONG - Inconsistent spacing
<ContentRow className="mb-8">                   // Use mb-16 for section spacing
<div className="p-3">                           // Use p-4 or p-6 for padding
```

---

## Component Patterns

### Chart Component Structure

All chart components follow this standard pattern:

```tsx
"use client"; // Required for client-side interactivity

import { useState, useCallback, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface DataPoint {
  category: string;
  value: number;
  // ... other fields
}

const chartData: DataPoint[] = [
  { category: "Item 1", value: 100 },
  { category: "Item 2", value: 200 },
  // Data is HARDCODED in components
];

export function ChartName() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="w-full space-y-4">
      <ResponsiveContainer width="100%" height={384}>
        <BarChart data={chartData}>
          <XAxis
            dataKey="category"
            tick={{ fill: "#525252", fontSize: 12 }}
            axisLine={{ stroke: "#e5e5e5" }}
          />
          <YAxis
            tick={{ fill: "#525252", fontSize: 12 }}
            axisLine={{ stroke: "#e5e5e5" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="value"
            fill="#003087"
            animationDuration={prefersReducedMotion ? 0 : 800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### Animation Standards

**Timing**:
```typescript
// Standard animation durations
const durations = {
  bars: prefersReducedMotion ? 0 : 800,      // Bar charts
  areas: prefersReducedMotion ? 0 : 1000,    // Area charts
  pies: prefersReducedMotion ? 0 : 1200,     // Pie charts
  transitions: prefersReducedMotion ? 0 : 200 // UI state changes
};
```

**Easing**:
```css
transition: all 0.3s ease-out;   /* UI transitions */
animationEasing="ease-out"       /* Recharts animations */
```

**Motion Preferences** (CRITICAL for Accessibility):
```tsx
const prefersReducedMotion = useReducedMotion();

// Always respect user motion preferences
<AreaChart
  data={data}
  animationDuration={prefersReducedMotion ? 0 : 1000}
/>
```

### Interactive Patterns

**Hover States**:
```tsx
// Mouse hover
onMouseEnter={() => setActiveIndex(index)}
onMouseLeave={() => setActiveIndex(null)}

// Conditional styling based on active state
className={cn(
  "transition-colors duration-200",
  isActive ? "text-primary" : "text-muted-foreground"
)}
```

**Keyboard Navigation** (WCAG Requirement):
```tsx
// All interactive charts MUST support keyboard
<div
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === "ArrowRight") setActiveIndex((prev) => (prev + 1) % data.length);
    if (e.key === "ArrowLeft") setActiveIndex((prev) => (prev - 1 + data.length) % data.length);
    if (e.key === "Enter") handleSelect(activeIndex);
    if (e.key === "Escape") setActiveIndex(null);
  }}
  aria-label="Chart description. Use arrow keys to navigate."
>
```

### Recharts Axis Styling (Standard)

**Consistent axis styling across all charts**:
```tsx
<XAxis
  dataKey="category"
  tick={{ fill: "#525252", fontSize: 12, fontWeight: 500 }}
  axisLine={{ stroke: "#e5e5e5" }}
  tickLine={{ stroke: "#e5e5e5" }}
/>

<YAxis
  tick={{ fill: "#525252", fontSize: 12 }}
  axisLine={{ stroke: "#e5e5e5" }}
  tickLine={{ stroke: "#e5e5e5" }}
  tickFormatter={(value) => value.toLocaleString()} // Add thousands separators
/>
```

### Custom Tooltip Pattern

```tsx
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: DataPoint }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-card border border-border p-4 shadow-lg min-w-[200px]">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
        {data.category}
      </p>
      <p className="text-2xl font-bold text-primary">{data.value}</p>
      <p className="text-sm text-muted-foreground">{data.label}</p>
    </div>
  );
}
```

---

## Accessibility Standards (WCAG 2.1 Level AA)

### Completed Accessibility Improvements (Phase 1)

✅ **Motion Preferences**
- All animations respect `prefers-reduced-motion`
- Use `useReducedMotion()` hook in all chart components

✅ **Keyboard Navigation**
- All interactive charts support arrow key navigation
- Focus states visible on all interactive elements
- Tab order follows logical reading order

✅ **ARIA Labels**
- All charts have descriptive `aria-label` attributes
- Interactive buttons have `aria-pressed` states
- Navigation uses `aria-current="page"`

✅ **Color Contrast**
- All text meets WCAG AA contrast ratios (4.5:1 for body text, 3:1 for large text)
- Chart colors updated: #737373 → #555555, #a3a3a3 → #777777
- Treemap uses high-contrast colors for readability

### Accessibility Checklist for New Components

When creating new components, ensure:

- [ ] `"use client"` directive for client-side interactivity
- [ ] Import and use `useReducedMotion()` hook
- [ ] All animations have `duration: prefersReducedMotion ? 0 : <ms>`
- [ ] Interactive elements have `tabIndex={0}`
- [ ] Keyboard handlers for ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Enter, Escape
- [ ] `aria-label` on all charts describing the data
- [ ] `aria-pressed={isActive}` on toggle buttons
- [ ] Focus states: `focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`
- [ ] Color contrast verified with WAVE or similar tool
- [ ] Touch targets minimum 44x44px on mobile

---

## Data Update Procedures

### Where Data Lives

**All data is hardcoded in chart components**. There is no external API or database.

Example from `team-size-scaling-curve.tsx`:
```typescript
const teamSizeData: TeamSizeData[] = [
  {
    companySize: "<500",
    employees: "Under 500",
    teamSize: 12,
    phase: "Startup Mode",
    phaseDescription: "Lean teams, generalist security roles...",
    index: 0,
  },
  // ... more data points
];
```

### How to Update Data

1. **Locate the Chart Component**
   - Find the component in `/components/scrollytelling/` or `/components/charts/`
   - Example: To update compensation data, edit `compensation-comparison-chart.tsx`

2. **Find the Data Array**
   - Look for a constant array (e.g., `teamSizeData`, `compensationData`, `threatData`)
   - Data is always defined near the top of the file

3. **Update the Values**
   - Modify numbers, labels, or descriptions
   - **IMPORTANT**: Maintain the data structure (don't add/remove fields without updating interfaces)

4. **Verify TypeScript Interface**
   ```typescript
   interface DataPoint {
     category: string;  // If you rename this field...
     value: number;     // ...update ALL references in the component
   }
   ```

5. **Update Related UI Elements**
   - If data changes significantly, update:
     - MetricCard values in `app/page.tsx`
     - CalloutBox insights
     - Section descriptions

6. **Test Locally**
   ```bash
   npm run dev
   # Visit http://localhost:3000
   # Verify chart renders correctly
   ```

7. **Deploy**
   ```bash
   git add .
   git commit -m "Update: Compensation data for Q2 2026"
   git push origin main
   # Vercel auto-deploys in ~2 minutes
   ```

### Common Data Update Scenarios

**Scenario 1: Update a single metric**
```typescript
// Before
{ companySize: "<500", teamSize: 12 }

// After (new survey data)
{ companySize: "<500", teamSize: 15 }
```

**Scenario 2: Update section description**
```tsx
// In app/page.tsx
<SectionHeader
  eyebrow="Section 01"
  title="Compensation Analysis"
  description="Public companies maintain significant compensation advantages..." // Update this
/>
```

**Scenario 3: Update chart colors**
```typescript
// Only if new data categories require new colors
const THREAT_DATA = [
  { name: "Third-Party Risk", value: 43, fill: "#003087" }, // Primary blue
  { name: "New Threat", value: 15, fill: "#0055c4" },       // Use existing palette
];
```

### Data Validation Checklist

Before deploying data updates:

- [ ] All numbers add up correctly (percentages sum to 100% where applicable)
- [ ] Labels are grammatically correct and consistent with tone
- [ ] Colors follow existing palette (no arbitrary new colors)
- [ ] Chart renders without console errors
- [ ] Tooltips display correct values
- [ ] Metric cards in sidebar match chart data
- [ ] Section descriptions align with updated data

---

## Responsive Design Patterns

### Completed Mobile Optimizations (Phase 2)

✅ **Responsive Chart Heights**
- Desktop: `h-96` (384px)
- Mobile: Dynamic based on viewport
- Use `ResponsiveContainer` for all Recharts components

✅ **Sankey Chart Mobile Fix**
- Uses `min-w-[600px]` with horizontal scroll on mobile
- Optimized SVG viewBox for small screens

✅ **Tooltip Positioning**
- Tooltips stay within viewport boundaries
- `maxWidth: '90vw'` prevents overflow

✅ **Breakpoint Standards**

```css
/* Tailwind Breakpoints */
sm:  640px   /* Small tablets, large phones */
md:  768px   /* Tablets */
lg:  1024px  /* Laptops */
xl:  1280px  /* Desktops */
2xl: 1536px  /* Large desktops */
```

**Responsive Patterns**:
```tsx
// Column layouts
<div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
  <PrimaryColumn />    {/* Full width mobile, 2/3 desktop */}
  <SidebarColumn />    {/* Full width mobile, 1/3 desktop */}
</div>

// Typography scaling
<h1 className="text-4xl md:text-5xl lg:text-6xl">

// Spacing
<div className="p-6 md:p-8 lg:p-12">

// Visibility
<div className="hidden md:block">  {/* Hide on mobile */}
<div className="md:hidden">        {/* Show only on mobile */}
```

### Mobile Testing Checklist

When making layout changes, test:

- [ ] iPhone SE (375px) - smallest common viewport
- [ ] iPhone 12/13 (390px)
- [ ] iPad (768px)
- [ ] Desktop (1440px+)
- [ ] No horizontal scroll (except Sankey chart)
- [ ] Touch targets ≥44x44px
- [ ] Readable text sizes (minimum 14px body text on mobile)

---

## Deployment Workflow

### Automatic Deployment (Vercel + GitHub)

**Every push to `main` branch triggers automatic deployment**:

1. **Make Changes Locally**
   ```bash
   # Edit files
   npm run dev  # Test locally
   ```

2. **Commit and Push**
   ```bash
   git add .
   git commit -m "Update: Description of changes"
   git push origin main
   ```

3. **Vercel Auto-Deploys**
   - Build starts automatically (takes ~2 minutes)
   - Preview URL generated
   - Production deployment on success
   - Rollback available if build fails

4. **Verify Deployment**
   - Visit production URL
   - Check Vercel Dashboard for analytics

### Preview Deployments (Branches)

```bash
# Create feature branch
git checkout -b update-compensation-data

# Make changes and push
git push origin update-compensation-data

# Vercel creates preview deployment
# URL: https://ciso-survey-2026-[branch-name]-[hash].vercel.app
```

**Preview deployments are perfect for**:
- Testing large data updates
- Sharing drafts with stakeholders
- A/B testing content changes

### Environment Configuration

**No environment variables required** - this is a pure static site.

If you need to add environment variables in the future:
```bash
# Vercel Dashboard → Settings → Environment Variables
# Add variables there, NOT in .env files (which are gitignored)
```

### Build Commands

```bash
npm run dev      # Development server (localhost:3000)
npm run build    # Production build (test before deploying)
npm run start    # Serve production build locally
npm run lint     # Run ESLint
```

---

## Content Editing Workflow

### Making Textual Changes to app/page.tsx

**Step-by-Step Process**:

1. **Identify the Section**
   - Locate section by ID: `executive-summary`, `compensation`, `reporting-structure`, etc.
   - Sections are in order: 01 Compensation → 02 Reporting → ... → 08 Recommendations

2. **Update Section Components**

   **Section Headers**:
   ```tsx
   <SectionHeader
     eyebrow="Section 01"
     title="Keep Short (3-5 words)"           // ← Edit this
     description="One clear sentence."        // ← Edit this
   />
   ```

   **Subsection Headers**:
   ```tsx
   <SubsectionHeader
     title="Chart Title"                      // ← Edit this
     description="What it shows."             // ← Edit this
   />
   ```

   **Metric Cards**:
   ```tsx
   <MetricCard
     value="$814K"                            // ← Edit this
     label="Description"                      // ← Edit this
     sentiment="neutral"                      // ← Change if data sentiment changes
   />
   ```

   **Callout Boxes**:
   ```tsx
   <CalloutBox variant="insight">
     Your insight here. Keep concise.         // ← Edit this
   </CalloutBox>
   ```

   **Body Paragraphs**:
   ```tsx
   <p className="text-muted-foreground leading-relaxed">
     Updated paragraph text here.             // ← Edit this
   </p>
   ```

3. **Maintain Consistency**
   - Use find-and-replace for terminology changes (e.g., "CISO" → "Chief Information Security Officer")
   - Keep tone professional and data-driven
   - Avoid first-person ("we", "our") unless in strategic recommendations
   - Use present tense for data findings ("CISOs report", not "CISOs reported")

4. **Verify Links**
   - Ensure all internal anchor links match section IDs
   - Navigation items in `navigation.tsx` must match section IDs in `app/page.tsx`

5. **Preview and Deploy**
   ```bash
   npm run dev           # Test changes locally
   git add app/page.tsx
   git commit -m "Update: Section 03 team dynamics copy"
   git push origin main
   ```

### Tone and Voice Guidelines

**DO**:
- "Security leaders face..." ✅
- "The data reveals..." ✅
- "Organizations must modernize..." ✅
- "CISOs with direct CEO access..." ✅

**DON'T**:
- "We found that security leaders..." ❌ (avoid first person)
- "Amazingly, the data shows..." ❌ (avoid editorializing)
- "Companies should probably think about..." ❌ (be definitive)
- "CISOs that have direct CEO access..." ❌ (use "with", not "that")

### Recommended Text Length Limits

| Element | Target Length | Max Length |
|---------|--------------|------------|
| Section Header Title | 3-5 words | 7 words |
| Section Header Description | 15-25 words | 35 words |
| Subsection Header Title | 3-6 words | 8 words |
| Subsection Header Description | 10-15 words | 20 words |
| Metric Card Label | 2-5 words | 7 words |
| Callout Box | 20-35 words | 50 words |
| Body Paragraph | 40-80 words | 120 words |
| Intro Paragraph (`.text-lead`) | 50-80 words | 100 words |

---

## Testing Guidelines

### Pre-Deployment Checklist

Before pushing to production, verify:

#### Visual Testing
- [ ] All sections render without layout breaks
- [ ] Charts display correct data
- [ ] No console errors in browser DevTools
- [ ] Tooltips appear and disappear correctly
- [ ] Hover states work on all interactive elements

#### Content Verification
- [ ] All metric cards show current data
- [ ] Section descriptions match chart insights
- [ ] No typos or grammatical errors
- [ ] Links work (navigation menu, footer)

#### Accessibility Testing
- [ ] Tab through entire page (logical focus order)
- [ ] Keyboard navigate charts (arrow keys, Enter, Escape)
- [ ] ARIA labels present on all charts (`role="img"`)
- [ ] Color contrast verified (use WAVE or axe DevTools)
- [ ] Test with `prefers-reduced-motion` enabled

#### Responsive Testing
- [ ] Mobile (375px): No horizontal scroll (except Sankey)
- [ ] Tablet (768px): Proper grid layouts
- [ ] Desktop (1440px+): Optimal spacing
- [ ] Touch targets ≥44x44px on mobile

#### Browser Testing
- [ ] Chrome/Edge (primary)
- [ ] Safari (macOS/iOS)
- [ ] Firefox
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Lighthouse Audit Targets

Run Lighthouse in Chrome DevTools:

```
Performance:   90+  ✅
Accessibility: 95+  ✅
Best Practices: 95+  ✅
SEO:           90+  ✅
```

**Common Issues to Watch**:
- Accessibility: Missing ARIA labels, low contrast
- Performance: Large image assets (use next/image if adding images)
- Best Practices: Console errors, deprecated APIs

---

## Common Maintenance Tasks

### 1. Update Survey Year (Annual Update)

**Files to modify**:
```
app/page.tsx
├── Hero title: "2026 Global CISO Report" → "2027 Global CISO Report"
├── Executive Summary description: "Q4 2025–Q1 2026" → "Q4 2026–Q1 2027"
└── Footer copyright year

components/scrollytelling/hero-section.tsx
└── Year in title

package.json
└── Update version: "0.1.0" → "0.2.0"
```

### 2. Add New Section

**Steps**:
1. Create new chart component in `components/scrollytelling/`
2. Add section to `app/page.tsx` following existing pattern:
   ```tsx
   <SectionWrapper id="new-section-id" variant="muted">
     <SectionHeader eyebrow="Section 09" title="..." description="..." />
     <ContentRow>
       <PrimaryColumn><NewChart /></PrimaryColumn>
       <SidebarColumn><MetricCard ... /></SidebarColumn>
     </ContentRow>
   </SectionWrapper>
   ```
3. Add navigation item to `components/scrollytelling/navigation.tsx`
4. Update README if adding significant functionality

### 3. Change Color Theme

**To change primary color** (e.g., from royal blue to teal):

1. Update Tailwind config (if using custom colors)
2. Find and replace all instances:
   - `#003087` → New primary color
   - `#0055c4` → New primary-light color
3. Update gradient definitions in chart components
4. Verify contrast ratios with new colors

**CAUTION**: Changing the color theme affects brand identity. Consult with design stakeholders first.

### 4. Optimize Build Performance

If build times increase:

```bash
# Analyze bundle size
npm run build
# Review .next/build-manifest.json

# Consider code splitting for large components
const HeavyChart = dynamic(() => import('@/components/heavy-chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false
});
```

---

## Troubleshooting

### Common Issues and Solutions

#### Charts Not Rendering

**Problem**: Chart shows blank space
**Solution**:
1. Check browser console for errors
2. Verify data array is not empty
3. Ensure `ResponsiveContainer` has valid width/height
4. Check that data keys match chart dataKey props

#### Build Fails on Vercel

**Problem**: `npm run build` fails in deployment
**Solution**:
1. Run `npm run build` locally to see errors
2. Common causes:
   - TypeScript errors (set `ignoreBuildErrors: true` in next.config.mjs)
   - Missing dependencies (check package.json)
   - Import path errors (use `@/` alias correctly)

#### Tooltip Positioning Issues

**Problem**: Tooltips overflow viewport on mobile
**Solution**:
```tsx
// Add maxWidth constraint
<div className="bg-card border p-4 shadow-lg" style={{ maxWidth: '90vw' }}>
```

#### Animation Performance Issues

**Problem**: Janky animations on lower-end devices
**Solution**:
1. Reduce animation duration:
   ```typescript
   animationDuration={prefersReducedMotion ? 0 : 600} // Reduced from 1000
   ```
2. Use CSS transforms instead of position changes
3. Avoid animating expensive properties (box-shadow, filter)

#### Accessibility Errors

**Problem**: Lighthouse flags accessibility issues
**Solution**:
1. Add missing ARIA labels
2. Increase color contrast
3. Add keyboard navigation
4. Ensure focus states are visible
5. Test with screen reader (NVDA on Windows, VoiceOver on Mac)

---

## Project Maintenance Notes

### Dependencies to Watch

**Critical Dependencies** (update carefully):
- `next`: Major version updates may require configuration changes
- `react`: Keep in sync with Next.js compatibility
- `recharts`: Chart API changes may require component updates
- `tailwindcss`: v4.x is latest, stay on v4.x track

**Safe to Update**:
- `lucide-react`: Icon library (backwards compatible)
- `@radix-ui/*`: UI primitives (stable API)
- `@vercel/analytics`: Analytics package

### Update Strategy

```bash
# Check for outdated packages
npm outdated

# Update non-breaking versions
npm update

# Test thoroughly after updates
npm run build
npm run dev
# Manual testing of all interactive components
```

### Backup Strategy

**Vercel maintains deployment history**:
- Last 100 deployments stored
- Instant rollback to any previous version
- Access via Vercel Dashboard → Deployments

**Git history is your backup**:
```bash
# Revert to previous commit
git revert HEAD

# Or reset to specific commit (destructive)
git reset --hard <commit-hash>
git push --force origin main
```

---

## Claude Code Specific Guidance

### How to Use This File

When Claude is working on this project, reference this file for:

1. **Design Consistency**: Color palette, typography, spacing
2. **Component Patterns**: How charts are structured, animation timing
3. **Content Guidelines**: Tone, length limits, hierarchy
4. **Data Updates**: Where data lives, how to modify safely
5. **Accessibility**: WCAG standards, keyboard navigation patterns

### Key Reminders for Claude

**When editing app/page.tsx**:
- ✅ Maintain existing section structure (SectionWrapper > SectionHeader > ContentRow)
- ✅ Keep metric card sentiments aligned with data implications
- ✅ Preserve typography classes (`text-muted-foreground`, `leading-relaxed`, etc.)
- ✅ Follow word count limits for headers and descriptions
- ❌ Don't add new colors outside the existing palette
- ❌ Don't change spacing patterns (mb-16, gap-8, etc.)
- ❌ Don't remove accessibility features (ARIA labels, keyboard handlers)

**When creating new chart components**:
- ✅ Start with `"use client"` directive
- ✅ Import and use `useReducedMotion()` hook
- ✅ Follow Recharts axis styling standards
- ✅ Add keyboard navigation (arrow keys, Enter, Escape)
- ✅ Include descriptive `aria-label` on chart container
- ✅ Use custom tooltip with consistent styling
- ❌ Don't skip motion preferences support
- ❌ Don't use arbitrary colors (stick to palette)
- ❌ Don't forget focus states for interactive elements

**When updating data**:
- ✅ Find data array in chart component
- ✅ Verify TypeScript interfaces match new data structure
- ✅ Update related metric cards in app/page.tsx
- ✅ Test locally before pushing
- ❌ Don't change data structure without updating component logic
- ❌ Don't forget to update section descriptions to match new data

### Design Preservation Priorities

**HIGHEST PRIORITY** (Never Change):
1. Color palette (royal blue #003087 primary, neutral grays)
2. Typography scale (Inter font, clamp() sizing)
3. Accessibility features (keyboard nav, ARIA labels, motion preferences)
4. Component structure (SectionWrapper, ContentRow, etc.)

**MEDIUM PRIORITY** (Change with Caution):
1. Spacing scale (maintain consistency if changing)
2. Animation timing (preserve motion preferences)
3. Chart types (ensure data visualization best practices)

**LOW PRIORITY** (Safe to Modify):
1. Text content (following tone guidelines)
2. Data values (following update procedures)
3. Section order (maintain logical narrative flow)

---

## Additional Resources

### External Documentation
- **Next.js**: https://nextjs.org/docs
- **Recharts**: https://recharts.org/en-US/api
- **Radix UI**: https://www.radix-ui.com/primitives/docs/overview/introduction
- **Tailwind CSS**: https://tailwindcss.com/docs
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/

### Internal References
- **GitHub Repository**: https://github.com/JasonData555/2026CISOSurvey
- **Vercel Dashboard**: https://vercel.com/dashboard (for deployment history, analytics)
- **Implementation Plan**: See `.claude/plans/resilient-painting-rivest.md` for Phase 1 & 2 details

---

## Questions or Issues?

If you encounter issues not covered in this guide:

1. **Check Recent Commits**: Review git history for similar changes
2. **Inspect Components**: Read existing chart components for patterns
3. **Test Locally**: Always run `npm run dev` before deploying
4. **Review Lighthouse**: Run accessibility and performance audits
5. **Consult Plan File**: `.claude/plans/resilient-painting-rivest.md` has detailed implementation notes

**This file should evolve with the project**. When adding new patterns or making significant changes, update this CLAUDE.md file to maintain comprehensive documentation.

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Maintainer**: TalentHitch via Claude Code
