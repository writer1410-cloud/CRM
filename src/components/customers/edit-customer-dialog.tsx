"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import {
  customerStatusLabels,
  type Customer,
  type CustomerStatus,
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

export interface EditCustomerValues {
  name: string;
  contactName: string;
  email: string;
  phone: string;
  status: CustomerStatus;
}

interface EditCustomerDialogProps {
  customer: Customer;
  onSave: (values: EditCustomerValues) => void;
  disabled?: boolean;
}

export function EditCustomerDialog({ customer, onSave, disabled = false }: EditCustomerDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(customer.name);
  const [contactName, setContactName] = useState(customer.contactName);
  const [email, setEmail] = useState(customer.email);
  const [phone, setPhone] = useState(customer.phone);
  const [status, setStatus] = useState<CustomerStatus>(customer.status);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setName(customer.name);
    setContactName(customer.contactName);
    setEmail(customer.email);
    setPhone(customer.phone);
    setStatus(customer.status);
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
    onSave({ name: name.trim(), contactName: contactName.trim(), email: email.trim(), phone: phone.trim(), status });
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
            <DialogTitle>顧客の編集</DialogTitle>
            <DialogDescription>
              {customer.id} の情報を編集してください。
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-customer-name">会社名</Label>
              <Input
                id="edit-customer-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-customer-contact">担当者名</Label>
              <Input
                id="edit-customer-contact"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-customer-email">メールアドレス</Label>
                <Input
                  id="edit-customer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-customer-phone">電話番号</Label>
                <Input
                  id="edit-customer-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-customer-status">ステータス</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as CustomerStatus)}>
                <SelectTrigger id="edit-customer-status" className="w-full">
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
