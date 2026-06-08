import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '@/constants/theme';

/**
 * タブ3: お気に入り・履歴。
 * 過去に生成して「ウケた」雑談ネタをストックする。
 * 後続ステップで Supabase の `saved_talks` テーブルから一覧取得する。
 */
export default function FavoritesScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>お気に入り・履歴</Text>
        <Text style={styles.subtitle}>ウケたネタをストックして再利用できます</Text>
      </View>

      <View style={styles.empty}>
        <Ionicons name="heart-outline" size={48} color={colors.textMuted} />
        <Text style={styles.emptyText}>まだ保存されたネタはありません</Text>
        <Text style={styles.emptyHint}>「雑談生成」タブで生成し、❤️ で保存しましょう</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, gap: spacing.xs },
  title: { ...typography.title },
  subtitle: { ...typography.caption },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.xl },
  emptyText: { ...typography.subheading, color: colors.textMuted },
  emptyHint: { ...typography.caption, textAlign: 'center' },
});
