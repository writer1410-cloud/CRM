"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  RotateCw,
  Minus,
  X,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";

import { cn, formatCurrency } from "@/lib/utils";
import { salesSnapshot, weeklySalesTrend } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  thisWeek: { label: "今週", color: "var(--brand-orange)" },
  lastWeek: { label: "前週", color: "var(--brand-blue)" },
} satisfies ChartConfig;

const toMan = (value: number) => (value / 10000).toFixed(1);

interface KpiTileProps {
  label: string;
  value: number;
  dotClassName: string;
  change?: number;
}

function KpiTile({ label, value, dotClassName, change }: KpiTileProps) {
  const isPositive = (change ?? 0) >= 0;
  const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="bg-card flex flex-col gap-1 rounded-lg border px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-xs">{label}</span>
        {change !== undefined && (
          <span
            className={cn(
              "flex items-center text-xs font-medium",
              isPositive ? "text-brand-green" : "text-brand-red"
            )}
          >
            <TrendIcon className="size-3" />
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className={cn("size-3 shrink-0 rounded-full", dotClassName)} />
        <span className="text-xl font-bold tracking-tight tabular-nums">
          {formatCurrency(value)}
        </span>
      </div>
    </div>
  );
}

export function WeeklySalesCard() {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      {/* Card header with window controls */}
      <div className="flex items-center justify-between border-b px-5 py-3.5">
        <h2 className="text-sm font-semibold">
          週間売上データ（2020年1月6日から1月12日）
        </h2>
        <div className="text-muted-foreground flex items-center gap-2.5">
          <RotateCw className="size-4 cursor-pointer hover:text-foreground" />
          <Minus className="size-4 cursor-pointer hover:text-foreground" />
          <X className="size-4 cursor-pointer hover:text-foreground" />
        </div>
      </div>

      <div className="bg-muted/40 p-5">
        {/* KPI tiles */}
        <div className="grid gap-3 sm:grid-cols-3">
          <KpiTile
            label="本日の売上"
            value={salesSnapshot.today}
            change={salesSnapshot.todayChange}
            dotClassName="bg-muted-foreground"
          />
          <KpiTile
            label="今週の売上平均"
            value={salesSnapshot.thisWeekAvg}
            change={salesSnapshot.thisWeekAvgChange}
            dotClassName="bg-brand-orange"
          />
          <KpiTile
            label="前週の売上平均"
            value={salesSnapshot.lastWeekAvg}
            dotClassName="bg-brand-blue"
          />
        </div>

        {/* Legend */}
        <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="bg-brand-orange size-2.5 rounded-full" />
            今週：2020年1月6日から1月12日の売上データ
          </span>
          <span className="flex items-center gap-1.5">
            <span className="bg-brand-blue size-2.5 rounded-full" />
            前週：2019年12月30日から2020年1月5日の売上データ
          </span>
        </div>

        {/* Chart */}
        <ChartContainer
          config={chartConfig}
          className="mt-4 h-[300px] w-full"
        >
          <LineChart
            data={weeklySalesTrend}
            margin={{ top: 24, left: 4, right: 16, bottom: 4 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={32}
              tickFormatter={toMan}
              domain={[0, 40]}
              ticks={[0, 5, 10, 15, 20, 25, 30, 35]}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-3">
                      <span className="text-muted-foreground">
                        {chartConfig[name as keyof typeof chartConfig]?.label}
                      </span>
                      <span className="font-mono font-medium">
                        {formatCurrency(value as number)}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Line
              dataKey="lastWeek"
              type="monotone"
              stroke="var(--color-lastWeek)"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "var(--color-lastWeek)", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            >
              <LabelList
                dataKey="lastWeek"
                position="top"
                offset={10}
                className="fill-muted-foreground"
                fontSize={11}
                formatter={(value) => toMan(Number(value))}
              />
            </Line>
            <Line
              dataKey="thisWeek"
              type="monotone"
              stroke="var(--color-thisWeek)"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "var(--color-thisWeek)", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            >
              <LabelList
                dataKey="thisWeek"
                position="bottom"
                offset={10}
                className="fill-muted-foreground"
                fontSize={11}
                formatter={(value) => toMan(Number(value))}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </div>
    </Card>
  );
}
