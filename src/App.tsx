import { Link, Route, Routes } from 'react-router-dom';
import { ArrowRight, BarChart3, Gauge, RadioTower } from 'lucide-react';
import ObxAppLayout from '@/components/obx/ObxAppLayout';
import AnimatedSection from '@/components/AnimatedSection';
import ReadinessAssessment from '@/components/obx/ReadinessAssessment';
import KpiTestTool from '@/components/obx/KpiTestTool';
import TelemetryCheckTool from '@/components/obx/TelemetryCheckTool';

const TOOLS = [
  {
    number: '01',
    title: 'Outcome Readiness Assessment',
    note: 'Score a category across the four gates',
    detail: 'Assess whether a category is ready for outcome-based contracting before investing in solution design.',
    to: '/assessment',
    cta: 'Open assessment',
    icon: Gauge,
  },
  {
    number: '02',
    title: 'KPI Contractability Test',
    note: 'Measurable, verifiable, controllable?',
    detail: 'Test whether a proposed performance measure is strong enough to carry commercial risk.',
    to: '/kpi-contractability-test',
    cta: 'Open test',
    icon: BarChart3,
  },
  {
    number: '03',
    title: 'Data & Telemetry Baseline Check',
    note: 'Can the outcome actually be proven?',
    detail: 'Examine the instrumentation, data quality, pipeline, baseline, and governance behind an outcome.',
    to: '/data-telemetry',
    cta: 'Open check',
    icon: RadioTower,
  },
] as const;

const ReadinessHome = () => (
  <ObxAppLayout
    appName="Readiness"
    title="Test the foundations before you contract the outcome."
    intro="Three focused assessments for the commercial, operational, and data conditions behind an outcome-based model. Results stay in your browser."
    seoTitle="OBX — Readiness"
    seoDescription="Assess outcome readiness, KPI contractability, and the data foundation required for performance-based industrial models."
    path="/"
    kind="readiness"
    steps={[
      { title: 'Choose the readiness check', detail: 'Start with overall outcome readiness, KPI contractability, or the data and telemetry baseline.' },
      { title: 'Work through the questions', detail: 'Assess the commercial, operational, measurement, and governance conditions using the guided prompts.' },
      { title: 'Review the gaps', detail: 'Use the result to identify what must improve before an outcome-based agreement is designed.' },
    ]}
    faqs={[
      { question: 'Is my assessment data stored?', answer: 'No. Your readiness answers and results stay in your browser.' },
      { question: 'Which assessment should I start with?', answer: 'Begin with the Outcome Readiness Assessment for the broad view, then use the KPI and telemetry checks to investigate specific gaps.' },
      { question: 'Does a high score mean the category is ready to contract?', answer: 'The result is a structured diagnostic, not a final contracting decision. Validate it with commercial, operational, legal, and customer stakeholders.' },
      { question: 'Can I repeat an assessment?', answer: 'Yes. Repeat it as assumptions, data quality, or operating conditions change.' },
    ]}
  >
    <section className="px-6 pb-20 md:px-12 md:pb-24 lg:px-16">
      <div className="grid grid-cols-1 border-l border-t border-foreground/15 lg:grid-cols-3">
        {TOOLS.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <AnimatedSection key={tool.title} delay={index * 0.05}>
              <Link
                to={tool.to}
                className="group flex h-full min-h-[26rem] flex-col border-b border-r border-foreground/15 p-7 transition-colors hover:bg-muted md:p-9"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {tool.number}
                  </span>
                  <Icon className="h-7 w-7" strokeWidth={1.25} aria-hidden="true" />
                </div>
                <div className="mt-auto">
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    {tool.note}
                  </p>
                  <h2 className="mt-4 font-serif text-3xl font-normal leading-tight">{tool.title}</h2>
                  <p className="mt-4 font-sans text-sm leading-relaxed text-muted-foreground">{tool.detail}</p>
                  <span className="mt-8 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
                    {tool.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                  </span>
                </div>
              </Link>
            </AnimatedSection>
          );
        })}
      </div>
    </section>
  </ObxAppLayout>
);

const AssessmentPage = () => (
  <ObxAppLayout
    appName="Readiness"
    title="Outcome Readiness Assessment"
    intro="Twenty questions across ten dimensions. Assess whether a category is ready for outcome-based contracting before investing in solution design. Results stay in your browser."
    seoTitle="OBX — Outcome Readiness Assessment"
    seoDescription="Score a category across ten dimensions to see whether it is ready for outcome-based contracting."
    path="/assessment"
    kind="readiness"
    steps={[
      { title: 'Frame the diagnostic', detail: 'Optionally name the industry and transformation type so the result is labelled clearly.' },
      { title: 'Answer twenty questions', detail: 'Score each dimension honestly — maturity, alignment and capability are weighted separately.' },
      { title: 'Read the profile', detail: 'Review the readiness index, dimension radar and misalignment flags before designing an offer.' },
    ]}
    faqs={[
      { question: 'Is my assessment data stored?', answer: 'No. Answers and results stay in your browser and are never sent anywhere.' },
      { question: 'How long does it take?', answer: 'Around ten minutes if you already know the category well.' },
      { question: 'Does a high score mean the category is ready to contract?', answer: 'It is a structured diagnostic, not a decision. Validate it with commercial, operational, legal and customer stakeholders.' },
      { question: 'What should I do next?', answer: 'Use the KPI Contractability Test and the Data & Telemetry Baseline Check to investigate the specific gaps it surfaces.' },
    ]}
  >
    <ReadinessAssessment />
  </ObxAppLayout>
);

const KpiTestPage = () => (
  <ObxAppLayout
    appName="Readiness"
    title="KPI Contractability Test"
    intro="Fifteen questions across three gates — measurable, verifiable, controllable. A KPI is only as contractable as its weakest gate. Scoring runs entirely in your browser."
    seoTitle="OBX — KPI Contractability Test"
    seoDescription="Test whether a proposed performance measure is strong enough to carry commercial risk."
    path="/kpi-contractability-test"
    kind="readiness"
    steps={[
      { title: 'Name the KPI', detail: 'Test one performance measure at a time so the verdict stays unambiguous.' },
      { title: 'Score the three gates', detail: 'Answer fifteen questions on measurability, verifiability and controllability, including the gate-killers.' },
      { title: 'Act on the blockers', detail: 'Use the contractability index and the listed fixes before attaching money to the KPI.' },
    ]}
    faqs={[
      { question: 'Is anything stored?', answer: 'No. The test runs locally in your browser and nothing is sent anywhere.' },
      { question: 'What is a gate-killer question?', answer: 'A question where a low score blocks contractability regardless of the overall average.' },
      { question: 'Why is my index lower than the average?', answer: 'The weakest gate is weighted heavily — a KPI is only as contractable as its weakest link.' },
      { question: 'What if the verdict is "redesign required"?', answer: 'Change the measure, the boundary or the accountable party before pricing it.' },
    ]}
  >
    <KpiTestTool />
  </ObxAppLayout>
);

const TelemetryCheckPage = () => (
  <ObxAppLayout
    appName="Readiness"
    title="Data & Telemetry Baseline Check"
    intro="Twenty-four questions across instrumentation, data quality, pipeline, baseline and governance. The question behind all of them: can the outcome actually be proven?"
    seoTitle="OBX — Data & Telemetry Baseline Check"
    seoDescription="Examine the instrumentation, data quality, pipeline, baseline and governance behind an outcome-based agreement."
    path="/data-telemetry"
    kind="readiness"
    steps={[
      { title: 'Set the scope', detail: 'One asset class, fleet or site at a time, so the evidence chain is concrete.' },
      { title: 'Score the five layers', detail: 'Work through instrumentation, data quality, pipeline, baseline and governance.' },
      { title: 'Close the gaps', detail: 'Use the proof index and remediation list to fix the evidence chain before contracting.' },
    ]}
    faqs={[
      { question: 'Is anything stored?', answer: 'No. The check runs locally in your browser and nothing is sent anywhere.' },
      { question: 'What does the proof index mean?', answer: 'It expresses how defensible the measured outcome would be if challenged by the counterparty.' },
      { question: 'Which layer matters most?', answer: 'The weakest one. A perfect sensor set cannot compensate for an unfrozen baseline or missing data rights.' },
      { question: 'When should I repeat it?', answer: 'Whenever instrumentation, data ownership or operating conditions change.' },
    ]}
  >
    <TelemetryCheckTool />
  </ObxAppLayout>
);

const App = () => (
  <Routes>
    <Route path="/" element={<ReadinessHome />} />
    <Route path="/assessment" element={<AssessmentPage />} />
    <Route path="/kpi-contractability-test" element={<KpiTestPage />} />
    <Route path="/data-telemetry" element={<TelemetryCheckPage />} />
    <Route path="*" element={<ReadinessHome />} />
  </Routes>
);

export default App;
