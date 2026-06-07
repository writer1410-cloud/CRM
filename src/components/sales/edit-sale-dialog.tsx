"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import {
  customers,
  saleStatusLabels,
  type Sale,
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

export interface EditSaleValues {
  date: string;
  customerName: string;
  amount: number;
  status: SaleStatus;
}

interface EditSaleDialogProps {
  sale: Sale;
  onSave: (values: EditSaleValues) => void;
  disabled?: boolean;
}

export function EditSaleDialog({ sale, onSave, disabled = false }: EditSaleDialogProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(sale.date);
  const [customerName, setCustomerName] = useState(sale.customerName);
  const [amount, setAmount] = useState(String(sale.amount));
  const [status, setStatus] = useState<SaleStatus>(sale.status);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setDate(sale.date);
    setCustomerName(sale.customerName);
    setAmount(String(sale.amount));
    setStatus(sale.status);
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerName) {
      setError("顧客名を選択してください。");
      return;
    }
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError("金額には正の数値を入力してください。");
      return;
    }
    onSave({ date, customerName, amount: numAmount, status });
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
        <Button variant="ghost" size="icon" className="size-7" disabled={disabled}>
          <Pencil className="size-3.5" />
          <span className="sr-only">編集</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>売上の編集</DialogTitle>
            <DialogDescription>
              売上 {sale.id} の情報を編集してください。
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-sale-customer">顧客名</Label>
              <Select value={customerName} onValueChange={setCustomerName}>
                <SelectTrigger id="edit-sale-customer" className="w-full">
                  <SelectValue placeholder="顧客を選択" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-sale-date">日付</Label>
                <Input
                  id="edit-sale-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-sale-amount">金額（円）</Label>
                <Input
                  id="edit-sale-amount"
                  type="number"
                  min={0}
                  step={1000}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-sale-status">ステータス</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as SaleStatus)}>
                <SelectTrigger id="edit-sale-status" className="w-full">
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button type="submit">保存する</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
