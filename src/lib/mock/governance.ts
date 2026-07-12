import type {
  Audit,
  ComplianceIssue,
  IssueCluster,
  Policy,
} from "@/lib/types";

export const policies: Policy[] = [
  { id: "pol-1", title: "Fleet Fuel Reimbursement Policy", version: "v2.1", pillar: "environmental", publishedAt: "2026-03-01", acknowledgedPct: 88, requiresAcknowledgement: true, body: "All fleet fuel purchases must be logged against an assigned vehicle and reimbursed only with a valid receipt. Diesel and petrol reimbursements are capped at the monthly route allowance. Excess consumption triggers a review by the Logistics lead. EV charging is reimbursed at the published per-kWh rate." },
  { id: "pol-2", title: "Supplier Code of Conduct", version: "v3.0", pillar: "governance", publishedAt: "2026-02-10", acknowledgedPct: 72, requiresAcknowledgement: true, body: "Suppliers must adhere to our environmental, labour, and anti-corruption standards. Annual attestation is required. Non-compliance may result in contract suspension." },
  { id: "pol-3", title: "Data Privacy & Retention", version: "v1.4", pillar: "governance", publishedAt: "2026-04-22", acknowledgedPct: 95, requiresAcknowledgement: true, body: "Personal data is retained only as long as necessary for its stated purpose. Access is role-restricted and logged. Data subject requests are handled within 30 days." },
  { id: "pol-4", title: "Diversity, Equity & Inclusion Charter", version: "v2.0", pillar: "social", publishedAt: "2026-01-18", acknowledgedPct: 91, requiresAcknowledgement: false, body: "We commit to equitable hiring, pay parity reviews, and inclusive workplace practices across all departments." },
  { id: "pol-5", title: "Whistleblower Protection", version: "v1.2", pillar: "governance", publishedAt: "2026-05-05", acknowledgedPct: 64, requiresAcknowledgement: true, body: "Employees may report misconduct anonymously without fear of retaliation. Reports are investigated by an independent committee." },
];

export const audits: Audit[] = [
  { id: "aud-1", title: "Q2 Emissions Data Audit", departmentId: "dep-mfg", auditorId: "usr-aud", date: "2026-06-15", status: "completed", hash: "9f2a…c41b", prevHash: "0000…0000", verified: true, findings: [ { id: "f-1", title: "Emission factor version mismatch on Line 3", severity: "medium", description: "Line 3 used a 2023 electricity factor for two weeks.", resolved: true }, { id: "f-2", title: "Missing meter reading logs", severity: "low", description: "Three daily meter readings were not recorded.", resolved: true } ] },
  { id: "aud-2", title: "Supplier Compliance Review", departmentId: "dep-proc", auditorId: "usr-aud", date: "2026-06-28", status: "completed", hash: "3b7d…88ee", prevHash: "9f2a…c41b", verified: true, findings: [ { id: "f-3", title: "2 suppliers missing annual attestation", severity: "high", description: "Attestations overdue by 40+ days.", resolved: false } ] },
  { id: "aud-3", title: "Fleet Fuel Reimbursement Spot-check", departmentId: "dep-log", auditorId: "usr-aud", date: "2026-07-09", status: "in_progress", hash: "c19f…21a0", prevHash: "3b7d…88ee", verified: true, findings: [ { id: "f-4", title: "Fuel spike not backed by route log", severity: "high", description: "820L → 2450L jump on FLEET-2247 without an extended-route justification.", resolved: false } ] },
];

export const complianceIssues: ComplianceIssue[] = [
  { id: "ci-1", title: "Overdue supplier attestations", description: "Two key suppliers have not submitted their annual code-of-conduct attestation.", departmentId: "dep-proc", ownerId: "usr-mgr", severity: "high", status: "overdue", createdAt: "2026-05-20", dueDate: "2026-06-30", linkedPillar: "governance", clusterId: "clu-attest", hash: "a1", prevHash: "00", verified: true },
  { id: "ci-2", title: "Fleet fuel anomaly investigation", description: "3.4σ diesel spike on FLEET-2247 requires justification or correction.", departmentId: "dep-log", ownerId: "usr-emp2", severity: "high", status: "in_progress", createdAt: "2026-07-08", dueDate: "2026-07-18", linkedPillar: "environmental", hash: "a2", prevHash: "a1", verified: true },
  { id: "ci-3", title: "Data privacy training below target", description: "Technology dept is at 85% completion vs 100% mandate.", departmentId: "dep-it", ownerId: "usr-emp4", severity: "medium", status: "open", createdAt: "2026-07-01", dueDate: "2026-07-25", linkedPillar: "governance", clusterId: "clu-training", hash: "a3", prevHash: "a2", verified: true },
  { id: "ci-4", title: "Missing meter reading logs (recurring)", description: "Manual meter readings skipped again on Line 1 — same control gap as Q2 audit.", departmentId: "dep-mfg", ownerId: "usr-emp5", severity: "medium", status: "open", createdAt: "2026-07-05", dueDate: "2026-07-22", linkedPillar: "environmental", clusterId: "clu-metering", hash: "a4", prevHash: "a3", verified: true },
  { id: "ci-5", title: "Safety training overdue (Manufacturing)", description: "Line supervisors below required safety certification renewal.", departmentId: "dep-mfg", ownerId: "usr-emp", severity: "critical", status: "overdue", createdAt: "2026-06-10", dueDate: "2026-07-01", linkedPillar: "social", clusterId: "clu-training", hash: "a5", prevHash: "a4", verified: true },
  { id: "ci-6", title: "Whistleblower policy ack below 70%", description: "Acknowledgement rate at 64%, under the 70% governance threshold.", departmentId: "dep-log", ownerId: "usr-mgr", severity: "low", status: "open", createdAt: "2026-07-02", dueDate: "2026-08-01", linkedPillar: "governance", clusterId: "clu-attest", hash: "a6", prevHash: "a5", verified: true },
  { id: "ci-7", title: "Retention schedule not applied to backups", description: "Old backups exceed the documented retention window.", departmentId: "dep-it", ownerId: "usr-emp4", severity: "medium", status: "resolved", createdAt: "2026-05-15", dueDate: "2026-06-15", resolvedAt: "2026-06-12", linkedPillar: "governance", hash: "a7", prevHash: "a6", verified: true },
];

export const issueClusters: IssueCluster[] = [
  { id: "clu-training", label: "Training / certification gaps", issueIds: ["ci-3", "ci-5"], departmentsAffected: 2 },
  { id: "clu-attest", label: "Overdue attestations & acknowledgements", issueIds: ["ci-1", "ci-6"], departmentsAffected: 2 },
  { id: "clu-metering", label: "Manual metering control failures", issueIds: ["ci-4"], departmentsAffected: 1 },
];
