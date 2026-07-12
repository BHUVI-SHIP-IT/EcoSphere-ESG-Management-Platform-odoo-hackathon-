"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { PageHeader } from "@/components/shared/page-header";
import { SeverityChip } from "@/components/shared/chips";
import { Icon } from "@/components/icon";
import {
  complianceIssues,
  deptName,
  userName,
  initials,
} from "@/lib/mock";
import { fmtDate } from "@/lib/format";
import type { ComplianceIssue, ComplianceStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const columns: { key: ComplianceStatus; label: string; accent: string }[] = [
  { key: "open", label: "Open", accent: "border-t-muted-foreground/40" },
  { key: "in_progress", label: "In Progress", accent: "border-t-info" },
  { key: "overdue", label: "Overdue", accent: "border-t-danger" },
  { key: "resolved", label: "Resolved", accent: "border-t-success" },
];

export default function CompliancePage() {
  const [selected, setSelected] = useState<ComplianceIssue | null>(null);
  const overdue = complianceIssues.filter((i) => i.status === "overdue");

  return (
    <>
      <PageHeader
        title="Compliance Board"
        description="Every issue has a mandatory owner and due date. Overdue items are flagged automatically."
        actions={
          <Button>
            <Icon name="shield-alert" className="h-4 w-4" /> New issue
          </Button>
        }
      />

      {overdue.length > 0 && (
        <div className="mb-5 flex items-center gap-3 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3">
          <Icon name="shield-alert" className="h-5 w-5 text-danger" />
          <p className="text-sm">
            <span className="font-semibold text-danger">{overdue.length} overdue issues</span>{" "}
            <span className="text-muted-foreground">
              require immediate attention — including {overdue.filter((i) => i.severity === "critical").length} critical.
            </span>
          </p>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => {
          const items = complianceIssues.filter((i) => i.status === col.key);
          return (
            <div key={col.key} className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-sm font-semibold">{col.label}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {items.length}
                </span>
              </div>
              <div className="space-y-2">
                {items.map((issue) => (
                  <Card
                    key={issue.id}
                    className={cn("cursor-pointer border-t-2 transition-shadow hover:shadow-md", col.accent)}
                    onClick={() => setSelected(issue)}
                  >
                    <CardContent className="space-y-2 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-snug">{issue.title}</p>
                      </div>
                      <p className="line-clamp-2 text-xs text-muted-foreground">{issue.description}</p>
                      <div className="flex items-center justify-between">
                        <SeverityChip severity={issue.severity} />
                        <span className="text-[11px] text-muted-foreground">due {fmtDate(issue.dueDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 pt-1">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="bg-muted text-[9px]">
                            {initials(userName(issue.ownerId))}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[11px] text-muted-foreground">{userName(issue.ownerId)}</span>
                        {issue.verified && (
                          <span className="ml-auto flex items-center gap-0.5 text-[10px] text-success" title="Tamper-evident">
                            <Icon name="shield-check" className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.title}</SheetTitle>
                <SheetDescription>{selected.description}</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-4 pb-6">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Field label="Owner" value={userName(selected.ownerId)} />
                  <Field label="Department" value={deptName(selected.departmentId)} />
                  <Field label="Severity" value={<SeverityChip severity={selected.severity} />} />
                  <Field label="Pillar" value={<span className="capitalize">{selected.linkedPillar}</span>} />
                  <Field label="Created" value={fmtDate(selected.createdAt)} />
                  <Field label="Due" value={fmtDate(selected.dueDate)} />
                </div>

                {/* Tamper-evident chain (novelty #8) */}
                <div className="rounded-lg border border-success/30 bg-success/10 p-3">
                  <div className="flex items-center gap-2">
                    <Icon name="shield-check" className="h-4 w-4 text-success" />
                    <span className="text-sm font-semibold text-success">Verified — unmodified</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    This record is part of an append-only hash chain. Any post-hoc edit would break the chain.
                  </p>
                  <div className="mt-2 space-y-1 font-mono text-[11px] text-muted-foreground">
                    <div>prev: {selected.prevHash}</div>
                    <div>hash: {selected.hash}</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-0.5 font-medium">{value}</div>
    </div>
  );
}
