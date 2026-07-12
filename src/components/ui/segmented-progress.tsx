"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SegmentedProgressProps {
  value: number;
  segments?: number;
  className?: string;
}

export function SegmentedProgress({ value, segments = 10, className }: SegmentedProgressProps) {
  // Clamp value between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("flex w-full gap-1.5", className)} data-slot="segmented-progress">
      {Array.from({ length: segments }).map((_, i) => {
        const threshold = (i / segments) * 100;
        const segmentMax = ((i + 1) / segments) * 100;
        let fill = 0;
        if (clampedValue >= segmentMax) {
          fill = 1;
        } else if (clampedValue > threshold) {
          fill = (clampedValue - threshold) / (segmentMax - threshold);
        }

        return (
          <div
            key={i}
            className="h-2 flex-1 bg-[var(--border)] overflow-hidden rounded-[2px] relative"
            title={`${clampedValue}%`}
          >
            <motion.div
              className="absolute inset-y-0 left-0 bg-[var(--accent)] origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: fill }}
              style={{ width: "100%" }}
              transition={{
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.05, // 50ms gap before next starts (staggered delay)
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
