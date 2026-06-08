# 雑談ネタ生成アプリ（Mobile / Expo）

ルート営業パーソン向けの「雑談ネタ・切り出し方生成」クロスプラットフォーム（iOS/Android）アプリです。
既存の Next.js Web CRM とは独立した Expo プロジェクトとして `mobile/` 配下に構築しています。

## 技術スタック

| 分類 | 採用技術 |
| --- | --- |
| フレームワーク | React Native (Expo SDK 52), TypeScript |
| ナビゲーション | Expo Router（ファイルベースルーティング） |
| スタイリング | StyleSheet + デザイントークン（`src/constants/theme.ts`） |
| Backend / DB | Supabase（Auth + PostgreSQL + Edge Functions） |
| 課金 | RevenueCat（react-native-purchases） |
| 音声読み上げ | expo-speech（TTS） |
| AI / 検索 | OpenAI/Anthropic + Web 検索 API（Supabase Edge Function 側で実行） |

## ディレクトリ構成

```
mobile/
├── app/                         # 画面ルーティングのみ（ロジックは持たない）
│   ├── _layout.tsx              # ルートレイアウト（SafeArea / Stack）
│   └── (tabs)/                  # ボトムタブ群
│       ├── _layout.tsx          # 3タブ定義（ホーム / 雑談生成 / お気に入り）
│       ├── index.tsx            # タブ1: ホーム・顧客一覧（カード型UI）
│       ├── generate.tsx         # タブ2: 雑談生成（チップ選択フォーム）★中核
│       └── favorites.tsx        # タブ3: お気に入り・履歴
└── src/                         # アプリロジック（@/ エイリアスで参照）
    ├── components/
    │   └── generate/
    │       ├── ChipGroup.tsx            # チップ型の単一選択UI
    │       └── SmallTalkResultCard.tsx  # 3ステップ表示 + TTS + お気に入り
    ├── hooks/
    │   ├── useSubscription.ts           # RevenueCat 課金判定（要件指定）
    │   ├── useUsageLimit.ts             # 無料プラン 月10回 制限
    │   └── useSmallTalkGenerator.ts     # 生成ユースケース集約（課金ゲート適用）
    ├── lib/
    │   ├── config.ts                    # app.json extra からの設定読込
    │   ├── supabase.ts                  # Supabase クライアント
    │   ├── generation.ts                # 生成API（Edge Function 呼び出し）
    │   └── mock-data.ts                 # UI確認用モックデータ
    ├── constants/
    │   ├── theme.ts                     # デザイントークン
    │   └── options.ts                   # 業界/年代/役職/テーマの選択肢
    └── types/
        └── index.ts                     # ドメイン型
```

### 設計方針

- **`app/` は薄く保つ**: 画面ファイルはルーティングと組み立てのみ。状態・API・課金ロジックは `src/hooks` と `src/lib` に集約し、テスト容易性と再利用性を確保。
- **API キーをクライアントに置かない**: OpenAI/Anthropic と Web 検索 API キーは Supabase Edge Function（`generate-smalltalk`）側でのみ使用。アプリは入力条件を渡して結果（3ステップ JSON）を受け取るだけ。
- **3ステップ公式の固定**: 出力は常に `fact`（事実）/ `empathy`（共感）/ `question`（質問）の3キー。年代・役職に応じてトーンを自動調整。
- **課金ゲートの一元化**: `useSubscription`（RevenueCat）+ `useUsageLimit` を `useSmallTalkGenerator` が束ね、「無料は月10回・プレミアムは無制限 + TTS 解放」を一箇所で適用。

## セットアップ

```bash
cd mobile
npm install
npx expo start          # QR を Expo Go で読み取り、または i / a でシミュレータ起動
```

> 注意: RevenueCat（`react-native-purchases`）はネイティブモジュールのため Expo Go では動作しません。
> 課金機能の実機確認には development build（`npx expo run:ios` / `run:android`、または EAS Build）が必要です。
> Edge Function 未デプロイ時は `src/lib/generation.ts` のモック生成にフォールバックします。

## 設定値

`app.json` の `expo.extra` に以下を設定します（本番では EAS シークレット推奨）:

- `supabaseUrl`, `supabaseAnonKey`
- `revenueCatApiKeyIos`, `revenueCatApiKeyAndroid`

## 次のステップ（未実装）

- [ ] Supabase Auth によるログイン画面
- [ ] Edge Function `generate-smalltalk`（Web 検索 + LLM）の実装・デプロイ
- [ ] お気に入り・履歴の Supabase 永続化
- [ ] ペイウォール画面（`Purchases.getOfferings()` + 購入フロー）
```
