"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { motion, AnimatePresence } from "framer-motion";
import {
  individualLeaderboard,
  departmentLeaderboard,
  initials,
  currentUserByRole,
} from "@/lib/mock";
import { useRole } from "@/lib/role-context";
import { scoreColor } from "@/lib/format";
import type { LeaderboardEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

const medalColors: Record<number, string> = {
  1: "bg-[#f5a623] text-[#0a0f0d]",
  2: "bg-[#a0aec0] text-[#0a0f0d]",
  3: "bg-[#c4783a] text-[#0a0f0d]",
};

function Row({
  e,
  metric,
  isCurrentUser,
}: {
  e: LeaderboardEntry;
  metric: "xp" | "score";
  isCurrentUser: boolean;
}) {
  const medal = e.rank <= 3;

  return (
    <motion.div
      layout
      layoutId={e.subjectId}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex items-center gap-3 rounded-[4px] border p-3 transition-colors duration-300",
        isCurrentUser
          ? "border-[var(--accent-dim)] bg-[#39ff8a0d]"
          : medal
            ? "border-[var(--border-glow)] bg-[var(--bg-card-hover)]"
            : "border-[var(--border)] bg-[var(--bg-card)]",
      )}
    >
      {/* Rank badge */}
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold font-mono",
          medalColors[e.rank] ?? "text-[var(--text-secondary)]",
        )}
      >
        {e.rank}
      </span>

      <Avatar className="h-9 w-9 shrink-0">
        <AvatarFallback className="bg-[var(--border)] text-[var(--text-secondary)] text-xs font-medium">
          {initials(e.name)}
        </AvatarFallback>
      </Avatar>

      <span className="flex-1 truncate text-sm font-medium text-[var(--text-primary)]">
        {e.name}
        {isCurrentUser && (
          <span className="ml-2 text-[10px] font-mono text-[var(--accent)] opacity-80">YOU</span>
        )}
      </span>

      {/* Trend arrow */}
      <span
        className={cn(
          "text-xs font-bold w-4 text-center",
          e.trend === "up"
            ? "text-[var(--accent)]"
            : e.trend === "down"
              ? "text-[var(--danger)]"
              : "text-[var(--text-secondary)]",
        )}
      >
        {e.trend === "up" ? "▲" : e.trend === "down" ? "▼" : "—"}
      </span>

      {/* Score/XP */}
      {metric === "xp" ? (
        <Badge
          variant="secondary"
          className="font-mono tabular-nums text-[var(--text-data)] border-[var(--border)] bg-[var(--bg-card-hover)]"
        >
          {e.xp.toLocaleString()} XP
        </Badge>
      ) : (
        <span className={cn("font-mono font-bold tabular-nums text-sm", scoreColor(e.score ?? 0))}>
          {e.score}
        </span>
      )}
    </motion.div>
  );
}

export default function LeaderboardPage() {
  const { role } = useRole();
  const currentUserId = currentUserByRole[role];

  return (
    <>
      <PageHeader title="Leaderboard" description="Individual XP standings and department ESG scores." />
      <Tabs defaultValue="individual">
        <TabsList>
          <TabsTrigger value="individual">Individual</TabsTrigger>
          <TabsTrigger value="department">Department</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="mt-4">
          <Card>
            <CardContent className="space-y-2 p-4">
              <AnimatePresence>
                {individualLeaderboard.map((e) => (
                  <Row
                    key={e.subjectId}
                    e={e}
                    metric="xp"
                    isCurrentUser={e.subjectId === currentUserId}
                  />
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="department" className="mt-4">
          <Card>
            <CardContent className="space-y-2 p-4">
              <AnimatePresence>
                {departmentLeaderboard.map((e) => (
                  <Row
                    key={e.subjectId}
                    e={e}
                    metric="score"
                    isCurrentUser={false}
                  />
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

