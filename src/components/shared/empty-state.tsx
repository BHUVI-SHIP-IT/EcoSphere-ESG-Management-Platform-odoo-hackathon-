import { Icon } from "@/components/icon";

export function EmptyState({
  icon = "search",
  title,
  description,
}: {
  icon?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-14 text-center">
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <p className="font-medium">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
