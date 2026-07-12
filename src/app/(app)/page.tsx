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

export default function DashboardPage() {
  const { role } = useRole();
  const org = orgScore(defaultWeights);
  const spark = scoreTrend.map((s) => s.total);
  const delta = org.total - scoreTrend[0].total;

  return (
    <>
      <PageHeader
        title="ESG Dashboard"
        description="Live, weighted ESG performance across every department — updated as operational data flows in."
      />

      {/* Score row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:row-span-1">
          <CardContent className="flex flex-col items-center gap-3 p-6">
            <ScoreRing score={org.total} />
            <div className="flex items-center gap-1.5 text-sm">
              <span className={cn("font-medium", delta >= 0 ? "text-success" : "text-danger")}>
                {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)} pts
              </span>
              <span className="text-muted-foreground">vs 6 months ago</span>
            </div>
            <div className="h-9 w-full max-w-[200px]">
              <Sparkline data={spark} color="var(--primary)" />
            </div>
            <p className="text-xs text-muted-foreground">
              Weighted {Math.round(defaultWeights.environmental * 100)}/
              {Math.round(defaultWeights.social * 100)}/
              {Math.round(defaultWeights.governance * 100)} · E/S/G
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3 lg:col-span-2 lg:grid-cols-3">
          {pillarMeta.map((p) => {
            const score = org[p.scoreKey];
            return (
              <Link key={p.key} href={p.href} className="group">
                <Card className="h-full transition-shadow group-hover:shadow-md">
                  <CardContent className="flex h-full flex-col gap-3 p-5">
                    <div className="flex items-center justify-between">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/12 text-primary">
                        <Icon name={p.icon} className="h-5 w-5" />
                      </span>
                      <Icon name="chevron-right" className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{p.label}</p>
                      <p className={cn("font-heading text-3xl font-bold tracking-tight", scoreColor(score))}>
                        {score}
                        <span className="text-base font-normal text-muted-foreground">/100</span>
                      </p>
                    </div>
                    <Progress value={score} className="mt-auto h-1.5" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}

          {/* Quick actions */}
          <Card className="sm:col-span-3">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick actions</CardTitle>
              <CardDescription>Tailored to your role — {role.replace("_", " ")}.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {quickActions[role].map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
                  className="inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon name={a.icon} className="h-4 w-4 text-primary" />
                  {a.label}
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Leaderboard + activity */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Department leaderboard</CardTitle>
            <CardDescription>By total ESG score</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {departmentLeaderboard.map((d) => (
              <div key={d.subjectId} className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-accent/40">
                <span className="w-5 text-center text-sm font-semibold text-muted-foreground">{d.rank}</span>
                <span className="flex-1 truncate text-sm font-medium">{d.name}</span>
                <span className={cn("text-sm font-semibold", scoreColor(d.score ?? 0))}>{d.score}</span>
                <span className={cn("text-xs", d.trend === "up" ? "text-success" : d.trend === "down" ? "text-danger" : "text-muted-foreground")}>
                  {d.trend === "up" ? "▲" : d.trend === "down" ? "▼" : "—"}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent activity</CardTitle>
            <CardDescription>Approvals, compliance events, anomalies and unlocks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {activityFeed.map((e) => (
              <div key={e.id} className="flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-accent/40">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-muted text-xs">
                    {e.actor === "System" ? <Icon name="sparkles" className="h-4 w-4" /> : initials(e.actor)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug">
                    <span className="font-medium">{e.actor}</span> {e.summary}
                  </p>
                  <p className="text-xs text-muted-foreground">{relativeTime(e.at)}</p>
                </div>
                {e.pillar && (
                  <Badge variant="outline" className="shrink-0 capitalize">
                    {e.pillar}
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
