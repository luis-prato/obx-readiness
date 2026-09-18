import { DIMENSIONS, DIMENSION_KEYS, DimensionKey } from "./dimensions";

export type RiskBand = "low" | "moderate" | "elevated" | "high";

export interface ScoringResult {
  dimensions: Record<DimensionKey, number | null>;
  readiness_index: number;
  maturity_score: number;
  alignment_score: number;
  capability_score: number;
  risk_band: RiskBand;
  flags: { area: string; severity: "low" | "moderate" | "high"; description: string; recommendation: string }[];
}

const COMPOSITE_GROUPS: Record<"maturity" | "alignment" | "capability", DimensionKey[]> = {
  maturity: ["operational_readiness", "data_systems_maturity", "performance_measurement"],
  alignment: ["strategic_clarity", "leadership_alignment", "stakeholder_buy_in"],
  capability: ["change_capability", "execution_governance", "transformation_velocity"],
};

const READINESS_WEIGHTS = { alignment: 0.3, maturity: 0.3, capability: 0.25, risk: 0.15 };

const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));
const round1 = (v: number) => Math.round(v * 10) / 10;
const scaleToHundred = (v: number) => clamp(((v - 1) / 4) * 100);

const avg = (nums: number[]) => (nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null);

function band(score: number): RiskBand {
  if (score >= 75) return "low";
  if (score >= 55) return "moderate";
  if (score >= 35) return "elevated";
  return "high";
}

export function computeScores(answers: Record<string, number>): ScoringResult {
  const dimensions = {} as Record<DimensionKey, number | null>;

  for (const dim of DIMENSIONS) {
    const values = dim.questions
      .map((q) => answers[q.key])
      .filter((v): v is number => typeof v === "number" && v > 0)
      .map(scaleToHundred);
    const mean = avg(values);
    dimensions[dim.key] = mean == null ? null : round1(mean);
  }

  const groupScore = (keys: DimensionKey[]) => {
    const vals = keys.map((k) => dimensions[k]).filter((v): v is number => v != null);
    return vals.length ? round1(avg(vals)!) : 0;
  };

  const maturity_score = groupScore(COMPOSITE_GROUPS.maturity);
  const alignment_score = groupScore(COMPOSITE_GROUPS.alignment);
  const capability_score = groupScore(COMPOSITE_GROUPS.capability);
  const riskControl = dimensions.risk_exposure ?? 0;

  const readiness_index = round1(
    alignment_score * READINESS_WEIGHTS.alignment +
      maturity_score * READINESS_WEIGHTS.maturity +
      capability_score * READINESS_WEIGHTS.capability +
      riskControl * READINESS_WEIGHTS.risk
  );

  const flags: ScoringResult["flags"] = [];
  const push = (
    area: string,
    severity: "low" | "moderate" | "high",
    description: string,
    recommendation: string
  ) => flags.push({ area, severity, description, recommendation });

  if (alignment_score - capability_score >= 20)
    push("Ambition vs. capability gap", "high",
      "Leadership alignment materially outpaces execution capability.",
      "Sequence a capability build (governance, change, delivery cadence) before scaling commitments.");

  if (maturity_score - alignment_score >= 20)
    push("Operational readiness ahead of sponsorship", "moderate",
      "Operations are more prepared than the leadership consensus supports.",
      "Run a sponsor alignment workshop to convert operational readiness into funded scope.");

  if ((dimensions.data_systems_maturity ?? 100) < 45)
    push("Telemetry foundation", "high",
      "Data and systems maturity is too low to support outcome-based billing or SLAs.",
      "Prioritise data ownership, integration, and a minimum viable telemetry set.");

  if ((dimensions.performance_measurement ?? 100) < 45)
    push("Measurement discipline", "high",
      "KPI definitions and reporting infrastructure cannot yet evidence performance.",
      "Define a KPI tree with owners, baselines, and an auditable measurement path.");

  if ((dimensions.risk_exposure ?? 100) < 40)
    push("Risk allocation", "moderate",
      "Risk is under-quantified and poorly allocated in commercial terms.",
      "Map risk-to-party in the contract model and attach mitigation owners.");

  if ((dimensions.stakeholder_buy_in ?? 100) < 45)
    push("Adoption risk", "moderate",
      "Buy-in below the level required for a durable operating model change.",
      "Surface middle-management objections early and tie incentives to adoption milestones.");

  if ((dimensions.transformation_velocity ?? 100) < 40)
    push("Delivery momentum", "low",
      "Milestone delivery and pilot scaling are inconsistent.",
      "Reduce work-in-progress and enforce a fixed quarterly delivery cadence.");

  return {
    dimensions,
    readiness_index,
    maturity_score,
    alignment_score,
    capability_score,
    risk_band: band(readiness_index),
    flags,
  };
}

export const DIMENSION_LABELS: Record<DimensionKey, string> = DIMENSION_KEYS.reduce((acc, k) => {
  acc[k] = DIMENSIONS.find((d) => d.key === k)!.label;
  return acc;
}, {} as Record<DimensionKey, string>);
