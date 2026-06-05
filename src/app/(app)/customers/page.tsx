import { Users } from "lucide-react";

import { ComingSoon } from "@/components/layout/coming-soon";

export default function CustomersPage() {
  return (
    <ComingSoon
      icon={Users}
      title="顧客管理"
      description="顧客一覧、連絡先、ステータス（リード・契約中など）の管理画面をここに実装します。"
    />
  );
}
