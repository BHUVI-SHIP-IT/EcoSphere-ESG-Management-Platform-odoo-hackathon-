import { cn } from "@/lib/utils";
import {
  approvalStatusStyles,
  complianceStatusStyles,
  severityStyles,
  statusLabel,
} from "@/lib/format";
import type { ApprovalStatus, ComplianceStatus, Severity } from "@/lib/types";

const base =
  "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize";

export function SeverityChip({ severity }: { severity: Severity }) {
  return <span className={cn(base, severityStyles[severity])}>{severity}</span>;
}

export function ComplianceStatusChip({ status }: { status: ComplianceStatus }) {
  return <span className={cn(base, complianceStatusStyles[status])}>{statusLabel[status]}</span>;
}

export function ApprovalStatusChip({ status }: { status: ApprovalStatus }) {
  return <span className={cn(base, approvalStatusStyles[status])}>{statusLabel[status]}</span>;
}
