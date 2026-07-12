"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icon";
import { useRole } from "@/lib/role-context";
import { visibleGroups } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { role } = useRole();
  const pathname = usePathname();
  const groups = visibleGroups(role);

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
          <Icon name="leaf" className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <div className="font-heading text-base font-semibold tracking-tight">EcoSphere</div>
          <div className="text-[11px] text-sidebar-foreground/60">ESG Platform</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/45">
              {group.label}
            </div>
            <div className="space-y-0.5">
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
                      "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                        : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Icon name={item.icon} className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="rounded-lg bg-sidebar-accent/60 px-3 py-2.5 text-xs text-sidebar-foreground/70">
          <span className="font-semibold text-sidebar-accent-foreground">Demo build</span> — data is
          mocked; scoring & AI wire up next.
        </div>
      </div>
    </div>
  );
}
