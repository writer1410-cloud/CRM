import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, radius, shadow, spacing, typography } from '@/constants/theme';
import type { SmallTalkResult } from '@/types';

interface SmallTalkResultCardProps {
  result: SmallTalkResult;
  /** TTS 読み上げが許可されているか (プレミアム限定機能) */
  canUseTts: boolean;
  /** お気に入り保存が押されたとき */
  onSave?: (result: SmallTalkResult) => void;
  isSaved?: boolean;
}

const STEPS = [
  { key: 'fact', no: '1', title: '事実', color: colors.stepFact },
  { key: 'empathy', no: '2', title: '共感', color: colors.stepEmpathy },
  { key: 'question', no: '3', title: '質問', color: colors.stepQuestion },
] as const;

/**
 * 生成された雑談ネタを「3ステップの公式」で表示するカード。
 * 車内での耳学用に expo-speech による読み上げボタンを備える（プレミアム限定）。
 */
export function SmallTalkResultCard({ result, canUseTts, onSave, isSaved }: SmallTalkResultCardProps) {
  const [speaking, setSpeaking] = useState(false);

  // 画面離脱時に読み上げを止める
  useEffect(() => () => void Speech.stop(), []);

  const handleSpeak = async () => {
    if (speaking) {
      await Speech.stop();
      setSpeaking(false);
      return;
    }
    const text = `ステップ1、事実。${result.fact}。ステップ2、共感。${result.empathy}。ステップ3、質問。${result.question}`;
    setSpeaking(true);
    Speech.speak(text, {
      language: 'ja-JP',
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>雑談の切り出し方</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={canUseTts ? handleSpeak : undefined}
            disabled={!canUseTts}
            accessibilityRole="button"
            accessibilityLabel={speaking ? '読み上げを停止' : '読み上げを開始'}
            style={[styles.iconButton, !canUseTts && styles.iconButtonDisabled]}
          >
            <Ionicons
              name={speaking ? 'stop' : 'volume-high'}
              size={20}
              color={canUseTts ? colors.primary : colors.textMuted}
            />
          </TouchableOpacity>
          {onSave && (
            <TouchableOpacity
              onPress={() => onSave(result)}
              accessibilityRole="button"
              accessibilityLabel="お気に入りに保存"
              style={styles.iconButton}
            >
              <Ionicons
                name={isSaved ? 'heart' : 'heart-outline'}
                size={20}
                color={isSaved ? colors.danger : colors.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!canUseTts && (
        <Text style={styles.lockedHint}>🔒 音声読み上げはプレミアム限定機能です</Text>
      )}

      {STEPS.map((step) => (
        <View key={step.key} style={styles.step}>
          <View style={[styles.badge, { backgroundColor: step.color }]}>
            <Text style={styles.badgeNo}>{step.no}</Text>
          </View>
          <View style={styles.stepBody}>
            <Text style={[styles.stepTitle, { color: step.color }]}>{step.title}</Text>
            <Text style={styles.stepText}>{result[step.key]}</Text>
          </View>
        </View>
      ))}

      {result.source?.url && (
        <TouchableOpacity onPress={() => Linking.openURL(result.source!.url)} style={styles.source}>
          <Ionicons name="link" size={14} color={colors.textMuted} />
          <Text style={styles.sourceText} numberOfLines={1}>
            出典: {result.source.title}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.lg,
    ...shadow.card,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { ...typography.heading },
  actions: { flexDirection: 'row', gap: spacing.sm },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonDisabled: { opacity: 0.5 },
  lockedHint: { ...typography.caption, color: colors.warning },
  step: { flexDirection: 'row', gap: spacing.md },
  badge: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeNo: { color: colors.textInverse, fontWeight: '700', fontSize: 14 },
  stepBody: { flex: 1, gap: spacing.xs },
  stepTitle: { ...typography.subheading },
  stepText: { ...typography.body, lineHeight: 22 },
  source: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sourceText: { ...typography.caption, flex: 1 },
});
