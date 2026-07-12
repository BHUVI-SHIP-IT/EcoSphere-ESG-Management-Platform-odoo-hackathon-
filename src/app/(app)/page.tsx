"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/shared/page-header";
import { ScoreRing } from "@/components/charts/score-ring";
import { Sparkline } from "@/components/charts/mini-charts";
import { Icon } from "@/components/icon";
import { useRole } from "@/lib/role-context";
import {
  activityFeed,
  defaultWeights,
  departmentLeaderboard,
  initials,
  orgScore,
  scoreTrend,
} from "@/lib/mock";
import { relativeTime, scoreColor } from "@/lib/format";
import type { Pillar, Role } from "@/lib/types";
import { cn } from "@/lib/utils";

const pillarMeta: { key: Pillar; label: string; icon: string; scoreKey: "environmental" | "social" | "governance"; href: string }[] = [
  { key: "environmental", label: "Environmental", icon: "leaf", scoreKey: "environmental", href: "/environmental" },
  { key: "social", label: "Social", icon: "hand-heart", scoreKey: "social", href: "/social" },
  { key: "governance", label: "Governance", icon: "shield-alert", scoreKey: "governance", href: "/governance" },
];

const quickActions: Record<Role, { label: string; icon: string; href: string }[]> = {
  employee: [
    { label: "Log CSR proof", icon: "hand-heart", href: "/social" },
    { label: "Join a challenge", icon: "flag", href: "/gamification" },
    { label: "Acknowledge a policy", icon: "scroll-text", href: "/governance/policies" },
  ],
  esg_manager: [
    { label: "Review approvals", icon: "clipboard-check", href: "/social/approvals" },
    { label: "Open compliance board", icon: "shield-alert", href: "/governance" },
    { label: "Tune score weights", icon: "sliders-horizontal", href: "/settings" },
  ],
  admin: [
    { label: "Platform settings", icon: "settings", href: "/settings" },
    { label: "Manage badges", icon: "award", href: "/gamification/rewards" },
    { label: "Emission factors", icon: "sliders-horizontal", href: "/environmental/factors" },
  ],
  auditor: [
    { label: "Review audits", icon: "file-search", href: "/governance/audits" },
    { label: "Compliance board", icon: "shield-alert", href: "/governance" },
    { label: "Root-cause clusters", icon: "git-fork", href: "/clusters" },
  ],
};

import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

import type { Variants } from "framer-motion";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};
export default function DashboardPage() {
  const { role } = useRole();
  const org = orgScore(defaultWeights);
  const spark = scoreTrend.map((s) => s.total);
  const delta = org.total - scoreTrend[0].total;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      <PageHeader
        title="ESG Dashboard"
        description="Live, weighted ESG performance across every department — updated as operational data flows in."
      />

      {/* Score row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div variants={cardVariants} className="lg:row-span-1 h-full">
          <Card className="h-full">
            <CardContent className="flex flex-col items-center gap-4 p-6 justify-center h-full">
              <ScoreRing score={org.total} delay={0} />
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5 text-sm">
                  <span className={cn("font-medium font-mono tabular-nums", delta >= 0 ? "text-[var(--accent)]" : "text-danger")}>
                    {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)} pts
                  </span>
                  <span className="text-muted-foreground">vs 6 months ago</span>
                </div>
                <div className="h-9 w-full min-w-[160px] max-w-[200px] mt-2">
                  <Sparkline data={spark} color="var(--accent)" />
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider font-semibold">
                  Weights: E {Math.round(defaultWeights.environmental * 100)}% /
                  S {Math.round(defaultWeights.social * 100)}% /
                  G {Math.round(defaultWeights.governance * 100)}%
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-3 lg:col-span-2 lg:grid-cols-3">
          {pillarMeta.map((p, idx) => {
            const score = org[p.scoreKey];
            return (
              <motion.div key={p.key} variants={cardVariants} className="h-full">
                <Link href={p.href} className="group block h-full">
                  <Card className="h-full transition-shadow">
                    <CardContent className="flex h-full flex-col gap-3 p-5">
                      <div className="flex items-center justify-between">
                        <span className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-[#39ff8a08] border border-[var(--border)] text-[var(--accent)]">
                          <Icon name={p.icon} className="h-5 w-5" />
                        </span>
                        <Icon name="chevron-right" className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{p.label}</p>
                      </div>
                      <div className="mt-auto flex justify-center pt-2">
                        <ScoreRing score={score} size={100} stroke={8} label="" delay={idx * 150 + 150} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}

          {/* Quick actions */}
          <motion.div variants={cardVariants} className="sm:col-span-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick actions</CardTitle>
                <CardDescription>Tailored to your role — {role.replace("_", " ")}.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {quickActions[role].map((a) => (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="inline-flex items-center gap-2 rounded-[4px] border border-[var(--border)] bg-card px-3 py-2 text-sm font-medium transition-all hover:bg-[var(--bg-card-hover)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    <Icon name={a.icon} className="h-4 w-4 text-[var(--accent)]" />
                    {a.label}
                  </Link>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Leaderboard + activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div variants={cardVariants} className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Department leaderboard</CardTitle>
              <CardDescription>By total ESG score</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {departmentLeaderboard.map((d) => (
                <div key={d.subjectId} className="flex items-center gap-3 rounded-[4px] px-2 py-1.5 transition-colors hover:bg-[#39ff8a08]">
                  <span className="w-5 text-center text-sm font-bold font-display text-[var(--accent)]">{d.rank}</span>
                  <span className="flex-1 truncate text-sm font-medium">{d.name}</span>
                  <span className="text-sm font-mono font-bold text-[var(--text-data)] tabular-nums">{d.score}</span>
                  <span className={cn("text-xs", d.trend === "up" ? "text-[var(--accent)]" : d.trend === "down" ? "text-danger" : "text-muted-foreground")}>
                    {d.trend === "up" ? "▲" : d.trend === "down" ? "▼" : "—"}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recent activity</CardTitle>
              <CardDescription>Approvals, compliance events, anomalies and unlocks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {activityFeed.map((e) => (
                <div key={e.id} className="flex items-start gap-3 rounded-[4px] px-2 py-2 transition-colors hover:bg-[#39ff8a08]">
                  <Avatar className="h-8 w-8 rounded-[4px]">
                    <AvatarFallback className="bg-[var(--border)] text-xs text-[var(--text-primary)] rounded-[4px]">
                      {e.actor === "System" ? <Icon name="sparkles" className="h-4 w-4" /> : initials(e.actor)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">
                      <span className="font-semibold text-[var(--text-primary)]">{e.actor}</span> {e.summary}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{relativeTime(e.at)}</p>
                  </div>
                  {e.pillar && (
                    <Badge variant="outline" className="shrink-0 capitalize rounded-[4px] text-[10px] border-[var(--border)] text-[var(--text-secondary)]">
                      {e.pillar}
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
