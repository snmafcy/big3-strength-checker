export type Gender = 'male' | 'female';
export type Exercise = 'bench' | 'squat' | 'deadlift';
export type Level = 'untrained' | 'novice' | 'intermediate' | 'advanced' | 'elite';

export const LEVELS: Level[] = ['untrained', 'novice', 'intermediate', 'advanced', 'elite'];
export const EXERCISES: Exercise[] = ['bench', 'squat', 'deadlift'];

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
  exercise: Exercise;
  anchors: Anchor[];
}
