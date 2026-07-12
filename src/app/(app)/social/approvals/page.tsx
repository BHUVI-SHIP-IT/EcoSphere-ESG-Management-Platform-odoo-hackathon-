"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { ApprovalStatusChip } from "@/components/shared/chips";
import { EmptyState } from "@/components/shared/empty-state";
import { Icon } from "@/components/icon";
import {
  participations as seed,
  csrActivities,
  userName,
  initials,
} from "@/lib/mock";
import { fmtDate } from "@/lib/format";
import type { Participation } from "@/lib/types";
import { toast } from "sonner";

function activityTitle(id: string): string {
  return csrActivities.find((a) => a.id === id)?.title ?? "Unknown activity";
}
function activityEvidence(id: string): boolean {
  return csrActivities.find((a) => a.id === id)?.evidenceRequired ?? false;
}

export default function ApprovalsPage() {
  const [rows, setRows] = useState<Participation[]>(seed);
  const queue = rows.filter((p) => p.status === "submitted" || p.status === "under_review");
  const decided = rows.filter((p) => p.status === "approved" || p.status === "rejected");

  function decide(id: string, status: "approved" | "rejected") {
    setRows((r) => r.map((p) => (p.id === id ? { ...p, status } : p)));
    toast[status === "approved" ? "success" : "error"](
      `Participation ${status}`,
    );
  }

  return (
    <>
      <PageHeader
        title="Approval Queue"
        description="Review submitted proof of participation. Evidence-required activities are locked until proof is attached."
      />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Pending review ({queue.length})</CardTitle>
          <CardDescription>Approve or reject with a reason</CardDescription>
        </CardHeader>
        <CardContent>
          {queue.length === 0 ? (
            <EmptyState icon="clipboard-check" title="All caught up" description="No submissions waiting for review." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Proof</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Decision</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queue.map((p) => {
                  const evidenceRequired = activityEvidence(p.activityId);
                  const locked = evidenceRequired && !p.proofUrl;
                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="bg-muted text-[10px]">
                              {initials(userName(p.userId))}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{userName(p.userId)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{activityTitle(p.activityId)}</TableCell>
                      <TableCell>
                        {p.proofUrl ? (
                          <Badge variant="outline" className="gap-1">
                            <Icon name="clipboard-check" className="h-3 w-3" /> {p.proofUrl}
                          </Badge>
                        ) : locked ? (
                          <Badge className="gap-1 bg-danger/15 text-danger border-danger/30" variant="outline">
                            Evidence required
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{fmtDate(p.submittedAt)}</TableCell>
                      <TableCell>
                        <ApprovalStatusChip status={p.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-success/40 text-success hover:bg-success/10"
                            disabled={locked}
                            onClick={() => decide(p.id, "approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-danger/40 text-danger hover:bg-danger/10"
                            onClick={() => decide(p.id, "rejected")}
                          >
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Recently decided</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {decided.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="text-sm font-medium">{userName(p.userId)}</TableCell>
                  <TableCell className="text-sm">{activityTitle(p.activityId)}</TableCell>
                  <TableCell>
                    <ApprovalStatusChip status={p.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {p.rejectionReason ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
