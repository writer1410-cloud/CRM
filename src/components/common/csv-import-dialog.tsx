"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Entity = "sales" | "customers" | "inventory";

const entityLabels: Record<Entity, string> = {
  sales: "売上",
  customers: "顧客",
  inventory: "在庫",
};

const csvHints: Record<Entity, { header: string; example: string }> = {
  sales: {
    header: "date,customerName,amount,status",
    example: "2026-06-01,株式会社サンプル,150000,paid",
  },
  customers: {
    header: "name,contactName,email,phone,status",
    example: "株式会社サンプル,田中太郎,tanaka@sample.co.jp,03-1234-5678,active",
  },
  inventory: {
    header: "name,sku,stock,threshold,price,category",
    example: "サンプル商品,SKU-001,100,10,5000,ソフトウェア",
  },
};

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split("\n").filter((l) => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] ?? "";
    });
    return row;
  });
}

interface CsvImportDialogProps {
  entity: Entity;
  onImport: (rows: unknown[]) => void;
  disabled?: boolean;
}

export function CsvImportDialog({ entity, onImport, disabled = false }: CsvImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);

  const hint = csvHints[entity];

  function reset() {
    setCsvText("");
    setParseError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!csvText.trim()) {
      setParseError("CSVデータを入力してください。");
      return;
    }
    const rows = parseCSV(csvText);
    if (rows.length === 0) {
      setParseError("有効なデータが見つかりませんでした。ヘッダー行と1行以上のデータが必要です。");
      return;
    }
    onImport(rows);
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
        <Button variant="outline" className="gap-2" disabled={disabled}>
          <Upload className="size-4" />
          CSVインポート
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{entityLabels[entity]}のCSVインポート</DialogTitle>
            <DialogDescription>
              以下の形式でCSVデータを貼り付けてください。
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="rounded-none border bg-muted/50 p-3 font-mono text-xs">
              <p className="text-muted-foreground mb-1 font-sans text-xs font-medium">
                期待するフォーマット:
              </p>
              <p>{hint.header}</p>
              <p className="text-muted-foreground">{hint.example}</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="csv-input">CSVデータ</Label>
              <Textarea
                id="csv-input"
                placeholder={`${hint.header}\n${hint.example}`}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                rows={8}
                className="font-mono text-xs"
              />
            </div>

            {parseError && (
              <p className="text-destructive text-sm">{parseError}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button type="submit">インポートする</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
