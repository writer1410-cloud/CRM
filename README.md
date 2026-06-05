# Nexus CRM — オールインワン業務管理 SaaS（ポートフォリオ）

売上・顧客・在庫・タスクを一元管理する、汎用業務管理システムのデモアプリです。
Next.js (App Router) + Vercel デプロイを前提に構築しています。

## 技術スタック

| 分類 | 採用技術 |
| --- | --- |
| Frontend / Backend | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Charts | Recharts |
| Icons | Lucide React |
| Database / ORM | Prisma + PostgreSQL（後続ステップで導入予定） |
| Auth | NextAuth.js（後続ステップで導入予定） |

## 開発状況（ステップ・バイ・ステップ）

UI/UX をモックデータで完成させてから、段階的にデータベース接続へ進めます。

- [x] **Step 1: 基盤構築** — プロジェクト構成、shadcn/ui の導入、共通レイアウト（サイドバー + ヘッダー）
- [x] **Step 2: ダッシュボード (`/dashboard`)** — サマリーカード、売上推移チャート、タスク進捗チャート
- [ ] **Step 3: 売上管理 (`/sales`)** — データテーブル + 新規登録モーダル
- [ ] **Step 4: 顧客管理 (`/customers`)** — 顧客一覧・ステータス管理
- [ ] **Step 5: 在庫管理 (`/inventory`)** — 在庫一覧・しきい値ハイライト
- [ ] **Step 6: タスク管理 (`/tasks`)** — カンバンボード
- [ ] **Step 7: DB 接続** — Prisma + PostgreSQL（Vercel Postgres / Supabase 想定）
- [ ] **Step 8: 認証** — NextAuth.js

現在はすべての画面が `src/lib/mock-data.ts` のモックデータを参照しています。

## ディレクトリ構成

```
src/
├── app/
│   ├── (app)/              # 共通レイアウト（サイドバー + ヘッダー）配下の画面
│   │   ├── layout.tsx
│   │   ├── dashboard/      # ダッシュボード
│   │   ├── sales/          # 売上管理
│   │   ├── customers/      # 顧客管理
│   │   ├── inventory/      # 在庫管理
│   │   └── tasks/          # タスク管理
│   ├── layout.tsx          # ルートレイアウト（フォント・メタデータ）
│   ├── page.tsx            # / → /dashboard へリダイレクト
│   └── globals.css         # Tailwind v4 + shadcn テーマ（CSS 変数）
├── components/
│   ├── ui/                 # shadcn/ui コンポーネント
│   ├── layout/             # サイドバー・ヘッダー等のレイアウト部品
│   └── dashboard/          # ダッシュボード専用コンポーネント
└── lib/
    ├── utils.ts            # cn() / 通貨・日付フォーマッタ
    ├── nav.ts              # ナビゲーション定義
    └── mock-data.ts        # モックデータ（将来 Prisma モデルに対応）
```

## セットアップ

```bash
npm install
npm run dev      # http://localhost:3000
```

その他のスクリプト:

```bash
npm run build      # 本番ビルド
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

> **Note:** shadcn/ui コンポーネントはこの環境のネットワーク制約によりレジストリ
> （`ui.shadcn.com`）から取得できなかったため、`components.json` を構成のうえ、
> コンポーネントソースを `src/components/ui/` に直接配置しています。
