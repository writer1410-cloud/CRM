import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';

/**
 * ルートレイアウト。
 * 全画面共通の Provider (SafeArea) とナビゲーションスタックを定義する。
 * タブ群は `(tabs)` グループにまとめ、将来的に認証画面やモーダルを
 * このスタック直下に追加できるようにしている。
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="(tabs)" />
        {/* 例: <Stack.Screen name="paywall" options={{ presentation: 'modal' }} /> */}
      </Stack>
    </SafeAreaProvider>
  );
}
