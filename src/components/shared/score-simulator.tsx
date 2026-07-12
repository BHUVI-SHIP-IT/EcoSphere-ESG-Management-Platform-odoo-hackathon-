"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { departments, orgScore, defaultWeights, weightedTotal } from "@/lib/mock";
import { scoreColor } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Normalize three weights so they always sum to 100.
function rebalance(changed: "e" | "s" | "g", value: number, prev: { e: number; s: number; g: number }) {
  const others = (["e", "s", "g"] as const).filter((k) => k !== changed);
  const remaining = 100 - value;
  const otherSum = others.reduce((a, k) => a + prev[k], 0) || 1;
  const next = { ...prev, [changed]: value };
  others.forEach((k) => {
    next[k] = Math.round((prev[k] / otherSum) * remaining);
  });
  // fix rounding drift
  const drift = 100 - (next.e + next.s + next.g);
  next[others[0]] += drift;
  return next;
}

export function ScoreSimulator() {
  const [w, setW] = useState({
    e: Math.round(defaultWeights.environmental * 100),
    s: Math.round(defaultWeights.social * 100),
    g: Math.round(defaultWeights.governance * 100),
  });

  const weights = { environmental: w.e / 100, social: w.s / 100, governance: w.g / 100 };
  const committed = orgScore(defaultWeights);
  const simulated = orgScore(weights);
  const diff = simulated.total - committed.total;
  const changed = w.e !== Math.round(defaultWeights.environmental * 100);

  const rows: { key: "e" | "s" | "g"; label: string; color: string }[] = [
    { key: "e", label: "Environmental", color: "var(--chart-1)" },
    { key: "s", label: "Social", color: "var(--chart-2)" },
    { key: "g", label: "Governance", color: "var(--chart-4)" },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Score Simulation — What-If</CardTitle>
        <CardDescription>
          Drag the pillar weights and see the recomputed Overall ESG score before committing.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          {rows.map((r) => (
            <div key={r.key}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color }} />
                  {r.label}
                </span>
                <span className="tabular-nums text-muted-foreground">{w[r.key]}%</span>
              </div>
              <Slider
                value={[w[r.key]]}
                min={0}
                max={100}
                step={5}
                onValueChange={([v]) => setW((prev) => rebalance(r.key, v, prev))}
              />
            </div>
          ))}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Weights always total 100%</span>
            <Button
              variant="ghost"
              size="sm"
              disabled={!changed}
              onClick={() =>
                setW({
                  e: Math.round(defaultWeights.environmental * 100),
                  s: Math.round(defaultWeights.social * 100),
                  g: Math.round(defaultWeights.governance * 100),
                })
              }
            >
              Reset
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border bg-muted/30 p-5 text-center">
            <p className="text-sm text-muted-foreground">Simulated Overall ESG</p>
            <p className={cn("font-heading text-5xl font-bold", scoreColor(simulated.total))}>
              {simulated.total}
            </p>
            {changed && (
              <Badge
                variant="outline"
                className={cn("mt-1", diff >= 0 ? "border-success/30 text-success" : "border-danger/30 text-danger")}
              >
                {diff >= 0 ? "▲ +" : "▼ "}
                {diff} vs current ({committed.total})
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Recomputed department totals</p>
            {departments.slice(0, 4).map((d) => {
              const simTotal = weightedTotal(d.environmentalScore, d.socialScore, d.governanceScore, weights);
              const curTotal = weightedTotal(d.environmentalScore, d.socialScore, d.governanceScore, defaultWeights);
              const dd = simTotal - curTotal;
              return (
                <div key={d.id} className="flex items-center justify-between rounded-lg border p-2 text-sm">
                  <span className="font-medium">{d.name}</span>
                  <span className="flex items-center gap-2">
                    <span className={cn("font-semibold tabular-nums", scoreColor(simTotal))}>{simTotal}</span>
                    {changed && dd !== 0 && (
                      <span className={cn("text-xs", dd > 0 ? "text-success" : "text-danger")}>
                        {dd > 0 ? "+" : ""}
                        {dd}
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          <Button
            className="w-full"
            disabled={!changed}
            onClick={() => toast.success(`Committed new weights: ${w.e}/${w.s}/${w.g}`)}
          >
            Commit new weights
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
