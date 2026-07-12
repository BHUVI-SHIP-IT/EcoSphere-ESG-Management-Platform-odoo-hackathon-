"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icon } from "@/components/icon";
import { notifications as seed } from "@/lib/mock";
import { relativeTime, severityStyles } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/lib/types";

function NotifRow({ n }: { n: AppNotification }) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/40",
        !n.read && "bg-accent/25",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
          severityStyles[n.severity],
        )}
      >
        <Icon
          name={
            n.kind === "compliance"
              ? "shield-alert"
              : n.kind === "anomaly"
                ? "leaf"
                : n.kind === "approval"
                  ? "clipboard-check"
                  : n.kind === "badge"
                    ? "award"
                    : n.kind === "reward"
                      ? "trophy"
                      : "bell"
          }
          className="h-4 w-4"
        />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug">{n.title}</p>
          {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground leading-snug">{n.body}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">{relativeTime(n.createdAt)}</span>
          <Badge variant="outline" className="text-[10px] capitalize">
            {n.delivery}
          </Badge>
        </div>
      </div>
    </div>
  );
}

export function NotificationDrawer() {
  const [items] = useState<AppNotification[]>(seed);
  const unread = items.filter((n) => !n.read).length;
  const immediate = items.filter((n) => n.delivery === "immediate");
  const digest = items.filter((n) => n.delivery === "digest");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Icon name="bell" className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-danger-foreground">
              {unread}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col gap-0">
        <SheetHeader className="px-5 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Icon name="bell" className="h-4 w-4" /> Notifications
          </SheetTitle>
        </SheetHeader>
        <Tabs defaultValue="immediate" className="flex-1 flex flex-col min-h-0">
          <div className="px-5 pt-3">
            <TabsList className="w-full">
              <TabsTrigger value="immediate" className="flex-1">
                Alerts
                {immediate.filter((n) => !n.read).length > 0 && (
                  <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">
                    {immediate.filter((n) => !n.read).length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="digest" className="flex-1">
                Daily Digest
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="immediate" className="flex-1 min-h-0 mt-2">
            <ScrollArea className="h-full px-5 pb-5">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground py-1">
                  High-severity events, delivered immediately.
                </p>
                {immediate.map((n) => (
                  <NotifRow key={n.id} n={n} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="digest" className="flex-1 min-h-0 mt-2">
            <ScrollArea className="h-full px-5 pb-5">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground py-1">
                  Low-priority events bundled into a daily digest to reduce fatigue.
                </p>
                {digest.map((n) => (
                  <NotifRow key={n.id} n={n} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
