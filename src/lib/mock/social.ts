import type {
  CSRActivity,
  DiversityMetric,
  Participation,
  TrainingRecord,
} from "@/lib/types";

export const csrActivities: CSRActivity[] = [
  { id: "csr-1", title: "River Cleanup Drive", description: "Weekend cleanup of the Meadow River bank with local partners.", categoryId: "cat-community", deadline: "2026-07-26", xpReward: 250, evidenceRequired: true, participantCount: 34 },
  { id: "csr-2", title: "Code Club Mentoring", description: "Mentor high-school students in intro programming, 4 sessions.", categoryId: "cat-education", deadline: "2026-08-15", xpReward: 400, evidenceRequired: true, participantCount: 12 },
  { id: "csr-3", title: "Blood Donation Camp", description: "On-site donation drive with the regional blood bank.", categoryId: "cat-health", deadline: "2026-07-20", xpReward: 150, evidenceRequired: false, participantCount: 58 },
  { id: "csr-4", title: "Community Garden Build", description: "Build raised beds for the neighbourhood community garden.", categoryId: "cat-community", deadline: "2026-08-02", xpReward: 300, evidenceRequired: true, participantCount: 21 },
  { id: "csr-5", title: "Financial Literacy Workshops", description: "Run budgeting workshops for local nonprofits.", categoryId: "cat-education", deadline: "2026-09-01", xpReward: 350, evidenceRequired: true, participantCount: 9 },
  { id: "csr-6", title: "Wellbeing Walk Challenge", description: "Company-wide steps challenge raising funds per km walked.", categoryId: "cat-health", deadline: "2026-07-31", xpReward: 200, evidenceRequired: false, participantCount: 87 },
];

export const participations: Participation[] = [
  { id: "part-1", activityId: "csr-1", activityKind: "csr", userId: "usr-emp", status: "approved", proofUrl: "proof-river.jpg", submittedAt: "2026-07-06", reviewedAt: "2026-07-07", reviewerId: "usr-mgr" },
  { id: "part-2", activityId: "csr-2", activityKind: "csr", userId: "usr-emp5", status: "under_review", proofUrl: "proof-mentor.pdf", submittedAt: "2026-07-09" },
  { id: "part-3", activityId: "csr-4", activityKind: "csr", userId: "usr-emp2", status: "submitted", proofUrl: "proof-garden.jpg", submittedAt: "2026-07-10" },
  { id: "part-4", activityId: "csr-1", activityKind: "csr", userId: "usr-emp3", status: "approved", proofUrl: "proof-river2.jpg", submittedAt: "2026-07-06", reviewedAt: "2026-07-07", reviewerId: "usr-mgr" },
  { id: "part-5", activityId: "csr-5", activityKind: "csr", userId: "usr-emp4", status: "rejected", proofUrl: "proof-fin.pdf", submittedAt: "2026-07-04", reviewedAt: "2026-07-05", reviewerId: "usr-mgr", rejectionReason: "Evidence did not show workshop attendance sheet." },
  { id: "part-6", activityId: "csr-2", activityKind: "csr", userId: "usr-emp", status: "submitted", proofUrl: "proof-code.pdf", submittedAt: "2026-07-11" },
];

export const diversityMetrics: DiversityMetric[] = [
  { dimension: "Gender", segments: [ { label: "Women", count: 312 }, { label: "Men", count: 348 }, { label: "Non-binary / other", count: 25 } ] },
  { dimension: "Age band", segments: [ { label: "Under 30", count: 210 }, { label: "30–45", count: 336 }, { label: "46–60", count: 118 }, { label: "60+", count: 21 } ] },
  { dimension: "Leadership", segments: [ { label: "Women in leadership", count: 38 }, { label: "Men in leadership", count: 47 } ] },
];

export const trainingRecords: TrainingRecord[] = [
  { id: "tr-1", userId: "usr-emp", departmentId: "dep-mfg", courseName: "Workplace Safety 2026", completion: 100, completedAt: "2026-06-12" },
  { id: "tr-2", userId: "usr-emp5", departmentId: "dep-mfg", courseName: "Workplace Safety 2026", completion: 60 },
  { id: "tr-3", userId: "usr-emp2", departmentId: "dep-log", courseName: "Anti-Bribery & Corruption", completion: 100, completedAt: "2026-05-30" },
  { id: "tr-4", userId: "usr-emp4", departmentId: "dep-it", courseName: "Data Privacy Essentials", completion: 85 },
  { id: "tr-5", userId: "usr-emp3", departmentId: "dep-hr", courseName: "Inclusive Leadership", completion: 100, completedAt: "2026-06-28" },
];

export const trainingByDept: { dept: string; completion: number }[] = [
  { dept: "Manufacturing", completion: 82 },
  { dept: "Logistics & Fleet", completion: 76 },
  { dept: "Procurement", completion: 91 },
  { dept: "Finance", completion: 95 },
  { dept: "People & Culture", completion: 99 },
  { dept: "Technology", completion: 88 },
];
