export type LayerKey = "instrumentation" | "quality" | "pipeline" | "baseline" | "governance";

export interface TelemetryQuestion {
  key: string;
  text: string;
  /** A hard prerequisite: a low score blocks proof regardless of the average. */
  critical?: boolean;
}

export interface TelemetryLayer {
  key: LayerKey;
  label: string;
  description: string;
  questions: TelemetryQuestion[];
}

export const SCALE_LABELS = [
  { value: 1, label: "No" },
  { value: 2, label: "Weak" },
  { value: 3, label: "Partial" },
  { value: 4, label: "Mostly" },
  { value: 5, label: "Yes" },
];

export const LAYERS: TelemetryLayer[] = [
  {
    key: "instrumentation",
    label: "Instrumentation",
    description:
      "The physical and digital signals required to observe the outcome exist on the asset, at the right resolution, for the whole installed base.",
    questions: [
      { key: "i1", text: "Are the signals that drive the outcome captured by sensors or systems today?", critical: true },
      { key: "i2", text: "Is the sampling rate fine enough to detect the events the outcome depends on?" },
      { key: "i3", text: "Is coverage consistent across the whole fleet, sites and asset generations?", critical: true },
      { key: "i4", text: "Is connectivity reliable, with local buffering when the link drops?" },
    ],
  },
  {
    key: "quality",
    label: "Data quality",
    description:
      "The captured data is complete, accurate, timely and consistently labelled — the difference between telemetry and noise.",
    questions: [
      { key: "q1", text: "Is data completeness measured, with a known and acceptable gap rate?", critical: true },
      { key: "q2", text: "Is sensor accuracy and drift characterised, with a calibration schedule in place?" },
      { key: "q3", text: "Are assets, sites and events identified with stable, unique IDs across systems?" },
      { key: "q4", text: "Are units, time zones and timestamps normalised at ingestion?" },
      { key: "q5", text: "Are anomalies and outliers handled by a written rule rather than case by case?" },
    ],
  },
  {
    key: "pipeline",
    label: "Pipeline & architecture",
    description:
      "Data moves from edge to report through an automated, monitored path that produces the same number every time it runs.",
    questions: [
      { key: "p1", text: "Is the path from edge to reporting automated end to end, without manual spreadsheets?", critical: true },
      { key: "p2", text: "Is latency short enough for the KPI review and payment cycle?" },
      { key: "p3", text: "Is the pipeline monitored, with alerts on ingestion failure and data gaps?" },
      { key: "p4", text: "Is the KPI calculation versioned, so a past result can be reproduced exactly?" },
      { key: "p5", text: "Can the volume and retention be sustained for the full contract term?" },
    ],
  },
  {
    key: "baseline",
    label: "Baseline & proof",
    description:
      "There is a defensible before-picture and a method that isolates your contribution from everything else that changed.",
    questions: [
      { key: "b1", text: "Does a baseline exist, built from a representative period rather than an estimate?", critical: true },
      { key: "b2", text: "Is the baseline period long enough to cover seasonality and product mix?" },
      { key: "b3", text: "Is there a method to separate your effect from external change — control group, index or model?", critical: true },
      { key: "b4", text: "Have both parties formally agreed the baseline and the normalisation rules?" },
      { key: "b5", text: "Is the improvement expected to exceed the measurement error of the system?" },
    ],
  },
  {
    key: "governance",
    label: "Access & governance",
    description:
      "The evidence is legally usable, auditable and available to the party who has to be convinced by it.",
    questions: [
      { key: "g1", text: "Are data ownership and usage rights settled between the parties in writing?", critical: true },
      { key: "g2", text: "Can the counterparty or an auditor access the underlying evidence, not only the summary?" },
      { key: "g3", text: "Is the record tamper-evident, with audit logs and immutable history?" },
      { key: "g4", text: "Are privacy, security and cross-border transfer requirements satisfied?" },
      { key: "g5", text: "Is a named team accountable for the data product, with funded run cost?" },
    ],
  },
];

export const TOTAL_QUESTIONS = LAYERS.reduce((n, l) => n + l.questions.length, 0);
