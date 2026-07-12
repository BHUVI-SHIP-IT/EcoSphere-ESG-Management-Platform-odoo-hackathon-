"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { ScoreSimulator } from "@/components/shared/score-simulator";
import { Icon } from "@/components/icon";
import { departments } from "@/lib/mock";
import type { Severity } from "@/lib/types";
import { toast } from "sonner";

const automations = [
  { key: "auto-emission", label: "Auto Emission Calculation", desc: "Auto-create carbon transactions from linked Purchase/Manufacturing/Expense/Fleet records." },
  { key: "evidence", label: "Evidence Requirement", desc: "Require proof upload before a CSR or challenge participation can be approved." },
  { key: "badge-auto", label: "Badge Auto-Award", desc: "Award badges the moment an employee's XP or completed-count satisfies an unlock rule." },
  { key: "overdue-flag", label: "Overdue Compliance Flagging", desc: "Automatically flag compliance issues as overdue past their due date." },
];

const digestRules: { severity: Severity; delivery: "immediate" | "digest" }[] = [
  { severity: "critical", delivery: "immediate" },
  { severity: "high", delivery: "immediate" },
  { severity: "medium", delivery: "digest" },
  { severity: "low", delivery: "digest" },
];

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings & Administration"
        description="Scoring weights, automation rules, notifications, and master data."
      />

      <Tabs defaultValue="scoring">
        <TabsList className="flex-wrap">
          <TabsTrigger value="scoring">Scoring</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="builder">Badges & Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="scoring" className="mt-4">
          <ScoreSimulator />
        </TabsContent>

        <TabsContent value="automation" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Automation Rules</CardTitle>
              <CardDescription>Reduce manual effort across the platform</CardDescription>
            </CardHeader>
            <CardContent className="divide-y">
              {automations.map((a) => (
                <div key={a.key} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{a.label}</p>
                    <p className="text-xs text-muted-foreground">{a.desc}</p>
                  </div>
                  <Switch defaultChecked onCheckedChange={(v) => toast(`${a.label}: ${v ? "on" : "off"}`)} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Severity-Aware Digesting</CardTitle>
              <CardDescription>
                High-severity events fire immediately; lower-priority ones bundle into a daily digest to reduce fatigue.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {digestRules.map((r) => (
                <div key={r.severity} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                  <Badge
                    variant="outline"
                    className="capitalize"
                  >
                    {r.severity}
                  </Badge>
                  <Select defaultValue={r.delivery}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="digest">Daily digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Channels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {["In-app notifications", "Email notifications"].map((c) => (
                <div key={c} className="flex items-center justify-between">
                  <span className="text-sm">{c}</span>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Departments</CardTitle>
              <CardDescription>Organizational hierarchy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {departments.map((d) => (
                <div key={d.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Icon name="users" className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{d.name}</span>
                    <Badge variant="secondary" className="text-[10px]">{d.headcount} people</Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => toast("Edit department")}>Edit</Button>
                </div>
              ))}
              <Button variant="outline" className="w-full" onClick={() => toast.success("Add department")}>
                <Icon name="users" className="h-4 w-4" /> Add department
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Badge Unlock Rule Builder</CardTitle>
              <CardDescription>Define the metric, operator and threshold that unlocks a badge</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-4">
                <Input placeholder="Badge name" />
                <Select defaultValue="xp">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xp">XP</SelectItem>
                    <SelectItem value="challenges_completed">Challenges completed</SelectItem>
                    <SelectItem value="csr_completed">CSR completed</SelectItem>
                    <SelectItem value="streak_days">Streak days</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue=">=">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value=">=">≥</SelectItem>
                    <SelectItem value=">">&gt;</SelectItem>
                    <SelectItem value="==">=</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="number" placeholder="Threshold" defaultValue={1000} />
              </div>
              <Button onClick={() => toast.success("Badge rule created")}>
                <Icon name="award" className="h-4 w-4" /> Create badge
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
