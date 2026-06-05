"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "@/lib/utils";
import { monthlySales, weeklySales } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const chartConfig = {
  sales: { label: "売上", color: "var(--chart-1)" },
  target: { label: "目標", color: "var(--chart-2)" },
} satisfies ChartConfig;

const compactYen = (value: number) => `¥${(value / 10000).toLocaleString()}万`;

export function SalesChart() {
  const [view, setView] = useState<"monthly" | "weekly">("monthly");

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1.5">
          <CardTitle>売上推移</CardTitle>
          <CardDescription>
            {view === "monthly" ? "月別の売上と目標の比較" : "今月の週別売上"}
          </CardDescription>
        </div>
        <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
          <TabsList>
            <TabsTrigger value="monthly">月別</TabsTrigger>
            <TabsTrigger value="weekly">週別</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {view === "monthly" ? (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={monthlySales} margin={{ left: 4, right: 12 }}>
              <defs>
                <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-sales)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-sales)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-target)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-target)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={56}
                tickFormatter={compactYen}
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
              <Area
                dataKey="target"
                type="monotone"
                fill="url(#fillTarget)"
                stroke="var(--color-target)"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
              <Area
                dataKey="sales"
                type="monotone"
                fill="url(#fillSales)"
                stroke="var(--color-sales)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={weeklySales} margin={{ left: 4, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="week"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={56}
                tickFormatter={compactYen}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => (
                      <span className="font-mono font-medium">
                        {formatCurrency(value as number)}
                      </span>
                    )}
                  />
                }
              />
              <Bar dataKey="sales" fill="var(--color-sales)" radius={0} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
