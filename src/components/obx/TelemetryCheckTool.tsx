import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { LAYERS, SCALE_LABELS, TOTAL_QUESTIONS } from "@/lib/telemetry/criteria";
import { computeTelemetry, TelemetryResult, VERDICT_LABELS, VERDICT_NOTES } from "@/lib/telemetry/scoring";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

const NEXT_STEPS = [
  { label: "KPI Contractability Test", note: "Measurable, verifiable, controllable?", to: "/obx-readiness/KPIContractabilityTest" },
  { label: "Outcome Readiness Assessment", note: "Score the category across ten dimensions", to: "/obx-readiness/assessment" },
  { label: "The Library", note: "KPI definitions, clause banks, and reference models", to: "/obx-ai-skills-model" },
];

const TelemetryCheckTool = () => {
  const [scope, setScope] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<TelemetryResult | null>(null);

  const answered = Object.keys(answers).length;
  const complete = answered === TOTAL_QUESTIONS;
  const progress = Math.round((answered / TOTAL_QUESTIONS) * 100);

  const radarData = useMemo(
    () =>
      result
        ? LAYERS.map((l) => ({ layer: l.label, score: result.layers[l.key] ?? 0 }))
        : [],
    [result]
  );

  const handleCompute = () => {
    setResult(computeTelemetry(answers));
    setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  return (
    <div className="bg-background text-foreground">
      {/* Scope */}
      <section className="px-6 md:px-12 lg:px-16 pb-12">
        <div className="border-t border-foreground/10 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-5">
              Context — optional
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-normal leading-snug">
              Name the scope under test
            </h2>
            <p className="mt-4 font-sans text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
              One asset class, fleet or site at a time. Used only to label your on-screen result.
            </p>
          </div>
          <div className="lg:col-span-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Scope
            </p>
            <input
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="e.g. Compressor fleet, Nordics — energy per unit produced"
              className="w-full border border-foreground/20 bg-transparent px-4 py-3 font-sans text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
            />
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

      {/* Layers */}
      <section className="px-6 md:px-12 lg:px-16 py-14 md:py-20">
        <div className="space-y-14 md:space-y-20">
          {LAYERS.map((layer, i) => (
            <div key={layer.key} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 border-t border-foreground/10 pt-10">
              <div className="lg:col-span-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-5">
                  {String(i + 1).padStart(2, "0")} — Layer
                </p>
                <h2 className="font-serif text-2xl md:text-3xl font-normal leading-snug">{layer.label}</h2>
                <p className="mt-4 font-sans text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
                  {layer.description}
                </p>
              </div>
              <div className="lg:col-span-7 border-t border-foreground/10">
                {layer.questions.map((q) => (
                  <div key={q.key} className="border-b border-foreground/10 py-6">
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="font-sans text-base md:text-lg font-medium">{q.text}</p>
                      {q.critical && (
                        <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                          Prerequisite
                        </span>
                      )}
                    </div>
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
          {complete ? "Check the evidence chain →" : `Answer all questions to continue (${answered}/${TOTAL_QUESTIONS})`}
        </button>
      </section>

      {/* Results */}
      {result && (
        <section id="results" className="scroll-mt-28 px-6 md:px-12 lg:px-16 pb-24 md:pb-32">
          <div className="border-t border-foreground/10 pt-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-5">
              Result {scope ? `— ${scope}` : ""}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-normal leading-snug">
              {VERDICT_LABELS[result.verdict]}
            </h2>
            <p className="mt-4 max-w-2xl font-sans text-base text-muted-foreground leading-relaxed">
              {VERDICT_NOTES[result.verdict]}
            </p>

            <div className="mt-10 grid grid-cols-2 lg:grid-cols-3 border-t border-l border-foreground/10">
              {[
                { label: "Proof Index", value: result.proof_index },
                { label: "Instrumentation", value: result.layers.instrumentation },
                { label: "Data quality", value: result.layers.quality },
                { label: "Pipeline", value: result.layers.pipeline },
                { label: "Baseline & proof", value: result.layers.baseline },
                { label: "Access & governance", value: result.layers.governance },
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
                    Evidence chain profile
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em]">
                    Weakest: {result.weakest}
                  </p>
                </div>
                <div className="h-[380px] border border-foreground/10 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} outerRadius="70%">
                      <PolarGrid stroke="hsl(var(--foreground) / 0.15)" />
                      <PolarAngleAxis
                        dataKey="layer"
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
                  Gaps &amp; remediation
                </p>
                <div className="border-t border-foreground/10">
                  {result.gaps.length === 0 ? (
                    <p className="py-6 font-sans text-sm text-muted-foreground">
                      No blocking gaps detected. Freeze the baseline and version the calculation.
                    </p>
                  ) : (
                    result.gaps.map((g, i) => (
                      <div key={i} className="border-b border-foreground/10 py-6">
                        <div className="flex items-baseline justify-between gap-4">
                          <p className="font-sans text-base font-medium">{g.question}</p>
                          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                            {g.severity}
                          </span>
                        </div>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                          {g.layer}
                        </p>
                        <p className="mt-2 font-sans text-sm text-muted-foreground">{g.action}</p>
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
                Turn the evidence chain into a contract you can defend
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

export default TelemetryCheckTool;
