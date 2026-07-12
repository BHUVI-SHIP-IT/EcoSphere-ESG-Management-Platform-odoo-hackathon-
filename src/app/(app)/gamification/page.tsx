"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/shared/page-header";
import { XpBar } from "@/components/shared/xp-bar";
import { ProofDropzone } from "@/components/shared/status-stepper";
import { Icon } from "@/components/icon";
import { challenges, currentUserByRole, userById } from "@/lib/mock";
import { useRole } from "@/lib/role-context";
import { fmtDate } from "@/lib/format";
import type { Challenge, Difficulty } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const difficultyStyles: Record<Difficulty, string> = {
  easy: "bg-success/15 text-success border-success/30",
  medium: "bg-warning/20 text-warning-foreground border-warning/40",
  hard: "bg-danger/15 text-danger border-danger/30",
};

export default function ChallengesPage() {
  const { role } = useRole();
  const user = userById(currentUserByRole[role]);
  const [selected, setSelected] = useState<Challenge | null>(null);

  return (
    <>
      <PageHeader
        title="Challenges"
        description="Earn XP and drive your department's ESG score. Each challenge shows its estimated score impact before you join."
      />

      <div className="mb-5 max-w-md">
        <XpBar xp={user?.xp ?? 0} level={user?.level ?? 1} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map((c) => (
          <Card key={c.id} className="flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline" className="capitalize">{c.pillar}</Badge>
                <Badge variant="outline" className={cn("capitalize", difficultyStyles[c.difficulty])}>
                  {c.difficulty}
                </Badge>
              </div>
              <CardTitle className="mt-1.5 text-base">{c.title}</CardTitle>
              <CardDescription className="line-clamp-2">{c.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 font-medium text-primary">
                  <Icon name="award" className="h-4 w-4" /> {c.xpReward} XP
                </span>
                <span className="text-xs text-muted-foreground">due {fmtDate(c.deadline)}</span>
              </div>
              {/* Score-impact preview (novelty #6) */}
              <div className="rounded-lg border border-primary/25 bg-primary/5 p-2.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Icon name="leaf" className="h-3.5 w-3.5 text-primary" /> Est. score impact
                  </span>
                  <span className="text-sm font-semibold text-primary">+{c.estimatedScoreImpact.toFixed(1)} pts</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button className="w-full" variant="secondary" onClick={() => setSelected(c)}>
                View challenge
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">{selected.pillar}</Badge>
                  <Badge variant="outline" className={cn("capitalize", difficultyStyles[selected.difficulty])}>
                    {selected.difficulty}
                  </Badge>
                </div>
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription>{selected.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-xs text-muted-foreground">Reward</p>
                    <p className="font-heading text-xl font-bold text-primary">{selected.xpReward} XP</p>
                  </div>
                  <div className="rounded-lg border border-primary/25 bg-primary/5 p-3 text-center">
                    <p className="text-xs text-muted-foreground">Est. score impact</p>
                    <p className="font-heading text-xl font-bold text-primary">+{selected.estimatedScoreImpact.toFixed(1)}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Completing this challenge is estimated to raise your department&rsquo;s{" "}
                  <span className="capitalize">{selected.pillar}</span> score by{" "}
                  {selected.estimatedScoreImpact.toFixed(1)} points, feeding directly into the weighted ESG total.
                </p>
                {selected.evidenceRequired && <ProofDropzone evidenceRequired />}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    toast.success(`Joined "${selected.title}" — good luck!`);
                    setSelected(null);
                  }}
                >
                  Join challenge
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
