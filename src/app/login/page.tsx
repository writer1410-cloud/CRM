import Link from "next/link";
import { Hexagon } from "lucide-react";

import { appName, appTagline } from "@/lib/nav";
import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {/* Brand */}
        <div className="flex items-center justify-center gap-3">
          <div className="bg-sidebar flex size-11 items-center justify-center border-2 border-white/80 text-white">
            <Hexagon className="size-6" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-foreground text-xl font-bold tracking-wide">
              {appName}
            </span>
            <span className="text-muted-foreground text-[10px] tracking-[0.2em]">
              {appTagline}
            </span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ログイン</CardTitle>
            <CardDescription>
              アカウント情報を入力してダッシュボードにアクセスします。
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <LoginForm />
            <div className="bg-muted text-muted-foreground border p-3 text-xs">
              <p className="font-medium">デモ用アカウント</p>
              <p>メール: admin@nexus-crm.jp</p>
              <p>パスワード: demo1234</p>
            </div>
            <p className="text-muted-foreground text-center text-xs">
              ログインせずに{" "}
              <Link
                href="/dashboard"
                className="text-primary font-medium hover:underline"
              >
                ダッシュボードを見る
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
