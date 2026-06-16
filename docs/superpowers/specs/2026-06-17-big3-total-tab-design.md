# BIG3 合計（total）タブ 設計

## 目的

ベンチ・スクワット・デッドの3タブに加え、4つ目の「BIG3 合計」タブを追加する。各体重でベンチ＋スクワット＋デッドの合計値を、既存のサマリーバンド＋表のレイアウトで表示する。

## 決定事項

- タブのラベルは「BIG3」、新規ピクトグラムアイコンを追加する。
- 合計タブでは世界記録列を表示しない（各体重の世界記録を単純合算した値は現実のパワーリフティング総合記録と乖離し、誤解を招くため）。
- デフォルトの選択タブは従来どおり `bench`。

## データ層 — `src/data/standards.ts`

- `getTotalTable(gender: Gender): StandardsTable` を新設。
  - 3種目（bench / squat / deadlift）のテーブルを取得し、アンカーを体重で突き合わせる。
  - 各アンカーの `untrained`〜`elite` と `worldRecord` を行ごとに合算した合成 `StandardsTable` を返す。
  - `plus` フラグは3種目で一致しているはずなので合算行にも引き継ぐ。
  - 3種目のアンカー本数・体重・plus が一致しない場合は `throw`（データ不整合を早期に検出）。
- `getTableForTab(gender: Gender, tab: Tab): StandardsTable` を新設。
  - `tab === 'total'` のとき `getTotalTable(gender)`、それ以外は `getTable(gender, tab)`。

## 型・ラベル — `src/domain/types.ts`, `src/domain/labels.ts`

- `export type Tab = Exercise | 'total'`
- `export const TABS: Tab[] = [...EXERCISES, 'total']`
- `export const TAB_LABEL: Record<Tab, string> = { ...EXERCISE_LABEL, total: 'BIG3' }`
- `StandardsTable.exercise` の型を `Tab` に拡張する。
  - 当該フィールドはデータ読み込み時に設定されるのみで、下流の分岐に使われていない（`getTable` の検索キーのみ）。合成テーブルでは `'total'` を入れる。

## アイコン — `src/components/icons.tsx`

- 合計用の新ピクトグラム（プレートを重ねた／バーベルのモチーフ）を既存の硬派な線画スタイル（`svgBase`, `plate`）で追加する。
- `TabIcon({ tab, className })` ラッパーを追加。`tab === 'total'` のとき新アイコン、それ以外は既存 `ExerciseIcon` を描画する。

## 配線

- `src/App.tsx`
  - state を `useState<Tab>('bench')` に変更。
  - テーブル取得を `getTableForTab(settings.gender, tab)` に変更。
  - 表へ渡す `showWorldRecord` を `settings.showWorldRecord && tab !== 'total'` に変更。
- `src/components/ExerciseBottomBar.tsx`
  - `TABS` を map し、`TabIcon` ＋ `TAB_LABEL` を使う。props 型を `Tab` に更新。
- `src/components/Header.tsx`
  - props 型を `Tab` に更新し、`TAB_LABEL` を使う。

## 既存の挙動の踏襲

- サマリーバンドと `interpolateLevels` は合成テーブルに対してそのまま動作する（範囲外バッジも自動で機能）。
- `buildDisplayRows` / `filterDisplayRows`（重量級行のしきい値）も合成テーブルでそのまま機能する。

## テスト

- `getTotalTable`：3種目の合算が正しいこと、アンカー不整合時に `throw` すること。
- 表示・補間の既存テストは、合計も「ただのテーブル」なので描画ロジックはカバー済み。
