import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

import { config } from './config';

/**
 * Supabase クライアント (Auth + PostgreSQL)。
 * セッションは AsyncStorage に永続化し、モバイルでは自動 URL 検出を無効化する。
 */
export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
