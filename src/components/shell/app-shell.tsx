"use client";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

const MOBILE_TABS = [
  { href: "/", label: "Dashboard", icon: "sparkles" },
  { href: "/environmental", label: "Env", icon: "leaf" },
  { href: "/social", label: "Social", icon: "hand-heart" },
  { href: "/governance", label: "Gov", icon: "shield-alert" },
  { href: "/gamification", label: "Gamify", icon: "trophy" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#0a0f0d] text-[var(--text-primary)]">
      {/* Desktop Sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-[var(--border)] lg:block bg-[#080d0a]">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
        <Topbar />
        
        {/* Overlapping Page Transitions Container */}
        <main className="flex-1 px-4 py-6 lg:px-8 overflow-hidden grid grid-cols-1 grid-rows-1">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{
                opacity: { duration: 0.25 },
                y: { duration: 0.25 },
                ease: [0.16, 1, 0.3, 1]
              }}
              className="col-start-1 row-start-1 min-w-0 flex flex-col"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden flex h-16 bg-[#080d0a] border-t border-[var(--border)] justify-around items-center px-2">
        {MOBILE_TABS.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname === tab.href || pathname.startsWith(tab.href + "/");

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center group cursor-pointer focus:outline-none"
            >
              {active && (
                <motion.div
                  layoutId="mobile-active-pill"
                  className="absolute h-8 w-12 rounded-full bg-[#39ff8a]/10 border border-[#39ff8a]/20 -z-10"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              <Icon
                name={tab.icon}
                className={cn(
                  "h-5 w-5 transition-colors duration-200",
                  active ? "text-[var(--accent)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                )}
              />
              <span
                className={cn(
                  "text-[10px] mt-1 font-medium transition-colors duration-200 tracking-tight",
                  active ? "text-[var(--accent)] font-semibold" : "text-[var(--text-secondary)]"
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
