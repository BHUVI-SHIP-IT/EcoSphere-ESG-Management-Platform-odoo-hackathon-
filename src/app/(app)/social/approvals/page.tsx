"use client";

import { useEffect, useState } from "react";
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
import { fmtDate } from "@/lib/format";
import { toast } from "sonner";

type RealParticipation = {
  id: string;
  activityId: string;
  activityTitle: string;
  userId: string;
  userName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  proofUrl: string | null;
  submittedAt: string;
};

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Maps real enum values to the status chip's expected mock-style strings
function toChipStatus(status: RealParticipation["status"]): "submitted" | "under_review" | "approved" | "rejected" {
  if (status === "APPROVED") return "approved";
  if (status === "REJECTED") return "rejected";
  return "submitted";
}

export default function ApprovalsPage() {
  const [rows, setRows] = useState<RealParticipation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/social")
      .then((res) => res.json())
      .then((data) => setRows(data.participations ?? []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  const queue = rows.filter((p) => p.status === "PENDING");
  const decided = rows.filter((p) => p.status === "APPROVED" || p.status === "REJECTED");

  async function decide(id: string, status: "APPROVED" | "REJECTED") {
    // Optimistic update
    setRows((r) => r.map((p) => (p.id === id ? { ...p, status } : p)));

    try {
      const res = await fetch(`/api/social/participations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast[status === "APPROVED" ? "success" : "error"](`Participation ${status.toLowerCase()}`);
    } catch {
      toast.error("Failed to save decision — please retry");
      // Revert on failure
      setRows((r) => r.map((p) => (p.id === id ? { ...p, status: "PENDING" } : p)));
    }
  }

  if (loading) {
    return (
      <>
        <PageHeader
          title="Approval Queue"
          description="Review submitted proof of participation."
        />
        <p className="text-sm text-muted-foreground">Loading real submissions…</p>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Approval Queue"
        description="Review submitted proof of participation. Decisions are saved to the database immediately."
      />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Pending review ({queue.length})</CardTitle>
          <CardDescription>Approve or reject</CardDescription>
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
                {queue.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-muted text-[10px]">
                            {initials(p.userName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{p.userName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{p.activityTitle}</TableCell>
                    <TableCell>
                      {p.proofUrl ? (
                        <Badge variant="outline" className="gap-1">
                          <Icon name="clipboard-check" className="h-3 w-3" /> {p.proofUrl}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{fmtDate(p.submittedAt)}</TableCell>
                    <TableCell>
                      <ApprovalStatusChip status={toChipStatus(p.status)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-success/40 text-success hover:bg-success/10"
                          onClick={() => decide(p.id, "APPROVED")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-danger/40 text-danger hover:bg-danger/10"
                          onClick={() => decide(p.id, "REJECTED")}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {decided.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="text-sm font-medium">{p.userName}</TableCell>
                  <TableCell className="text-sm">{p.activityTitle}</TableCell>
                  <TableCell>
                    <ApprovalStatusChip status={toChipStatus(p.status)} />
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