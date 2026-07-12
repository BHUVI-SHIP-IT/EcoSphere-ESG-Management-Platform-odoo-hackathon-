"use client";

import { Icon } from "@/components/icon";
import { motion } from "framer-motion";

export function XpBar({ xp, level }: { xp: number; level: number }) {
  const perLevel = 500;
  const intoLevel = xp % perLevel;
  const pct = (intoLevel / perLevel) * 100;
  return (
    <div className="rounded-[4px] border border-[var(--border)] bg-[#0f1f16] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-[#0a0f0d] text-sm font-bold shadow-sm shadow-[#39ff8a33]">
            {level}
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Level {level}</p>
            <p className="text-xs text-[var(--text-secondary)] font-mono font-medium tabular-nums">{xp.toLocaleString()} XP total</p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
          <Icon name="trophy" className="h-3.5 w-3.5 text-[var(--accent)]" />
          <span className="font-mono font-semibold text-[var(--text-data)] tabular-nums">{perLevel - intoLevel}</span> XP to level {level + 1}
        </span>
      </div>
      
      {/* XP Points Bar with Spring Overshoot */}
      <div className="mt-4 h-[6px] w-full rounded-[3px] bg-[var(--border)] overflow-hidden relative">
        <motion.div
          className="absolute left-0 top-0 bottom-0 rounded-[3px] bg-gradient-to-r from-[#39ff8a] to-[#00ff6a]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            mass: 0.8,
          }}
        />
      </div>
    </div>
  );
}
