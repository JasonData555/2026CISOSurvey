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
import { CalloutBox } from "@/components/scrollytelling/callout-box";
import { CompensationComparisonChart } from "@/components/scrollytelling/compensation-comparison-chart";
import { ReportingStructureSankeyChart } from "@/components/scrollytelling/reporting-structure-sankey";
import { AIGovernanceChallengesChart } from "@/components/scrollytelling/ai-governance-challenges-chart";
import { CEOReportingSlopeChart } from "@/components/scrollytelling/ceo-reporting-slope-chart";
import { BoardReportingChart } from "@/components/scrollytelling/board-reporting-chart";
import { ThreatPrioritiesTreemap } from "@/components/charts/threat-priorities-treemap";
import { AISecurityLeadershipChart } from "@/components/scrollytelling/ai-security-leadership-chart";
import { ConfidenceMeterVisualization } from "@/components/scrollytelling/confidence-meter-visualization";
import { Footer } from "@/components/scrollytelling/footer";
import { TeamSizeScalingCurve } from "@/components/scrollytelling/team-size-scaling-curve";
import { NextGenVsCISOCompensationChart } from "@/components/scrollytelling/nextgen-vs-ciso-compensation-chart";
import { StrategicImperativesRoadmap } from "@/components/scrollytelling/strategic-imperatives-roadmap";
import { IndustryCompensationChart } from "@/components/scrollytelling/industry-compensation-chart";
import { GeographicCompensationChart } from "@/components/scrollytelling/geographic-compensation-chart";
import { SigningBonusChart } from "@/components/scrollytelling/signing-bonus-chart";
import { BudgetJustificationChart } from "@/components/scrollytelling/budget-justification-chart";
import { NextGenTeamSizeChart } from "@/components/scrollytelling/nextgen-team-size-chart";
import { FunctionalResponsibilitiesChart } from "@/components/scrollytelling/functional-responsibilities-chart";
import { InternationalCompensationChart } from "@/components/scrollytelling/international-compensation-chart";
import { InternationalTeamSizeChart } from "@/components/scrollytelling/international-team-size-chart";
import { InternationalResponsibilitiesChart } from "@/components/scrollytelling/international-responsibilities-chart";
import { ExecutiveLiabilityChart } from "@/components/scrollytelling/executive-liability-chart";
import { PersonalLiabilityChart } from "@/components/scrollytelling/personal-liability-chart";
import { AIGovernanceChallengesByCompanyChart } from "@/components/scrollytelling/ai-governance-challenges-by-company-chart";
import { AIConcernsByCompanyChart } from "@/components/scrollytelling/ai-concerns-by-company-chart";
import { AIGovernanceFrameworksChart } from "@/components/scrollytelling/ai-governance-frameworks-chart";
import { CISOTenureChart } from "@/components/scrollytelling/ciso-tenure-chart";

export default function CISOReport2026() {
  return (
    <main>
      <Navigation />
      <HeroSection />

      {/* About Section - Introduction & Methodology */}
      <SectionWrapper id="about">
        <SectionHeader
          eyebrow="2026 Global CISO Report"
          title="Introduction & Methodology"
        />

        <ContentRow className="mb-16">
          <PrimaryColumn>
            <SubsectionHeader
              title="Introduction"
            />
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Presented by <strong className="text-foreground">Hitch Partners</strong>, the 2026 Global Organization Report analyzes the evolving landscape of security leadership. Now in its ninth annual edition, the report provides critical insight into compensation trends, reporting structures, and the expanding responsibilities of security executives in 2025.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This year's analysis examines both Chief Information Security Officers (CISOs) and NextGen security leaders. While CISOs continue to shape security strategy and communicate risk at the executive level, NextGen security leaders who operate just below the CISO are playing an increasingly pivotal role in executing strategy, owning key security programs, and driving operational excellence.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                As threats to infrastructure and applications intensify, demand for seasoned security leadership remains high. Both CISOs and NextGen security leaders are commanding competitive compensation as organizations prioritize security at the highest levels.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Hitch Partners specializes in executive search and sector advocacy, equipping security leaders with data-driven insights to navigate this dynamic field. We welcome your feedback and invite you to share topics you'd like us to explore in future reports.
              </p>
            </div>
          </PrimaryColumn>

          <SidebarColumn>
            <MetricCard
              value="625+"
              label="Survey Respondents"
              sentiment="neutral"
            />
            <MetricCard
              value="9th"
              label="Annual Edition"
              sentiment="neutral"
            />
            <MetricCard
              value="93%"
              label="North American Coverage"
              sentiment="neutral"
            />
          </SidebarColumn>
        </ContentRow>

        <ContentRow className="mb-16">
          <PrimaryColumn>
            <SubsectionHeader
              title="Methodology"
            />
            <p className="text-muted-foreground leading-relaxed">
              This report is based on survey responses from more than 625+ Information Security executives across North America (U.S. and Canada) and select international markets. Responses were collected between Q4 2025 and Q1 2026 and represent a broad cross-section of industries, company sizes, and organizational models providing a comprehensive view of how security leadership is evolving as we enter 2026.
            </p>
          </PrimaryColumn>
        </ContentRow>

        <ContentRow className="mb-16">
          <PrimaryColumn>
            <SubsectionHeader title="Scope & Definitions" />
            <div className="space-y-6">
              <div>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>"CISO" Definition:</strong> Throughout this report, CISO refers to the most senior security leader accountable for an organization's information security strategy, program execution, and risk management. This encompasses multiple titles, including:
                </p>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Chief Information Security Officer (CISO)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Chief Security Officer (CSO)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Head of Security / Head of Information Security</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Vice President of Security / VP of Information Security</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Senior Director of Security (when serving as top security role)</span>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>"NextGen" Definition:</strong> "NextGen" refers to the security leadership layer directly reporting to the CISO—typically the top 3-5 security leaders responsible for executing the security program across specialized domains. These roles represent the next generation of CISO talent and include titles such as:
                </p>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Deputy CISO</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Head of Security / Security Engineering</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Vice President of Product Security / Application Security</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Senior Director / Director of Security (domain-specific: Cloud, Identity, GRC, etc.)</span>
                  </li>
                </ul>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  NextGen leaders translate CISO strategy into operational execution, combining strategic alignment with hands-on program leadership. They typically manage teams of 5 to 50+ security professionals within their areas of specialization.
                </p>
              </div>
            </div>
          </PrimaryColumn>
        </ContentRow>

        <ContentRow className="mb-16">
          <PrimaryColumn>
            <SubsectionHeader title="Geographic Segments" />
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                This report highlights the North American security leadership market, a space Hitch Partners has supported through security leadership searches for more than a decade. With respondents based in the U.S. and Canada, the dataset offers a robust regional view of compensation benchmarks, organizational structures, and evolving security priorities.
              </p>

              <div>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Expanding Global Coverage:</strong> Beginning in 2025, we expanded our data collection beyond North America to include European and broader international markets to establish baseline benchmarks and better understand regional differences in security leadership practices. While international respondents currently account for a significantly lower percentage of total responses, we are committed to increasing global representation in future editions.
                </p>
              </div>

              <div>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Current International Representation:</strong>
                </p>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>European Union: Concentrated in Germany, France, and the Netherlands</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>United Kingdom: London, other major business centers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Scandinavia: Norway, Sweden, Denmark</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Middle East: UAE, Saudi Arabia, and Israel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Australia: Sydney and Melbourne metro areas</span>
                  </li>
                </ul>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                As the international dataset matures over the next 12–24 months, we will introduce deeper regional analysis, including market-specific compensation benchmarks, regulatory drivers (such as GDPR, NIS2, and DORA), and structural differences in security organizations. In this year's edition, international findings are presented alongside North American data where sample sizes support statistically meaningful comparisons. All international compensation figures have been converted to USD using exchange rates as of January 11, 2026, to ensure direct comparability.
              </p>
            </div>
          </PrimaryColumn>
        </ContentRow>

        <ContentRow>
          <PrimaryColumn>
            <SubsectionHeader
              title="Acknowledgment & Thanks"
            />
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                We extend our sincere thanks to the security leaders who contributed their time and insight to this report, and to the broader community who helped rally participation across North America and international markets. This benchmark exists because of your engagement and trust.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We are grateful to the many CISOs and security leaders we connected with throughout the year at CISO Sanctuary gatherings, speaking engagements, our annual Brewery Party, Black Hat, and other industry events around the world. These conversations continue to shape our perspective and strengthen this community.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We also want to recognize and thank the Hitch team for the care, rigor, and coordination behind this effort - from research and analysis to community outreach and execution.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We look forward to even deeper engagement in 2026 and remain committed to supporting and advocating for a security leadership community we truly admire and care about.
              </p>
            </div>
          </PrimaryColumn>
        </ContentRow>
      </SectionWrapper>

      {/* Executive Summary Section */}
      <SectionWrapper id="executive-summary" variant="muted">
        <SectionHeader
          eyebrow="Executive Summary"
          title="Critical Inflection Points in Security Leadership"
          description="The 2026 Global CISO Report reveals fundamental shifts in compensation, reporting structures, and governance with implications for every security leader's strategic positioning."
        />

        <StatGrid columns={3} className="mb-12">
          <MetricCard value="$128K" label="Public Company vs Private Company Compensation Gap" sentiment="warning" />
          <MetricCard value="30-32%" label="CISO Report to CTO / Engineering" sentiment="neutral" />
          <MetricCard value="2%" label="Have Optimized AI Governance" sentiment="bad" />
          <MetricCard value="36%" label="Private Company CISOs Without Liability Protection" sentiment="bad" />
          <MetricCard value="43%" label="CISOs Report Third Party Risk as #1 Priority" sentiment="warning" />
          <MetricCard value="+6% YoY" label="NextGen Compensation Growth Outpacing CISO" sentiment="neutral" />
        </StatGrid>

        <p className="text-lead max-w-3xl">
          Based on responses from 625+ information security executives collected Q4 2025–Q1 2026, 
          this analysis identifies the critical decisions facing security leadership in 2026.
        </p>
      </SectionWrapper>

      {/* Compensation Analysis Section */}
      <SectionWrapper id="compensation" variant="default">
        <SectionHeader
          eyebrow="Section 01"
          title="Compensation Analysis"
          description="Public companies maintain significant compensation advantages across all components, with equity driving the largest differentials."
        />

        <ContentRow className="mb-16">
          <PrimaryColumn>
            <SubsectionHeader
              title="Public vs. Private Company CISO Compensation"
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
              description="Total compensation varies significantly by industry vertical."
            />
            <IndustryCompensationChart />
          </PrimaryColumn>
          <SidebarColumn>
            <CalloutBox variant="insight">
              Consumer-facing software and media industries lead in total compensation,
              with equity packages accounting for up to 49% of total comp in top sectors.
            </CalloutBox>
          </SidebarColumn>
        </ContentRow>

        <ContentRow className="mb-16">
          <PrimaryColumn>
            <SubsectionHeader
              title="Geographic Insights"
              description="Location Premiums Persist Despite Remote Work Expansion"
            />
            <GeographicCompensationChart />
          </PrimaryColumn>
          <SidebarColumn>
            <CalloutBox variant="insight">
              Compensation differences by location remain significant, with a 2.4x spread between top-paying markets such as Seattle and lower-cost metros like Kansas City.
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
      <SectionWrapper id="reporting-structure" variant="muted">
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

      {/* CISO Liability Protection Section */}
      <SectionWrapper id="liability-protection" variant="muted">
        <SectionHeader
          eyebrow="Section 03"
          title="CISO Liability Protection"
          description="Security leaders face significant personal risk with inadequate executive and personal liability coverage across both public and private sectors."
        />

        <ContentRow className="mb-16">
          <PrimaryColumn>
            <SubsectionHeader
              title="Executive Liability Coverage"
              description="D&O and indemnification policy adoption by company structure."
            />
            <ExecutiveLiabilityChart />
          </PrimaryColumn>
          <SidebarColumn>
            <MetricCard value="36%" label="Private CISOs unprotected" sentiment="bad" />
            <MetricCard value="20%" label="Public CISOs unprotected" sentiment="warning" />
            <CalloutBox variant="insight">
              Executive Liability Protection Gap: 36% of private and 20% of public CISOs lack coverage. S&P 500 executive protection benefits rose from 12% to 22.5% (2020–2024), per ISS-Corporate data reported by the Financial Times.
            </CalloutBox>
          </SidebarColumn>
        </ContentRow>

        <ContentRow>
          <PrimaryColumn>
            <SubsectionHeader
              title="Personal Liability Insurance"
              description="Individual coverage rates reveal a widespread protection gap."
            />
            <PersonalLiabilityChart />
          </PrimaryColumn>
          <SidebarColumn>
            <MetricCard value="~75%" label="Lack personal coverage" sentiment="bad" />
            <MetricCard value="<2%" label="Difference between sectors" sentiment="neutral" />
          </SidebarColumn>
        </ContentRow>
      </SectionWrapper>

      {/* Team Dynamics Section */}
      <SectionWrapper id="team-dynamics">
        <SectionHeader
          eyebrow="Section 04"
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

        <ContentRow className="mb-12">
          <PrimaryColumn>
            <p className="text-muted-foreground leading-relaxed">
              The &ldquo;federation effect&rdquo; becomes visible for organizations larger than 10,000 employees,
              where average team size contracts 47% to 129. Large enterprises distribute security
              responsibilities into other organizations including platform teams, IT functions, and
              enterprise risk (GRC). The CISO role transitions from large, self contained organization
              to governance, influence, and strategic oversight across federated security capabilities.
            </p>
          </PrimaryColumn>
        </ContentRow>

        <ContentRow>
          <PrimaryColumn>
            <SubsectionHeader
              title="CISO Tenure by Company Size"
              description="Average tenure patterns reveal retention challenges at smaller organizations."
            />
            <CISOTenureChart />
          </PrimaryColumn>
          <SidebarColumn>
            <div className="space-y-4">
              <MetricCard value="44 mo" label="Avg Current Tenure Public Company" sentiment="neutral" />
              <MetricCard value="36 mo" label="Avg Current Tenure Private Company" sentiment="neutral" />
            </div>
          </SidebarColumn>
        </ContentRow>
      </SectionWrapper>

      {/* CISO Functional Responsibilities Section */}
      <SectionWrapper id="functional-responsibilities" variant="muted">
        <SectionHeader
          eyebrow="Section 05"
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

        <ContentRow>
          <PrimaryColumn>
            <CalloutBox variant="insight">
              The data reveals three distinct clusters: <strong>universal operational functions</strong> (Incident Response,
              Cloud Security, SecOps at 88-93%), <strong>converging risk functions</strong> (Privacy, GRC, TPRM at 82-85%),
              and <strong>fragmented emerging functions</strong> (AI Ethics, Post-Quantum Cryptography, Fraud at 18-30%).
              This fragmentation in emerging areas suggests either unclear ownership models or security functions
              still maturing into CISO portfolios. This gap between technical control and governance oversight creates
              the AI leadership vacuum explored in the next section.
            </CalloutBox>
          </PrimaryColumn>
        </ContentRow>
      </SectionWrapper>

      {/* AI Governance Section */}
      <SectionWrapper id="ai-governance">
        <SectionHeader
          eyebrow="Section 06"
          title="AI Governance and Risk Management"
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
            <MetricCard value="84%" label="Security Leaders Lack Full Confidence in Technical Assessment" sentiment="warning" />
          </SidebarColumn>
        </ContentRow>

        <ContentRow className="mb-16">
          <PrimaryColumn>
            <SubsectionHeader
              title="Technical Assessment Confidence Gap"
              description="CISOs lack confidence in their ability to evaluate technical talent."
            />
            <ConfidenceMeterVisualization />
          </PrimaryColumn>
          <SidebarColumn />

        </ContentRow>

        <ContentRow className="mb-16">
          <PrimaryColumn>
            <SubsectionHeader
              title="AI Governance and Risk Management Maturity"
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

        <ContentRow className="mb-8">
          <PrimaryColumn>
            <SubsectionHeader
              title="AI Challenges and Concerns"
              description="AI security spending averages anticipated spend of 7% of total security budget"
            />
            <AIGovernanceChallengesByCompanyChart />
          </PrimaryColumn>
        </ContentRow>

        <ContentRow className="mb-16">
          <PrimaryColumn>
            <AIConcernsByCompanyChart />
          </PrimaryColumn>
          <SidebarColumn>
            <MetricCard value="75%" label="Cite Data Exposure as Top AI Risk" sentiment="warning" />
            <CalloutBox variant="insight">
              Data Exposure Dominates AI Concerns 75% of CISOs cite data exposure/privacy breaches as the top AI risk, followed by shadow AI bypassing controls (49%).
            </CalloutBox>
          </SidebarColumn>
        </ContentRow>

        <ContentRow className="mb-16">
          <PrimaryColumn>
            <AIGovernanceFrameworksChart />
          </PrimaryColumn>
          <SidebarColumn>
            <MetricCard value="67%" label="Public Companies Using NIST AI RMF" sentiment="good" />
            <CalloutBox variant="insight">
              NIST AI Framework established as clear market preference over alternatives, 3x more likely.
            </CalloutBox>
          </SidebarColumn>
        </ContentRow>
      </SectionWrapper>

      {/* Threat Landscape Section */}
      <SectionWrapper id="threat-landscape" variant="muted">
        <SectionHeader
          eyebrow="Section 07"
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
              Third-party risk ranks as the overwhelming #1 priority. Modernize TPRM programs
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
          eyebrow="Section 08"
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

      {/* International CISO Section */}
      <SectionWrapper id="international" variant="default">
        <SectionHeader
          eyebrow="Section 09"
          title="International CISO Landscape"
          description="European and international CISOs operate in distinctly different contexts; 32% lower compensation, broader regulatory responsibilities, and unique team scaling patterns shaped by GDPR and centralized governance models."
        />

        {/* Row 1: Compensation Comparison */}
        <ContentRow className="mb-16">
          <PrimaryColumn>
            <SubsectionHeader
              title="Compensation Gap: International vs. North America"
              description="International CISOs earn $469K total compensation which is 32% below the North American average of $750K."
            />
            <InternationalCompensationChart />
          </PrimaryColumn>
          <SidebarColumn>
            <MetricCard value="$469K" label="Int'l Avg Total Comp" sentiment="neutral" />
            <MetricCard value="$750K" label="North America Avg" sentiment="neutral" />
            <MetricCard value="-32%" label="Compensation Gap" sentiment="warning" />
            <CalloutBox variant="insight">
              Lower equity prevalence and regional market differences drive the compensation differential.
              Base salaries show smaller variance ($243K vs $364K North America average).
            </CalloutBox>
          </SidebarColumn>
        </ContentRow>

        {/* Row 2: Team Size Comparison */}
        <ContentRow className="mb-16">
          <PrimaryColumn>
            <SubsectionHeader
              title="Team Scaling Patterns"
            />
            <InternationalTeamSizeChart />
          </PrimaryColumn>
          <SidebarColumn>
            <MetricCard value="150" label="Int'l Team Size at 10K+ Employees" sentiment="neutral" />
            <MetricCard value="129" label="North America 10K+" sentiment="neutral" />
            <MetricCard value="+16%" label="Enterprise Scale Difference" sentiment="good" />
            <CalloutBox variant="insight">
              Higher enterprise team sizes suggest less federation in international markets,
              with centralized security models persisting longer as companies scale.
            </CalloutBox>
          </SidebarColumn>
        </ContentRow>

        {/* Row 3: Functional Responsibilities */}
        <ContentRow className="mb-16">
          <PrimaryColumn>
            <SubsectionHeader
              title="Functional Responsibilities: Regulatory-Driven Priorities"
              description="International CISOs oversee an average of 10 functions (vs 12 in NA) with significantly higher ownership of TPRM and Privacy."
            />
            <InternationalResponsibilitiesChart />
          </PrimaryColumn>
          <SidebarColumn>
            <MetricCard value="85%" label="TPRM Ownership" sentiment="good" />
            <CalloutBox variant="default" className="text-xs">
              vs 41% in North America. Largest gap (+44pp) driven by GDPR, NIS2, and DORA regulatory emphasis
            </CalloutBox>
            <MetricCard value="73%" label="Privacy Ownership" sentiment="good" />
            <CalloutBox variant="default" className="text-xs">
              vs 58% in North America (+15pp). GDPR enforcement and DPO reporting structures
            </CalloutBox>
            <MetricCard value="10" label="Avg Functions Per CISO" sentiment="neutral" />
          </SidebarColumn>
        </ContentRow>
      </SectionWrapper>

      {/* Strategic Recommendations Section */}
      <SectionWrapper id="recommendations" variant="muted">
        <SectionHeader
          eyebrow="Section 10"
          title="Strategic Imperatives for 2026"
          description="Six critical actions for security leaders navigating compensation, governance, and organizational challenges. Click any imperative to explore implementation details and related data points."
        />

        <StrategicImperativesRoadmap />
      </SectionWrapper>

      <Footer />
    </main>
  );
}
