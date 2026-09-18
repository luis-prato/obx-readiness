import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { DIMENSIONS, SCALE_LABELS, CONTEXT_OPTIONS } from "@/lib/discovery/dimensions";
import { computeScores, DIMENSION_LABELS, ScoringResult } from "@/lib/discovery/scoring";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

const TOTAL_QUESTIONS = DIMENSIONS.reduce((n, d) => n + d.questions.length, 0);

const NEXT_STEPS = [
  {
    label: "KPI Contractability Test",
    note: "Measurable, verifiable, controllable?",
    to: "/obx-readiness/KPIContractabilityTest",
  },
  {
    label: "Data & Telemetry Baseline Check",
    note: "Can the outcome actually be proven?",
    to: "/obx-readiness/DataTelemetry",
  },
  {
    label: "OBX — AI Skills Model",
    note: "Practical AI capabilities for industrial teams",
    to: "/obx-ai-skills-model",
  },
];

const ReadinessAssessment = () => {
  const [industry, setIndustry] = useState("");
  const [type, setType] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<ScoringResult | null>(null);

  const answered = Object.keys(answers).length;
  const complete = answered === TOTAL_QUESTIONS;
  const progress = Math.round((answered / TOTAL_QUESTIONS) * 100);

  const radarData = useMemo(
    () =>
      result
        ? Object.entries(result.dimensions).map(([key, value]) => ({
            dimension: DIMENSION_LABELS[key as keyof typeof DIMENSION_LABELS],
            score: value ?? 0,
          }))
        : [],
    [result]
  );

  const handleCompute = () => {
    setResult(computeScores(answers));
    setTimeout(
      () => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }),
      50
    );
  };

  return (
    <div id="assessment" className="scroll-mt-28">
      <section className="px-6 md:px-12 lg:px-16 pb-12">
        <div className="border-t border-foreground/10 pt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-5">
            01 — Outcome Readiness Assessment
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-normal leading-snug">
            Twenty questions across ten dimensions
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-sm md:text-base text-muted-foreground leading-relaxed">
            Scoring is deterministic and runs entirely in your browser — nothing is stored or sent
            anywhere. Do not enter confidential information.
          </p>
        </div>
      </section>

      {/* Context */}
      <section className="px-6 md:px-12 lg:px-16 pb-12">
        <div className="border-t border-foreground/10 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-5">
              Context — optional
            </p>
            <h3 className="font-serif text-2xl md:text-3xl font-normal leading-snug">
              Frame the diagnostic
            </h3>
            <p className="mt-4 font-sans text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
              Used only to label your on-screen results.
            </p>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Industry
              </p>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="rounded-none border-foreground/20">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {CONTEXT_OPTIONS.industry.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Transformation type
              </p>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="rounded-none border-foreground/20">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {CONTEXT_OPTIONS.transformation_type.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Progress */}
      <div className="sticky top-[57px] z-30 bg-background/90 backdrop-blur border-y border-foreground/10 px-6 md:px-12 lg:px-16 py-3">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>Progress</span>
          <span>{answered} / {TOTAL_QUESTIONS}</span>
        </div>
        <div className="mt-2 h-px w-full bg-foreground/10">
          <div className="h-px bg-foreground transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Questions */}
      <section className="px-6 md:px-12 lg:px-16 py-14 md:py-20">
        <div className="space-y-14 md:space-y-20">
          {DIMENSIONS.map((dim, i) => (
            <div key={dim.key} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 border-t border-foreground/10 pt-10">
              <div className="lg:col-span-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-5">
                  {String(i + 1).padStart(2, "0")} — Dimension
                </p>
                <h3 className="font-serif text-2xl md:text-3xl font-normal leading-snug">{dim.label}</h3>
                <p className="mt-4 font-sans text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
                  {dim.description}
                </p>
              </div>
              <div className="lg:col-span-7 border-t border-foreground/10">
                {dim.questions.map((q) => (
                  <div key={q.key} className="border-b border-foreground/10 py-6">
                    <p className="font-sans text-base md:text-lg font-medium">{q.text}</p>
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {SCALE_LABELS.map((s) => {
                        const active = answers[q.key] === s.value;
                        return (
                          <button
                            key={s.value}
                            type="button"
                            onClick={() => setAnswers((prev) => ({ ...prev, [q.key]: s.value }))}
                            className={cn(
                              "border px-2 py-3 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors",
                              active
                                ? "border-foreground bg-foreground text-background"
                                : "border-foreground/15 text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                            )}
                          >
                            {s.value} · {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled={!complete}
          onClick={handleCompute}
          className={cn(
            "mt-14 w-full border py-5 font-mono text-xs uppercase tracking-[0.2em] transition-colors",
            complete
              ? "border-foreground hover:bg-foreground hover:text-background"
              : "border-foreground/15 text-muted-foreground cursor-not-allowed"
          )}
        >
          {complete ? "Compute readiness →" : `Answer all questions to continue (${answered}/${TOTAL_QUESTIONS})`}
        </button>
      </section>

      {/* Results */}
      {result && (
        <section id="results" className="scroll-mt-28 px-6 md:px-12 lg:px-16 pb-24 md:pb-32">
          <div className="border-t border-foreground/10 pt-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-5">
              Results {industry ? `— ${industry}` : ""}
            </p>
            <h3 className="font-serif text-3xl md:text-4xl font-normal leading-snug">
              Readiness profile
            </h3>

            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 border-t border-l border-foreground/10">
              {[
                { label: "Readiness Index", value: result.readiness_index },
                { label: "Maturity", value: result.maturity_score },
                { label: "Alignment", value: result.alignment_score },
                { label: "Capability", value: result.capability_score },
              ].map((m) => (
                <div key={m.label} className="border-b border-r border-foreground/10 p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {m.label}
                  </p>
                  <p className="mt-3 font-serif text-4xl md:text-5xl">{m.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              <div className="lg:col-span-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Dimension profile
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em]">
                    Risk: {result.risk_band}
                  </p>
                </div>
                <div className="h-[380px] border border-foreground/10 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} outerRadius="70%">
                      <PolarGrid stroke="hsl(var(--foreground) / 0.15)" />
                      <PolarAngleAxis
                        dataKey="dimension"
                        tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                      />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        dataKey="score"
                        stroke="hsl(var(--foreground))"
                        fill="hsl(var(--foreground))"
                        fillOpacity={0.12}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  Misalignment flags
                </p>
                <div className="border-t border-foreground/10">
                  {result.flags.length === 0 ? (
                    <p className="py-6 font-sans text-sm text-muted-foreground">
                      No structural misalignments detected.
                    </p>
                  ) : (
                    result.flags.map((f) => (
                      <div key={f.area} className="border-b border-foreground/10 py-6">
                        <div className="flex items-baseline justify-between gap-4">
                          <p className="font-sans text-base font-medium">{f.area}</p>
                          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                            {f.severity}
                          </span>
                        </div>
                        <p className="mt-2 font-sans text-sm text-muted-foreground">{f.description}</p>
                        <p className="mt-2 font-sans text-sm">{f.recommendation}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Next steps */}
            <div className="mt-16 border-t border-foreground/10 pt-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-5">
                Where to go next
              </p>
              <h3 className="font-serif text-2xl md:text-3xl font-normal leading-snug max-w-2xl">
                Turn the profile into a contract you can fund
              </h3>
              <div className="mt-8 border-t border-foreground/10">
                {NEXT_STEPS.map((s) => (
                  <Link
                    key={s.label}
                    to={s.to}
                    className="group flex items-center justify-between gap-6 border-b border-foreground/10 py-6"
                  >
                    <div>
                      <p className="font-sans text-base md:text-lg font-medium group-hover:opacity-60 transition-opacity">
                        {s.label}
                      </p>
                      <p className="mt-1 font-sans text-sm text-muted-foreground">{s.note}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                  </Link>
                ))}
              </div>

              <Link
                to="https://www.luisprato.com/contact"
                className="mt-10 block border border-foreground/20 py-5 text-center font-mono text-xs uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-colors"
              >
                Start a conversation →
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ReadinessAssessment;
