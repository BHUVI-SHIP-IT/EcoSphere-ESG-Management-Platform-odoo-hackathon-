import { Progress } from "@/components/ui/progress";
import { Icon } from "@/components/icon";

export function XpBar({ xp, level }: { xp: number; level: number }) {
  const perLevel = 500;
  const intoLevel = xp % perLevel;
  const pct = (intoLevel / perLevel) * 100;
  return (
    <div className="rounded-xl border bg-gradient-to-br from-primary/10 to-accent/20 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
            {level}
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Level {level}</p>
            <p className="text-xs text-muted-foreground">{xp.toLocaleString()} XP total</p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Icon name="trophy" className="h-3.5 w-3.5 text-primary" />
          {perLevel - intoLevel} XP to level {level + 1}
        </span>
      </div>
      <Progress value={pct} className="mt-3 h-2" />
    </div>
  );
}
