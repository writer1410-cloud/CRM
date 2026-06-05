"use client";

import { Cell, Label, Pie, PieChart } from "recharts";

import { getTaskStatusBreakdown } from "@/lib/mock-data";
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

const chartConfig = {
  count: { label: "件数" },
  todo: { label: "未着手", color: "var(--chart-3)" },
  in_progress: { label: "進行中", color: "var(--chart-1)" },
  done: { label: "完了", color: "var(--chart-2)" },
} satisfies ChartConfig;

const COLORS: Record<string, string> = {
  todo: "var(--color-todo)",
  in_progress: "var(--color-in_progress)",
  done: "var(--color-done)",
};

export function TaskStatusChart() {
  const data = getTaskStatusBreakdown();
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>タスク進捗状況</CardTitle>
        <CardDescription>ステータス別のタスク件数</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[260px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="status" hideLabel />}
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              innerRadius={64}
              strokeWidth={4}
            >
              {data.map((entry) => (
                <Cell key={entry.status} fill={COLORS[entry.status]} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          総タスク
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <div className="flex justify-center gap-4 px-6 pb-6 text-sm">
        {data.map((entry) => (
          <div key={entry.status} className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-[2px]"
              style={{ backgroundColor: COLORS[entry.status] }}
            />
            <span className="text-muted-foreground">{entry.label}</span>
            <span className="font-medium">{entry.count}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
