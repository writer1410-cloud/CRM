"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import {
  customers,
  saleStatusLabels,
  type SaleStatus,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface NewSaleValues {
  date: string;
  customerName: string;
  amount: number;
  status: SaleStatus;
}

interface NewSaleDialogProps {
  onCreate: (values: NewSaleValues) => void;
}

const TODAY = "2026-06-06";

export function NewSaleDialog({ onCreate }: NewSaleDialogProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(TODAY);
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<SaleStatus>("pending");
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setDate(TODAY);
    setCustomerName("");
    setAmount("");
    setStatus("pending");
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!customerName) {
      setError("顧客名を選択してください。");
      return;
    }
    if (!numericAmount || numericAmount <= 0) {
      setError("金額には正の数値を入力してください。");
      return;
    }
    onCreate({ date, customerName, amount: numericAmount, status });
    reset();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          新規売上を登録
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>新規売上の登録</DialogTitle>
            <DialogDescription>
              売上の詳細を入力してください。登録後、一覧の先頭に追加されます。
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customer">顧客名</Label>
              <Select value={customerName} onValueChange={setCustomerName}>
                <SelectTrigger id="customer" className="w-full">
                  <SelectValue placeholder="顧客を選択" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.name}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">日付</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">金額（円）</Label>
                <Input
                  id="amount"
                  type="number"
                  min={0}
                  step={1000}
                  placeholder="例: 120000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">ステータス</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as SaleStatus)}
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(saleStatusLabels) as SaleStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {saleStatusLabels[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              キャンセル
            </Button>
            <Button type="submit">登録する</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
