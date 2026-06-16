import { describe, it, expect, beforeEach } from 'vitest';
import { loadSettings, saveSettings } from './useSettings';

beforeEach(() => localStorage.clear());

describe('settings persistence', () => {
  it('未保存時は男性・体重 null・表示オプション無効の既定値', () => {
    expect(loadSettings()).toEqual({
      gender: 'male',
      bodyweight: null,
      showHeavyRows: false,
      showWorldRecord: false,
    });
  });
  it('保存した値を復元する（表示オプション含む）', () => {
    saveSettings({ gender: 'female', bodyweight: 60, showHeavyRows: true, showWorldRecord: true });
    expect(loadSettings()).toEqual({
      gender: 'female',
      bodyweight: 60,
      showHeavyRows: true,
      showWorldRecord: true,
    });
  });
  it('壊れた JSON は既定値にフォールバック', () => {
    localStorage.setItem('big3-settings', '{not json');
    expect(loadSettings()).toEqual({
      gender: 'male',
      bodyweight: null,
      showHeavyRows: false,
      showWorldRecord: false,
    });
  });
});
