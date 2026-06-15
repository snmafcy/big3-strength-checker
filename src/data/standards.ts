import raw from './strength_standards.json';
import type { Anchor, Exercise, Gender, StandardsTable } from '../domain/types';

interface RawAnchor {
  bodyweight: number;
  plus?: boolean;
  untrained: number;
  novice: number;
  intermediate: number;
  advanced: number;
  elite: number;
  world_record: number;
}
interface RawTable { gender: string; exercise: string; anchors: RawAnchor[] }
interface RawData { unit: string; age_band: string; source: string; tables: RawTable[] }

const data = raw as RawData;

function toAnchor(r: RawAnchor): Anchor {
  return {
    bodyweight: r.bodyweight,
    plus: r.plus,
    untrained: r.untrained,
    novice: r.novice,
    intermediate: r.intermediate,
    advanced: r.advanced,
    elite: r.elite,
    worldRecord: r.world_record,
  };
}

export const tables: StandardsTable[] = data.tables.map((t) => ({
  gender: t.gender as Gender,
  exercise: t.exercise as Exercise,
  anchors: t.anchors.map(toAnchor),
}));

export const source = data.source;
export const ageBand = data.age_band;

export function getTable(gender: Gender, exercise: Exercise): StandardsTable {
  const table = tables.find((t) => t.gender === gender && t.exercise === exercise);
  if (!table) throw new Error(`No table for ${gender} ${exercise}`);
  return table;
}
