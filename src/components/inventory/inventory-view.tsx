"use client";

import { useOptimistic, useMemo, useState, useTransition } from "react";
import { AlertTriangle, Search } from "lucide-react";

import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import { type Product } from "@/lib/mock-data";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditProductDialog, type EditProductValues } from "./edit-product-dialog";
import { CsvImportDialog } from "@/components/common/csv-import-dialog";
import { updateProductAction, importProductsFromCSVAction } from "@/app/actions/inventory";

type StockLevel = "out" | "low" | "ok";

function stockLevel(product: Product): StockLevel {
  if (product.stock === 0) return "out";
  if (product.stock <= product.threshold) return "low";
  return "ok";
}

const stockLevelLabels: Record<StockLevel, string> = {
  out: "在庫切れ",
  low: "在庫少",
  ok: "在庫あり",
};

function StockBadge({ level }: { level: StockLevel }) {
  const variant =
    level === "out" ? "destructive" : level === "low" ? "warning" : "success";
  return <Badge variant={variant}>{stockLevelLabels[level]}</Badge>;
}

type OptimisticAction =
  | { type: "update"; id: string; values: EditProductValues }
  | { type: "import"; products: Product[] };

function productsReducer(state: Product[], action: OptimisticAction): Product[] {
  switch (action.type) {
    case "update":
      return state.map((p) =>
        p.id === action.id ? { ...p, ...action.values } : p
      );
    case "import":
      return [...action.products, ...state];
  }
}

interface InventoryViewProps {
  initialProducts: Product[];
}

export function InventoryView({ initialProducts }: InventoryViewProps) {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  const [optimisticProducts, dispatch] = useOptimistic(initialProducts, productsReducer);

  const categories = useMemo(
    () => Array.from(new Set(optimisticProducts.map((p) => p.category))),
    [optimisticProducts]
  );

  const filtered = useMemo(() => {
    return optimisticProducts.filter((p) => {
      const q = query.toLowerCase();
      const matchesQuery =
        p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      const matchesCategory =
        categoryFilter === "all" || p.category === categoryFilter;
      return matchesQuery && matchesCategory;
    });
  }, [optimisticProducts, query, categoryFilter]);

  const totalCount = filtered.length;
  const lowStockCount = filtered.filter((p) => stockLevel(p) !== "ok").length;
  const inventoryValue = filtered.reduce(
    (sum, p) => sum + p.stock * p.price,
    0
  );

  function handleEdit(product: Product, values: EditProductValues) {
    setSaveError(null);
    setImportSuccess(null);
    startTransition(async () => {
      dispatch({ type: "update", id: product.id, values });
      const result = await updateProductAction(product.id, values);
      if (result.error) setSaveError(result.error);
    });
  }

  function handleImport(rows: unknown[]) {
    const typedRows = rows as Array<{
      name: string;
      sku: string;
      stock: string;
      threshold: string;
      price: string;
      category: string;
    }>;

    const optimisticNewProducts: Product[] = typedRows.map((row, i) => ({
      id: `PRD-TMP-${Date.now()}-${i}`,
      name: row.name || "不明",
      sku: row.sku || `SKU-TMP-${i}`,
      stock: Number(row.stock) || 0,
      threshold: Number(row.threshold) || 0,
      price: Number(row.price) || 0,
      category: row.category || "その他",
    }));

    setSaveError(null);
    setImportSuccess(null);
    startTransition(async () => {
      dispatch({ type: "import", products: optimisticNewProducts });
      const result = await importProductsFromCSVAction(typedRows);
      if (result.error) setSaveError(result.error);
      else setImportSuccess(`${result.imported}件の商品をインポートしました。`);
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="gap-0 py-5">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-medium">
              総商品数
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 text-2xl font-bold">
            {totalCount} 品目
          </CardContent>
        </Card>
        <Card className="gap-0 py-5">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-medium">
              在庫不足（要発注）
            </CardTitle>
          </CardHeader>
          <CardContent className="text-brand-red flex items-center gap-2 pt-2 text-2xl font-bold">
            {lowStockCount > 0 && <AlertTriangle className="size-5" />}
            {lowStockCount} 品目
          </CardContent>
        </Card>
        <Card className="gap-0 py-5">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-medium">
              在庫総額
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 text-2xl font-bold">
            {formatCurrency(inventoryValue)}
          </CardContent>
        </Card>
      </div>

      {saveError && (
        <div className="bg-destructive/10 text-destructive border-destructive/30 rounded-none border px-4 py-3 text-sm">
          ⚠️ {saveError}
        </div>
      )}
      {importSuccess && (
        <div className="bg-brand-green/10 text-brand-green border-brand-green/30 rounded-none border px-4 py-3 text-sm">
          ✓ {importSuccess}
        </div>
      )}

      {/* Table card */}
      <Card className="gap-0 py-0">
        <CardHeader className="flex flex-col gap-3 border-b py-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">在庫一覧</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
              <Input
                placeholder="商品名・SKUで検索..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-8 sm:w-60"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべてのカテゴリ</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <CsvImportDialog entity="inventory" onImport={handleImport} disabled={isPending} />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">SKU</TableHead>
                <TableHead>商品名</TableHead>
                <TableHead>カテゴリ</TableHead>
                <TableHead className="text-right">在庫数</TableHead>
                <TableHead className="text-right">しきい値</TableHead>
                <TableHead className="text-right">単価</TableHead>
                <TableHead>在庫状況</TableHead>
                <TableHead className="pr-5 w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => {
                const level = stockLevel(product);
                const isLow = level !== "ok";
                return (
                  <TableRow
                    key={product.id}
                    className={cn(isLow && "bg-brand-red/5")}
                  >
                    <TableCell className="text-muted-foreground pl-5 font-mono text-xs">
                      {product.sku}
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {product.category}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-semibold tabular-nums",
                        isLow && "text-brand-red"
                      )}
                    >
                      {formatNumber(product.stock)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-right tabular-nums">
                      {formatNumber(product.threshold)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(product.price)}
                    </TableCell>
                    <TableCell>
                      <StockBadge level={level} />
                    </TableCell>
                    <TableCell className="pr-5">
                      <EditProductDialog
                        product={product}
                        onSave={(values) => handleEdit(product, values)}
                        disabled={isPending}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-muted-foreground py-12 text-center"
                  >
                    条件に一致する商品がありません。
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
