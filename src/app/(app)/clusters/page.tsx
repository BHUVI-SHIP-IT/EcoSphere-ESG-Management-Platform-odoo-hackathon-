"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { SeverityChip } from "@/components/shared/chips";
import { ComplianceStatusChip } from "@/components/shared/chips";
import { Icon } from "@/components/icon";
import { issueClusters, complianceIssues, deptName } from "@/lib/mock";

export default function ClustersPage() {
  const unclustered = complianceIssues.filter((i) => !i.clusterId);

  return (
    <>
      <PageHeader
        title="Root-Cause Clusters"
        description="Compliance issues embedded and grouped by semantic similarity — surfacing recurring governance gaps across departments and time."
      />

      <div className="mb-4 flex items-start gap-3 rounded-lg border border-info/30 bg-info/10 p-4">
        <Icon name="git-fork" className="mt-0.5 h-5 w-5 text-info" />
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{issueClusters.length} recurring themes</span>{" "}
          detected across {complianceIssues.length} compliance issues. Clustering the same control failure
          across departments turns isolated tickets into a systemic signal.
        </p>
      </div>

      <div className="space-y-4">
        {issueClusters.map((cluster) => {
          const issues = complianceIssues.filter((i) => cluster.issueIds.includes(i.id));
          return (
            <Card key={cluster.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/12 text-info">
                      <Icon name="git-fork" className="h-4 w-4" />
                    </span>
                    <div>
                      <CardTitle className="text-base">{cluster.label}</CardTitle>
                      <CardDescription>
                        {cluster.issueIds.length} issues · {cluster.departmentsAffected} departments affected
                      </CardDescription>
                    </div>
                  </div>
                  {cluster.departmentsAffected > 1 && (
                    <Badge className="bg-warning/20 text-warning-foreground border-warning/40" variant="outline">
                      Cross-department pattern
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-2 pl-5">
                  <div className="absolute left-1.5 top-2 bottom-2 w-px bg-border" />
                  {issues.map((i) => (
                    <div key={i.id} className="relative flex items-center gap-3 rounded-lg border p-3">
                      <span className="absolute -left-[15px] h-3 w-3 rounded-full border-2 border-background bg-info" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{i.title}</p>
                        <p className="text-xs text-muted-foreground">{deptName(i.departmentId)}</p>
                      </div>
                      <SeverityChip severity={i.severity} />
                      <ComplianceStatusChip status={i.status} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {unclustered.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-muted-foreground">Unclustered issues</CardTitle>
              <CardDescription>No recurring pattern detected yet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {unclustered.map((i) => (
                <div key={i.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{i.title}</p>
                    <p className="text-xs text-muted-foreground">{deptName(i.departmentId)}</p>
                  </div>
                  <SeverityChip severity={i.severity} />
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
