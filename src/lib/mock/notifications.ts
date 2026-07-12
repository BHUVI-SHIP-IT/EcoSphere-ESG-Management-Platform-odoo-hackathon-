import type { ActivityEvent, AppNotification, CopilotMessage } from "@/lib/types";

export const notifications: AppNotification[] = [
  { id: "n-1", kind: "compliance", severity: "critical", title: "Overdue: Safety training (Manufacturing)", body: "Line supervisors below required certification. Due 2026-07-01.", createdAt: "2026-07-11T08:20:00Z", read: false, delivery: "immediate", link: "/governance" },
  { id: "n-2", kind: "anomaly", severity: "high", title: "Carbon anomaly detected", body: "Fleet diesel 3.4σ above baseline on FLEET-2247.", createdAt: "2026-07-08T14:05:00Z", read: false, delivery: "immediate", link: "/environmental" },
  { id: "n-3", kind: "approval", severity: "medium", title: "CSR proof awaiting review", body: "Tomás Vidal submitted proof for Community Garden Build.", createdAt: "2026-07-10T09:00:00Z", read: false, delivery: "immediate", link: "/social" },
  { id: "n-4", kind: "badge", severity: "low", title: "Badge unlocked: Green Streak", body: "You completed 5 environmental challenges.", createdAt: "2026-07-09T17:30:00Z", read: true, delivery: "digest", link: "/gamification" },
  { id: "n-5", kind: "policy", severity: "low", title: "Policy reminder: Whistleblower Protection", body: "Acknowledgement rate at 64%. Please acknowledge.", createdAt: "2026-07-09T06:00:00Z", read: true, delivery: "digest", link: "/governance" },
  { id: "n-6", kind: "reward", severity: "low", title: "Reward back in stock", body: "EcoSphere Hoodie is available again.", createdAt: "2026-07-08T12:00:00Z", read: true, delivery: "digest", link: "/gamification" },
];

export const activityFeed: ActivityEvent[] = [
  { id: "a-1", kind: "approval", actor: "Marco Reyes", summary: "approved River Cleanup proof from Lena Cho", at: "2026-07-11T10:15:00Z", pillar: "social" },
  { id: "a-2", kind: "compliance", actor: "System", summary: "flagged safety training as overdue (critical)", at: "2026-07-11T08:20:00Z", pillar: "governance" },
  { id: "a-3", kind: "anomaly", actor: "System", summary: "detected a 3.4σ fleet emission spike", at: "2026-07-08T14:05:00Z", pillar: "environmental" },
  { id: "a-4", kind: "badge", actor: "Wei Zhang", summary: "unlocked the Green Streak badge", at: "2026-07-09T17:30:00Z" },
  { id: "a-5", kind: "csr", actor: "Sara Lindqvist", summary: "joined Community Garden Build", at: "2026-07-09T13:00:00Z", pillar: "social" },
  { id: "a-6", kind: "audit", actor: "Priya Nair", summary: "opened Fleet Fuel Reimbursement spot-check", at: "2026-07-09T09:45:00Z", pillar: "governance" },
];

export const copilotSuggestions: string[] = [
  "What is our policy on fleet fuel reimbursement?",
  "Show overdue compliance issues in Manufacturing linked to emissions",
  "Which departments are below the data privacy training target?",
  "Summarize open high-severity governance issues",
];

// Canned Copilot exchange demonstrating grounded answers with citations (novelty #1).
export const copilotSample: CopilotMessage[] = [
  { id: "m-1", role: "user", content: "What is our policy on fleet fuel reimbursement?" },
  {
    id: "m-2",
    role: "assistant",
    content:
      "Fleet fuel purchases must be logged against an assigned vehicle and are reimbursed only with a valid receipt. Diesel and petrol reimbursements are capped at the monthly route allowance — anything above triggers a review by the Logistics lead. EV charging is reimbursed at the published per-kWh rate.\n\nNote: there is an active investigation (CI-2) into a 3.4σ diesel spike on FLEET-2247 that exceeded the route allowance.",
    citations: [
      { kind: "policy", recordId: "pol-1", title: "Fleet Fuel Reimbursement Policy v2.1", snippet: "…reimbursed only with a valid receipt. Diesel and petrol reimbursements are capped at the monthly route allowance…" },
      { kind: "compliance", recordId: "ci-2", title: "Fleet fuel anomaly investigation", snippet: "3.4σ diesel spike on FLEET-2247 requires justification or correction." },
    ],
  },
];
