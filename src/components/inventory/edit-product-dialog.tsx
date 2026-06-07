"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { type Product } from "@/lib/mock-data";
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

export interface EditProductValues {
  name: string;
  stock: number;
  threshold: number;
  price: number;
  category: string;
}

interface EditProductDialogProps {
  product: Product;
  onSave: (values: EditProductValues) => void;
  disabled?: boolean;
}

export function EditProductDialog({ product, onSave, disabled = false }: EditProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(product.name);
  const [stock, setStock] = useState(String(product.stock));
  const [threshold, setThreshold] = useState(String(product.threshold));
  const [price, setPrice] = useState(String(product.price));
  const [category, setCategory] = useState(product.category);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setName(product.name);
    setStock(String(product.stock));
    setThreshold(String(product.threshold));
    setPrice(String(product.price));
    setCategory(product.category);
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("商品名を入力してください。");
      return;
    }
    const numStock = Number(stock);
    const numThreshold = Number(threshold);
    const numPrice = Number(price);
    if (isNaN(numStock) || numStock < 0) {
      setError("在庫数には0以上の整数を入力してください。");
      return;
    }
    if (isNaN(numThreshold) || numThreshold < 0) {
      setError("しきい値には0以上の整数を入力してください。");
      return;
    }
    if (isNaN(numPrice) || numPrice < 0) {
      setError("単価には0以上の数値を入力してください。");
      return;
    }
    onSave({ name: name.trim(), stock: numStock, threshold: numThreshold, price: numPrice, category: category.trim() });
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
            <DialogTitle>商品の編集</DialogTitle>
            <DialogDescription>
              商品情報を編集してください。SKUは変更できません。
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="product-name">商品名</Label>
              <Input
                id="product-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="product-category">カテゴリ</Label>
              <Input
                id="product-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="product-stock">在庫数</Label>
                <Input
                  id="product-stock"
                  type="number"
                  min={0}
                  step={1}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="product-threshold">しきい値</Label>
                <Input
                  id="product-threshold"
                  type="number"
                  min={0}
                  step={1}
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="product-price">単価（円）</Label>
                <Input
                  id="product-price"
                  type="number"
                  min={0}
                  step={100}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
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
