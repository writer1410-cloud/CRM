"use client";

import { useOptimistic, useMemo, useState, useTransition } from "react";
import { Search } from "lucide-react";

import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  saleStatusLabels,
  type Sale,
  type SaleStatus,
} from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NewSaleDialog, type NewSaleValues } from "./new-sale-dialog";
import { createSaleAction } from "@/app/actions/sales";

const statusDot: Record<SaleStatus, string> = {
  paid: "bg-brand-green",
  pending: "bg-brand-orange",
  overdue: "bg-brand-red",
  cancelled: "bg-muted-foreground/60",
};

function StatusBadge({ status }: { status: SaleStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <span className={cn("size-2 rounded-full", statusDot[status])} />
      {saleStatusLabels[status]}
    </span>
  );
}

interface SalesViewProps {
  initialSales: Sale[];
}

export function SalesView({ initialSales }: SalesViewProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<SaleStatus | "all">("all");
  const [isPending, startTransition] = useTransition();

  // useOptimistic syncs automatically with initialSales when server re-renders
  const [optimisticSales, addOptimisticSale] = useOptimistic(
    initialSales,
    (state: Sale[], newSale: Sale) => [newSale, ...state]
  );

  function handleCreate(values: NewSaleValues) {
    const maxNumber = optimisticSales.reduce((max, sale) => {
      const n = Number(sale.id.replace(/\D/g, ""));
      return Number.isNaN(n) ? max : Math.max(max, n);
    }, 1000);
    const optimistic: Sale = { id: `INV-${maxNumber + 1}`, ...values };

    startTransition(async () => {
      addOptimisticSale(optimistic);
      await createSaleAction(values);
    });
  }

  const filtered = useMemo(() => {
    return optimisticSales.filter((sale) => {
      const matchesQuery = sale.customerName
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || sale.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [optimisticSales, query, statusFilter]);

  const totalAmount = filtered.reduce((sum, s) => sum + s.amount, 0);
  const paidAmount = filtered
    .filter((s) => s.status === "paid")
    .reduce((sum, s) => sum + s.amount, 0);
  const pendingCount = filtered.filter(
    (s) => s.status === "pending" || s.status === "overdue"
  ).length;

  return (
    <div className="flex flex-col gap-5">
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="gap-0 py-5">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-medium">
              合計売上（表示中）
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 text-2xl font-bold">
            {formatCurrency(totalAmount)}
          </CardContent>
        </Card>
        <Card className="gap-0 py-5">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-medium">
              入金済み
            </CardTitle>
          </CardHeader>
          <CardContent className="text-brand-green pt-2 text-2xl font-bold">
            {formatCurrency(paidAmount)}
          </CardContent>
        </Card>
        <Card className="gap-0 py-5">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-medium">
              未入金・遅延
            </CardTitle>
          </CardHeader>
          <CardContent className="text-brand-orange pt-2 text-2xl font-bold">
            {pendingCount} 件
          </CardContent>
        </Card>
      </div>

      {/* Table card */}
      <Card className="gap-0 py-0">
        <CardHeader className="flex flex-col gap-3 border-b py-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">売上履歴</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
              <Input
                placeholder="顧客名で検索..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-8 sm:w-56"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as SaleStatus | "all")}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべてのステータス</SelectItem>
                {(Object.keys(saleStatusLabels) as SaleStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    {saleStatusLabels[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <NewSaleDialog onCreate={handleCreate} disabled={isPending} />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">請求番号</TableHead>
                <TableHead>日付</TableHead>
                <TableHead>顧客名</TableHead>
                <TableHead className="text-right">金額</TableHead>
                <TableHead className="pr-5">ステータス</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="text-muted-foreground pl-5 font-mono text-xs">
                    {sale.id}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(sale.date)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {sale.customerName}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatCurrency(sale.amount)}
                  </TableCell>
                  <TableCell className="pr-5">
                    <StatusBadge status={sale.status} />
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-muted-foreground py-12 text-center"
                  >
                    条件に一致する売上がありません。
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
