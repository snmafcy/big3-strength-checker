import { describe, it, expect, beforeEach } from 'vitest';
import { loadSettings, saveSettings } from './useSettings';

beforeEach(() => localStorage.clear());

describe('settings persistence', () => {
  it('未保存時は男性・体重 null の既定値', () => {
    expect(loadSettings()).toEqual({ gender: 'male', bodyweight: null });
  });
  it('保存した値を復元する', () => {
    saveSettings({ gender: 'female', bodyweight: 60 });
    expect(loadSettings()).toEqual({ gender: 'female', bodyweight: 60 });
  });
  it('壊れた JSON は既定値にフォールバック', () => {
    localStorage.setItem('big3-settings', '{not json');
    expect(loadSettings()).toEqual({ gender: 'male', bodyweight: null });
  });
});
