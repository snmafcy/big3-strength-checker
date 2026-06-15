import { useState } from 'react';
import type { Gender } from '../domain/types';
import type { Settings } from '../state/useSettings';
import { GENDER_LABEL } from '../domain/labels';
import { validateBodyweight } from '../domain/validation';

export function SettingsSheet({
  initial,
  onSave,
  onClose,
}: {
  initial: Settings;
  onSave: (s: Settings) => void;
  onClose: () => void;
}) {
  const [gender, setGender] = useState<Gender>(initial.gender);
  const [weightText, setWeightText] = useState(initial.bodyweight != null ? String(initial.bodyweight) : '');
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (weightText.trim() === '') {
      setError('体重を入力してください');
      return;
    }
    const value = Number(weightText);
    const err = validateBodyweight(value);
    if (err) {
      setError(err);
      return;
    }
    onSave({ gender, bodyweight: value });
  };

  return (
    <div
      className="fixed inset-0 z-30 flex items-end bg-[oklch(0.15_0_0/0.5)] motion-safe:animate-[fade_200ms_ease-out]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="設定"
        onClick={(e) => e.stopPropagation()}
        className="z-40 w-full rounded-t-2xl bg-bg p-5 shadow-[0_-8px_32px_oklch(0.15_0_0/0.18)] motion-safe:animate-[sheet_240ms_var(--ease-out-expo)]"
      >
        <h2 className="mb-4 font-sans text-base font-bold text-ink">設定</h2>

        <div className="mb-5">
          <p className="mb-2 text-sm text-muted">性別</p>
          <div className="flex gap-2">
            {(['male', 'female'] as Gender[]).map((g) => {
              const selected = g === gender;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  aria-pressed={selected}
                  className={`min-h-12 flex-1 rounded-sm border font-sans text-sm font-bold focus-visible:outline-2 focus-visible:outline-primary focus-visible:[outline-offset:2px] ${
                    selected ? 'border-ink bg-ink text-bg' : 'border-hairline bg-surface text-ink'
                  }`}
                >
                  {GENDER_LABEL[g]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-2">
          <label htmlFor="bw" className="mb-1 block text-sm text-muted">
            体重 (kg)
          </label>
          <input
            id="bw"
            type="number"
            inputMode="decimal"
            value={weightText}
            onChange={(e) => {
              setWeightText(e.target.value);
              setError(null);
            }}
            className="tabular w-full border-0 border-b border-hairline bg-bg py-2 text-3xl font-bold text-ink focus:border-b-2 focus:border-primary focus:outline-none"
          />
        </div>
        {error && (
          <p role="alert" className="mb-2 text-sm text-warn-ink">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleSave}
          className="mt-4 min-h-12 w-full rounded-sm bg-primary py-4 font-sans font-bold text-bg transition-colors hover:bg-primary-deep focus-visible:outline-2 focus-visible:outline-primary focus-visible:[outline-offset:2px]"
        >
          保存
        </button>
      </div>
    </div>
  );
}
