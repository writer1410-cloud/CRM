import { Package } from "lucide-react";

import { ComingSoon } from "@/components/layout/coming-soon";

export default function InventoryPage() {
  return (
    <ComingSoon
      icon={Package}
      title="在庫管理"
      description="商品名・SKU・在庫数・価格の一覧と、在庫少（しきい値以下）のハイライト表示をここに実装します。"
    />
  );
}
