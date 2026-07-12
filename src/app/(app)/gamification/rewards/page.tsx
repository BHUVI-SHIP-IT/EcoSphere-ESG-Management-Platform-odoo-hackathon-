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
import { motion } from "framer-motion";

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
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Card
                      className={cn(
                        "text-center transition-all duration-300 relative overflow-hidden",
                        !b.unlocked && "grayscale blur-[0.4px]",
                      )}
                      style={{
                        opacity: b.unlocked ? 1 : 0.35,
                        ...(b.unlocked && {
                          borderColor: "var(--accent-dim)",
                          boxShadow: "0 0 16px rgba(57,255,138,0.08)",
                        }),
                      }}
                    >
                      <CardContent className="flex flex-col items-center gap-2 p-5 relative">
                        {/* Concentric pulse rings — only for unlocked */}
                        {b.unlocked && (
                          <div className="absolute inset-0 flex items-start justify-center pt-5 pointer-events-none">
                            {[0, 1, 2].map((i) => (
                              <motion.span
                                key={i}
                                className="absolute h-14 w-14 rounded-2xl border border-[var(--accent)]"
                                initial={{ opacity: 0.5, scale: 1 }}
                                animate={{ opacity: 0, scale: 1.8 }}
                                transition={{
                                  duration: 1.8,
                                  ease: "easeOut",
                                  repeat: Infinity,
                                  delay: i * 0.6,
                                  repeatDelay: 0.2,
                                }}
                              />
                            ))}
                          </div>
                        )}

                        <span
                          className={cn(
                            "relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl",
                            b.unlocked
                              ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                              : "bg-muted text-muted-foreground",
                          )}
                          style={b.unlocked ? { boxShadow: "0 0 20px rgba(57,255,138,0.25)" } : {}}
                        >
                          <Icon name={b.iconKey} className="h-7 w-7" />
                        </span>

                        <p className="text-sm font-semibold">{b.name}</p>
                        <p className="text-xs text-muted-foreground">{b.description}</p>

                        {b.unlocked ? (
                          <Badge
                            variant="outline"
                            className="border-[var(--accent)]/40 text-[var(--accent)] text-[10px] font-mono"
                          >
                            ✦ Unlocked
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] opacity-60">
                            🔒 Locked
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
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
