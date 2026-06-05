import { AlertTriangle, Calendar, Check, Mail, Phone } from "lucide-react";

import { cn, formatDate } from "@/lib/utils";
import {
  supportCategoryLabels,
  supportHistory,
  type SupportCategory,
  type SupportState,
} from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const categoryStyles: Record<SupportCategory, string> = {
  service: "bg-brand-teal text-white",
  billing: "bg-brand-green text-white",
  defect: "bg-brand-red text-white",
  other: "bg-muted-foreground/70 text-white",
};

function StateIcon({ state }: { state: SupportState }) {
  if (state === "alert") {
    return <AlertTriangle className="text-brand-red size-4 shrink-0" />;
  }
  if (state === "resolved") {
    return <Check className="text-brand-green size-4 shrink-0" />;
  }
  return <span className="size-4 shrink-0" />;
}

export function SupportHistory() {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b px-5 py-3.5">
        <CardTitle className="text-sm">カスタマーサポート履歴</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y">
          {supportHistory.map((ticket) => (
            <li
              key={ticket.id}
              className={cn(
                "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
                ticket.state === "resolved" && "bg-muted/30"
              )}
            >
              <StateIcon state={ticket.state} />

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="truncate text-sm font-semibold">
                    {ticket.company}
                  </span>
                  <span className="text-muted-foreground shrink-0 text-xs">
                    {ticket.department}
                    {ticket.department && " "}
                    {ticket.contact}
                  </span>
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span
                    className={cn(
                      "rounded px-2 py-0.5 text-[11px] font-medium",
                      categoryStyles[ticket.category]
                    )}
                  >
                    {supportCategoryLabels[ticket.category]}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Calendar className="size-3.5" />
                    {formatDate(ticket.date)}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Phone className="size-3.5" />
                    {ticket.calls}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Mail className="size-3.5" />
                    {ticket.mails}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
