import { Construction, type LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface ComingSoonProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export function ComingSoon({
  title,
  description,
  icon: Icon = Construction,
}: ComingSoonProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="bg-muted text-muted-foreground flex size-14 items-center justify-center rounded-2xl">
          <Icon className="size-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-muted-foreground max-w-md text-sm">{description}</p>
        </div>
        <p className="text-muted-foreground/70 text-xs">
          この画面は次のステップで実装予定です。
        </p>
      </CardContent>
    </Card>
  );
}
