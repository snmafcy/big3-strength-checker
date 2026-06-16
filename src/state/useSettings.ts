import { useEffect, useState } from 'react';
import type { Gender } from '../domain/types';

export interface Settings {
  gender: Gender;
  bodyweight: number | null;
  /** 125kg以降の重量級アンカー行を表示するか（既定: 非表示）。 */
  showHeavyRows: boolean;
  /** 世界記録（参考）列を表示するか（既定: 非表示）。 */
  showWorldRecord: boolean;
}

const KEY = 'big3-settings';
const DEFAULT: Settings = {
  gender: 'male',
  bodyweight: null,
  showHeavyRows: false,
  showWorldRecord: false,
};

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    const parsed = JSON.parse(raw);
    return {
      gender: parsed.gender === 'female' ? 'female' : 'male',
      bodyweight: typeof parsed.bodyweight === 'number' ? parsed.bodyweight : null,
      showHeavyRows: parsed.showHeavyRows === true,
      showWorldRecord: parsed.showWorldRecord === true,
    };
  } catch {
    return { ...DEFAULT };
  }
}

export function saveSettings(s: Settings): void {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);
  return [settings, setSettings] as const;
}
