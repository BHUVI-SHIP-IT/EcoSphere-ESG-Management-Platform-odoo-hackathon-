"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { users } from "@/lib/mock";
import type { User } from "@/lib/types";

const STORAGE_KEY = "ecosphere.session";
// Demo mock — any of the seeded accounts log in with this shared password.
const DEMO_PASSWORD = "ecosphere";

interface AuthContextValue {
  user: User | null;
  status: "loading" | "authenticated" | "unauthenticated";
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  /** Demo helper: switch the active account (used by the role viewer). */
  switchUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthContextValue["status"]>("loading");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const id = JSON.parse(raw) as string;
        const found = users.find((u) => u.id === id) ?? null;
        setUser(found);
        setStatus(found ? "authenticated" : "unauthenticated");
        return;
      }
    } catch {
      // ignore corrupt storage
    }
    setStatus("unauthenticated");
  }, []);

  function persist(u: User | null) {
    setUser(u);
    setStatus(u ? "authenticated" : "unauthenticated");
    try {
      if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u.id));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  function login(email: string, password: string) {
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) return { ok: false, error: "No account found for that email." };
    if (password !== DEMO_PASSWORD) return { ok: false, error: "Incorrect password." };
    persist(found);
    return { ok: true };
  }

  function logout() {
    persist(null);
  }

  function switchUser(userId: string) {
    const found = users.find((u) => u.id === userId);
    if (found) persist(found);
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

export { DEMO_PASSWORD };
