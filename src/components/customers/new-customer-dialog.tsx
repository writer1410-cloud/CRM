"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { customerStatusLabels, type CustomerStatus } from "@/lib/mock-data";
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

export interface NewCustomerValues {
  name: string;
  contactName: string;
  email: string;
  phone: string;
  status: CustomerStatus;
}

interface NewCustomerDialogProps {
  onCreate: (values: NewCustomerValues) => void;
  disabled?: boolean;
}

export function NewCustomerDialog({ onCreate, disabled = false }: NewCustomerDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<CustomerStatus>("lead");
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setName("");
    setContactName("");
    setEmail("");
    setPhone("");
    setStatus("lead");
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("会社名を入力してください。");
      return;
    }
    if (!contactName.trim()) {
      setError("担当者名を入力してください。");
      return;
    }
    onCreate({ name: name.trim(), contactName: contactName.trim(), email: email.trim(), phone: phone.trim(), status });
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
        <Button className="gap-2" disabled={disabled}>
          <Plus className="size-4" />
          新規顧客を登録
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>新規顧客の登録</DialogTitle>
            <DialogDescription>
              顧客の情報を入力してください。登録後、一覧の先頭に追加されます。
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">会社名</Label>
              <Input
                id="name"
                placeholder="例: 株式会社サンプル"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contactName">担当者名</Label>
              <Input
                id="contactName"
                placeholder="例: 山田 太郎"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="例: info@example.jp"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">電話番号</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="例: 03-0000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">ステータス</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as CustomerStatus)}
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(customerStatusLabels) as CustomerStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {customerStatusLabels[s]}
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
