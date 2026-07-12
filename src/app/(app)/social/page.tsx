"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusStepper, ProofDropzone } from "@/components/shared/status-stepper";
import { Icon } from "@/components/icon";
import { useRole } from "@/lib/role-context";
import { toast } from "sonner";

type RealCSRActivity = {
  id: string;
  title: string;
  description: string | null;
  departmentId: string;
  departmentName: string;
  participantCount: number;
};

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

export default function SocialPage() {
  const { role } = useRole();
  const [selected, setSelected] = useState<RealCSRActivity | null>(null);
  const [csrActivities, setCsrActivities] = useState<RealCSRActivity[]>([]);
  const [participations, setParticipations] = useState<RealParticipation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/social")
      .then((res) => res.json())
      .then((data) => {
        setCsrActivities(data.csrActivities ?? []);
        setParticipations(data.participations ?? []);
      })
      .catch(() => {
        setCsrActivities([]);
        setParticipations([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const myParticipation = selected
    ? participations.find((p) => p.activityId === selected.id)
    : null;

  const totalParticipants = csrActivities.reduce((a, c) => a + c.participantCount, 0);
  const pending = participations.filter((p) => p.status === "PENDING").length;

  return (
    <>
      <PageHeader
        title="CSR Activities"
        description="Community, education and wellbeing initiatives — join, submit proof, earn XP."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active activities" value={csrActivities.length} icon="hand-heart" accent="primary" />
        <StatCard label="Total participants" value={totalParticipants} icon="users" accent="info" />
        <StatCard label="Pending proofs" value={pending} icon="clipboard-check" accent="warning" />
      </div>

      {loading ? (
        <p className="mt-5 text-sm text-muted-foreground">Loading real activity data…</p>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {csrActivities.map((c) => (
            <Card key={c.id} className="flex flex-col overflow-hidden">
              <div className="flex h-28 items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-accent/30">
                <Icon name="hand-heart" className="h-9 w-9 text-primary/70" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline">{c.departmentName}</Badge>
                </div>
                <CardTitle className="mt-1.5 text-base">{c.title}</CardTitle>
                <CardDescription className="line-clamp-2">{c.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-3 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Icon name="users" className="h-3.5 w-3.5" /> {c.participantCount} joined
                  </span>
                </div>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button className="w-full" variant="secondary" onClick={() => setSelected(c)}>
                  View & participate
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <div className="mb-1 flex items-center gap-2">
                  <Badge variant="outline">{selected.departmentName}</Badge>
                </div>
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription>{selected.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {myParticipation ? (
                  <div className="space-y-3 rounded-lg border p-4">
                    <p className="text-sm font-medium">Submission status</p>
                    <StatusStepper
                      status={
                        myParticipation.status === "APPROVED"
                          ? "approved"
                          : myParticipation.status === "REJECTED"
                          ? "rejected"
                          : "submitted"
                      }
                    />
                  </div>
                ) : (
                  <ProofDropzone evidenceRequired={true} />
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Close
                </Button>
                {!myParticipation && (
                  <Button
                    onClick={() => {
                      toast.success(`Joined "${selected.title}" — proof submitted for review`);
                      setSelected(null);
                    }}
                  >
                    Submit participation
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