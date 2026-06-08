import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChipGroup } from '@/components/generate/ChipGroup';
import { SmallTalkResultCard } from '@/components/generate/SmallTalkResultCard';
import { AGE_GROUPS, INDUSTRIES, ROLES, THEMES } from '@/constants/options';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { useSmallTalkGenerator } from '@/hooks/useSmallTalkGenerator';
import type { SmallTalkInput } from '@/types';

/**
 * タブ2: 雑談生成画面。
 * 業界・年代・役職・テーマをチップで選び、3ステップの公式で雑談ネタを生成する。
 */
export default function GenerateScreen() {
  const { result, isGenerating, generate, isPremium, remaining } = useSmallTalkGenerator();

  const [industry, setIndustry] = useState<string | null>(null);
  const [ageGroup, setAgeGroup] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [theme, setTheme] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isFormValid = Boolean(industry && ageGroup && role && theme);

  const handleGenerate = async () => {
    // 個別に null チェックして型を絞り込む（strict null 対応）
    if (!industry || !ageGroup || !role || !theme) return;
    setErrorMsg(null);
    const input: SmallTalkInput = {
      industry,
      ageGroup,
      role,
      theme,
      note: note.trim() || undefined,
    };
    const outcome = await generate(input);
    if (!outcome.ok) setErrorMsg(outcome.message);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <Text style={styles.title}>雑談を生成</Text>
            <View style={styles.quotaBadge}>
              <Ionicons
                name={isPremium ? 'infinite' : 'flash'}
                size={14}
                color={isPremium ? colors.primary : colors.warning}
              />
              <Text style={styles.quotaText}>
                {isPremium ? 'プレミアム' : `残り${remaining}回`}
              </Text>
            </View>
          </View>
          <Text style={styles.subtitle}>
            訪問前に、相手に合わせた自然な切り出し方を3ステップで用意します。
          </Text>

          <ChipGroup label="業界" options={INDUSTRIES} value={industry} onChange={setIndustry} />
          <ChipGroup label="年代" options={AGE_GROUPS} value={ageGroup} onChange={setAgeGroup} />
          <ChipGroup label="役職" options={ROLES} value={role} onChange={setRole} />
          <ChipGroup label="テーマ" options={THEMES} value={theme} onChange={setTheme} />

          <View style={styles.noteBlock}>
            <Text style={styles.noteLabel}>メモ（任意）</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="例: 先月新工場を稼働、ゴルフが趣味 など"
              placeholderTextColor={colors.textMuted}
              style={styles.noteInput}
              multiline
            />
          </View>

          {errorMsg && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleGenerate}
            disabled={!isFormValid || isGenerating}
            activeOpacity={0.85}
            style={[styles.generateButton, (!isFormValid || isGenerating) && styles.generateButtonDisabled]}
          >
            {isGenerating ? (
              <ActivityIndicator color={colors.textInverse} />
            ) : (
              <>
                <Ionicons name="sparkles" size={18} color={colors.textInverse} />
                <Text style={styles.generateButtonText}>雑談ネタを生成</Text>
              </>
            )}
          </TouchableOpacity>

          {result && (
            <View style={styles.resultBlock}>
              <SmallTalkResultCard result={result} canUseTts={isPremium} />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { ...typography.title },
  subtitle: { ...typography.caption, marginTop: -spacing.md },
  quotaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  quotaText: { ...typography.caption, fontWeight: '600', color: colors.text },
  noteBlock: { gap: spacing.sm },
  noteLabel: { ...typography.subheading },
  noteInput: {
    minHeight: 72,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    textAlignVertical: 'top',
    ...typography.body,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: '#FEF2F2',
  },
  errorText: { ...typography.caption, color: colors.danger, flex: 1 },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
  },
  generateButtonDisabled: { backgroundColor: colors.textMuted, opacity: 0.6 },
  generateButtonText: { ...typography.subheading, color: colors.textInverse, fontSize: 16 },
  resultBlock: { marginTop: spacing.sm },
});
