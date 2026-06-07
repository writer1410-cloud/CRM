"use client";

import { useOptimistic, useMemo, useState, useTransition } from "react";
import { Mail, Phone, Search } from "lucide-react";

import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  customerStatusLabels,
  type Customer,
  type CustomerStatus,
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
import { NewCustomerDialog, type NewCustomerValues } from "./new-customer-dialog";
import { createCustomerAction } from "@/app/actions/customers";

const statusDot: Record<CustomerStatus, string> = {
  active: "bg-brand-green",
  lead: "bg-brand-blue",
  inactive: "bg-brand-orange",
  churned: "bg-brand-red",
};

function StatusBadge({ status }: { status: CustomerStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <span className={cn("size-2 rounded-full", statusDot[status])} />
      {customerStatusLabels[status]}
    </span>
  );
}

interface CustomersViewProps {
  initialCustomers: Customer[];
}

export function CustomersView({ initialCustomers }: CustomersViewProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | "all">("all");
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);

  const [optimisticCustomers, addOptimisticCustomer] = useOptimistic(
    initialCustomers,
    (state: Customer[], newCustomer: Customer) => [newCustomer, ...state]
  );

  function handleCreate(values: NewCustomerValues) {
    const maxNumber = optimisticCustomers.reduce((max, c) => {
      const n = Number(c.id.replace(/\D/g, ""));
      return Number.isNaN(n) ? max : Math.max(max, n);
    }, 10);
    const optimistic: Customer = {
      id: `CUS-${String(maxNumber + 1).padStart(3, "0")}`,
      totalSpent: 0,
      lastContact: new Date().toISOString().slice(0, 10),
      ...values,
    };

    setSaveError(null);
    startTransition(async () => {
      addOptimisticCustomer(optimistic);
      const result = await createCustomerAction(values);
      if (result.error) setSaveError(result.error);
    });
  }

  const filtered = useMemo(() => {
    return optimisticCustomers.filter((c) => {
      const matchesQuery =
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.contactName.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [optimisticCustomers, query, statusFilter]);

  const totalCount = filtered.length;
  const activeCount = filtered.filter((c) => c.status === "active").length;
  const leadCount = filtered.filter((c) => c.status === "lead").length;
  const inactiveChurnedCount = filtered.filter(
    (c) => c.status === "inactive" || c.status === "churned"
  ).length;

  return (
    <div className="flex flex-col gap-5">
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="gap-0 py-5">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-medium">
              総顧客数
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 text-2xl font-bold">
            {totalCount} 社
          </CardContent>
        </Card>
        <Card className="gap-0 py-5">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-medium">
              契約中
            </CardTitle>
          </CardHeader>
          <CardContent className="text-brand-green pt-2 text-2xl font-bold">
            {activeCount} 社
          </CardContent>
        </Card>
        <Card className="gap-0 py-5">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-medium">
              リード
            </CardTitle>
          </CardHeader>
          <CardContent className="text-brand-blue pt-2 text-2xl font-bold">
            {leadCount} 社
          </CardContent>
        </Card>
        <Card className="gap-0 py-5">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-medium">
              解約・休眠
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground pt-2 text-2xl font-bold">
            {inactiveChurnedCount} 社
          </CardContent>
        </Card>
      </div>

      {saveError && (
        <div className="bg-destructive/10 text-destructive border-destructive/30 rounded-none border px-4 py-3 text-sm">
          ⚠️ {saveError}
        </div>
      )}

      {/* Table card */}
      <Card className="gap-0 py-0">
        <CardHeader className="flex flex-col gap-3 border-b py-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">顧客一覧</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
              <Input
                placeholder="会社名・担当者で検索..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-8 sm:w-60"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as CustomerStatus | "all")}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべてのステータス</SelectItem>
                {(Object.keys(customerStatusLabels) as CustomerStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    {customerStatusLabels[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <NewCustomerDialog onCreate={handleCreate} disabled={isPending} />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">ID</TableHead>
                <TableHead>会社名</TableHead>
                <TableHead>担当者</TableHead>
                <TableHead>連絡先</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead className="text-right">累計売上</TableHead>
                <TableHead className="pr-5">最終連絡</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="text-muted-foreground pl-5 font-mono text-xs">
                    {customer.id}
                  </TableCell>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {customer.contactName}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5 text-sm">
                      <span className="text-muted-foreground inline-flex items-center gap-1">
                        <Mail className="size-3 shrink-0" />
                        {customer.email}
                      </span>
                      <span className="text-muted-foreground inline-flex items-center gap-1">
                        <Phone className="size-3 shrink-0" />
                        {customer.phone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={customer.status} />
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {customer.totalSpent > 0 ? (
                      formatCurrency(customer.totalSpent)
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground pr-5">
                    {formatDate(customer.lastContact)}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-muted-foreground py-12 text-center"
                  >
                    条件に一致する顧客がいません。
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
