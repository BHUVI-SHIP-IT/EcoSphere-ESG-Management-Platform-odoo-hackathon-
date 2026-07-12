"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icon";
import { useRole } from "@/lib/role-context";
import { visibleGroups } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { role } = useRole();
  const pathname = usePathname();
  const groups = visibleGroups(role);

  return (
    <div className="flex h-full flex-col bg-[#080d0a] text-[var(--text-secondary)] border-r border-[var(--border)]">
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-[var(--border)]">
        <div className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-[var(--accent)] text-[#0a0f0d] shadow-sm shadow-[#39ff8a33]">
          <Icon name="leaf" className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <div className="font-heading text-base font-semibold tracking-tight text-[var(--text-primary)]">EcoSphere</div>
          <div className="text-[11px] text-[var(--text-secondary)]/60 font-medium">ESG Platform</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="px-2.5 mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]/50">
              {group.label}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-[4px] px-3 py-2 text-sm font-medium transition-all duration-200 ease-[var(--ease)] overflow-hidden",
                      active
                        ? "text-[var(--text-primary)] bg-[#39ff8a08]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[#39ff8a08]",
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId="sidebar-active-indicator"
                        className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-[var(--accent)]"
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                    <Icon name={item.icon} className={cn("h-4 w-4 shrink-0 transition-colors duration-200", active ? "text-[var(--accent)]" : "group-hover:text-[var(--text-primary)]")} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--border)] p-3">
        <div className="rounded-[4px] bg-[#39ff8a05] border border-[var(--border)] px-3 py-2.5 text-xs text-[var(--text-secondary)]">
          <span className="font-semibold text-[var(--text-primary)]">Demo build</span> — data is
          mocked; scoring & AI wire up next.
        </div>
      </div>
    </div>
  );
}
