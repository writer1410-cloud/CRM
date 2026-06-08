import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/constants/theme';
import type { SelectOption } from '@/types';

interface ChipGroupProps {
  label: string;
  options: SelectOption[];
  /** 選択中の value (単一選択) */
  value: string | null;
  onChange: (value: string) => void;
}

/**
 * モバイルで指でタップしやすいチップ型の単一選択コンポーネント。
 * 業界・年代・役職・テーマの選択フォームで再利用する。
 */
export function ChipGroup({ label, options, value, onChange }: ChipGroupProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onChange(option.value)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  label: { ...typography.subheading },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: { ...typography.body, color: colors.textMuted },
  chipTextSelected: { color: colors.textInverse, fontWeight: '600' },
});
