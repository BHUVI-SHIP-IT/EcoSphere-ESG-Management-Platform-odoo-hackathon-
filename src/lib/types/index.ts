// EcoSphere domain types — derived from the spec data model.
// The UI is built against this contract; only the data source swaps when the backend lands.

// ---------- Shared / enums ----------

export type ID = string;
export type ISODate = string;

export type Role = "admin" | "esg_manager" | "employee" | "auditor";

export type Pillar = "environmental" | "social" | "governance";

export type SourceType = "purchase" | "manufacturing" | "expense" | "fleet";

export type Severity = "low" | "medium" | "high" | "critical";

export type ApprovalStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected";

export type ComplianceStatus = "open" | "in_progress" | "overdue" | "resolved";

export type Trend = "up" | "down" | "flat";

export interface TrendValue {
  value: number;
  /** delta vs previous period, signed */
  delta: number;
  direction: Trend;
}

// ---------- People & org ----------

export interface User {
  id: ID;
  name: string;
  email: string;
  role: Role;
  departmentId: ID;
  avatarUrl?: string;
  title?: string;
  xp: number;
  level: number;
}

export interface Department {
  id: ID;
  name: string;
  parentId: ID | null;
  headcount: number;
  totalScore: number; // 0-100
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
}

export interface Category {
  id: ID;
  name: string;
  kind: "csr" | "challenge" | "emission" | "compliance";
  color?: string;
}

// ---------- Environmental ----------

export interface EmissionFactor {
  id: ID;
  name: string;
  categoryId: ID;
  unit: string; // e.g. "kg", "kWh", "L", "km"
  /** kg CO2e per unit */
  co2ePerUnit: number;
  source: string; // reference standard (e.g. "GHG Protocol", "DEFRA 2024")
  updatedAt: ISODate;
}

// Minimal ERP stub records the platform sits on top of.
export interface ErpRecordBase {
  id: ID;
  sourceType: SourceType;
  departmentId: ID;
  date: ISODate;
  reference: string; // human-readable doc no
  quantity: number;
  unit: string;
  categoryId: ID;
  amount?: number; // monetary, where relevant
  description: string;
}

export interface CarbonTransaction {
  id: ID;
  departmentId: ID;
  sourceType: SourceType;
  sourceRecordId: ID; // FK into an ERP stub record
  emissionFactorId: ID;
  quantity: number;
  unit: string;
  /** computed = quantity * factor.co2ePerUnit, in kg CO2e */
  co2eKg: number;
  autoCalculated: boolean;
  date: ISODate;
  /** anomaly detection (novelty #2) */
  anomaly?: {
    isAnomaly: boolean;
    /** z-score vs department/source baseline */
    zScore: number;
    baselineMean: number;
    /** recent history for the inline sparkline */
    history: number[];
  };
}

export interface SustainabilityGoal {
  id: ID;
  name: string;
  departmentId: ID | null; // null = org-wide
  metric: string; // e.g. "Total emissions (t CO2e)"
  target: number;
  current: number;
  unit: string;
  deadline: ISODate;
  direction: "reduce" | "increase";
}

// ---------- Social ----------

export interface CSRActivity {
  id: ID;
  title: string;
  description: string;
  categoryId: ID;
  imageUrl?: string;
  deadline: ISODate;
  xpReward: number;
  evidenceRequired: boolean;
  participantCount: number;
}

export interface Participation {
  id: ID;
  activityId: ID; // CSRActivity or Challenge
  activityKind: "csr" | "challenge";
  userId: ID;
  status: ApprovalStatus;
  proofUrl?: string;
  submittedAt: ISODate;
  reviewedAt?: ISODate;
  reviewerId?: ID;
  rejectionReason?: string;
}

export interface DiversityMetric {
  dimension: string; // e.g. "Gender", "Age band"
  segments: { label: string; count: number }[];
}

export interface TrainingRecord {
  id: ID;
  userId: ID;
  departmentId: ID;
  courseName: string;
  completion: number; // 0-100
  completedAt?: ISODate;
}

// ---------- Governance ----------

export interface Policy {
  id: ID;
  title: string;
  version: string;
  body: string;
  pillar: Pillar;
  publishedAt: ISODate;
  acknowledgedPct: number; // 0-100
  requiresAcknowledgement: boolean;
}

export interface PolicyAcknowledgement {
  id: ID;
  policyId: ID;
  userId: ID;
  acknowledgedAt: ISODate;
}

export interface AuditFinding {
  id: ID;
  title: string;
  severity: Severity;
  description: string;
  resolved: boolean;
}

export interface Audit {
  id: ID;
  title: string;
  departmentId: ID;
  auditorId: ID;
  date: ISODate;
  status: "scheduled" | "in_progress" | "completed";
  findings: AuditFinding[];
  /** tamper-evident hash chain (novelty #8) */
  hash: string;
  prevHash: string;
  verified: boolean;
}

export interface ComplianceIssue {
  id: ID;
  title: string;
  description: string;
  departmentId: ID;
  ownerId: ID; // mandatory ownership
  severity: Severity;
  status: ComplianceStatus;
  createdAt: ISODate;
  dueDate: ISODate;
  resolvedAt?: ISODate;
  linkedPillar: Pillar;
  /** root-cause cluster id (novelty #3) */
  clusterId?: ID;
  hash: string;
  prevHash: string;
  verified: boolean;
}

export interface IssueCluster {
  id: ID;
  label: string; // recurring theme
  issueIds: ID[];
  departmentsAffected: number;
}

// ---------- Gamification ----------

export type Difficulty = "easy" | "medium" | "hard";

export interface Challenge {
  id: ID;
  title: string;
  description: string;
  categoryId: ID;
  pillar: Pillar;
  difficulty: Difficulty;
  xpReward: number;
  deadline: ISODate;
  evidenceRequired: boolean;
  /** score-impact preview (novelty #6): est. contribution to dept score */
  estimatedScoreImpact: number;
  participantCount: number;
}

export interface Badge {
  id: ID;
  name: string;
  description: string;
  iconKey: string; // maps to a lucide icon
  unlocked: boolean;
  unlockRule: UnlockRule;
  unlockedAt?: ISODate;
}

export interface UnlockRule {
  metric: "xp" | "challenges_completed" | "csr_completed" | "streak_days";
  operator: ">=" | ">" | "==";
  threshold: number;
}

export interface Reward {
  id: ID;
  name: string;
  description: string;
  pointsCost: number;
  stock: number;
  imageUrl?: string;
}

export interface LeaderboardEntry {
  rank: number;
  subjectId: ID; // user or department id
  name: string;
  avatarUrl?: string;
  xp: number;
  score?: number;
  trend: Trend;
}

// ---------- Scoring ----------

export interface ScoreWeights {
  environmental: number; // fractions summing to 1
  social: number;
  governance: number;
}

export interface ScoreContribution {
  label: string;
  pillar: Pillar;
  points: number;
  sourceType: string; // "carbon" | "csr" | "challenge" | "compliance" | ...
  sourceRecordId: ID;
  date: ISODate;
}

export interface ScoreSnapshot {
  departmentId: ID | null; // null = org-wide
  period: string; // e.g. "2026-07"
  environmental: number;
  social: number;
  governance: number;
  total: number;
  /** contributing records (novelty #5 explainability) */
  contributions?: ScoreContribution[];
}

// ---------- Notifications ----------

export type NotificationKind =
  | "compliance"
  | "approval"
  | "policy"
  | "badge"
  | "anomaly"
  | "reward";

export interface AppNotification {
  id: ID;
  kind: NotificationKind;
  severity: Severity;
  title: string;
  body: string;
  createdAt: ISODate;
  read: boolean;
  /** immediate vs bundled into daily digest (novelty #7) */
  delivery: "immediate" | "digest";
  link?: string;
}

// ---------- Copilot (novelty #1) ----------

export interface CopilotCitation {
  kind: "policy" | "audit" | "compliance";
  recordId: ID;
  title: string;
  snippet: string;
}

export interface CopilotMessage {
  id: ID;
  role: "user" | "assistant";
  content: string;
  citations?: CopilotCitation[];
}

// ---------- Activity feed ----------

export interface ActivityEvent {
  id: ID;
  kind: NotificationKind | "csr" | "audit";
  actor: string;
  summary: string;
  at: ISODate;
  pillar?: Pillar;
}
