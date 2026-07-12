import type { Role } from "@/lib/types";

export interface NavItem {
  label: string;
  href: string;
  icon: string; // lucide icon name
  roles?: Role[]; // if set, only these roles see it
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/", icon: "layout-dashboard" }],
  },
  {
    label: "Environmental",
    items: [
      { label: "Carbon & Emissions", href: "/environmental", icon: "leaf" },
      { label: "Emission Factors", href: "/environmental/factors", icon: "sliders-horizontal", roles: ["admin", "esg_manager"] },
      { label: "Sustainability Goals", href: "/environmental/goals", icon: "target" },
    ],
  },
  {
    label: "Social",
    items: [
      { label: "CSR Activities", href: "/social", icon: "hand-heart" },
      { label: "Approval Queue", href: "/social/approvals", icon: "clipboard-check", roles: ["admin", "esg_manager"] },
      { label: "Diversity & Training", href: "/social/diversity", icon: "users" },
    ],
  },
  {
    label: "Governance",
    items: [
      { label: "Policies", href: "/governance/policies", icon: "scroll-text" },
      { label: "Compliance Board", href: "/governance", icon: "shield-alert" },
      { label: "Audits", href: "/governance/audits", icon: "file-search" },
    ],
  },
  {
    label: "Gamification",
    items: [
      { label: "Challenges", href: "/gamification", icon: "flag" },
      { label: "Badges & Rewards", href: "/gamification/rewards", icon: "award" },
      { label: "Leaderboard", href: "/gamification/leaderboard", icon: "trophy" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "Compliance Copilot", href: "/copilot", icon: "sparkles" },
      { label: "Root-Cause Clusters", href: "/clusters", icon: "git-fork", roles: ["admin", "esg_manager", "auditor"] },
    ],
  },
  {
    label: "Insights",
    items: [{ label: "Reports", href: "/reports", icon: "bar-chart-3" }],
  },
  {
    label: "Administration",
    items: [
      { label: "Settings", href: "/settings", icon: "settings", roles: ["admin", "esg_manager"] },
    ],
  },
];

export function visibleGroups(role: Role): NavGroup[] {
  return navGroups
    .map((g) => ({
      ...g,
      items: g.items.filter((i) => !i.roles || i.roles.includes(role)),
    }))
    .filter((g) => g.items.length > 0);
}
