"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import type { User, Role } from "@/lib/types";

function mapDbRole(dbRole: string): Role {
  switch (dbRole) {
    case "ADMIN":
      return "admin";
    case "ESG_MANAGER":
      return "esg_manager";
    case "DEPARTMENT_LEAD":
      return "auditor";
    case "EMPLOYEE":
    default:
      return "employee";
  }
}

interface AuthContextValue {
  user: User | null;
  status: "loading" | "authenticated" | "unauthenticated";
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  switchUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthContextValue["status"]>("loading");

  async function refreshSession() {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.user) {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: mapDbRole(data.user.role),
          departmentId: data.user.departmentId ?? "",
          xp: data.user.xp ?? 0,
          level: 1,
        });
        setStatus("authenticated");
      } else {
        setUser(null);
        setStatus("unauthenticated");
      }
    } catch {
      setUser(null);
      setStatus("unauthenticated");
    }
  }

  useEffect(() => {
    refreshSession();
  }, []);

  async function login(email: string, password: string) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.error ?? "Login failed" };
      }
      await refreshSession();
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setStatus("unauthenticated");
  }

  function switchUser(_userId: string) {
    toast.error("Switching accounts isn't available with real sign-in. Please log out and sign in as that user.");
  }

  return (
    <AuthContext.Provider value={{ user, status, login, logout, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export const DEMO_PASSWORD = "password123";