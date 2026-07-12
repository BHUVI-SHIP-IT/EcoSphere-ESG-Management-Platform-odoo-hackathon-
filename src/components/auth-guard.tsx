"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Icon } from "@/components/icon";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <span className="flex h-11 w-11 animate-pulse items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Icon name="leaf" className="h-6 w-6" />
          </span>
          <p className="text-sm">Loading your workspace…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
