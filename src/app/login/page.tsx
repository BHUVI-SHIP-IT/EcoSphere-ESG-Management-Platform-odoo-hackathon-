"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Icon } from "@/components/icon";
import { ThemeToggle } from "@/components/shell/theme-toggle";
import { useAuth, DEMO_PASSWORD } from "@/lib/auth-context";
import { ROLE_LABELS } from "@/lib/role-context";
import { users, initials } from "@/lib/mock";
import type { Role } from "@/lib/types";
import { toast } from "sonner";

// One representative demo account per role for quick sign-in.
const demoAccounts: Role[] = ["admin", "esg_manager", "employee", "auditor"];

export default function LoginPage() {
  const { status, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = login(email, password);
    if (res.ok) {
      toast.success("Welcome back");
      router.replace("/");
    } else {
      setError(res.error ?? "Login failed");
      setSubmitting(false);
    }
  }

  function fillDemo(role: Role) {
    const u = users.find((x) => x.role === role);
    if (u) {
      setEmail(u.email);
      setPassword(DEMO_PASSWORD);
      setError(null);
    }
  }

  return (
    <div className="relative flex min-h-screen">
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>

      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-primary/70 p-10 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/15 backdrop-blur">
            <Icon name="leaf" className="h-6 w-6" />
          </div>
          <span className="font-heading text-xl font-semibold">EcoSphere</span>
        </div>

        <div className="max-w-md space-y-4">
          <h1 className="font-heading text-3xl font-bold leading-tight">
            ESG performance, continuously scored and fully explainable.
          </h1>
          <p className="text-primary-foreground/80">
            Carbon, social and governance data on one live backbone — every score traceable back to
            the transaction that produced it.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {["Carbon accounting", "CSR & gamification", "Compliance Copilot"].map((t) => (
              <span key={t} className="rounded-full bg-primary-foreground/15 px-3 py-1 text-xs backdrop-blur">
                {t}
              </span>
            ))}
          </div>
        </div>

        <p className="text-xs text-primary-foreground/60">© 2026 EcoSphere · Demo build</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Icon name="leaf" className="h-5 w-5" />
            </div>
            <span className="font-heading text-lg font-semibold">EcoSphere</span>
          </div>

          <h2 className="font-heading text-2xl font-semibold tracking-tight">Sign in</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back. Enter your credentials to continue.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@ecosphere.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6">
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Demo accounts
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {demoAccounts.map((role) => {
                const u = users.find((x) => x.role === role)!;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => fillDemo(role)}
                    className="flex items-center gap-2 rounded-lg border p-2 text-left transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary/15 text-primary text-[10px]">
                        {initials(u.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">{u.name}</p>
                      <p className="truncate text-[10px] text-muted-foreground">{ROLE_LABELS[role]}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Click an account to autofill, then Sign in. Password:{" "}
              <Badge variant="secondary" className="font-mono text-[10px]">{DEMO_PASSWORD}</Badge>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
