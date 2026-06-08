import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { type CustomerInfo } from 'react-native-purchases';

import { config, PREMIUM_ENTITLEMENT_ID } from '@/lib/config';

interface SubscriptionState {
  /** 有効なプレミアム entitlement を持っているか */
  isPremium: boolean;
  /** 初回ロード中フラグ */
  isLoading: boolean;
  /** RevenueCat の生の顧客情報 (購入画面などで利用) */
  customerInfo: CustomerInfo | null;
  /** 最新状態を再取得 (購入完了後などに呼ぶ) */
  refresh: () => Promise<void>;
  /** 取得失敗時のエラー */
  error: Error | null;
}

let configured = false;

/** RevenueCat SDK の初期化（多重初期化を防ぐ） */
function ensureConfigured() {
  if (configured || !config.revenueCatApiKey) return;
  Purchases.configure({ apiKey: config.revenueCatApiKey });
  configured = true;
}

/**
 * RevenueCat を用いてユーザーの課金状態を判定するフック。
 *
 * `Purchases.getCustomerInfo()` の `entitlements.active` に
 * プレミアム entitlement が含まれるかでサブスク有効性を判定する。
 * 生成回数の無制限化・TTS 解放などの機能ゲートはこの `isPremium` を参照する。
 */
export function useSubscription(): SubscriptionState {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const resolve = useCallback((info: CustomerInfo) => {
    setCustomerInfo(info);
    setIsPremium(typeof info.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== 'undefined');
  }, []);

  const refresh = useCallback(async () => {
    if (!config.revenueCatApiKey || Platform.OS === 'web') {
      // 開発環境 (Expo Go / Web) では課金 SDK が動作しないため無料ユーザー扱い
      setIsPremium(false);
      setIsLoading(false);
      return;
    }
    try {
      ensureConfigured();
      const info = await Purchases.getCustomerInfo();
      resolve(info);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('課金状態の取得に失敗しました'));
    } finally {
      setIsLoading(false);
    }
  }, [resolve]);

  useEffect(() => {
    refresh();
    // 購入・復元時の変更をリアルタイムに反映
    if (config.revenueCatApiKey && Platform.OS !== 'web') {
      ensureConfigured();
      Purchases.addCustomerInfoUpdateListener(resolve);
      return () => Purchases.removeCustomerInfoUpdateListener(resolve);
    }
  }, [refresh, resolve]);

  return { isPremium, isLoading, customerInfo, refresh, error };
}
