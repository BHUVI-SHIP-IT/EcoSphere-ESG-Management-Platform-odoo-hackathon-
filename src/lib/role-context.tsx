"use client";

import { useAuth } from "@/lib/auth-context";
import { users } from "@/lib/mock";
import type { Role } from "@/lib/types";

// Role is now derived from the authenticated user. setRole switches to a seeded
// account with that role (demo affordance), so existing role-dependent pages keep working.
export function useRole() {
  const { user, switchUser } = useAuth();
  const role: Role = user?.role ?? "employee";

  function setRole(r: Role) {
    const target = users.find((u) => u.role === r);
    if (target) switchUser(target.id);
  }

  return { role, setRole };
}

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  esg_manager: "ESG Manager",
  employee: "Employee",
  auditor: "Auditor",
};
