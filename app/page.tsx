import { Navigation } from "@/components/scrollytelling/navigation";
import { HeroSection } from "@/components/scrollytelling/hero-section";
import {
  SectionWrapper,
  ContentRow,
  PrimaryColumn,
  SidebarColumn,
} from "@/components/scrollytelling/section-wrapper";
import { SectionHeader, SubsectionHeader } from "@/components/scrollytelling/section-header";
import { MetricCard, StatGrid } from "@/components/scrollytelling/metric-card";
import { CalloutBox, KeyTakeaways } from "@/components/scrollytelling/callout-box";
import { CompensationComparisonChart } from "@/components/scrollytelling/compensation-comparison-chart";
import { ReportingStructureSankeyChart } from "@/components/scrollytelling/reporting-structure-sankey";
import { AIGovernanceChallengesChart } from "@/components/scrollytelling/ai-governance-challenges-chart";
import { ConfidenceMeterVisualization } from "@/components/scrollytelling/confidence-meter-visualization";
import { CEOReportingSlopeChart } from "@/components/scrollytelling/ceo-reporting-slope-chart";
import { BoardReportingChart } from "@/components/scrollytelling/board-reporting-chart";
import { ThreatPrioritiesTreemap } from "@/components/charts/threat-priorities-treemap";
import { AISecurityLeadershipChart } from "@/components/scrollytelling/ai-security-leadership-chart";
import { Footer } from "@/components/scrollytelling/footer";
import { TeamSizeScalingCurve } from "@/components/scrollytelling/team-size-scaling-curve";
import { NextGenVsCISOCompensationChart } from "@/components/scrollytelling/nextgen-vs-ciso-compensation-chart";
import { StrategicImperativesRoadmap } from "@/components/scrollytelling/strategic-imperatives-roadmap";
import { IndustryCompensationChart } from "@/components/scrollytelling/industry-compensation-chart";
import { SigningBonusChart } from "@/components/scrollytelling/signing-bonus-chart";
import { BudgetJustificationChart } from "@/components/scrollytelling/budget-justification-chart";
import { NextGenTeamSizeChart } from "@/components/scrollytelling/nextgen-team-size-chart";
import { FunctionalResponsibilitiesChart } from "@/components/scrollytelling/functional-responsibilities-chart";

export default function CISOReport2026() {
  return (
    <main>
      <Navigation />
      <HeroSection />

      {/* Executive Summary Section */}
      <SectionWrapper id="executive-summary">
        <SectionHeader
          eyebrow="Executive Summary"
          title="Critical Inflection Points in Security Leadership"
          description="The 2026 Global CISO Report reveals fundamental shifts in compensation, reporting structures, and governance with implications for every security leader's strategic positioning."
        />

        <StatGrid columns={3} className="mb-12">
          <MetricCard value="$128K" label="Public-Private Compensation Gap" sentiment="warning" />
          <MetricCard value="30-32%" label="CTO/Engineering Reporting Dominance" sentiment="neutral" />
          <MetricCard value="97%" label="Lack Mature Frameworks" sentiment="bad" />
          <MetricCard value="36%" label="Private CISOs Without Liability Protection" sentiment="bad" />
          <MetricCard value="43%" label="Third-Party Risk as #1 Priority" sentiment="warning" />
          <MetricCard value="YOY+" label="NextGen Compensation Growth Outpacing CISO" sentiment="neutral" />
        </StatGrid>

        <p className="text-lead max-w-3xl">
          Based on responses from 625+ information security executives collected Q4 2025–Q1 2026, 
          this analysis identifies the critical decisions facing security leadership in 2026.
        </p>
      </SectionWrapper>

      {/* Compensation Analysis Section */}
      <SectionWrapper id="compensation" variant="muted">
        <SectionHeader
          eyebrow="Section 01"
          title="Compensation Analysis"
          description="Public companies maintain significant compensation advantages across all components, with equity driving the largest differentials."
        />

        <ContentRow className="mb-16">
          <PrimaryColumn>
            <SubsectionHeader
              title="Public vs. Private Company Compensation"
              description="Total compensation breakdown reveals structural differences in how organizations value security leadership."
            />
            <CompensationComparisonChart />
          </PrimaryColumn>
          <SidebarColumn>
            <MetricCard value="$814K" label="Avg Public CISO Total Comp" sentiment="neutral" />
            <MetricCard value="$686K" label="Avg Private CISO Total Comp" sentiment="neutral" />
          </SidebarColumn>
        </ContentRow>

        <ContentRow className="mb-16">
          <PrimaryColumn>
            <SubsectionHeader
              title="Industry Compensation Leaders"
              description="Cash-only compensation varies significantly by industry vertical."
            />
            <IndustryCompensationChart />
          </PrimaryColumn>
          <SidebarColumn>
            <CalloutBox variant="insight">
              Technology and financial services lead in cash compensation, 
              reflecting the competitive talent market in these sectors.
            </CalloutBox>
          </SidebarColumn>
        </ContentRow>

        <ContentRow>
          <PrimaryColumn>
            <SubsectionHeader
              title="Employment Offer Bonus Trends"
              description="Signing bonus prevalence varies between public and private companies."
            />
            <SigningBonusChart />
          </PrimaryColumn>
          <SidebarColumn>
            <CalloutBox variant="insight">
              Public companies deploy larger signing bonuses to offset equity cliff 
              risk and accelerate time-to-productivity.
            </CalloutBox>
          </SidebarColumn>
        </ContentRow>
      </SectionWrapper>

      {/* Reporting Structure Section */}
      <SectionWrapper id="reporting-structure">
        <SectionHeader
          eyebrow="Section 02"
          title="Reporting Structure Evolution"
          description="Security leadership has fundamentally realigned toward technical execution, with CTO and senior engineering leaders now representing the dominant reporting structure."
        />

        <ContentRow className="mb-16">
          <PrimaryColumn>
            <SubsectionHeader
              title="The CTO/Engineering Line Ascendancy"
              description="CTO and senior engineering leaders now represent 30-32% of CISO reporting relationships."
            />
            <ReportingStructureSankeyChart />
          </PrimaryColumn>
          <SidebarColumn>
            <MetricCard value="+5%" label="YOY Growth in Private CISOs Reporting to CTO/Engineering" sentiment="neutral" />
            <MetricCard value="32%" label="CEO Reporting at Companies <500 Employees" sentiment="neutral" />
            <MetricCard value="63%" label="Public CISOs Presenting to Board Quarterly" sentiment="good" />
          </SidebarColumn>
        </ContentRow>

        <ContentRow className="mb-16">
          <PrimaryColumn>
            <p className="text-muted-foreground leading-relaxed">
              CIO reporting remains significant at 22% (private) and 34% (public), with steady but 
              slower growth of +2% and +4% respectively. The CIO line reflects traditional IT-centric 
              security models, while the accelerating CTO trend suggests organizations increasingly 
              view security as integral to product development and engineering velocity.
            </p>
          </PrimaryColumn>
        </ContentRow>

        <ContentRow className="mb-16">
          <PrimaryColumn>
            <SubsectionHeader
              title="Company Size Dictates Access"
              description="Reporting to the CEO drops significantly as company size grows, while CIO reporting increases proportionally. Board reporting frequency also varies substantially between public and private companies."
            />
            <CEOReportingSlopeChart />
          </PrimaryColumn>
          <SidebarColumn>
            <CalloutBox variant="insight">
              At companies under 500 employees, 32% of CISOs report directly to the CEO.
              This collapses to just 3% at enterprises exceeding 10,000 employees.
            </CalloutBox>
          </SidebarColumn>
        </ContentRow>

        <ContentRow>
          <PrimaryColumn>
            <BoardReportingChart />
          </PrimaryColumn>
        </ContentRow>
      </SectionWrapper>

      {/* Team Dynamics Section */}
      <SectionWrapper id="team-dynamics" variant="muted">
        <SectionHeader
          eyebrow="Section 03"
          title="Team Size Dynamics"
          description="Security team scaling follows a non-linear trajectory that peaks at upper mid-market scale before federation begins."
        />

        <ContentRow className="mb-12">
          <PrimaryColumn>
            <SubsectionHeader
              title="The Complexity Curve"
              description="Team size peaks at 5K-10K employees before declining due to federation."
            />
            <TeamSizeScalingCurve />
          </PrimaryColumn>
          <SidebarColumn>
            <MetricCard value="243" label="Peak Security Team Size at 5K-10K Employee Companies" sentiment="neutral" />
            <MetricCard value="-47%" label="Team Size Decline at 10K+ Employees Due to Federation" sentiment="warning" />
          </SidebarColumn>
        </ContentRow>

        <ContentRow>
          <PrimaryColumn>
            <p className="text-muted-foreground leading-relaxed">
              The federation effect becomes visible beyond 10,000 employees, where average team size 
              contracts 47% to 129 personnel. Large enterprises distribute security responsibilities 
              into platform teams, IT functions, and enterprise risk organizations. The CISO role 
              transitions from hands-on program execution to governance, influence, and strategic 
              oversight across federated security capabilities.
            </p>
          </PrimaryColumn>
        </ContentRow>
      </SectionWrapper>

      {/* CISO Functional Responsibilities Section */}
      <SectionWrapper id="functional-responsibilities">
        <SectionHeader
          eyebrow="Section 04"
          title="CISO Functional Responsibilities"
          description="Security leadership encompasses a diverse portfolio of direct responsibilities from universal operational functions to emerging AI governance revealing where accountability is concentrated and where critical gaps persist."
        />

        <ContentRow className="mb-16">
          <PrimaryColumn>
            <SubsectionHeader
              title="Direct Responsibility Landscape"
              description="Percentage of North American CISOs with direct oversight of each security function."
            />
            <FunctionalResponsibilitiesChart />
          </PrimaryColumn>
          <SidebarColumn>
            <MetricCard value="93%" label="CISOs Own Incident Response" sentiment="good" />
            <MetricCard value="12" label="Average Functions Per CISO" sentiment="neutral" />
            <MetricCard value="88%" label="CISO Responsible for IT" sentiment="good" />
            <MetricCard value="74%" label="CISO Responsible for Product/Application Security" sentiment="good" />
          </SidebarColumn>
        </ContentRow>

        <ContentRow className="mb-16">
          <PrimaryColumn>
            <CalloutBox variant="insight">
              While 93% of CISOs own Incident Response and 90% manage Cloud Security,
              only 30% have direct responsibility for AI Ethics despite 83% owning AI Data Protection.
              This gap between technical control and governance oversight creates the AI leadership vacuum
              explored in the next section.
            </CalloutBox>
          </PrimaryColumn>
        </ContentRow>

        <ContentRow>
          <PrimaryColumn>
            <CalloutBox variant="insight">
              The data reveals three distinct clusters: <strong>universal operational functions</strong> (Incident Response,
              Cloud Security, SecOps at 88-93%), <strong>converging risk functions</strong> (Privacy, GRC, TPRM at 82-85%),
              and <strong>fragmented emerging functions</strong> (AI Ethics, Post-Quantum Cryptography, Fraud at 18-30%).
              This fragmentation in emerging areas suggests either unclear ownership models or security functions
              still maturing into CISO portfolios.
            </CalloutBox>
          </PrimaryColumn>
        </ContentRow>
      </SectionWrapper>

      {/* AI Governance Section */}
      <SectionWrapper id="ai-governance">
        <SectionHeader
          eyebrow="Section 05"
          title="AI Governance and Risk Management Maturity"
          description="Organizations face a critical gap between AI adoption velocity and security preparedness, with structural vulnerabilities across governance, technical capability, and executive protection."
        />

        <ContentRow className="mb-16">
          <PrimaryColumn>
            <SubsectionHeader
              title="AI Security Leadership Vacuum"
              description="Only 6% of private and 13% of public companies have dedicated AI security leaders."
            />
            <AISecurityLeadershipChart />
          </PrimaryColumn>
          <SidebarColumn>
            <MetricCard value="6%" label="Private Companies with Dedicated AI Security Leaders" sentiment="bad" />
            <MetricCard value="85%" label="Security Leaders Lack Full Confidence in Technical Assessment" sentiment="warning" />
          </SidebarColumn>
        </ContentRow>

        <ContentRow className="mb-16">
          <PrimaryColumn>
            <SubsectionHeader
              title="Technical Assessment Capability Crisis"
              description="Only 16% of CISOs express high confidence in their recruiting team's technical assessment ability."
            />
            <ConfidenceMeterVisualization />
            <p className="mt-6 text-muted-foreground leading-relaxed">
              This assessment deficit creates a compounding vulnerability: organizations may have 
              significantly more security headcount than actual security capability, particularly 
              as teams rapidly adopt AI-driven tools without adequate evaluation frameworks.
            </p>
          </PrimaryColumn>
        </ContentRow>

        <ContentRow className="mb-16">
          <PrimaryColumn>
            <SubsectionHeader
              title="AI Governance Challenges"
              description="Shadow AI and accountability definition top the list of governance concerns."
            />
            <AIGovernanceChallengesChart />
          </PrimaryColumn>
          <SidebarColumn>
            <MetricCard value="52%" label="Developing but inconsistent" sentiment="warning" />
            <CalloutBox variant="warning">
              Only 25% of organizations report "established and repeatable" AI governance processes with 66% of private and 53% of public companies having no plans to hire dedicated AI security leadership.
            </CalloutBox>
          </SidebarColumn>
        </ContentRow>

        <KeyTakeaways
          items={[
            "95%+ AI governance immaturity (calculated from lack of dedicated leaders + low confidence)",
            "36% private CISOs have NO executive liability protection",
            "85% lack technical assessment confidence",
            "Shadow AI + accountability = 48% of top governance challenges",
          ]}
        />
      </SectionWrapper>

      {/* Threat Landscape Section */}
      <SectionWrapper id="threat-landscape" variant="muted">
        <SectionHeader
          eyebrow="Section 06"
          title="Threat Landscape 2026"
          description="Third-party risk dominates security priorities, with AI-enhanced attacks and cloud misconfigurations completing the top three concerns."
        />

        <ContentRow className="mb-16">
          <PrimaryColumn>
            <SubsectionHeader
              title="Attack Vector Security Priorities"
              description="Top security priorities for 2026 ranked by CISO concern."
            />
            <ThreatPrioritiesTreemap />
          </PrimaryColumn>
          <SidebarColumn>
            <MetricCard value="43%" label="Third-Party Risk as #1 Security Priority" sentiment="warning" />
            <CalloutBox variant="insight">
              Third-party risk ranks as the overwhelming #1 priority—modernize TPRM programs 
              with continuous monitoring and tiered risk frameworks.
            </CalloutBox>
          </SidebarColumn>
        </ContentRow>

        <ContentRow>
          <PrimaryColumn>
            <SubsectionHeader
              title="Budget Justification Measures"
              description="How CISOs justify security budget requirements to leadership."
            />
            <BudgetJustificationChart />
          </PrimaryColumn>
          <SidebarColumn>
            <CalloutBox variant="insight">
              Business Impact Overtakes Compliance 69% justify security budgets via business impact versus 49% through compliance avoidance, marking shift from "cost of doing business" to "enabler of business outcomes."
            </CalloutBox>
          </SidebarColumn>
        </ContentRow>
      </SectionWrapper>

      {/* NextGen Leaders Section */}
      <SectionWrapper id="nextgen-leaders">
        <SectionHeader
          eyebrow="Section 07"
          title="NextGen Security Leaders"
          description="Deputy CISOs, Heads of Security Engineering, and domain-specific Directors represent the execution layer bridging strategy with hands-on program delivery."
        />

        <ContentRow className="mb-16">
          <PrimaryColumn>
            <SubsectionHeader
              title="Compensation Dynamics"
              description="NextGen compensation growth is outpacing CISO increases, signaling execution-layer talent scarcity."
            />
            <NextGenVsCISOCompensationChart />
          </PrimaryColumn>
          <SidebarColumn>
            <MetricCard value="37" label="Average Direct Reports" sentiment="neutral" />
          </SidebarColumn>
        </ContentRow>

        <ContentRow className="mb-16">
          <PrimaryColumn>
            <SubsectionHeader
              title="Employment Incentives"
              description="Signing bonus prevalence mirrors CISO patterns—public companies deploy larger bonuses to offset equity cliff risk."
            />
            <div className="bg-card border border-border p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Public Companies</p>
                  <p className="text-3xl font-bold text-primary">65%</p>
                  <p className="text-sm text-muted-foreground">Offer signing bonuses</p>
                  <p className="text-lg font-semibold text-foreground">$73K avg</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Private Companies</p>
                  <p className="text-3xl font-bold text-[#737373]">53%</p>
                  <p className="text-sm text-muted-foreground">Offer signing bonuses</p>
                  <p className="text-lg font-semibold text-foreground">$48K avg</p>
                </div>
              </div>
            </div>
          </PrimaryColumn>
          <SidebarColumn>
            <CalloutBox variant="insight">
              Private companies offer 53% of NextGen roles with signing bonuses versus 65% for public companies, with public bonuses 53% higher ($73K vs $48K). This suggests private companies using cash incentives to compete with public company stability.
            </CalloutBox>
          </SidebarColumn>
        </ContentRow>

        <ContentRow>
          <PrimaryColumn>
            <SubsectionHeader
              title="Span of Control"
              description="NextGen security leaders manage teams that scale dramatically with company size, from lean startup teams to large enterprise operations."
            />
            <NextGenTeamSizeChart />
          </PrimaryColumn>
          <SidebarColumn>
            <CalloutBox variant="insight">
              Cloud Security and AppSec leaders tend toward smaller, highly technical teams, 
              while GRC and Security Operations leaders manage larger operational groups.
            </CalloutBox>
          </SidebarColumn>
        </ContentRow>
      </SectionWrapper>

      {/* Strategic Recommendations Section */}
      <SectionWrapper id="recommendations" variant="muted">
        <SectionHeader
          eyebrow="Section 08"
          title="Strategic Imperatives for 2026"
          description="Six critical actions for security leaders navigating compensation, governance, and organizational challenges. Click any imperative to explore implementation details and related data points."
        />

        <StrategicImperativesRoadmap />
      </SectionWrapper>

      <Footer />
    </main>
  );
}
