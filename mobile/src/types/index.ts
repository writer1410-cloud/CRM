/**
 * アプリ全体で共有するドメイン型。
 * 画面・フック・API レイヤーはここで定義した型のみをやり取りする。
 */

/** 雑談生成の入力条件 */
export interface SmallTalkInput {
  /** 顧客の業界 (例: 製造業, 建設, 医療) */
  industry: string;
  /** 顧客担当者の年代 (例: 20代, 50代) */
  ageGroup: string;
  /** 顧客担当者の役職 (トーン調整に使用) */
  role: string;
  /** 雑談のテーマ (例: 経済, スポーツ, 天気) */
  theme: string;
  /** 任意の補足メモ (特定の顧客情報など) */
  note?: string;
}

/**
 * 3ステップの公式に固定された雑談生成結果。
 * step1: 事実 / step2: 共感 / step3: 質問
 */
export interface SmallTalkResult {
  id: string;
  /** ステップ1（事実）: 最新ニュースの提示 */
  fact: string;
  /** ステップ2（共感）: 営業パーソンが共感を示す一言 */
  empathy: string;
  /** ステップ3（質問）: 顧客に意見を求める自然な問いかけ */
  question: string;
  /** 参照した最新ニュースの出典 (Web検索由来) */
  source?: {
    title: string;
    url: string;
  };
  /** 生成時の入力条件 (履歴・お気に入り表示用に保持) */
  input: SmallTalkInput;
  /** ISO8601 形式の生成日時 */
  createdAt: string;
}

/** お気に入り・履歴に保存される雑談ネタ */
export interface SavedSmallTalk extends SmallTalkResult {
  isFavorite: boolean;
}

/** ホーム/顧客一覧で表示する顧客 */
export interface Customer {
  id: string;
  name: string;
  company: string;
  industry: string;
  ageGroup: string;
  role: string;
  /** 次回訪問予定 (ISO8601) */
  nextVisitAt?: string;
  /** 直近の雑談メモ */
  lastTalkSummary?: string;
}

/** チップ/セレクトボックス用の選択肢 */
export interface SelectOption {
  label: string;
  value: string;
}
