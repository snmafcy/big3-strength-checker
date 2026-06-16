import { useState } from 'react';
import type { Exercise } from './domain/types';
import { useSettings } from './state/useSettings';
import { getTable } from './data/standards';
import { buildDisplayRows, filterDisplayRows, findClosestRowIndex } from './domain/displayRows';
import { interpolateLevels } from './domain/interpolation';
import { Header } from './components/Header';
import { SummaryBand } from './components/SummaryBand';
import { StandardsTable } from './components/StandardsTable';
import { ExerciseBottomBar } from './components/ExerciseBottomBar';
import { SettingsSheet } from './components/SettingsSheet';

export function App() {
  const [settings, setSettings] = useSettings();
  const [exercise, setExercise] = useState<Exercise>('bench');
  const [sheetOpen, setSheetOpen] = useState(false);

  const table = getTable(settings.gender, exercise);
  const rows = filterDisplayRows(buildDisplayRows(table), settings.showHeavyRows);
  const hasBodyweight = settings.bodyweight != null;
  const summary = hasBodyweight ? interpolateLevels(table, settings.bodyweight!) : null;
  const highlightIndex = hasBodyweight ? findClosestRowIndex(rows, settings.bodyweight!) : -1;

  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">
      <Header exercise={exercise} gender={settings.gender} />
      <main className="mx-auto w-full max-w-md flex-1 overflow-y-auto px-4 pb-24">
        {summary ? (
          <SummaryBand bodyweight={settings.bodyweight!} levels={summary} />
        ) : (
          <p className="my-6 border-y border-hairline py-6 text-center text-sm text-muted">
            <span className="mr-1" aria-hidden>⚙</span>
            設定から性別・体重を入力すると、あなたの目安が表示されます
          </p>
        )}
        <StandardsTable rows={rows} highlightIndex={highlightIndex} showWorldRecord={settings.showWorldRecord} />
        <p className="mt-6 mb-2 text-center text-[11px] text-muted">
          基準データ出典: ExRx Strength Standards（18-39歳）。補間値は目安です。
        </p>
      </main>
      <ExerciseBottomBar exercise={exercise} onSelect={setExercise} onOpenSettings={() => setSheetOpen(true)} />
      {sheetOpen && (
        <SettingsSheet
          initial={settings}
          onSave={(s) => {
            setSettings(s);
            setSheetOpen(false);
          }}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </div>
  );
}
