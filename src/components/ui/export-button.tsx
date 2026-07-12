"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ExportButtonProps {
  format: string;
  onExport: () => void;
  className?: string;
}

export function ExportButton({ format, onExport, className }: ExportButtonProps) {
  const [state, setState] = useState<"idle" | "exporting" | "done">("idle");

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (state !== "idle") return;
    
    setState("exporting");

    // Wait ~1.2s to match the arc sweep, then set state to done and call parent export
    setTimeout(() => {
      setState("done");
      onExport();
      setTimeout(() => {
        setState("idle");
      }, 2000);
    }, 1200);
  };

  const radius = 7;
  const strokeWidth = 2;
  const circ = 2 * Math.PI * radius;

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={state === "exporting"}
      className={cn(
        "relative gap-2 px-4 py-2 border-[var(--border)] rounded-[4px] min-w-[110px] overflow-hidden select-none transition-all duration-300 font-sans font-medium uppercase text-xs tracking-wider",
        state === "done" && "border-[var(--accent)] text-[var(--accent)] shadow-[0_0_12px_#39ff8a33]",
        className
      )}
    >
      {state === "idle" && (
        <>
          <Icon name="download" className="h-4 w-4 text-[var(--accent)]" />
          <span>{format}</span>
        </>
      )}

      {state === "exporting" && (
        <div className="flex items-center gap-2 justify-center">
          <svg width="18" height="18" className="-rotate-90">
            <circle
              cx="9"
              cy="9"
              r={radius}
              fill="none"
              stroke="var(--border)"
              strokeWidth={strokeWidth}
            />
            <motion.circle
              cx="9"
              cy="9"
              r={radius}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={strokeWidth}
              strokeDasharray={circ}
              initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 1.2, ease: "linear" }}
            />
          </svg>
          <span className="text-[var(--accent)] font-medium text-[10px]">Processing...</span>
        </div>
      )}

      {state === "done" && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-1.5 justify-center text-[var(--accent)]"
        >
          <Icon name="check" className="h-4 w-4" />
          <span>Exported</span>
          <motion.div
            className="absolute inset-0 bg-[#39ff8a15] pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      )}
    </Button>
  );
}
