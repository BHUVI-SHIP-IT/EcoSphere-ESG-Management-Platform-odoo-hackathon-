"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/utils";

export function ScoreRing({
  score,
  size = 180,
  stroke = 14,
  label = "Overall ESG",
  delay = 0, // in ms
}: {
  score: number;
  size?: number;
  stroke?: number;
  label?: string;
  delay?: number;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;

  // Set up motion values
  const count = useMotionValue(0);
  const progress = useMotionValue(0);

  const [displayScore, setDisplayScore] = useState(0);

  // Sync state for strokeDashoffset
  const strokeDashoffset = useTransform(progress, [0, 1], [circ, 0]);

  useEffect(() => {
    // Animate the score number counting up
    const textAnimation = animate(count, score, {
      duration: 0.9,
      delay: delay / 1000,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplayScore(Math.round(latest)),
    });

    // Animate the stroke progress
    const strokeAnimation = animate(progress, score / 100, {
      duration: 0.9,
      delay: delay / 1000,
      ease: [0.16, 1, 0.3, 1],
    });

    return () => {
      textAnimation.stop();
      strokeAnimation.stop();
    };
  }, [score, delay]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          style={{ strokeDashoffset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-mono font-bold tracking-tight text-[var(--accent)] tabular-nums"
          style={{ fontSize: size * 0.24 }}
        >
          {displayScore}
        </span>
        <span className="text-[10px] uppercase font-sans font-medium tracking-wider text-[var(--text-secondary)] mt-1">{label}</span>
      </div>
    </div>
  );
}
