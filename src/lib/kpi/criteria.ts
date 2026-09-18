export type GateKey = "measurable" | "verifiable" | "controllable";

export interface KpiQuestion {
  key: string;
  text: string;
  /** A gate-killer question: a low score blocks contractability regardless of the average. */
  critical?: boolean;
}

export interface KpiGate {
  key: GateKey;
  label: string;
  description: string;
  questions: KpiQuestion[];
}

export const SCALE_LABELS = [
  { value: 1, label: "No" },
  { value: 2, label: "Weak" },
  { value: 3, label: "Partial" },
  { value: 4, label: "Mostly" },
  { value: 5, label: "Yes" },
];

export const GATES: KpiGate[] = [
  {
    key: "measurable",
    label: "Measurable",
    description:
      "The KPI has a single, unambiguous definition that resolves to a number from data that already exists at the required frequency.",
    questions: [
      { key: "m1", text: "Is the KPI defined by one written formula, with numerator, denominator and unit?", critical: true },
      { key: "m2", text: "Does the data needed to compute it already exist in a production system today?", critical: true },
      { key: "m3", text: "Is the measurement frequency at least as fast as the payment or review cycle?" },
      { key: "m4", text: "Are exclusions, downtime rules and edge cases written down rather than assumed?" },
      { key: "m5", text: "Is there a documented baseline built from at least one representative period?" },
    ],
  },
  {
    key: "verifiable",
    label: "Verifiable",
    description:
      "Both parties can reproduce the same number from the same evidence, and disagreements have a defined route to resolution.",
    questions: [
      { key: "v1", text: "Can the counterparty independently reproduce the number from evidence they can access?", critical: true },
      { key: "v2", text: "Is the data source tamper-evident (system of record, logged, not manually re-keyed)?" },
      { key: "v3", text: "Is sensor or instrument accuracy sufficient relative to the size of the bonus or penalty band?" },
      { key: "v4", text: "Is there a named dispute path — recalculation window, evidence pack, escalation, arbiter?", critical: true },
      { key: "v5", text: "Are data access and retention rights covered contractually for the full term?" },
    ],
  },
  {
    key: "controllable",
    label: "Controllable",
    description:
      "The party being paid on the KPI can actually move it, and factors outside their control are carved out or shared explicitly.",
    questions: [
      { key: "c1", text: "Can the accountable party materially move this KPI through its own decisions?", critical: true },
      { key: "c2", text: "Are customer-side dependencies (inputs, access, operator behaviour) defined as obligations?", critical: true },
      { key: "c3", text: "Are external factors — demand, price, weather, feedstock — excluded or indexed?" },
      { key: "c4", text: "Is the KPI resistant to gaming, i.e. it cannot be improved in a way that harms the outcome?" },
      { key: "c5", text: "Is the risk-reward band sized to the influence the party genuinely has?" },
    ],
  },
];

export const TOTAL_QUESTIONS = GATES.reduce((n, g) => n + g.questions.length, 0);
