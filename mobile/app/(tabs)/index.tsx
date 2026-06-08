import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AGE_GROUPS, INDUSTRIES, ROLES, labelOf } from '@/constants/options';
import { colors, radius, shadow, spacing, typography } from '@/constants/theme';
import { MOCK_CUSTOMERS } from '@/lib/mock-data';
import type { Customer } from '@/types';

/**
 * タブ1: ホーム / 顧客一覧。
 * カード型 UI で訪問予定の顧客をスッキリ表示する。
 */
export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={MOCK_CUSTOMERS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>今日の訪問先</Text>
            <Text style={styles.subtitle}>顧客を選んで雑談ネタを準備しましょう</Text>
          </View>
        }
        renderItem={({ item }) => <CustomerCard customer={item} />}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      />
    </SafeAreaView>
  );
}

function CustomerCard({ customer }: { customer: Customer }) {
  const meta = [
    labelOf(INDUSTRIES, customer.industry),
    labelOf(AGE_GROUPS, customer.ageGroup),
    labelOf(ROLES, customer.role),
  ].join('・');

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{customer.name.charAt(0)}</Text>
        </View>
        <View style={styles.flex}>
          <Text style={styles.name}>{customer.name}</Text>
          <Text style={styles.company}>{customer.company}</Text>
        </View>
      </View>

      <Text style={styles.meta}>{meta}</Text>
      {customer.lastTalkSummary && (
        <Text style={styles.lastTalk} numberOfLines={1}>
          💬 {customer.lastTalkSummary}
        </Text>
      )}

      <Link href="/generate" asChild>
        <TouchableOpacity style={styles.cta} activeOpacity={0.85}>
          <Ionicons name="sparkles" size={16} color={colors.primary} />
          <Text style={styles.ctaText}>雑談ネタを生成</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: spacing.lg },
  header: { marginBottom: spacing.lg, gap: spacing.xs },
  title: { ...typography.title },
  subtitle: { ...typography.caption },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadow.card,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...typography.heading, color: colors.primaryDark },
  name: { ...typography.subheading, fontSize: 16 },
  company: { ...typography.caption },
  meta: { ...typography.caption, color: colors.text },
  lastTalk: { ...typography.caption },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },
  ctaText: { ...typography.subheading, color: colors.primaryDark },
});
