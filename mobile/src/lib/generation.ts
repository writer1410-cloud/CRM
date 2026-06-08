import { labelOf, INDUSTRIES, AGE_GROUPS, ROLES, THEMES } from '@/constants/options';
import type { SmallTalkInput, SmallTalkResult } from '@/types';

import { config } from './config';
import { supabase } from './supabase';

/**
 * 雑談生成の API レイヤー。
 *
 * 設計方針: OpenAI/Anthropic の API キーや Web 検索 API キーは
 * 「絶対にクライアントへ置かない」。そのため実際の生成は Supabase Edge Function
 * (`generate-smalltalk`) 側で行い、アプリは入力条件を渡して結果を受け取るだけにする。
 *
 * Edge Function 側の責務:
 *   1. Web 検索 API で `industry` / `theme` に関する最新ニュースを取得
 *   2. その事実を踏まえ、年代・役職に応じてトーンを調整した 3 ステップ公式を生成
 *   3. 下記 SmallTalkResult 形状の JSON を返す
 */

/** Edge Function に渡すペイロード (ラベルを付与して LLM が解釈しやすくする) */
function toPayload(input: SmallTalkInput) {
  return {
    industry: labelOf(INDUSTRIES, input.industry),
    ageGroup: labelOf(AGE_GROUPS, input.ageGroup),
    role: labelOf(ROLES, input.role),
    theme: labelOf(THEMES, input.theme),
    note: input.note ?? '',
  };
}

/**
 * サーバー側プロンプトの参照用に、3 ステップ公式の指示文をクライアントにも明示しておく。
 * （Edge Function 未デプロイ時のモック生成でも同じトーン規則を使う）
 */
export const SYSTEM_PROMPT = `あなたはルート営業のトップセールスです。
顧客訪問の直前に使う「自然な雑談の切り出し方」を、必ず以下の3ステップの公式で出力します。

- ステップ1（事実）: 相手の業界・テーマに関する"最新ニュース"を一つ提示する
- ステップ2（共感）: 営業パーソンが共感を示すための一言
- ステップ3（質問）: 顧客に意見を求める自然な問いかけ

トーン&マナーは相手の【年代】と【役職】に合わせて自動調整すること。
役員・部長など役職が上、または年代が高いほど丁寧でフォーマルに、
若手・担当者にはフランクで親しみやすい言い回しにする。
出力は必ず JSON で {"fact","empathy","question","source"} のキーを持つこと。`;

export class GenerationError extends Error {}

/**
 * 雑談ネタを生成する。Edge Function を呼び出し、失敗時はローカルのモックにフォールバック。
 */
export async function generateSmallTalk(input: SmallTalkInput): Promise<SmallTalkResult> {
  if (config.supabaseUrl) {
    try {
      const { data, error } = await supabase.functions.invoke('generate-smalltalk', {
        body: toPayload(input),
      });
      if (error) throw error;
      if (data?.fact && data?.empathy && data?.question) {
        return normalize(input, data);
      }
    } catch {
      // ネットワーク不通 / 未デプロイ時はモックへフォールバック（開発体験のため）
    }
  }
  return mockGenerate(input);
}

/** Edge Function のレスポンスを SmallTalkResult に正規化 */
function normalize(input: SmallTalkInput, raw: Partial<SmallTalkResult>): SmallTalkResult {
  return {
    id: `talk_${Date.now()}`,
    fact: raw.fact ?? '',
    empathy: raw.empathy ?? '',
    question: raw.question ?? '',
    source: raw.source,
    input,
    createdAt: new Date().toISOString(),
  };
}

/** Edge Function 未接続時のサンプル生成（UI 確認・オフライン開発用） */
function mockGenerate(input: SmallTalkInput): SmallTalkResult {
  const industry = labelOf(INDUSTRIES, input.industry);
  const theme = labelOf(THEMES, input.theme);
  const formal = ['director', 'executive'].includes(input.role) || ['50s', '60s+'].includes(input.ageGroup);

  return normalize(input, {
    fact: `先日のニュースで、${industry}における${theme}の動きが話題になっていましたね。`,
    empathy: formal
      ? '私どもの業界でも注目しておりまして、御社への影響も気になっておりました。'
      : '私も気になってチェックしてたんですよ、けっこう影響ありそうですよね。',
    question: formal
      ? '差し支えなければ、御社では現場でどのような受け止め方をされていますか？'
      : 'ぶっちゃけ、現場の肌感だとどんな感じなんですか？',
    source: { title: '（モック）最新ニュースの出典がここに入ります', url: 'https://example.com' },
  });
}
