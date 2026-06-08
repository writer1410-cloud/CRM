import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import { FREE_MONTHLY_LIMIT } from '@/lib/config';

const STORAGE_KEY = 'usage:smalltalk';

interface UsageRecord {
  /** 'YYYY-MM' 形式。月が変わったらリセットする */
  month: string;
  count: number;
}

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

/**
 * 無料ユーザーの月間生成回数 (10回/月) をローカルに管理するフック。
 * 本来はサーバー側 (Supabase) でも検証すべきだが、UI 上の即時フィードバック用に端末側でも保持する。
 */
export function useUsageLimit() {
  const [count, setCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const load = useCallback(async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const record: UsageRecord = raw ? JSON.parse(raw) : { month: currentMonth(), count: 0 };
    if (record.month !== currentMonth()) {
      setCount(0);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ month: currentMonth(), count: 0 }));
    } else {
      setCount(record.count);
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /** 1回分を消費して永続化する */
  const increment = useCallback(async () => {
    const next = count + 1;
    setCount(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ month: currentMonth(), count: next }));
  }, [count]);

  const remaining = Math.max(0, FREE_MONTHLY_LIMIT - count);

  return { count, remaining, limit: FREE_MONTHLY_LIMIT, isReady, increment };
}
