import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { GATES, SCALE_LABELS, TOTAL_QUESTIONS } from "@/lib/kpi/criteria";
import { computeKpi, KpiResult, VERDICT_LABELS, VERDICT_NOTES } from "@/lib/kpi/scoring";
import { cn } from "@/lib/utils";

const NEXT_STEPS = [
  { label: "The Library", note: "KPI definitions, clause banks, and reference models", to: "/obx-ai-skills-model" },
  { label: "The Playbooks", note: "From diagnostic to a funded, verified contract", to: "/obx-ai-skills-model" },
  { label: "Outcome Readiness Assessment", note: "Score the wider category across ten dimensions", to: "/obx-readiness/assessment" },
];

const KpiTestTool = () => {
  const [kpiName, setKpiName] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<KpiResult | null>(null);

  const answered = Object.keys(answers).length;
  const complete = answered === TOTAL_QUESTIONS;
  const progress = Math.round((answered / TOTAL_QUESTIONS) * 100);

  const handleCompute = () => {
    setResult(computeKpi(answers));
    setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  return (
    <div className="bg-background text-foreground">


      {/* KPI under test */}
      <section className="px-6 md:px-12 lg:px-16 pb-12">
        <div className="border-t border-foreground/10 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-5">
              Context — optional
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-normal leading-snug">
              Name the KPI under test
            </h2>
            <p className="mt-4 font-sans text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
              Test one KPI at a time. Used only to label your on-screen result.
            </p>
          </div>
          <div className="lg:col-span-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
              KPI
            </p>
            <input
              value={kpiName}
              onChange={(e) => setKpiName(e.target.value)}
              placeholder="e.g. Availability of the packaging line (%)"
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

      {/* Gates */}
      <section className="px-6 md:px-12 lg:px-16 py-14 md:py-20">
        <div className="space-y-14 md:space-y-20">
          {GATES.map((gate, i) => (
            <div key={gate.key} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 border-t border-foreground/10 pt-10">
              <div className="lg:col-span-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-5">
                  {String(i + 1).padStart(2, "0")} — Gate
                </p>
                <h2 className="font-serif text-2xl md:text-3xl font-normal leading-snug">{gate.label}</h2>
                <p className="mt-4 font-sans text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
                  {gate.description}
                </p>
              </div>
              <div className="lg:col-span-7 border-t border-foreground/10">
                {gate.questions.map((q) => (
                  <div key={q.key} className="border-b border-foreground/10 py-6">
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="font-sans text-base md:text-lg font-medium">{q.text}</p>
                      {q.critical && (
                        <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                          Gate-killer
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
          {complete ? "Test contractability →" : `Answer all questions to continue (${answered}/${TOTAL_QUESTIONS})`}
        </button>
      </section>

      {/* Results */}
      {result && (
        <section id="results" className="scroll-mt-28 px-6 md:px-12 lg:px-16 pb-24 md:pb-32">
          <div className="border-t border-foreground/10 pt-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-5">
              Result {kpiName ? `— ${kpiName}` : ""}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-normal leading-snug">
              {VERDICT_LABELS[result.verdict]}
            </h2>
            <p className="mt-4 max-w-2xl font-sans text-base text-muted-foreground leading-relaxed">
              {VERDICT_NOTES[result.verdict]}
            </p>

            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 border-t border-l border-foreground/10">
              {[
                { label: "Contractability Index", value: result.contractability_index },
                { label: "Measurable", value: result.gates.measurable },
                { label: "Verifiable", value: result.gates.verifiable },
                { label: "Controllable", value: result.gates.controllable },
              ].map((m) => (
                <div key={m.label} className="border-b border-r border-foreground/10 p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {m.label}
                  </p>
                  <p className="mt-3 font-serif text-4xl md:text-5xl">{m.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <div className="flex items-center justify-between mb-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Gate profile
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em]">
                  Weakest gate: {result.weakest}
                </p>
              </div>
              <div className="border-t border-foreground/10">
                {GATES.map((g) => (
                  <div key={g.key} className="border-b border-foreground/10 py-6">
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="font-sans text-base font-medium">{g.label}</p>
                      <span className="font-mono text-xs">{result.gates[g.key]}</span>
                    </div>
                    <div className="mt-3 h-px w-full bg-foreground/10">
                      <div className="h-px bg-foreground transition-all duration-500" style={{ width: `${result.gates[g.key]}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
                Blockers & fixes
              </p>
              <div className="border-t border-foreground/10">
                {result.blockers.length === 0 ? (
                  <p className="py-6 font-sans text-sm text-muted-foreground">
                    No blocking weaknesses detected. Lock the definition and evidence pack in the contract schedule.
                  </p>
                ) : (
                  result.blockers.map((b, i) => (
                    <div key={i} className="border-b border-foreground/10 py-6">
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="font-sans text-base font-medium">{b.question}</p>
                        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                          {b.gate}
                        </span>
                      </div>
                      <p className="mt-2 font-sans text-sm text-muted-foreground">{b.recommendation}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Next steps */}
            <div className="mt-16 border-t border-foreground/10 pt-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-5">
                Where to go next
              </p>
              <h3 className="font-serif text-2xl md:text-3xl font-normal leading-snug max-w-2xl">
                Turn the KPI into a clause you can price
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

export default KpiTestTool;
