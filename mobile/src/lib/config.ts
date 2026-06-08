import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * app.json の `extra` から環境設定を取得する単一の入口。
 * 本番では EAS の環境変数 / シークレットで上書きする想定。
 */
const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string>;

export const config = {
  supabaseUrl: extra.supabaseUrl ?? '',
  supabaseAnonKey: extra.supabaseAnonKey ?? '',
  /** プラットフォームごとに RevenueCat の公開 API キーを出し分け */
  revenueCatApiKey:
    Platform.OS === 'ios'
      ? extra.revenueCatApiKeyIos ?? ''
      : extra.revenueCatApiKeyAndroid ?? '',
};

/** RevenueCat 上で「プレミアム」を表すエンタイトルメント識別子 */
export const PREMIUM_ENTITLEMENT_ID = 'premium';

/** 無料プランの月間生成上限 */
export const FREE_MONTHLY_LIMIT = 10;
