/**
 * デザイントークン。StyleSheet ベースで配色・余白・角丸・タイポを一元管理する。
 * NativeWind に移行する場合もこの値を tailwind.config の theme に流用できる。
 */

export const colors = {
  primary: '#0EA5E9',
  primaryDark: '#0284C7',
  primarySoft: '#E0F2FE',

  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F5F9',

  border: '#E2E8F0',

  text: '#0F172A',
  textMuted: '#64748B',
  textInverse: '#FFFFFF',

  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',

  // 3ステップ公式のアクセント
  stepFact: '#0EA5E9',
  stepEmpathy: '#16A34A',
  stepQuestion: '#9333EA',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  title: { fontSize: 24, fontWeight: '700' as const, color: colors.text },
  heading: { fontSize: 18, fontWeight: '700' as const, color: colors.text },
  subheading: { fontSize: 15, fontWeight: '600' as const, color: colors.text },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.text },
  caption: { fontSize: 13, fontWeight: '400' as const, color: colors.textMuted },
} as const;

export const shadow = {
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;
