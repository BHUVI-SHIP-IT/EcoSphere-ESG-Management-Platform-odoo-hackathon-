"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FilterChipOption<T extends string> {
  value: T;
  label: string;
}

interface FilterChipsProps<T extends string> {
  options: FilterChipOption<T>[];
  selected: T;
  onChange: (val: T) => void;
  className?: string;
  layoutId?: string;
}

export function FilterChips<T extends string>({
  options,
  selected,
  onChange,
  className,
  layoutId = "active-chip-pill",
}: FilterChipsProps<T>) {
  return (
    <div className={cn("flex flex-wrap gap-2 relative z-10", className)}>
      {options.map((opt) => {
        const active = opt.value === selected;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative px-4 py-2 rounded-[4px] text-xs font-medium uppercase tracking-wider border transition-all duration-200 ease-[var(--ease)] focus:outline-none cursor-pointer select-none",
              active
                ? "border-[var(--accent)] text-[var(--accent)] bg-[#39ff8a0d]"
                : "border-[var(--border)] text-[var(--text-secondary)] bg-transparent hover:text-[var(--text-primary)] hover:bg-[#39ff8a05]"
            )}
          >
            {active && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 bg-[#39ff8a0d] border border-[var(--accent)] rounded-[4px] -z-10 shadow-[0_0_8px_#39ff8a1a]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
