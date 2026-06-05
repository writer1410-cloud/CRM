import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SummaryCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  /** Percentage change vs. the previous period. Omit to hide the trend row. */
  change?: number;
  changeLabel?: string;
  /** Optional accent for the icon badge, e.g. "text-emerald-600 bg-emerald-100". */
  accentClassName?: string;
  hint?: string;
}

export function SummaryCard({
  title,
  value,
  icon: Icon,
  change,
  changeLabel,
  accentClassName,
  hint,
}: SummaryCardProps) {
  const isPositive = (change ?? 0) >= 0;
  const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="gap-0 py-5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-lg",
            accentClassName ?? "bg-primary/10 text-primary"
          )}
        >
          <Icon className="size-5" />
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {change !== undefined ? (
          <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
            <span
              className={cn(
                "flex items-center font-medium",
                isPositive ? "text-emerald-600" : "text-destructive"
              )}
            >
              <TrendIcon className="size-3.5" />
              {Math.abs(change)}%
            </span>
            {changeLabel ?? "前月比"}
          </p>
        ) : hint ? (
          <p className="text-muted-foreground mt-1 text-xs">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
