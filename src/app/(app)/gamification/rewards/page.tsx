"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/shared/page-header";
import { Icon } from "@/components/icon";
import { badges, rewards, currentUserByRole, userById } from "@/lib/mock";
import { useRole } from "@/lib/role-context";
import type { Reward } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function ruleText(r: (typeof badges)[number]["unlockRule"]): string {
  const metric = {
    xp: "XP",
    challenges_completed: "challenges completed",
    csr_completed: "CSR activities completed",
    streak_days: "day streak",
  }[r.metric];
  return `${metric} ${r.operator} ${r.threshold}`;
}

export default function RewardsPage() {
  const { role } = useRole();
  const user = userById(currentUserByRole[role]);
  const points = user?.xp ?? 0;
  const [redeeming, setRedeeming] = useState<Reward | null>(null);

  return (
    <>
      <PageHeader
        title="Badges & Rewards"
        description="Badges auto-award when unlock rules are met. Redeem XP for rewards."
        actions={
          <Badge variant="secondary" className="gap-1 px-3 py-1.5 text-sm">
            <Icon name="trophy" className="h-4 w-4 text-primary" /> {points.toLocaleString()} points
          </Badge>
        }
      />

      <Tabs defaultValue="badges">
        <TabsList>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="badges" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {badges.map((b) => (
              <Tooltip key={b.id}>
                <TooltipTrigger asChild>
                  <Card className={cn("text-center transition-all", !b.unlocked && "opacity-55 grayscale")}>
                    <CardContent className="flex flex-col items-center gap-2 p-5">
                      <span
                        className={cn(
                          "flex h-14 w-14 items-center justify-center rounded-2xl",
                          b.unlocked ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                        )}
                      >
                        <Icon name={b.iconKey} className="h-7 w-7" />
                      </span>
                      <p className="text-sm font-semibold">{b.name}</p>
                      <p className="text-xs text-muted-foreground">{b.description}</p>
                      {b.unlocked ? (
                        <Badge variant="outline" className="border-success/30 text-success text-[10px]">
                          Unlocked
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">Locked</Badge>
                      )}
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>Unlock rule: {ruleText(b.unlockRule)}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rewards.map((r) => {
              const affordable = points >= r.pointsCost;
              return (
                <Card key={r.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="mb-2 flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-accent/30 to-primary/10">
                      <Icon name="award" className="h-8 w-8 text-primary/70" />
                    </div>
                    <CardTitle className="text-base">{r.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{r.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between pb-3">
                    <span className="flex items-center gap-1 font-semibold text-primary">
                      <Icon name="trophy" className="h-4 w-4" /> {r.pointsCost.toLocaleString()}
                    </span>
                    <span className={cn("text-xs", r.stock < 10 ? "text-danger" : "text-muted-foreground")}>
                      {r.stock > 100 ? "In stock" : `${r.stock} left`}
                    </span>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button className="w-full" disabled={!affordable} onClick={() => setRedeeming(r)}>
                      {affordable ? "Redeem" : "Not enough points"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!redeeming} onOpenChange={(o) => !o && setRedeeming(null)}>
        <DialogContent className="max-w-sm">
          {redeeming && (
            <>
              <DialogHeader>
                <DialogTitle>Redeem reward</DialogTitle>
                <DialogDescription>
                  Redeem <span className="font-medium text-foreground">{redeeming.name}</span> for{" "}
                  {redeeming.pointsCost.toLocaleString()} points?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setRedeeming(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    toast.success(`Redeemed ${redeeming.name}!`);
                    setRedeeming(null);
                  }}
                >
                  Confirm redemption
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
