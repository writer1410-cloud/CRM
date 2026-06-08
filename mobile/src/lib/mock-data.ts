import type { Customer } from '@/types';

/**
 * UI 確認用の顧客モックデータ。
 * 後続ステップで Supabase の `customers` テーブルからの取得に差し替える。
 */
export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: '田中 健一',
    company: '株式会社マルセイ製作所',
    industry: 'manufacturing',
    ageGroup: '50s',
    role: 'director',
    nextVisitAt: '2026-06-10T10:00:00+09:00',
    lastTalkSummary: '新工場の稼働状況について盛り上がった',
  },
  {
    id: 'c2',
    name: '佐藤 美咲',
    company: 'グリーンケア訪問看護',
    industry: 'healthcare',
    ageGroup: '30s',
    role: 'manager',
    nextVisitAt: '2026-06-11T14:30:00+09:00',
    lastTalkSummary: '地域の介護人材不足が話題',
  },
  {
    id: 'c3',
    name: '鈴木 大輔',
    company: 'スズキ流通サービス',
    industry: 'logistics',
    ageGroup: '40s',
    role: 'lead',
    lastTalkSummary: '物流2024年問題への対応',
  },
];
