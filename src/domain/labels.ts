import type { Exercise, Gender, Level, Tab } from './types';

export const EXERCISE_LABEL: Record<Exercise, string> = {
  bench: 'ベンチ',
  squat: 'スクワット',
  deadlift: 'デッド',
};

export const TAB_LABEL: Record<Tab, string> = {
  ...EXERCISE_LABEL,
  total: 'BIG3',
};

export const GENDER_LABEL: Record<Gender, string> = {
  male: '男性',
  female: '女性',
};

export const LEVEL_LABEL: Record<Level, string> = {
  untrained: '初心者',
  novice: '初級',
  intermediate: '中級',
  advanced: '上級',
  elite: 'エリート',
};

/** DESIGN.md の熱量ランプ。レベル列ラベル/ドットのみに使用（数字には使わない）。 */
export const LEVEL_COLOR_VAR: Record<Level, string> = {
  untrained: 'var(--color-level-untrained)',
  novice: 'var(--color-level-novice)',
  intermediate: 'var(--color-level-intermediate)',
  advanced: 'var(--color-level-advanced)',
  elite: 'var(--color-level-elite)',
};
