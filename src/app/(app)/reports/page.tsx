"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/shared/page-header";
import { Icon } from "@/components/icon";
import { departments, orgSnapshot, deptName } from "@/lib/mock";
import { scoreColor } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const presets = [
  { key: "environmental", title: "Environmental Report", icon: "leaf", desc: "Emissions, factors, goals and anomalies." },
  { key: "social", title: "Social Report", icon: "hand-heart", desc: "CSR participation, diversity and training." },
  { key: "governance", title: "Governance Report", icon: "shield-alert", desc: "Policies, audits and compliance issues." },
  { key: "summary", title: "ESG Summary", icon: "bar-chart-3", desc: "Weighted composite across all pillars." },
];

const modules = ["Environmental", "Social", "Governance", "Gamification"];

export default function ReportsPage() {
  const [drill, setDrill] = useState<string | null>(null);
  const snap = orgSnapshot;

  return (
    <>
      <PageHeader
        title="Reports"
        description="Preset reports, a custom builder, and full score explainability. Export to PDF, Excel or CSV."
      />

      {/* Preset selector */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {presets.map((p) => (
          <Card key={p.key} className="group cursor-pointer transition-shadow hover:shadow-md" onClick={() => toast(`Generating ${p.title}…`)}>
            <CardContent className="flex flex-col gap-2 p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <Icon name={p.icon} className="h-5 w-5" />
              </span>
              <p className="font-semibold">{p.title}</p>
              <p className="text-xs text-muted-foreground">{p.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Custom builder */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Custom Report Builder</CardTitle>
            <CardDescription>Filter the preview, then export</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Department</label>
                <Select defaultValue="all">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All departments</SelectItem>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Date range</label>
                <Select defaultValue="q3">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="q3">This quarter</SelectItem>
                    <SelectItem value="ytd">Year to date</SelectItem>
                    <SelectItem value="12m">Last 12 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Category</label>
                <Select defaultValue="all">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    <SelectItem value="e">Environmental</SelectItem>
                    <SelectItem value="s">Social</SelectItem>
                    <SelectItem value="g">Governance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Modules</label>
              <div className="flex flex-wrap gap-4">
                {modules.map((m) => (
                  <label key={m} className="flex items-center gap-2 text-sm">
                    <Checkbox defaultChecked /> {m}
                  </label>
                ))}
              </div>
            </div>

            {/* Live preview */}
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Live preview — click a score to explain it</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Env</TableHead>
                    <TableHead className="text-right">Social</TableHead>
                    <TableHead className="text-right">Gov</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell className="text-right">{d.environmentalScore}</TableCell>
                      <TableCell className="text-right">{d.socialScore}</TableCell>
                      <TableCell className="text-right">{d.governanceScore}</TableCell>
                      <TableCell className="text-right">
                        <button
                          className={cn("font-semibold underline-offset-2 hover:underline", scoreColor(d.totalScore))}
                          onClick={() => setDrill(d.id)}
                        >
                          {d.totalScore}
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex gap-2">
              {["PDF", "Excel", "CSV"].map((f) => (
                <Button key={f} variant="outline" onClick={() => toast.success(`Exported as ${f}`)}>
                  <Icon name="bar-chart-3" className="h-4 w-4" /> {f}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Explainability summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Why this score?</CardTitle>
            <CardDescription>Org-wide contribution breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {snap.contributions?.map((c) => (
              <div key={c.sourceRecordId} className="flex items-center justify-between gap-2 rounded-lg border p-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm">{c.label}</p>
                  <p className="text-[11px] capitalize text-muted-foreground">{c.pillar} · {c.sourceType}</p>
                </div>
                <span className={cn("shrink-0 text-sm font-semibold", c.points >= 0 ? "text-success" : "text-danger")}>
                  {c.points >= 0 ? "+" : ""}
                  {c.points}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Drill-down dialog (novelty #5) */}
      <Dialog open={!!drill} onOpenChange={(o) => !o && setDrill(null)}>
        <DialogContent className="max-w-lg">
          {drill && (
            <>
              <DialogHeader>
                <DialogTitle>Score breakdown — {deptName(drill)}</DialogTitle>
                <DialogDescription>
                  Every point traces back to a real transaction, participation or compliance record.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                {snap.contributions?.map((c) => (
                  <div key={c.sourceRecordId} className="flex items-center justify-between gap-2 rounded-lg border p-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{c.label}</p>
                      <p className="text-[11px] text-muted-foreground">
                        <span className="capitalize">{c.pillar}</span> · {c.sourceType} · {c.sourceRecordId}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(c.points >= 0 ? "border-success/30 text-success" : "border-danger/30 text-danger")}
                    >
                      {c.points >= 0 ? "+" : ""}
                      {c.points} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
