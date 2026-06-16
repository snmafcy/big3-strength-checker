export type Gender = 'male' | 'female';
export type Exercise = 'bench' | 'squat' | 'deadlift';
/** ボトムバーのタブ。種目3つに合計（BIG3 total）を加えたもの。 */
export type Tab = Exercise | 'total';
export type Level = 'untrained' | 'novice' | 'intermediate' | 'advanced' | 'elite';

export const LEVELS: Level[] = ['untrained', 'novice', 'intermediate', 'advanced', 'elite'];
export const EXERCISES: Exercise[] = ['bench', 'squat', 'deadlift'];
export const TABS: Tab[] = [...EXERCISES, 'total'];

export interface Anchor {
  bodyweight: number;
  plus?: boolean;
  untrained: number;
  novice: number;
  intermediate: number;
  advanced: number;
  elite: number;
  worldRecord: number;
}

export interface StandardsTable {
  gender: Gender;
  exercise: Tab;
  anchors: Anchor[];
}
