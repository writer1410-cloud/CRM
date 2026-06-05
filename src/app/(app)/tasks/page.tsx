import { ListTodo } from "lucide-react";

import { ComingSoon } from "@/components/layout/coming-soon";

export default function TasksPage() {
  return (
    <ComingSoon
      icon={ListTodo}
      title="タスク管理"
      description="看板（カンバン）ボード、またはステータス付きタスク一覧（未着手・進行中・完了）をここに実装します。"
    />
  );
}
