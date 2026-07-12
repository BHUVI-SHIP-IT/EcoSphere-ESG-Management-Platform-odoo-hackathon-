"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/page-header";
import { Donut, SimpleBar } from "@/components/charts/mini-charts";
import { diversityMetrics, trainingByDept } from "@/lib/mock";

export default function DiversityPage() {
  return (
    <>
      <PageHeader
        title="Diversity & Training"
        description="Workforce demographics and mandatory training completion across departments."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {diversityMetrics.map((m) => (
          <Card key={m.dimension}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{m.dimension}</CardTitle>
              <CardDescription>Workforce breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <Donut data={m.segments.map((s) => ({ name: s.label, value: s.count }))} height={200} />
              <div className="mt-2 space-y-1 text-xs">
                {m.segments.map((s, i) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: `var(--chart-${i + 1})` }} />
                      {s.label}
                    </span>
                    <span className="font-medium">{s.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Training completion by department</CardTitle>
            <CardDescription>Mandatory course completion %</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBar data={trainingByDept} xKey="dept" barKey="completion" horizontal color="var(--chart-1)" height={280} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Completion detail</CardTitle>
            <CardDescription>Progress toward 100% mandate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {trainingByDept.map((t) => (
              <div key={t.dept}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{t.dept}</span>
                  <span className="text-muted-foreground">{t.completion}%</span>
                </div>
                <Progress value={t.completion} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
