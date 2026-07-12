"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

// ─── Types ────────────────────────────────────────────────────────────────────

type KanbanStatus = "available" | "in_progress" | "completed";

interface KanbanChallenge extends Challenge {
  status: KanbanStatus;
}

const COLUMNS: { id: KanbanStatus; label: string; icon: string; accent: string }[] = [
  { id: "available",   label: "Available",   icon: "circle-dashed", accent: "text-[var(--text-secondary)]" },
  { id: "in_progress", label: "In Progress", icon: "loader",        accent: "text-[var(--warning)]" },
  { id: "completed",   label: "Completed",   icon: "circle-check",  accent: "text-[var(--accent)]" },
];

const difficultyStyles: Record<Difficulty, string> = {
  easy:   "bg-[#39ff8a]/10 text-[var(--accent)]    border-[var(--accent)]/30",
  medium: "bg-[#f5a623]/10 text-[var(--warning)]   border-[var(--warning)]/30",
  hard:   "bg-[#ff4d4d]/10 text-[var(--danger)]    border-[var(--danger)]/30",
};

// ─── Challenge Card ────────────────────────────────────────────────────────────

function ChallengeCard({
  c,
  onMove,
  onView,
}: {
  c: KanbanChallenge;
  onMove: (id: string, to: KanbanStatus) => void;
  onView: (c: KanbanChallenge) => void;
}) {
  const [dragging, setDragging] = useState(false);

  const nextStatus: Record<KanbanStatus, KanbanStatus | null> = {
    available:   "in_progress",
    in_progress: "completed",
    completed:   null,
  };

  const next = nextStatus[c.status];

  return (
    <motion.div
      layout
      layoutId={c.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      drag
      dragSnapToOrigin
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
      whileHover={{ scale: 1.02, y: -2 }}
      whileDrag={{ scale: 1.04, zIndex: 50, boxShadow: "0 16px 40px rgba(0,0,0,0.4)" }}
      className={cn(
        "rounded-[4px] border bg-[var(--bg-card)] cursor-grab active:cursor-grabbing select-none",
        "transition-shadow duration-200",
        dragging
          ? "border-[var(--accent-dim)] shadow-[0_0_24px_rgba(57,255,138,0.15)]"
          : "border-[var(--border)] hover:border-[var(--accent-dim)] hover:shadow-[0_4px_20px_rgba(57,255,138,0.06)]",
        c.status === "completed" && "opacity-60",
      )}
    >
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className="capitalize text-[10px] text-[var(--text-secondary)] border-[var(--border)]">
            {c.pillar}
          </Badge>
          <Badge variant="outline" className={cn("capitalize text-[10px]", difficultyStyles[c.difficulty])}>
            {c.difficulty}
          </Badge>
        </div>

        {/* Title & description */}
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)] leading-snug">{c.title}</p>
          <p className="mt-1 text-xs text-[var(--text-secondary)] line-clamp-2">{c.description}</p>
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 font-mono font-bold text-[var(--accent)] tabular-nums">
            <Icon name="award" className="h-3.5 w-3.5" />
            {c.xpReward} XP
          </span>
          <span className="text-[var(--text-secondary)]">due {fmtDate(c.deadline)}</span>
        </div>

        {/* Score impact pill */}
        <div className="rounded-[3px] border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-2.5 py-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)]">
            <Icon name="trending-up" className="h-3 w-3 text-[var(--accent)]" />
            Est. score impact
          </span>
          <span className="text-xs font-mono font-bold text-[var(--accent)] tabular-nums">
            +{c.estimatedScoreImpact.toFixed(1)} pts
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 h-7 text-xs border border-[var(--border)] hover:border-[var(--accent-dim)]"
            onClick={() => onView(c)}
          >
            Details
          </Button>
          {next && c.status !== "completed" && (
            <Button
              size="sm"
              className="flex-1 h-7 text-xs"
              onClick={() => onMove(c.id, next)}
            >
              {c.status === "available" ? "Start" : "Complete"}
            </Button>
          )}
          {c.status === "completed" && (
            <span className="flex-1 flex items-center justify-center gap-1 text-xs text-[var(--accent)] font-mono">
              <Icon name="circle-check" className="h-3.5 w-3.5" /> Done
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Column ────────────────────────────────────────────────────────────────────

function KanbanColumn({
  col,
  cards,
  onMove,
  onView,
  onDrop,
}: {
  col: (typeof COLUMNS)[number];
  cards: KanbanChallenge[];
  onMove: (id: string, to: KanbanStatus) => void;
  onView: (c: KanbanChallenge) => void;
  onDrop: (id: string, to: KanbanStatus) => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col rounded-[4px] border bg-[var(--bg-card)] transition-colors duration-200",
        dragOver ? "border-[var(--accent-dim)] bg-[#39ff8a05]" : "border-[var(--border)]",
      )}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        setDragOver(false);
        const id = e.dataTransfer.getData("challengeId");
        if (id) onDrop(id, col.id);
      }}
    >
      {/* Column header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <Icon name={col.icon} className={cn("h-4 w-4", col.accent)} />
          <span className="text-sm font-semibold text-[var(--text-primary)]">{col.label}</span>
        </div>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--border)] text-[10px] font-mono font-bold text-[var(--text-secondary)]">
          {cards.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3 p-3 min-h-[200px] overflow-y-auto max-h-[calc(100vh-20rem)]">
        {cards.length === 0 && (
          <div className="flex flex-1 items-center justify-center py-8 text-xs text-[var(--text-secondary)] opacity-50">
            Drop here
          </div>
        )}
        {cards.map((c) => (
          <div
            key={c.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("challengeId", c.id)}
          >
            <ChallengeCard c={c} onMove={onMove} onView={onView} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChallengesPage() {
  const { role } = useRole();
  const user = userById(currentUserByRole[role]);

  const [board, setBoard] = useState<KanbanChallenge[]>(() =>
    challenges.map((c, i) => ({
      ...c,
      status: (["available", "available", "in_progress", "available", "in_progress", "completed"] as KanbanStatus[])[i] ?? "available",
    })),
  );
  const [selected, setSelected] = useState<KanbanChallenge | null>(null);

  function moveCard(id: string, to: KanbanStatus) {
    setBoard((prev) => prev.map((c) => (c.id === id ? { ...c, status: to } : c)));
    const label = { in_progress: "In Progress", completed: "Completed", available: "Available" }[to];
    toast.success(`Moved to ${label}`);
  }

  return (
    <>
      <PageHeader
        title="Challenges"
        description="Drag cards between columns or use the action buttons. Earn XP and drive your department's ESG score."
      />

      <div className="mb-5 max-w-md">
        <XpBar xp={user?.xp ?? 0} level={user?.level ?? 1} />
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            col={col}
            cards={board.filter((c) => c.status === col.id)}
            onMove={moveCard}
            onView={setSelected}
            onDrop={moveCard}
          />
        ))}
      </div>

      {/* Detail dialog */}
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
                  <div className="rounded-[4px] border border-[var(--border)] p-3 text-center">
                    <p className="text-xs text-[var(--text-secondary)]">Reward</p>
                    <p className="font-mono text-xl font-bold text-[var(--accent)] tabular-nums">{selected.xpReward} XP</p>
                  </div>
                  <div className="rounded-[4px] border border-[var(--accent)]/25 bg-[var(--accent)]/5 p-3 text-center">
                    <p className="text-xs text-[var(--text-secondary)]">Est. score impact</p>
                    <p className="font-mono text-xl font-bold text-[var(--accent)] tabular-nums">+{selected.estimatedScoreImpact.toFixed(1)}</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Completing this challenge is estimated to raise your department&rsquo;s{" "}
                  <span className="capitalize">{selected.pillar}</span> score by{" "}
                  {selected.estimatedScoreImpact.toFixed(1)} points, feeding directly into the weighted ESG total.
                </p>
                {selected.evidenceRequired && <ProofDropzone evidenceRequired />}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
                {selected.status !== "completed" && (
                  <Button
                    onClick={() => {
                      const next = selected.status === "available" ? "in_progress" : "completed";
                      moveCard(selected.id, next);
                      setSelected(null);
                    }}
                  >
                    {selected.status === "available" ? "Start challenge" : "Mark complete"}
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
