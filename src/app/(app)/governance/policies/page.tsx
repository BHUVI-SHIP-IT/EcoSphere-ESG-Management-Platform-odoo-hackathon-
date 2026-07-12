"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageHeader } from "@/components/shared/page-header";
import { Icon } from "@/components/icon";
import { policies } from "@/lib/mock";
import { fmtDate } from "@/lib/format";
import type { Policy } from "@/lib/types";
import { toast } from "sonner";

export default function PoliciesPage() {
  const [selected, setSelected] = useState<Policy | null>(null);
  const [scrolledEnd, setScrolledEnd] = useState(false);

  return (
    <>
      <PageHeader
        title="ESG Policy Library"
        description="Published policies with acknowledgement tracking. All acknowledgements are hash-chained."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {policies.map((p) => (
          <Card key={p.id} className="flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline" className="capitalize">{p.pillar}</Badge>
                <Badge variant="secondary" className="font-mono text-[10px]">{p.version}</Badge>
              </div>
              <CardTitle className="mt-1.5 text-base">{p.title}</CardTitle>
              <CardDescription>Published {fmtDate(p.publishedAt)}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto space-y-3">
              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Acknowledged</span>
                  <span className="font-medium">{p.acknowledgedPct}%</span>
                </div>
                <Progress value={p.acknowledgedPct} className="h-1.5" />
              </div>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setSelected(p);
                  setScrolledEnd(false);
                }}
              >
                Read {p.requiresAcknowledgement && "& acknowledge"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">{selected.pillar}</Badge>
                  <Badge variant="secondary" className="font-mono text-[10px]">{selected.version}</Badge>
                </div>
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription>Published {fmtDate(selected.publishedAt)}</DialogDescription>
              </DialogHeader>

              <ScrollArea
                className="h-64 rounded-lg border p-4"
                onScrollCapture={(e) => {
                  const el = e.currentTarget.querySelector("[data-radix-scroll-area-viewport]") as HTMLElement | null;
                  if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 24) setScrolledEnd(true);
                }}
              >
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {selected.body}
                  {"\n\n"}
                  This policy is reviewed annually. Employees are responsible for compliance and for
                  raising any concerns through the appropriate channel. Non-compliance may result in
                  corrective action in line with the Code of Conduct.
                </p>
              </ScrollArea>

              {selected.requiresAcknowledgement && (
                <p className="text-xs text-muted-foreground">
                  {scrolledEnd ? (
                    <span className="text-success">✓ You&rsquo;ve read to the end — you can acknowledge now.</span>
                  ) : (
                    "Scroll to the end of the policy to enable acknowledgement."
                  )}
                </p>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Close
                </Button>
                {selected.requiresAcknowledgement && (
                  <Button
                    disabled={!scrolledEnd}
                    onClick={() => {
                      toast.success(`Acknowledged "${selected.title}"`);
                      setSelected(null);
                    }}
                  >
                    <Icon name="shield-check" className="h-4 w-4" /> Acknowledge
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
