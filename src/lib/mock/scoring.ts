import type { ScoreSnapshot, ScoreWeights } from "@/lib/types";
import { departments } from "./core";

export const defaultWeights: ScoreWeights = {
  environmental: 0.4,
  social: 0.3,
  governance: 0.3,
};

// Pure scoring: (pillar scores, weights) -> total. Mirrors the backend scoring engine.
// This same function powers the Score Simulator (novelty #4).
export function weightedTotal(
  e: number,
  s: number,
  g: number,
  w: ScoreWeights,
): number {
  return Math.round(e * w.environmental + s * w.social + g * w.governance);
}

export function orgScore(w: ScoreWeights): {
  environmental: number;
  social: number;
  governance: number;
  total: number;
} {
  const n = departments.length;
  const e = Math.round(departments.reduce((a, d) => a + d.environmentalScore, 0) / n);
  const s = Math.round(departments.reduce((a, d) => a + d.socialScore, 0) / n);
  const g = Math.round(departments.reduce((a, d) => a + d.governanceScore, 0) / n);
  return { environmental: e, social: s, governance: g, total: weightedTotal(e, s, g, w) };
}

// Contribution breakdown for the explainability drill-down (novelty #5).
export const orgSnapshot: ScoreSnapshot = {
  departmentId: null,
  period: "2026-07",
  environmental: 72,
  social: 81,
  governance: 80,
  total: weightedTotal(72, 81, 80, defaultWeights),
  contributions: [
    { label: "Auto-calculated carbon (Manufacturing)", pillar: "environmental", points: 18, sourceType: "carbon", sourceRecordId: "ct-3", date: "2026-07-04" },
    { label: "Fleet emissions (Logistics)", pillar: "environmental", points: -6, sourceType: "carbon", sourceRecordId: "ct-5", date: "2026-07-08" },
    { label: "Renewable electricity progress", pillar: "environmental", points: 12, sourceType: "goal", sourceRecordId: "goal-3", date: "2026-07-01" },
    { label: "River Cleanup participation", pillar: "social", points: 9, sourceType: "csr", sourceRecordId: "csr-1", date: "2026-07-06" },
    { label: "Training completion (avg 88%)", pillar: "social", points: 14, sourceType: "training", sourceRecordId: "tr-1", date: "2026-07-01" },
    { label: "Policy acknowledgements", pillar: "governance", points: 16, sourceType: "policy", sourceRecordId: "pol-3", date: "2026-07-01" },
    { label: "Overdue compliance issues", pillar: "governance", points: -8, sourceType: "compliance", sourceRecordId: "ci-1", date: "2026-06-30" },
  ],
};

// Historical org total for the trend arrow / sparkline.
export const scoreTrend: { period: string; total: number }[] = [
  { period: "Feb", total: 71 },
  { period: "Mar", total: 72 },
  { period: "Apr", total: 74 },
  { period: "May", total: 76 },
  { period: "Jun", total: 77 },
  { period: "Jul", total: 78 },
];
