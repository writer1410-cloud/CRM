import { useCallback, useState } from 'react';

import { generateSmallTalk } from '@/lib/generation';
import type { SmallTalkInput, SmallTalkResult } from '@/types';

import { useSubscription } from './useSubscription';
import { useUsageLimit } from './useUsageLimit';

export type GenerateOutcome =
  | { ok: true; result: SmallTalkResult }
  | { ok: false; reason: 'limit_reached' | 'error'; message: string };

/**
 * 雑談生成のユースケースを集約するフック。
 * 課金状態 (useSubscription) と利用回数 (useUsageLimit) を束ね、
 * 「無料は月10回まで・プレミアムは無制限」のゲートを一箇所で適用する。
 */
export function useSmallTalkGenerator() {
  const { isPremium } = useSubscription();
  const { remaining, limit, increment, isReady } = useUsageLimit();

  const [result, setResult] = useState<SmallTalkResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const canGenerate = isPremium || remaining > 0;

  const generate = useCallback(
    async (input: SmallTalkInput): Promise<GenerateOutcome> => {
      if (!isPremium && remaining <= 0) {
        return {
          ok: false,
          reason: 'limit_reached',
          message: `無料プランは月${limit}回までです。プレミアムで無制限に生成できます。`,
        };
      }
      setIsGenerating(true);
      try {
        const generated = await generateSmallTalk(input);
        setResult(generated);
        if (!isPremium) await increment();
        return { ok: true, result: generated };
      } catch (e) {
        return {
          ok: false,
          reason: 'error',
          message: e instanceof Error ? e.message : '生成に失敗しました。',
        };
      } finally {
        setIsGenerating(false);
      }
    },
    [isPremium, remaining, limit, increment],
  );

  return { result, isGenerating, generate, canGenerate, isPremium, remaining, isReady };
}
