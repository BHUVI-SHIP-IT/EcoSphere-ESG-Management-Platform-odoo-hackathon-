"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { SeverityChip } from "@/components/shared/chips";
import { Icon } from "@/components/icon";
import { audits, deptName, userName } from "@/lib/mock";
import { fmtDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  scheduled: "bg-muted text-muted-foreground border-border",
  in_progress: "bg-info/15 text-info border-info/30",
  completed: "bg-success/15 text-success border-success/30",
};

export default function AuditsPage() {
  return (
    <>
      <PageHeader
        title="Audits"
        description="Audit events and findings, written to a tamper-evident hash chain."
      />

      {/* Hash-chain integrity strip (novelty #8) */}
      <div className="mb-5 flex items-center gap-3 rounded-lg border border-success/30 bg-success/10 px-4 py-3">
        <Icon name="shield-check" className="h-5 w-5 text-success" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-success">Chain verified — {audits.length} records intact</p>
          <p className="text-xs text-muted-foreground">
            Each audit links to the previous record&rsquo;s hash. No gaps or modifications detected.
          </p>
        </div>
        <Badge variant="outline" className="border-success/40 text-success">Unmodified</Badge>
      </div>

      <div className="relative space-y-4 pl-6">
        <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
        {audits.map((a) => (
          <div key={a.id} className="relative">
            <span className="absolute -left-[18px] top-4 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background bg-primary" />
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{a.title}</CardTitle>
                    <CardDescription>
                      {deptName(a.departmentId)} · {userName(a.auditorId)} · {fmtDate(a.date)}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className={cn("capitalize", statusStyles[a.status])}>
                    {a.status.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {a.findings.map((f) => (
                    <div key={f.id} className="flex items-start gap-2 rounded-lg border p-2.5">
                      <span className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", f.resolved ? "bg-success" : "bg-danger")} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{f.title}</p>
                          <SeverityChip severity={f.severity} />
                          {f.resolved && (
                            <Badge variant="outline" className="border-success/30 text-success text-[10px]">
                              Resolved
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{f.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 border-t pt-2 font-mono text-[11px] text-muted-foreground">
                  <Icon name="shield-check" className="h-3.5 w-3.5 text-success" />
                  <span>prev {a.prevHash}</span>
                  <Icon name="chevron-right" className="h-3 w-3" />
                  <span>hash {a.hash}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}
