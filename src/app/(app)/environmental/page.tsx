"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { TrendArea, Donut, Sparkline } from "@/components/charts/mini-charts";
import { Icon } from "@/components/icon";
import {
  carbonTransactions,
  carbonTrend,
  deptName,
  departments,
  emissionsBySource,
  erpRecords,
  factorById,
} from "@/lib/mock";
import { fmtCo2, fmtDate, fmtNumber } from "@/lib/format";
import type { CarbonTransaction, SourceType } from "@/lib/types";
import { cn } from "@/lib/utils";

const sourceLabels: Record<SourceType, string> = {
  purchase: "Purchase",
  manufacturing: "Manufacturing",
  expense: "Expense",
  fleet: "Fleet",
};

export default function EnvironmentalPage() {
  const [dept, setDept] = useState<string>("all");
  const [source, setSource] = useState<string>("all");
  const [selected, setSelected] = useState<CarbonTransaction | null>(null);

  const filtered = useMemo(
    () =>
      carbonTransactions.filter(
        (t) =>
          (dept === "all" || t.departmentId === dept) &&
          (source === "all" || t.sourceType === source),
      ),
    [dept, source],
  );

  const totalKg = carbonTransactions.reduce((a, t) => a + t.co2eKg, 0);
  const anomalies = carbonTransactions.filter((t) => t.anomaly?.isAnomaly);
  const autoPct = Math.round(
    (carbonTransactions.filter((t) => t.autoCalculated).length / carbonTransactions.length) * 100,
  );

  const selectedErp = selected ? erpRecords.find((e) => e.id === selected.sourceRecordId) : null;
  const selectedFactor = selected ? factorById(selected.emissionFactorId) : null;

  return (
    <>
      <PageHeader
        title="Carbon & Emissions"
        description="Emissions auto-calculated from linked operational records, with statistical anomaly detection."
        actions={
          <Button>
            <Icon name="leaf" className="h-4 w-4" /> Log transaction
          </Button>
        }
      />

      {/* Anomaly banner (novelty #2) */}
      {anomalies.length > 0 && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-danger/30 bg-danger/10 p-4">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-danger/15 text-danger">
            <Icon name="leaf" className="h-4 w-4" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-danger">
              {anomalies.length} carbon anomaly detected
            </p>
            <p className="text-sm text-muted-foreground">
              {deptName(anomalies[0].departmentId)} fleet emissions are{" "}
              <span className="font-medium text-foreground">
                {anomalies[0].anomaly!.zScore.toFixed(1)}σ
              </span>{" "}
              above the historical baseline of {fmtCo2(anomalies[0].anomaly!.baselineMean)}.
            </p>
          </div>
          <div className="hidden w-28 sm:block">
            <Sparkline data={anomalies[0].anomaly!.history} color="var(--danger)" />
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total emissions (30d)" value={fmtCo2(totalKg)} icon="leaf" trend="down" trendValue="6% vs prev" accent="success" />
        <StatCard label="Auto-calculated" value={`${autoPct}%`} icon="sliders-horizontal" accent="info" />
        <StatCard label="Anomalies flagged" value={anomalies.length} icon="shield-alert" accent="danger" />
        <StatCard label="Active goals" value={4} icon="target" accent="primary" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Emissions trend by department</CardTitle>
            <CardDescription>Monthly t CO₂e — note the Logistics fleet climb</CardDescription>
          </CardHeader>
          <CardContent>
            <TrendArea
              data={carbonTrend}
              xKey="month"
              series={departments.slice(0, 4).map((d) => ({ key: d.id, label: d.name }))}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">By source type</CardTitle>
            <CardDescription>Share of total emissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Donut data={emissionsBySource} />
            <div className="mt-2 grid grid-cols-2 gap-1.5 text-xs">
              {emissionsBySource.map((s, i) => (
                <div key={s.name} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: `var(--chart-${i + 1})` }}
                  />
                  {s.name} · {s.value}%
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions table */}
      <Card className="mt-4">
        <CardHeader className="flex-row items-center justify-between gap-3 pb-3">
          <div>
            <CardTitle className="text-base">Carbon transactions</CardTitle>
            <CardDescription>Click a row to trace it back to its source record</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={dept} onValueChange={setDept}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                {Object.entries(sourceLabels).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">CO₂e</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow
                  key={t.id}
                  className={cn("cursor-pointer", t.anomaly?.isAnomaly && "bg-danger/5")}
                  onClick={() => setSelected(t)}
                >
                  <TableCell className="whitespace-nowrap text-muted-foreground">{fmtDate(t.date)}</TableCell>
                  <TableCell className="font-medium">{deptName(t.departmentId)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{sourceLabels[t.sourceType]}</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {fmtNumber(t.quantity)} {t.unit}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{fmtCo2(t.co2eKg)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {t.autoCalculated && (
                        <Badge variant="secondary" className="gap-1 text-[10px]">
                          <Icon name="sparkles" className="h-3 w-3" /> Auto
                        </Badge>
                      )}
                      {t.anomaly?.isAnomaly && (
                        <Badge className="gap-1 bg-danger text-danger-foreground text-[10px]">
                          {t.anomaly.zScore.toFixed(1)}σ anomaly
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail drawer with traceability */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Icon name="leaf" className="h-4 w-4" /> Carbon transaction
                </SheetTitle>
                <SheetDescription>
                  Full traceability from computed emissions back to the operational record.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-5 px-4 pb-6">
                <div className="rounded-lg border bg-muted/30 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Computed emissions</p>
                  <p className="font-heading text-3xl font-bold text-primary">{fmtCo2(selected.co2eKg)}</p>
                </div>

                {selected.anomaly?.isAnomaly && (
                  <div className="rounded-lg border border-danger/30 bg-danger/10 p-3">
                    <p className="text-sm font-semibold text-danger">Anomaly detected</p>
                    <p className="text-xs text-muted-foreground">
                      {selected.anomaly.zScore.toFixed(1)}σ above the baseline of{" "}
                      {fmtCo2(selected.anomaly.baselineMean)}.
                    </p>
                    <div className="mt-2">
                      <Sparkline data={selected.anomaly.history} color="var(--danger)" />
                    </div>
                  </div>
                )}

                {/* Calculation chain */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Calculation
                  </p>
                  <div className="flex items-center gap-2 rounded-lg border p-3 text-sm">
                    <span className="tabular-nums">
                      {fmtNumber(selected.quantity)} {selected.unit}
                    </span>
                    <span className="text-muted-foreground">×</span>
                    <span className="tabular-nums">{selectedFactor?.co2ePerUnit} kg/{selectedFactor?.unit}</span>
                    <span className="text-muted-foreground">=</span>
                    <span className="font-semibold">{fmtCo2(selected.co2eKg)}</span>
                  </div>
                </div>

                {/* Emission factor */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Emission factor
                  </p>
                  <div className="rounded-lg border p-3">
                    <p className="font-medium">{selectedFactor?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedFactor?.co2ePerUnit} kg CO₂e / {selectedFactor?.unit} · {selectedFactor?.source}
                    </p>
                  </div>
                </div>

                {/* Linked ERP record */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Linked operational record
                  </p>
                  <div className="rounded-lg border p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{sourceLabels[selected.sourceType]}</Badge>
                      <span className="font-mono text-xs text-muted-foreground">{selectedErp?.reference}</span>
                    </div>
                    <p className="text-sm">{selectedErp?.description}</p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{deptName(selected.departmentId)}</span>
                      <span>{selectedErp && fmtDate(selectedErp.date)}</span>
                    </div>
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
