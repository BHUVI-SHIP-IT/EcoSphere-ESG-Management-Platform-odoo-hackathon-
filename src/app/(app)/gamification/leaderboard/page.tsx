"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import {
  individualLeaderboard,
  departmentLeaderboard,
  initials,
} from "@/lib/mock";
import { scoreColor } from "@/lib/format";
import type { LeaderboardEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

function Row({ e, metric }: { e: LeaderboardEntry; metric: "xp" | "score" }) {
  const medal = e.rank <= 3;
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border p-3",
        medal && "border-primary/30 bg-primary/5",
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
          e.rank === 1
            ? "bg-warning text-warning-foreground"
            : e.rank === 2
              ? "bg-muted-foreground/30"
              : e.rank === 3
                ? "bg-chart-5/30"
                : "text-muted-foreground",
        )}
      >
        {e.rank}
      </span>
      <Avatar className="h-9 w-9">
        <AvatarFallback className="bg-muted text-xs">{initials(e.name)}</AvatarFallback>
      </Avatar>
      <span className="flex-1 truncate font-medium">{e.name}</span>
      <span
        className={cn(
          "text-xs",
          e.trend === "up" ? "text-success" : e.trend === "down" ? "text-danger" : "text-muted-foreground",
        )}
      >
        {e.trend === "up" ? "▲" : e.trend === "down" ? "▼" : "—"}
      </span>
      {metric === "xp" ? (
        <Badge variant="secondary" className="tabular-nums">{e.xp.toLocaleString()} XP</Badge>
      ) : (
        <span className={cn("font-semibold tabular-nums", scoreColor(e.score ?? 0))}>{e.score}</span>
      )}
    </div>
  );
}

export default function LeaderboardPage() {
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
              {individualLeaderboard.map((e) => (
                <Row key={e.subjectId} e={e} metric="xp" />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="department" className="mt-4">
          <Card>
            <CardContent className="space-y-2 p-4">
              {departmentLeaderboard.map((e) => (
                <Row key={e.subjectId} e={e} metric="score" />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
