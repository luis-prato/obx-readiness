import { LAYERS, LayerKey } from "./criteria";

export type ProofVerdict = "provable" | "provable_with_work" | "instrument_first" | "not_provable";

export interface TelemetryResult {
  layers: Record<LayerKey, number>;
  proof_index: number;
  verdict: ProofVerdict;
  weakest: LayerKey;
  gaps: { layer: string; question: string; action: string; severity: "high" | "moderate" }[];
}

const round1 = (v: number) => Math.round(v * 10) / 10;
const toHundred = (v: number) => ((v - 1) / 4) * 100;
const avg = (n: number[]) => (n.length ? n.reduce((a, b) => a + b, 0) / n.length : 0);

export const VERDICT_LABELS: Record<ProofVerdict, string> = {
  provable: "The outcome can be proven",
  provable_with_work: "Provable after remediation",
  instrument_first: "Instrument before you contract",
  not_provable: "The outcome cannot be proven today",
};

export const VERDICT_NOTES: Record<ProofVerdict, string> = {
  provable:
    "The data foundation supports an outcome-based contract. Freeze the baseline, version the calculation and publish the evidence pack from day one.",
  provable_with_work:
    "The foundation is workable but incomplete. Close the gaps below during a shadow period before any payment depends on the number.",
  instrument_first:
    "Proof is not yet possible. Run an instrumentation and baseline programme first, then contract on outcomes once the data holds.",
  not_provable:
    "There is no defensible evidence chain today. Sell an availability or activity-based contract now, and fund the telemetry programme as a separate step.",
};

const ACTIONS: Record<string, string> = {
  i1: "Map the outcome to the signals that drive it and instrument the missing ones before pricing.",
  i2: "Raise the sampling rate, or edge-aggregate at a resolution that still captures the driving events.",
  i3: "Close fleet coverage gaps, or scope the contract to the instrumented subset only.",
  i4: "Add store-and-forward buffering at the edge so link outages do not create permanent data loss.",
  q1: "Measure completeness as a KPI in its own right and set a contractual minimum data availability.",
  q2: "Characterise drift and put a calibration schedule with evidence into the service scope.",
  q3: "Introduce a master asset registry with stable IDs shared across all systems.",
  q4: "Normalise units, time zones and timestamps at ingestion, not in downstream reports.",
  q5: "Write the outlier and exclusion rules into the measurement schedule and apply them automatically.",
  p1: "Automate the path end to end; every manual spreadsheet step is a future dispute.",
  p2: "Reduce latency to fit the review cycle, or move the payment cycle to match the data.",
  p3: "Add pipeline monitoring with alerts on ingestion failure, gaps and schema drift.",
  p4: "Version the KPI calculation and store inputs so any historical result can be reproduced.",
  p5: "Size storage and retention for the full term plus the audit tail, and fund the run cost.",
  b1: "Build a measured baseline from a representative period before committing to a target.",
  b2: "Extend the baseline window to cover seasonality, shift patterns and product mix.",
  b3: "Add a control group, index or counterfactual model to isolate attribution.",
  b4: "Get the baseline and normalisation rules signed off by both parties as a contract schedule.",
  b5: "Compare expected improvement to measurement error; widen the deadband or improve the instrument.",
  g1: "Settle data ownership, licence and derived-data rights in writing before deployment.",
  g2: "Give the counterparty or an auditor access to the underlying evidence, not just the dashboard.",
  g3: "Move to a tamper-evident record with audit logging and immutable history.",
  g4: "Complete the privacy, security and cross-border assessment before data leaves the site.",
  g5: "Name an accountable data product owner and fund the ongoing run cost in the business case.",
};

export function computeTelemetry(answers: Record<string, number>): TelemetryResult {
  const layers = {} as Record<LayerKey, number>;
  const gaps: TelemetryResult["gaps"] = [];

  for (const layer of LAYERS) {
    const values = layer.questions
      .map((q) => answers[q.key])
      .filter((v): v is number => typeof v === "number" && v > 0);
    layers[layer.key] = round1(avg(values.map(toHundred)));

    for (const q of layer.questions) {
      const a = answers[q.key];
      if (typeof a === "number" && (a <= 2 || (q.critical && a <= 3))) {
        gaps.push({
          layer: layer.label,
          question: q.text,
          action: ACTIONS[q.key] ?? "",
          severity: q.critical || a === 1 ? "high" : "moderate",
        });
      }
    }
  }

  const values = Object.values(layers);
  const mean = avg(values);
  const weakestValue = Math.min(...values);
  // Evidence chains fail at their weakest link, so the weakest layer is weighted heavily.
  const proof_index = round1(mean * 0.6 + weakestValue * 0.4);

  const weakest = (Object.keys(layers) as LayerKey[]).reduce((a, b) =>
    layers[a] <= layers[b] ? a : b
  );

  const criticalFail = LAYERS.some((l) =>
    l.questions.some((q) => q.critical && (answers[q.key] ?? 0) <= 2)
  );

  let verdict: ProofVerdict;
  if (weakestValue < 25 || (criticalFail && proof_index < 45)) verdict = "not_provable";
  else if (criticalFail || weakestValue < 40) verdict = "instrument_first";
  else if (proof_index >= 75) verdict = "provable";
  else if (proof_index >= 55) verdict = "provable_with_work";
  else verdict = "instrument_first";

  return { layers, proof_index, verdict, weakest, gaps };
}
