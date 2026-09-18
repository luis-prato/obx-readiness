import { GATES, GateKey } from "./criteria";

export type Verdict = "contractable" | "conditional" | "redesign" | "not_contractable";

export interface KpiResult {
  gates: Record<GateKey, number>;
  contractability_index: number;
  verdict: Verdict;
  weakest: GateKey;
  blockers: { gate: string; question: string; recommendation: string }[];
}

const round1 = (v: number) => Math.round(v * 10) / 10;
const toHundred = (v: number) => ((v - 1) / 4) * 100;
const avg = (n: number[]) => (n.length ? n.reduce((a, b) => a + b, 0) / n.length : 0);

export const VERDICT_LABELS: Record<Verdict, string> = {
  contractable: "Contractable",
  conditional: "Contractable with conditions",
  redesign: "Redesign required",
  not_contractable: "Not contractable",
};

export const VERDICT_NOTES: Record<Verdict, string> = {
  contractable:
    "This KPI can carry money. Lock the definition, the evidence pack and the dispute route in the contract schedule.",
  conditional:
    "Usable as a paid KPI once the open gates are closed. Treat the gaps below as conditions precedent, not afterthoughts.",
  redesign:
    "The KPI is structurally weak on at least one gate. Reframe it — change the measure, the boundary, or the accountable party — before pricing it.",
  not_contractable:
    "Do not attach payment to this KPI. Track it as an informational metric and contract on a proxy you can actually measure, verify and control.",
};

const RECOMMENDATIONS: Record<string, string> = {
  m1: "Write a single formula with numerator, denominator, unit and rounding rule into the KPI schedule.",
  m2: "Instrument the data source and run a shadow period before any payment is tied to the KPI.",
  m3: "Align measurement frequency to the payment cycle, or move payment to the slower cycle.",
  m4: "Document exclusions, planned downtime and force-majeure handling as explicit measurement rules.",
  m5: "Build a baseline from a representative period and have both parties sign it off.",
  v1: "Give the counterparty read access to the evidence, or publish a signed monthly evidence pack.",
  v2: "Source the number from a system of record with audit logging; eliminate manual re-keying.",
  v3: "Check instrument tolerance against the bonus band; widen the deadband or upgrade the sensor.",
  v4: "Add a recalculation window, evidence requirements, escalation ladder and independent arbiter.",
  v5: "Add data access, retention and portability rights covering the full contract term plus audit tail.",
  c1: "Reassign accountability to the party that owns the levers, or change the measure to one they control.",
  c2: "Convert customer-side dependencies into explicit customer obligations with relief for non-performance.",
  c3: "Exclude or index external factors; use ratios and normalised measures instead of absolutes.",
  c4: "Add a guardrail metric so the KPI cannot be improved at the expense of the real outcome.",
  c5: "Resize the risk-reward band to match the share of the outcome the party genuinely influences.",
};

export function computeKpi(answers: Record<string, number>): KpiResult {
  const gates = {} as Record<GateKey, number>;
  const blockers: KpiResult["blockers"] = [];

  for (const gate of GATES) {
    const values = gate.questions
      .map((q) => answers[q.key])
      .filter((v): v is number => typeof v === "number" && v > 0);
    gates[gate.key] = round1(avg(values.map(toHundred)));

    for (const q of gate.questions) {
      const a = answers[q.key];
      if (typeof a === "number" && (a <= 2 || (q.critical && a <= 3))) {
        blockers.push({
          gate: gate.label,
          question: q.text,
          recommendation: RECOMMENDATIONS[q.key] ?? "",
        });
      }
    }
  }

  const gateValues = Object.values(gates);
  const mean = avg(gateValues);
  const weakestValue = Math.min(...gateValues);
  // Weakest-link weighting: a KPI is only as contractable as its weakest gate.
  const contractability_index = round1(mean * 0.6 + weakestValue * 0.4);

  const weakest = (Object.keys(gates) as GateKey[]).reduce((a, b) =>
    gates[a] <= gates[b] ? a : b
  );

  const criticalFail = GATES.some((g) =>
    g.questions.some((q) => q.critical && (answers[q.key] ?? 0) <= 2)
  );

  let verdict: Verdict;
  if (weakestValue < 35 || criticalFail) verdict = weakestValue < 25 ? "not_contractable" : "redesign";
  else if (contractability_index >= 75) verdict = "contractable";
  else if (contractability_index >= 55) verdict = "conditional";
  else verdict = "redesign";

  return { gates, contractability_index, verdict, weakest, blockers };
}
