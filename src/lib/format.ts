import type { ApprovalStatus, ComplianceStatus, Severity } from "@/lib/types";

export function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function fmtDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function relativeTime(iso: string, now = new Date("2026-07-12T00:00:00Z")): string {
  const then = new Date(iso).getTime();
  const diff = now.getTime() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

export function fmtNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export function fmtCo2(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} t CO₂e`;
  return `${fmtNumber(Math.round(kg))} kg CO₂e`;
}

// Tailwind class fragments keyed to semantic status tokens.
export const severityStyles: Record<Severity, string> = {
  low: "bg-info/15 text-info border-info/30",
  medium: "bg-warning/20 text-warning-foreground border-warning/40",
  high: "bg-danger/15 text-danger border-danger/30",
  critical: "bg-danger text-danger-foreground border-danger",
};

export const complianceStatusStyles: Record<ComplianceStatus, string> = {
  open: "bg-muted text-muted-foreground border-border",
  in_progress: "bg-info/15 text-info border-info/30",
  overdue: "bg-danger/15 text-danger border-danger/30",
  resolved: "bg-success/15 text-success border-success/30",
};

export const approvalStatusStyles: Record<ApprovalStatus, string> = {
  submitted: "bg-muted text-muted-foreground border-border",
  under_review: "bg-warning/20 text-warning-foreground border-warning/40",
  approved: "bg-success/15 text-success border-success/30",
  rejected: "bg-danger/15 text-danger border-danger/30",
};

export const statusLabel: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  open: "Open",
  in_progress: "In Progress",
  overdue: "Overdue",
  resolved: "Resolved",
};

export function scoreColor(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 65) return "text-warning-foreground";
  return "text-danger";
}
