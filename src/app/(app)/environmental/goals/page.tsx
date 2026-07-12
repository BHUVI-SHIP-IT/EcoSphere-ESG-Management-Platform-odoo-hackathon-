"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SegmentedProgress } from "@/components/ui/segmented-progress";
import { PageHeader } from "@/components/shared/page-header";
import { Icon } from "@/components/icon";
import { goals, deptName } from "@/lib/mock";
import { fmtDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function goalProgress(g: (typeof goals)[number]): { pct: number; onTrack: boolean } {
  // For "reduce" goals, progress = how close current is to (or below) target.
  if (g.direction === "reduce") {
    const start = g.target * 1.6; // assumed baseline for the bar
    const pct = Math.max(0, Math.min(100, ((start - g.current) / (start - g.target)) * 100));
    return { pct: Math.round(pct), onTrack: g.current <= g.target * 1.15 };
  }
  const pct = Math.max(0, Math.min(100, (g.current / g.target) * 100));
  return { pct: Math.round(pct), onTrack: pct >= 60 };
}

export default function GoalsPage() {
  return (
    <>
      <PageHeader
        title="Sustainability Goals"
        description="Targets tracked continuously against live operational data."
        actions={
          <Button onClick={() => toast.success("New goal — form would open here")}>
            <Icon name="target" className="h-4 w-4" /> New goal
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {goals.map((g) => {
          const { pct, onTrack } = goalProgress(g);
          return (
            <Card key={g.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{g.name}</CardTitle>
                    <CardDescription>
                      {deptName(g.departmentId)} · due {fmtDate(g.deadline)}
                    </CardDescription>
                  </div>
                  <Badge
                    className={cn(
                      onTrack
                        ? "bg-success/15 text-success border-success/30"
                        : "bg-danger/15 text-danger border-danger/30",
                    )}
                    variant="outline"
                  >
                    {onTrack ? "On track" : "At risk"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="font-heading text-2xl font-bold">{g.current}</span>
                    <span className="ml-1 text-sm text-muted-foreground">{g.unit}</span>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    target <span className="font-medium text-foreground">{g.target} {g.unit}</span>
                  </div>
                </div>
                <SegmentedProgress value={pct} segments={10} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground">
                  {g.direction === "reduce" ? "Reduction" : "Progress"}: {pct}% · metric: {g.metric}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
