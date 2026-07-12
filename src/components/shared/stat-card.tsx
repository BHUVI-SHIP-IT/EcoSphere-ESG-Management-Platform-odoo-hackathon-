import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import type { Trend } from "@/lib/types";

export function StatCard({
  label,
  value,
  unit,
  icon,
  trend,
  trendValue,
  accent = "primary",
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon: string;
  trend?: Trend;
  trendValue?: string;
  accent?: "primary" | "info" | "warning" | "danger" | "success";
}) {
  const accentClass = {
    primary: "bg-primary/12 text-primary",
    info: "bg-info/12 text-info",
    warning: "bg-warning/20 text-warning-foreground",
    danger: "bg-danger/12 text-danger",
    success: "bg-success/12 text-success",
  }[accent];

  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 font-heading text-2xl font-semibold tracking-tight">
            {value}
            {unit && <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>}
          </p>
          {trend && trendValue && (
            <p
              className={cn(
                "mt-1.5 flex items-center gap-1 text-xs font-medium",
                trend === "up" && "text-success",
                trend === "down" && "text-danger",
                trend === "flat" && "text-muted-foreground",
              )}
            >
              {trend === "up" ? "▲" : trend === "down" ? "▼" : "—"} {trendValue}
            </p>
          )}
        </div>
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", accentClass)}>
          <Icon name={icon} className="h-5 w-5" />
        </span>
      </CardContent>
    </Card>
  );
}
