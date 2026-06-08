import type { SelectOption } from '@/types';

/** 雑談生成フォームのチップ選択肢。将来的に Supabase からの取得に差し替え可能。 */

export const INDUSTRIES: SelectOption[] = [
  { label: '製造業', value: 'manufacturing' },
  { label: '建設・不動産', value: 'construction' },
  { label: '医療・介護', value: 'healthcare' },
  { label: '小売・流通', value: 'retail' },
  { label: 'IT・通信', value: 'it' },
  { label: '金融・保険', value: 'finance' },
  { label: '飲食・サービス', value: 'food' },
  { label: '運輸・物流', value: 'logistics' },
];

export const AGE_GROUPS: SelectOption[] = [
  { label: '20代', value: '20s' },
  { label: '30代', value: '30s' },
  { label: '40代', value: '40s' },
  { label: '50代', value: '50s' },
  { label: '60代以上', value: '60s+' },
];

export const ROLES: SelectOption[] = [
  { label: '担当者', value: 'staff' },
  { label: '係長・主任', value: 'lead' },
  { label: '課長', value: 'manager' },
  { label: '部長', value: 'director' },
  { label: '役員・社長', value: 'executive' },
];

export const THEMES: SelectOption[] = [
  { label: '経済・景気', value: 'economy' },
  { label: 'スポーツ', value: 'sports' },
  { label: '天気・季節', value: 'weather' },
  { label: 'テクノロジー', value: 'technology' },
  { label: '地域・ローカル', value: 'local' },
  { label: 'グルメ', value: 'gourmet' },
  { label: '健康', value: 'health' },
  { label: 'エンタメ', value: 'entertainment' },
];

/** value から表示ラベルを引く小さなヘルパー */
export function labelOf(options: SelectOption[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}
