import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import type { ApprovalStatus } from "@/lib/types";

const steps: { key: ApprovalStatus; label: string }[] = [
  { key: "submitted", label: "Submitted" },
  { key: "under_review", label: "Under Review" },
  { key: "approved", label: "Approved" },
];

export function StatusStepper({ status }: { status: ApprovalStatus }) {
  const rejected = status === "rejected";
  const activeIndex = rejected
    ? 1
    : steps.findIndex((s) => s.key === status);

  return (
    <div className="flex items-center">
      {steps.map((s, i) => {
        const done = !rejected && i <= activeIndex;
        const isRejectStep = rejected && i === 2;
        return (
          <div key={s.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold",
                  isRejectStep
                    ? "border-danger bg-danger text-danger-foreground"
                    : done
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-muted text-muted-foreground",
                )}
              >
                {isRejectStep ? "✕" : done ? "✓" : i + 1}
              </span>
              <span className={cn("text-[10px]", done || isRejectStep ? "text-foreground" : "text-muted-foreground")}>
                {isRejectStep ? "Rejected" : s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "mx-1 h-0.5 flex-1",
                  i < activeIndex && !rejected ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ProofDropzone({ evidenceRequired }: { evidenceRequired: boolean }) {
  return (
    <div className="rounded-lg border-2 border-dashed border-border bg-muted/20 p-6 text-center transition-colors hover:border-primary/40">
      <span className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/12 text-primary">
        <Icon name="clipboard-check" className="h-5 w-5" />
      </span>
      <p className="text-sm font-medium">Drag & drop proof of participation</p>
      <p className="text-xs text-muted-foreground">
        {evidenceRequired ? "Evidence required before approval." : "Optional for this activity."} PNG,
        JPG or PDF up to 10 MB.
      </p>
    </div>
  );
}
