export interface Question { key: string; text: string }
export interface Dimension { key: DimensionKey; label: string; description: string; questions: Question[] }

export const DIMENSION_KEYS = [
  "strategic_clarity",
  "leadership_alignment",
  "stakeholder_buy_in",
  "operational_readiness",
  "data_systems_maturity",
  "change_capability",
  "execution_governance",
  "risk_exposure",
  "performance_measurement",
  "transformation_velocity",
] as const;

export type DimensionKey = (typeof DIMENSION_KEYS)[number];

export const SCALE_LABELS: { value: number; label: string }[] = [
  { value: 1, label: "Nascent" },
  { value: 2, label: "Developing" },
  { value: 3, label: "Defined" },
  { value: 4, label: "Managed" },
  { value: 5, label: "Optimized" },
];

export const DIMENSIONS: Dimension[] = [
  {
    key: "strategic_clarity",
    label: "Strategic Clarity",
    description: "Coherence and articulation of the transformation thesis.",
    questions: [
      { key: "sc_1", text: "How clearly is the transformation ambition articulated at executive level?" },
      { key: "sc_2", text: "How explicit are the target outcomes and success metrics?" },
    ],
  },
  {
    key: "leadership_alignment",
    label: "Leadership Alignment",
    description: "Convergence of executive sponsors on direction and trade-offs.",
    questions: [
      { key: "la_1", text: "How aligned is the executive team on transformation priorities?" },
      { key: "la_2", text: "How effectively does leadership resolve cross-functional trade-offs?" },
    ],
  },
  {
    key: "stakeholder_buy_in",
    label: "Stakeholder Buy-In",
    description: "Active sponsorship and commitment across affected functions.",
    questions: [
      { key: "sb_1", text: "How committed are key business unit leaders to the transformation?" },
      { key: "sb_2", text: "How well are middle management concerns surfaced and addressed?" },
    ],
  },
  {
    key: "operational_readiness",
    label: "Operational Readiness",
    description: "Process maturity and capacity to absorb change in operations.",
    questions: [
      { key: "or_1", text: "How standardized are core operational processes today?" },
      { key: "or_2", text: "How prepared are operations to integrate new service models?" },
    ],
  },
  {
    key: "data_systems_maturity",
    label: "Data & Systems Maturity",
    description: "Quality, integration, and accessibility of data and platforms.",
    questions: [
      { key: "dm_1", text: "How mature is the integration of core enterprise systems?" },
      { key: "dm_2", text: "How reliable and accessible is operational and performance data?" },
    ],
  },
  {
    key: "change_capability",
    label: "Change Capability",
    description: "Organizational capacity to design, lead, and sustain change.",
    questions: [
      { key: "cc_1", text: "How effective is the organization at executing complex change programs?" },
      { key: "cc_2", text: "How developed is internal change management capability?" },
    ],
  },
  {
    key: "execution_governance",
    label: "Execution Governance",
    description: "Mechanisms that translate strategy into accountable delivery.",
    questions: [
      { key: "eg_1", text: "How well-defined is the governance structure for delivery?" },
      { key: "eg_2", text: "How clear are decision rights across the program?" },
    ],
  },
  {
    key: "risk_exposure",
    label: "Risk Exposure",
    description: "Visibility and control of execution, commercial, and adoption risk.",
    questions: [
      { key: "re_1", text: "How well are key transformation risks identified and quantified?" },
      { key: "re_2", text: "How mature is risk allocation in commercial agreements?" },
    ],
  },
  {
    key: "performance_measurement",
    label: "Performance Measurement",
    description: "Discipline of KPI definition, measurement, and reporting.",
    questions: [
      { key: "pm_1", text: "How well-defined are the performance KPIs?" },
      { key: "pm_2", text: "How reliable is the measurement and reporting infrastructure?" },
    ],
  },
  {
    key: "transformation_velocity",
    label: "Transformation Velocity",
    description: "Pace and consistency of execution against the roadmap.",
    questions: [
      { key: "tv_1", text: "How consistently are transformation milestones delivered on time?" },
      { key: "tv_2", text: "How efficiently are pilots scaled into enterprise rollouts?" },
    ],
  },
];

export const CONTEXT_OPTIONS = {
  industry: [
    "Industrial Equipment", "Manufacturing", "Energy & Utilities",
    "Logistics & Mobility", "Construction & Infrastructure",
    "Healthcare & Life Sciences", "Other",
  ],
  transformation_type: [
    "Equipment-as-a-Service (EaaS)", "Machinery-as-a-Service (MaaS)",
    "Robotics-as-a-Service (RaaS)", "Performance-Based Contracting (PBC)",
    "Outcome-Based Contracting (OBC)", "Digital / Operating Model", "Other",
  ],
};
