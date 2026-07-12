import type {
  Badge,
  Challenge,
  LeaderboardEntry,
  Reward,
} from "@/lib/types";

export const challenges: Challenge[] = [
  { id: "ch-1", title: "Paperless Fortnight", description: "Go fully digital for two weeks — no printing.", categoryId: "cat-env-challenge", pillar: "environmental", difficulty: "easy", xpReward: 150, deadline: "2026-07-24", evidenceRequired: false, estimatedScoreImpact: 0.6, participantCount: 42 },
  { id: "ch-2", title: "Cycle-to-Work Month", description: "Log commutes by bike or public transport for 30 days.", categoryId: "cat-env-challenge", pillar: "environmental", difficulty: "medium", xpReward: 300, deadline: "2026-08-10", evidenceRequired: true, estimatedScoreImpact: 1.4, participantCount: 28 },
  { id: "ch-3", title: "Zero-Waste Line Trial", description: "Run a production line with zero landfill waste for a week.", categoryId: "cat-env-challenge", pillar: "environmental", difficulty: "hard", xpReward: 600, deadline: "2026-08-20", evidenceRequired: true, estimatedScoreImpact: 3.2, participantCount: 8 },
  { id: "ch-4", title: "Policy Ack Sprint", description: "Get your team to 100% policy acknowledgement.", categoryId: "cat-gov-challenge", pillar: "governance", difficulty: "medium", xpReward: 250, deadline: "2026-07-30", evidenceRequired: false, estimatedScoreImpact: 1.1, participantCount: 15 },
  { id: "ch-5", title: "Mentor a Newcomer", description: "Complete a 4-week mentoring cycle with a new joiner.", categoryId: "cat-social-challenge", pillar: "social", difficulty: "medium", xpReward: 350, deadline: "2026-09-05", evidenceRequired: true, estimatedScoreImpact: 1.6, participantCount: 19 },
  { id: "ch-6", title: "Clear the Compliance Board", description: "Resolve all open issues owned by you before due date.", categoryId: "cat-gov-challenge", pillar: "governance", difficulty: "hard", xpReward: 500, deadline: "2026-07-28", evidenceRequired: false, estimatedScoreImpact: 2.8, participantCount: 6 },
];

export const badges: Badge[] = [
  { id: "bdg-1", name: "First Steps", description: "Earn your first 100 XP.", iconKey: "sprout", unlocked: true, unlockedAt: "2026-04-02", unlockRule: { metric: "xp", operator: ">=", threshold: 100 } },
  { id: "bdg-2", name: "Green Streak", description: "Complete 5 environmental challenges.", iconKey: "leaf", unlocked: true, unlockedAt: "2026-06-11", unlockRule: { metric: "challenges_completed", operator: ">=", threshold: 5 } },
  { id: "bdg-3", name: "Community Champion", description: "Complete 10 CSR activities.", iconKey: "heart-handshake", unlocked: false, unlockRule: { metric: "csr_completed", operator: ">=", threshold: 10 } },
  { id: "bdg-4", name: "Governance Guardian", description: "Reach 3000 XP.", iconKey: "shield-check", unlocked: false, unlockRule: { metric: "xp", operator: ">=", threshold: 3000 } },
  { id: "bdg-5", name: "Consistency King", description: "Maintain a 30-day activity streak.", iconKey: "flame", unlocked: false, unlockRule: { metric: "streak_days", operator: ">=", threshold: 30 } },
  { id: "bdg-6", name: "Trailblazer", description: "Reach 5000 XP.", iconKey: "trophy", unlocked: false, unlockRule: { metric: "xp", operator: ">=", threshold: 5000 } },
];

export const rewards: Reward[] = [
  { id: "rw-1", name: "Extra Day Off", description: "One additional paid leave day.", pointsCost: 5000, stock: 12 },
  { id: "rw-2", name: "Plant a Tree in Your Name", description: "We plant a tree via our reforestation partner.", pointsCost: 800, stock: 999 },
  { id: "rw-3", name: "EcoSphere Hoodie", description: "Organic-cotton branded hoodie.", pointsCost: 1500, stock: 40 },
  { id: "rw-4", name: "Reusable Coffee Kit", description: "Insulated cup + reusable filter.", pointsCost: 600, stock: 75 },
  { id: "rw-5", name: "Lunch with the CSO", description: "1:1 lunch with the Chief Sustainability Officer.", pointsCost: 3000, stock: 4 },
  { id: "rw-6", name: "Charity Donation ($50)", description: "Direct $50 to a charity of your choice.", pointsCost: 2000, stock: 200 },
];

export const individualLeaderboard: LeaderboardEntry[] = [
  { rank: 1, subjectId: "usr-mgr", name: "Marco Reyes", xp: 6100, trend: "flat" },
  { rank: 2, subjectId: "usr-emp3", name: "Sara Lindqvist", xp: 5200, trend: "up" },
  { rank: 3, subjectId: "usr-admin", name: "Ada Okafor", xp: 4200, trend: "up" },
  { rank: 4, subjectId: "usr-emp2", name: "Tomás Vidal", xp: 3100, trend: "down" },
  { rank: 5, subjectId: "usr-emp4", name: "Wei Zhang", xp: 2750, trend: "up" },
  { rank: 6, subjectId: "usr-aud", name: "Priya Nair", xp: 2400, trend: "flat" },
  { rank: 7, subjectId: "usr-emp", name: "Lena Cho", xp: 1850, trend: "up" },
  { rank: 8, subjectId: "usr-emp5", name: "Fatima Al-Sayed", xp: 990, trend: "up" },
];

export const departmentLeaderboard: LeaderboardEntry[] = [
  { rank: 1, subjectId: "dep-hr", name: "People & Culture", xp: 0, score: 88, trend: "up" },
  { rank: 2, subjectId: "dep-fin", name: "Finance", xp: 0, score: 85, trend: "flat" },
  { rank: 3, subjectId: "dep-proc", name: "Procurement", xp: 0, score: 79, trend: "up" },
  { rank: 4, subjectId: "dep-it", name: "Technology", xp: 0, score: 76, trend: "up" },
  { rank: 5, subjectId: "dep-mfg", name: "Manufacturing", xp: 0, score: 71, trend: "down" },
  { rank: 6, subjectId: "dep-log", name: "Logistics & Fleet", xp: 0, score: 64, trend: "down" },
];
