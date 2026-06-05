import { TrendingUp } from "lucide-react";

import { ComingSoon } from "@/components/layout/coming-soon";

export default function SalesPage() {
  return (
    <ComingSoon
      icon={TrendingUp}
      title="売上管理"
      description="売上履歴のデータテーブルと、新規売上の登録フォーム（モーダル）をここに実装します。"
    />
  );
}
