import { describe, it, expect } from 'vitest';
import { validateBodyweight, MIN_BODYWEIGHT, MAX_BODYWEIGHT } from './validation';

describe('validateBodyweight', () => {
  it('妥当な値は null', () => {
    expect(validateBodyweight(70)).toBeNull();
    expect(validateBodyweight(MIN_BODYWEIGHT)).toBeNull();
    expect(validateBodyweight(MAX_BODYWEIGHT)).toBeNull();
  });
  it('NaN はエラー', () => {
    expect(validateBodyweight(NaN)).toBe('数値を入力してください');
  });
  it('下限未満はエラー文に下限を含む', () => {
    expect(validateBodyweight(20)).toContain('30');
  });
  it('上限超過はエラー文に上限を含む', () => {
    expect(validateBodyweight(300)).toContain('250');
  });
});
