# BIG3 レベルチェッカー（Web/React）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 性別と体重(kg)から BIG3（ベンチ/スクワット/デッド）の5段階筋力目安を表示する、オフライン動作・モバイル優先の React PWA を実装する。

**Architecture:** 純粋ロジック（補間・表示行生成・フォーマット・バリデーション）を `src/domain/` に UI 非依存で置き TDD で先に固める。ExRx 実データは JSON で内蔵し型付きローダ経由で読む。状態は `App.tsx` の `useState` ＋ localStorage（`useSettings`）のみ。UI は [DESIGN.md](../../../DESIGN.md) の視覚システム（North Star "The Record Board"：純白・インク黒の数字・規律ある赤一色、カードでなく帯＋罫線、Spline Sans Mono のタブュラー数字）に厳密準拠。

**Tech Stack:** Vite + React 19 + TypeScript / Tailwind CSS v4（`@theme`）/ Vitest + React Testing Library / vite-plugin-pwa / Vercel。フォント: Zen Kaku Gothic New（JP+ラテン）・Spline Sans Mono（数値）。

**設計ドキュメント:** 戦略 = [PRODUCT.md](../../../PRODUCT.md)、視覚 = [DESIGN.md](../../../DESIGN.md)（トークンは sidecar [.impeccable/design.json](../../../.impeccable/design.json) にも）。仕様 = [specs/2026-06-15-big3-strength-checker-web-design.md](../specs/2026-06-15-big3-strength-checker-web-design.md)。

**検証値の根拠（実データで確認済み）:** 男性ベンチ・体重70kg の補間 → 初心者51.9 / 初級66.9 / 中級80.3 / 上級110.3 / エリート137.2。アンカー 67kg と 75kg の間を線形補間（例: 中級 = 77.5 + (85−77.5)×(70−67)/(75−67) = 80.3125）。

---

## Task 1: プロジェクト・スキャフォルド & デザイントークン

ディレクトリには既に `docs/`・`PRODUCT.md`・`DESIGN.md`・`.impeccable/`・`README.md`・`.gitignore`・`.git` が存在する（空ではない）。`create-vite` は使わず、設定ファイルを手で作成する。

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/vite-env.d.ts`, `src/test/setup.ts`, `public/icon.svg`

- [ ] **Step 1: package.json を初期化**

Run: `npm init -y`

- [ ] **Step 2: package.json を編集**（`name`/`type`/`scripts` を設定）

`package.json` を以下に置き換える（`version` 等は npm 生成のものを保持してよいが、最低限このフィールドを含める）:

```json
{
  "name": "big3-strength-checker",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc -b"
  }
}
```

- [ ] **Step 3: 依存をインストール**

Run:
```bash
npm install react react-dom
npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom \
  tailwindcss @tailwindcss/vite vite-plugin-pwa \
  vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```
Expected: 依存が `package.json` に追加され、`node_modules/` が生成される。

- [ ] **Step 4: vite.config.ts を作成**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'BIG3 レベルチェッカー',
        short_name: 'BIG3',
        description: '体重からBIG3の筋力目安が一目で分かる',
        lang: 'ja',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
```

- [ ] **Step 5: tsconfig.json を作成**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vitest/globals", "@testing-library/jest-dom", "vite-plugin-pwa/client"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 6: tsconfig.node.json を作成**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "composite": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 7: index.html を作成**（フォント2種を読み込み）

```html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/icon.svg" />
    <link rel="apple-touch-icon" href="/icon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#ffffff" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Spline+Sans+Mono:wght@500;700&family=Zen+Kaku+Gothic+New:wght@400;700;900&display=swap" rel="stylesheet" />
    <title>BIG3 レベルチェッカー</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 8: src/index.css を作成**（DESIGN.md のトークンを Tailwind v4 `@theme` に焼き込む）

```css
@import "tailwindcss";

@theme {
  /* Colors — DESIGN.md (OKLCH, canonical) */
  --color-bg: oklch(1 0 0);
  --color-surface: oklch(0.965 0 0);
  --color-surface-sunken: oklch(0.93 0 0);
  --color-ink: oklch(0.18 0 0);
  --color-bar: oklch(0.15 0 0);
  --color-muted: oklch(0.44 0 0);
  --color-hairline: oklch(0.85 0 0);
  --color-primary: oklch(0.48 0.20 22);
  --color-primary-deep: oklch(0.40 0.18 22);
  --color-primary-tint: oklch(0.95 0.03 22);
  --color-warn: oklch(0.82 0.14 75);
  --color-warn-ink: oklch(0.30 0.06 70);
  --color-level-untrained: oklch(0.50 0 0);
  --color-level-novice: oklch(0.50 0.09 30);
  --color-level-intermediate: oklch(0.50 0.14 26);
  --color-level-advanced: oklch(0.49 0.18 24);
  --color-level-elite: oklch(0.47 0.21 22);

  /* Typography */
  --font-sans: "Zen Kaku Gothic New", system-ui, sans-serif;
  --font-mono: "Spline Sans Mono", ui-monospace, monospace;

  /* Radius (sharp-by-default) */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;

  /* Motion */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
}

:root {
  color-scheme: light;
}

html, body, #root {
  height: 100%;
}

body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

/* タブュラー数字（The Tabular Rule） */
.tabular {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 9: public/icon.svg を作成**（プレースホルダ。純白地・インク黒・赤一点の "BIG3" マーク）

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="BIG3">
  <rect width="512" height="512" fill="#ffffff"/>
  <rect x="48" y="232" width="416" height="48" fill="#111111"/>
  <text x="256" y="210" font-family="Arial, sans-serif" font-size="150" font-weight="900" text-anchor="middle" fill="#111111">BIG</text>
  <text x="256" y="420" font-family="Arial, sans-serif" font-size="190" font-weight="900" text-anchor="middle" fill="#c0202a">3</text>
</svg>
```

- [ ] **Step 10: src/vite-env.d.ts を作成**

```ts
/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
```

- [ ] **Step 11: src/test/setup.ts を作成**

```ts
import '@testing-library/jest-dom';
```

- [ ] **Step 12: src/main.tsx を作成**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 13: 仮の src/App.tsx を作成**（ビルド検証用。Task 9 で本実装に差し替える）

```tsx
export function App() {
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="font-sans text-2xl font-black tracking-tight">BIG3 レベルチェッカー</h1>
      <p className="mt-2 text-sm text-muted">セットアップ確認用プレースホルダ。</p>
    </main>
  );
}
```

- [ ] **Step 14: ビルドでツールチェーンを検証**

Run: `npm run build`
Expected: PASS。`tsc -b` が型エラーなく通り、`vite build` が `dist/` を生成（PWA の Service Worker と manifest を含む）。Tailwind v4 が `@theme` を解決しユーティリティを生成する。

- [ ] **Step 15: .gitignore に node_modules / dist を追記**（未記載なら）

`.gitignore` に以下が含まれることを確認し、なければ追記:
```
node_modules
dist
dist-ssr
*.local
```

- [ ] **Step 16: コミット**

```bash
git add -A
git commit -m "chore: scaffold Vite+React+TS+Tailwind v4+PWA with DESIGN.md tokens"
```

---

## Task 2: データ移植・型・ローダ

ExRx 実データ（6テーブル、男女でブラケット差、`plus` 行あり、`world_record` は snake_case）を内蔵し、camelCase の型付き構造に変換して読む。

**Files:**
- Create: `src/data/strength_standards.json`（参照 JSON のコピー）
- Create: `src/domain/types.ts`
- Create: `src/data/standards.ts`
- Test: `src/data/standards.test.ts`

- [ ] **Step 1: 実データをコピー**

Run: `cp docs/reference/strength_standards.real.json src/data/strength_standards.json`
Expected: `src/data/strength_standards.json` が作成される（6テーブル、`unit`/`age_band`/`source`/`tables`）。

- [ ] **Step 2: src/domain/types.ts を作成**

```ts
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
```

- [ ] **Step 3: 失敗するテストを書く**

`src/data/standards.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { tables, getTable, source, ageBand } from './standards';
import { LEVELS } from '../domain/types';

describe('standards loader', () => {
  it('6テーブル（男女×BIG3）を読み込む', () => {
    expect(tables).toHaveLength(6);
  });

  it('getTable で該当テーブルを取得し worldRecord に camelCase で変換される', () => {
    const t = getTable('male', 'bench');
    expect(t.gender).toBe('male');
    expect(t.exercise).toBe('bench');
    expect(t.anchors[0].worldRecord).toBe(199.0);
  });

  it('各テーブルのアンカー体重は昇順（plus 行は同値で末尾）', () => {
    for (const t of tables) {
      const closed = t.anchors.filter((a) => !a.plus);
      for (let i = 1; i < closed.length; i++) {
        expect(closed[i].bodyweight).toBeGreaterThan(closed[i - 1].bodyweight);
      }
      expect(t.anchors[t.anchors.length - 1].plus).toBe(true);
    }
  });

  it('全アンカーに5レベルの数値が存在する', () => {
    for (const t of tables) {
      for (const a of t.anchors) {
        for (const lv of LEVELS) expect(typeof a[lv]).toBe('number');
      }
    }
  });

  it('source と ageBand を公開する', () => {
    expect(source).toContain('ExRx');
    expect(ageBand).toBe('18-39');
  });
});
```

- [ ] **Step 4: テストが失敗することを確認**

Run: `npm test -- standards`
Expected: FAIL（`./standards` が存在しない）。

- [ ] **Step 5: src/data/standards.ts を実装**

```ts
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
```

- [ ] **Step 6: テストが通ることを確認**

Run: `npm test -- standards`
Expected: PASS（5テスト）。

- [ ] **Step 7: コミット**

```bash
git add src/data src/domain/types.ts
git commit -m "feat: embed ExRx data with typed loader and data tests"
```

---

## Task 3: domain/format.ts（kg フォーマット）

整数は小数点なし、端数は小数第1位（DESIGN.md のサマリー例 51.9 / 80.3、表の 52 / 67 と整合）。

**Files:**
- Create: `src/domain/format.ts`
- Test: `src/domain/format.test.ts`

- [ ] **Step 1: 失敗するテストを書く**

`src/domain/format.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { formatKg } from './format';

describe('formatKg', () => {
  it('整数は小数点なし', () => {
    expect(formatKg(52)).toBe('52');
    expect(formatKg(110)).toBe('110');
  });
  it('端数は小数第1位に丸める', () => {
    expect(formatKg(80.3125)).toBe('80.3');
    expect(formatKg(51.875)).toBe('51.9');
  });
  it('丸めて整数になる場合は小数点なし', () => {
    expect(formatKg(79.98)).toBe('80');
  });
});
```

- [ ] **Step 2: テストが失敗することを確認**

Run: `npm test -- format`
Expected: FAIL。

- [ ] **Step 3: src/domain/format.ts を実装**

```ts
export function formatKg(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}
```

- [ ] **Step 4: テストが通ることを確認**

Run: `npm test -- format`
Expected: PASS（3テスト）。

- [ ] **Step 5: コミット**

```bash
git add src/domain/format.ts src/domain/format.test.ts
git commit -m "feat: add kg formatter"
```

---

## Task 4: domain/interpolation.ts（線形補間・クランプ・plus 行）

任意体重に対し前後アンカーから各レベルを線形補間。最小未満は最小行でクランプ、上限超過は plus 行を使用し、いずれも `outOfRange: true`。

**Files:**
- Create: `src/domain/interpolation.ts`
- Test: `src/domain/interpolation.test.ts`

- [ ] **Step 1: 失敗するテストを書く**

`src/domain/interpolation.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { interpolateLevels } from './interpolation';
import { getTable } from '../data/standards';

const bench = getTable('male', 'bench');

describe('interpolateLevels', () => {
  it('男性ベンチ70kg を線形補間（DESIGN.md の例と一致）', () => {
    const r = interpolateLevels(bench, 70);
    expect(r.untrained).toBeCloseTo(51.875, 3);
    expect(r.novice).toBeCloseTo(66.875, 3);
    expect(r.intermediate).toBeCloseTo(80.3125, 4);
    expect(r.advanced).toBeCloseTo(110.3125, 4);
    expect(r.elite).toBeCloseTo(137.1875, 4);
    expect(r.outOfRange).toBe(false);
  });

  it('アンカー値ちょうど（52kg）は範囲内でその値', () => {
    const r = interpolateLevels(bench, 52);
    expect(r.untrained).toBe(37.5);
    expect(r.outOfRange).toBe(false);
  });

  it('最小未満（40kg）は最小行でクランプし範囲外', () => {
    const r = interpolateLevels(bench, 40);
    expect(r.untrained).toBe(37.5); // 52kg 行
    expect(r.outOfRange).toBe(true);
  });

  it('上限超過（200kg）は plus 行を使用し範囲外', () => {
    const r = interpolateLevels(bench, 200);
    expect(r.untrained).toBe(72.5); // 145+ 行
    expect(r.outOfRange).toBe(true);
  });
});
```

- [ ] **Step 2: テストが失敗することを確認**

Run: `npm test -- interpolation`
Expected: FAIL。

- [ ] **Step 3: src/domain/interpolation.ts を実装**

```ts
import type { Anchor, StandardsTable } from './types';
import { LEVELS } from './types';

export interface InterpolatedLevels {
  untrained: number;
  novice: number;
  intermediate: number;
  advanced: number;
  elite: number;
  outOfRange: boolean;
}

function pickLevels(a: Anchor): Omit<InterpolatedLevels, 'outOfRange'> {
  return {
    untrained: a.untrained,
    novice: a.novice,
    intermediate: a.intermediate,
    advanced: a.advanced,
    elite: a.elite,
  };
}

export function interpolateLevels(table: StandardsTable, bodyweight: number): InterpolatedLevels {
  const closed = table.anchors.filter((a) => !a.plus);
  const plusRow = table.anchors.find((a) => a.plus);
  const min = closed[0];
  const max = closed[closed.length - 1];

  if (bodyweight < min.bodyweight) {
    return { ...pickLevels(min), outOfRange: true };
  }
  if (bodyweight > max.bodyweight) {
    return { ...pickLevels(plusRow ?? max), outOfRange: true };
  }

  for (let i = 0; i < closed.length - 1; i++) {
    const lo = closed[i];
    const hi = closed[i + 1];
    if (bodyweight >= lo.bodyweight && bodyweight <= hi.bodyweight) {
      const t = (bodyweight - lo.bodyweight) / (hi.bodyweight - lo.bodyweight);
      const out = { outOfRange: false } as InterpolatedLevels;
      for (const lv of LEVELS) out[lv] = lo[lv] + (hi[lv] - lo[lv]) * t;
      return out;
    }
  }
  return { ...pickLevels(max), outOfRange: false };
}
```

- [ ] **Step 4: テストが通ることを確認**

Run: `npm test -- interpolation`
Expected: PASS（4テスト）。

- [ ] **Step 5: コミット**

```bash
git add src/domain/interpolation.ts src/domain/interpolation.test.ts
git commit -m "feat: add linear interpolation with clamp and plus-row handling"
```

---

## Task 5: domain/displayRows.ts（表示用の行生成・最近接行）

≤100kg は隣接アンカー間に中間体重の行を挿入。>100kg は元アンカーのみ。plus 行は末尾。設定体重に最も近い行のインデックスを返す関数も提供。

**Files:**
- Create: `src/domain/displayRows.ts`
- Test: `src/domain/displayRows.test.ts`

- [ ] **Step 1: 失敗するテストを書く**

`src/domain/displayRows.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { buildDisplayRows, findClosestRowIndex } from './displayRows';
import { getTable } from '../data/standards';

const bench = getTable('male', 'bench'); // closed: 52,56,60,67,75,82,90,100,110,125,145 + 145plus

describe('buildDisplayRows', () => {
  const rows = buildDisplayRows(bench);

  it('≤100kg は中間行を挿入し >100kg は元アンカーのみ、末尾に plus 行', () => {
    // closed 11 + 中間 7 (52-56,56-60,60-67,67-75,75-82,82-90,90-100) + plus 1 = 19
    expect(rows).toHaveLength(19);
    expect(rows[0].label).toBe('52');
    expect(rows[rows.length - 1].label).toBe('145+');
    expect(rows[rows.length - 1].plus).toBe(true);
  });

  it('67kg と 75kg の間に中間体重 71 の補間行が入る', () => {
    const mid = rows.find((r) => r.label === '71');
    expect(mid).toBeDefined();
    expect(mid!.interpolated).toBe(true);
  });

  it('100kg 超には中間行を挿入しない（105 は存在しない）', () => {
    expect(rows.some((r) => r.label === '105')).toBe(false);
  });

  it('中間行の値は両端の平均', () => {
    const mid = rows.find((r) => r.label === '71')!;
    // 67kg intermediate 77.5, 75kg intermediate 85 → 平均 81.25
    expect(mid.values.intermediate).toBeCloseTo(81.25, 2);
  });
});

describe('findClosestRowIndex', () => {
  const rows = buildDisplayRows(bench);
  it('体重70kg に最も近いのは 71 の行', () => {
    const idx = findClosestRowIndex(rows, 70);
    expect(rows[idx].label).toBe('71');
  });
});
```

- [ ] **Step 2: テストが失敗することを確認**

Run: `npm test -- displayRows`
Expected: FAIL。

- [ ] **Step 3: src/domain/displayRows.ts を実装**

```ts
import type { Anchor, Level, StandardsTable } from './types';
import { LEVELS } from './types';
import { formatKg } from './format';

export interface DisplayRow {
  bodyweight: number;
  label: string;
  plus: boolean;
  interpolated: boolean;
  values: Record<Level, number>;
}

function levelValues(a: Anchor): Record<Level, number> {
  const v = {} as Record<Level, number>;
  for (const lv of LEVELS) v[lv] = a[lv];
  return v;
}

function anchorRow(a: Anchor): DisplayRow {
  return {
    bodyweight: a.bodyweight,
    label: formatKg(a.bodyweight),
    plus: false,
    interpolated: false,
    values: levelValues(a),
  };
}

export function buildDisplayRows(table: StandardsTable): DisplayRow[] {
  const closed = table.anchors.filter((a) => !a.plus);
  const plusRow = table.anchors.find((a) => a.plus);
  const rows: DisplayRow[] = [];

  for (let i = 0; i < closed.length; i++) {
    const a = closed[i];
    rows.push(anchorRow(a));
    const next = closed[i + 1];
    if (next && a.bodyweight <= 100 && next.bodyweight <= 100) {
      const mid = (a.bodyweight + next.bodyweight) / 2;
      const values = {} as Record<Level, number>;
      for (const lv of LEVELS) values[lv] = (a[lv] + next[lv]) / 2;
      rows.push({ bodyweight: mid, label: formatKg(mid), plus: false, interpolated: true, values });
    }
  }

  if (plusRow) {
    rows.push({
      bodyweight: plusRow.bodyweight,
      label: `${formatKg(plusRow.bodyweight)}+`,
      plus: true,
      interpolated: false,
      values: levelValues(plusRow),
    });
  }
  return rows;
}

export function findClosestRowIndex(rows: DisplayRow[], bodyweight: number): number {
  let best = 0;
  let bestDist = Infinity;
  rows.forEach((r, i) => {
    const dist = Math.abs(r.bodyweight - bodyweight);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  });
  return best;
}
```

- [ ] **Step 4: テストが通ることを確認**

Run: `npm test -- displayRows`
Expected: PASS（5テスト）。

- [ ] **Step 5: コミット**

```bash
git add src/domain/displayRows.ts src/domain/displayRows.test.ts
git commit -m "feat: build display rows with midpoint insertion and closest-row lookup"
```

---

## Task 6: domain/validation.ts（体重バリデーション）

数値かつ 30〜250kg を妥当とする。インライン通知用のエラー文字列を返す。

**Files:**
- Create: `src/domain/validation.ts`
- Test: `src/domain/validation.test.ts`

- [ ] **Step 1: 失敗するテストを書く**

`src/domain/validation.test.ts`:
```ts
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
```

- [ ] **Step 2: テストが失敗することを確認**

Run: `npm test -- validation`
Expected: FAIL。

- [ ] **Step 3: src/domain/validation.ts を実装**

```ts
export const MIN_BODYWEIGHT = 30;
export const MAX_BODYWEIGHT = 250;

export function validateBodyweight(value: number): string | null {
  if (Number.isNaN(value)) return '数値を入力してください';
  if (value < MIN_BODYWEIGHT) return `${MIN_BODYWEIGHT}〜${MAX_BODYWEIGHT}kgで入力してください`;
  if (value > MAX_BODYWEIGHT) return `${MIN_BODYWEIGHT}〜${MAX_BODYWEIGHT}kgで入力してください`;
  return null;
}
```

- [ ] **Step 4: テストが通ることを確認**

Run: `npm test -- validation`
Expected: PASS（4テスト）。

- [ ] **Step 5: コミット**

```bash
git add src/domain/validation.ts src/domain/validation.test.ts
git commit -m "feat: add bodyweight validation"
```

---

## Task 7: domain/labels.ts ＆ state/useSettings.ts

UI 文言の一元化（DRY）と、性別・体重の localStorage 永続化。

**Files:**
- Create: `src/domain/labels.ts`
- Create: `src/state/useSettings.ts`
- Test: `src/state/useSettings.test.ts`

- [ ] **Step 1: src/domain/labels.ts を作成**

```ts
import type { Exercise, Gender, Level } from './types';

export const EXERCISE_LABEL: Record<Exercise, string> = {
  bench: 'ベンチ',
  squat: 'スクワット',
  deadlift: 'デッド',
};

export const GENDER_LABEL: Record<Gender, string> = {
  male: '男性',
  female: '女性',
};

export const LEVEL_LABEL: Record<Level, string> = {
  untrained: '初心者',
  novice: '初級',
  intermediate: '中級',
  advanced: '上級',
  elite: 'エリート',
};

/** DESIGN.md の熱量ランプ。レベル列ラベル/ドットのみに使用（数字には使わない）。 */
export const LEVEL_COLOR_VAR: Record<Level, string> = {
  untrained: 'var(--color-level-untrained)',
  novice: 'var(--color-level-novice)',
  intermediate: 'var(--color-level-intermediate)',
  advanced: 'var(--color-level-advanced)',
  elite: 'var(--color-level-elite)',
};
```

- [ ] **Step 2: 失敗するテストを書く**

`src/state/useSettings.test.ts`:
```ts
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
```

- [ ] **Step 3: テストが失敗することを確認**

Run: `npm test -- useSettings`
Expected: FAIL。

- [ ] **Step 4: src/state/useSettings.ts を実装**

```ts
import { useEffect, useState } from 'react';
import type { Gender } from '../domain/types';

export interface Settings {
  gender: Gender;
  bodyweight: number | null;
}

const KEY = 'big3-settings';
const DEFAULT: Settings = { gender: 'male', bodyweight: null };

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    const parsed = JSON.parse(raw);
    return {
      gender: parsed.gender === 'female' ? 'female' : 'male',
      bodyweight: typeof parsed.bodyweight === 'number' ? parsed.bodyweight : null,
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
```

- [ ] **Step 5: テストが通ることを確認**

Run: `npm test -- useSettings`
Expected: PASS（3テスト）。

- [ ] **Step 6: コミット**

```bash
git add src/domain/labels.ts src/state/useSettings.ts src/state/useSettings.test.ts
git commit -m "feat: add labels and localStorage-backed settings"
```

---

## Task 8: プレゼンテーション・コンポーネント（DESIGN.md 準拠）

DESIGN.md の各コンポーネント仕様に厳密準拠。**受け入れ条件（全コンポーネント共通）:** カードを使わず帯＋1px罫線 / 全数値は `.tabular`（Spline Sans Mono）でインク黒 / 赤は「いま効いている対象」のみ / フォーカス可視 / タップ ≥48–56px。

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/SummaryBand.tsx`
- Create: `src/components/StandardsTable.tsx`
- Create: `src/components/ExerciseBottomBar.tsx`
- Create: `src/components/SettingsSheet.tsx`

- [ ] **Step 1: Header.tsx を作成**（上部バー。ワードマーク＋現在の種目・性別）

```tsx
import type { Exercise, Gender } from '../domain/types';
import { EXERCISE_LABEL, GENDER_LABEL } from '../domain/labels';

export function Header({ exercise, gender }: { exercise: Exercise; gender: Gender }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-hairline bg-bg px-4 py-3">
      <h1 className="font-sans text-lg font-black tracking-tight text-ink">BIG3 レベルチェッカー</h1>
      <span className="text-sm text-muted">
        {EXERCISE_LABEL[exercise]}・{GENDER_LABEL[gender]}
      </span>
    </header>
  );
}
```

- [ ] **Step 2: SummaryBand.tsx を作成**（角丸カードでなく上下罫線の帯。熱量ランプ色ラベル＋インク黒の大きなモノ数値）

```tsx
import type { InterpolatedLevels } from '../domain/interpolation';
import { LEVELS } from '../domain/types';
import { LEVEL_LABEL, LEVEL_COLOR_VAR } from '../domain/labels';
import { formatKg } from '../domain/format';

export function SummaryBand({ bodyweight, levels }: { bodyweight: number; levels: InterpolatedLevels }) {
  return (
    <section className="my-4 border-y border-hairline py-4">
      <h2 className="mb-3 flex items-center gap-2 font-sans text-base font-bold text-ink">
        あなた(<span className="tabular">{formatKg(bodyweight)}</span>kg)の目安 (kg)
        {levels.outOfRange && (
          <span className="rounded-sm bg-warn px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-warn-ink">
            範囲外
          </span>
        )}
      </h2>
      <dl className="grid grid-cols-5 gap-2 text-center">
        {LEVELS.map((lv) => (
          <div key={lv}>
            <dt className="mb-1 text-[11px] font-bold tracking-wide" style={{ color: LEVEL_COLOR_VAR[lv] }}>
              {LEVEL_LABEL[lv]}
            </dt>
            <dd className="tabular text-2xl font-bold text-ink">{formatKg(levels[lv])}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

- [ ] **Step 3: StandardsTable.tsx を作成**（スティッキー熱量ランプ見出し、タブュラー数値、三重表現のハイライト行）

```tsx
import type { DisplayRow } from '../domain/displayRows';
import { LEVELS } from '../domain/types';
import { LEVEL_LABEL, LEVEL_COLOR_VAR } from '../domain/labels';
import { formatKg } from '../domain/format';

export function StandardsTable({ rows, highlightIndex }: { rows: DisplayRow[]; highlightIndex: number }) {
  return (
    <table className="w-full border-collapse text-right text-sm">
      <thead>
        <tr className="sticky top-[57px] bg-surface-sunken">
          <th className="px-1.5 py-2 text-left font-sans text-[11px] font-bold tracking-wide text-muted">体重</th>
          {LEVELS.map((lv) => (
            <th
              key={lv}
              className="px-1.5 py-2 font-sans text-[11px] font-bold tracking-wide"
              style={{ color: LEVEL_COLOR_VAR[lv] }}
            >
              {LEVEL_LABEL[lv]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => {
          const isHighlight = i === highlightIndex;
          return (
            <tr
              key={`${r.label}-${i}`}
              data-testid={isHighlight ? 'highlight-row' : undefined}
              aria-current={isHighlight ? 'true' : undefined}
              className={
                isHighlight
                  ? 'bg-primary-tint font-bold [box-shadow:inset_0_2px_0_var(--color-primary),inset_0_-2px_0_var(--color-primary)]'
                  : i % 2 === 1
                    ? 'bg-surface'
                    : ''
              }
            >
              <td className="tabular px-1.5 py-2 text-left text-ink">
                {isHighlight && <span className="mr-1 text-primary">▶</span>}
                {r.label}
                {r.plus ? '超' : ''}
              </td>
              {LEVELS.map((lv) => (
                <td key={lv} className="tabular px-1.5 py-2 text-ink">
                  {formatKg(r.values[lv])}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
```

- [ ] **Step 4: ExerciseBottomBar.tsx を作成**（near-black バー、アクティブ赤＋上辺インジケータ、⚙設定）

```tsx
import type { Exercise } from '../domain/types';
import { EXERCISES } from '../domain/types';
import { EXERCISE_LABEL } from '../domain/labels';

export function ExerciseBottomBar({
  exercise,
  onSelect,
  onOpenSettings,
}: {
  exercise: Exercise;
  onSelect: (e: Exercise) => void;
  onOpenSettings: () => void;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex items-stretch bg-bar pb-[env(safe-area-inset-bottom)]">
      {EXERCISES.map((e) => {
        const active = e === exercise;
        return (
          <button
            key={e}
            type="button"
            onClick={() => onSelect(e)}
            aria-pressed={active}
            className={`relative min-h-[56px] flex-1 font-sans text-sm focus-visible:outline-2 focus-visible:outline-primary focus-visible:[outline-offset:-2px] ${
              active ? 'font-bold text-primary' : 'text-[oklch(0.72_0_0)]'
            }`}
          >
            {active && <span className="absolute inset-x-0 top-0 h-0.5 bg-primary" />}
            {EXERCISE_LABEL[e]}
          </button>
        );
      })}
      <button
        type="button"
        aria-label="設定"
        onClick={onOpenSettings}
        className="min-h-[56px] px-5 text-xl text-[oklch(0.72_0_0)] focus-visible:outline-2 focus-visible:outline-primary focus-visible:[outline-offset:-2px]"
      >
        ⚙
      </button>
    </nav>
  );
}
```

- [ ] **Step 5: SettingsSheet.tsx を作成**（ボトムシート。性別 segmented、下線入力、保存）

```tsx
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
```

- [ ] **Step 6: index.css に keyframes を追記**（シート/バックドロップのモーション。`@theme` ブロックの外、ファイル末尾付近）

`src/index.css` の末尾に追記:
```css
@keyframes fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes sheet {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
```

- [ ] **Step 7: 型チェックで全コンポーネントが整合することを確認**

Run: `npm run typecheck`
Expected: PASS（型エラーなし）。`InterpolatedLevels`/`DisplayRow`/`Settings` のプロパティ名が各コンポーネントと一致していること。

- [ ] **Step 8: コミット**

```bash
git add src/components src/index.css
git commit -m "feat: build UI components per DESIGN.md (bands, tabular numbers, one-red rule)"
```

---

## Task 9: App.tsx 統合 ＋ コンポーネントテスト

状態 `{gender, exercise, bodyweight}` を束ね、初回案内・サマリー・ハイライト・種目切替・設定保存を配線。React Testing Library で主要フローを検証。

**Files:**
- Modify: `src/App.tsx`（Task 1 のプレースホルダを置き換え）
- Test: `src/App.test.tsx`

- [ ] **Step 1: src/App.tsx を実装**

```tsx
import { useState } from 'react';
import type { Exercise } from './domain/types';
import { useSettings } from './state/useSettings';
import { getTable } from './data/standards';
import { buildDisplayRows, findClosestRowIndex } from './domain/displayRows';
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
  const rows = buildDisplayRows(table);
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
        <StandardsTable rows={rows} highlightIndex={highlightIndex} />
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
```

- [ ] **Step 2: 失敗するテストを書く**

`src/App.test.tsx`:
```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';

beforeEach(() => localStorage.clear());

describe('App', () => {
  it('初回（未設定）は案内文を表示し、ハイライト行はない', () => {
    render(<App />);
    expect(screen.getByText(/設定から性別・体重を入力すると/)).toBeInTheDocument();
    expect(screen.queryByTestId('highlight-row')).not.toBeInTheDocument();
  });

  it('種目を切り替えるとヘッダ表示が変わる', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByText('ベンチ・男性')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'スクワット' }));
    expect(screen.getByText('スクワット・男性')).toBeInTheDocument();
  });

  it('設定で男性・70kg を保存するとサマリーとハイライト行が出る', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '設定' }));
    await user.type(screen.getByLabelText('体重 (kg)'), '70');
    await user.click(screen.getByRole('button', { name: '保存' }));

    // サマリー：男性ベンチ70kg → 中級80.3
    const summary = screen.getByText(/あなた\(/).closest('section')!;
    expect(within(summary).getByText('80.3')).toBeInTheDocument();
    // ハイライト行が存在する
    expect(screen.getByTestId('highlight-row')).toBeInTheDocument();
  });

  it('範囲外の体重では範囲外チップを表示する', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '設定' }));
    await user.type(screen.getByLabelText('体重 (kg)'), '200');
    await user.click(screen.getByRole('button', { name: '保存' }));
    expect(screen.getByText('範囲外')).toBeInTheDocument();
  });

  it('不正な体重（10kg）は保存されずエラーを表示する', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '設定' }));
    await user.type(screen.getByLabelText('体重 (kg)'), '10');
    await user.click(screen.getByRole('button', { name: '保存' }));
    expect(screen.getByRole('alert')).toHaveTextContent('30');
    // シートは開いたまま（保存ボタンが残る）
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: テストが失敗することを確認**

Run: `npm test -- App`
Expected: 最初は Task 1 のプレースホルダ App により FAIL（Step 1 を適用済みなら配線不足箇所で FAIL→PASS へ）。Step 1 適用後に実行する。

- [ ] **Step 4: テストが通ることを確認**

Run: `npm test -- App`
Expected: PASS（5テスト）。

- [ ] **Step 5: 全テスト・型チェックを通す**

Run: `npm test && npm run typecheck`
Expected: 全テスト PASS、型エラーなし。

- [ ] **Step 6: コミット**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "feat: wire App with summary, highlight, exercise switch, settings flow"
```

---

## Task 10: ビルド・PWA 確認 ＋ 出典表記 ＋ 公開準備

**Files:**
- Modify: `src/components/Header.tsx` または `src/App.tsx`（出典「ExRx」フッタ表記）
- Create: `README.md`（公開・デプロイ手順。既存を更新）

- [ ] **Step 1: 出典表記（ExRx）を追加**

`src/App.tsx` の `</main>` 直前に小さな出典フッタを追加:
```tsx
        <p className="mt-6 mb-2 text-center text-[11px] text-muted">
          基準データ出典: ExRx Strength Standards（18-39歳）。補間値は目安です。
        </p>
```

- [ ] **Step 2: 本番ビルドを実行**

Run: `npm run build`
Expected: PASS。`dist/` に `index.html`・アセット・`manifest.webmanifest`・`sw.js`（Service Worker）が生成される。

- [ ] **Step 3: プレビューで PWA/表示を目視確認**

Run: `npm run preview`
Expected: ローカル URL（既定 http://localhost:4173）で、起動直後に表が見える / 下部バーで種目切替 / ⚙で設定 → 保存でサマリー＋ハイライト。DevServer が動いていれば `/impeccable live` でのビジュアル反復、`/impeccable audit` でのa11y/コントラスト検証も可能。

- [ ] **Step 4: README.md を更新**

```markdown
# BIG3 レベルチェッカー（Web版）

性別と体重(kg)から BIG3（ベンチ/スクワット/デッド）の5段階筋力目安を表示する、オフライン動作の React PWA。

## 開発

```bash
npm install
npm run dev      # 開発サーバ
npm test         # テスト（Vitest）
npm run build    # 本番ビルド（dist/）
npm run preview  # ビルド成果物のプレビュー
```

## 技術スタック
Vite + React + TypeScript / Tailwind CSS v4 / Vitest + React Testing Library / vite-plugin-pwa。

## デザイン
戦略は `PRODUCT.md`、視覚システムは `DESIGN.md`（North Star: "The Record Board"）。

## データ出典
ExRx Strength Standards（18-39歳, kg）。アプリ内補間値は目安。

## デプロイ（Vercel）
1. GitHub にプッシュ。
2. Vercel で本リポジトリをインポート（Framework Preset: Vite、Build: `npm run build`、Output: `dist`）。
3. push で自動デプロイ。
iOS Safari はホーム画面追加が手動（共有 → ホーム画面に追加）。
```

- [ ] **Step 5: 最終確認（全テスト・ビルド）**

Run: `npm test && npm run build`
Expected: 全テスト PASS、ビルド成功。

- [ ] **Step 6: コミット**

```bash
git add -A
git commit -m "feat: add ExRx attribution, PWA build, deploy docs"
```

---

## 完了後

全タスク完了・全テスト緑・ビルド成功を確認したら、superpowers:finishing-a-development-branch スキルを使って統合方針（merge / PR / cleanup）を決める。
任意で `/impeccable audit src` と `/impeccable critique` を実行し、a11y・コントラスト・オンブランドを最終検証する（DESIGN.md の Do/Don't を基準に）。

## Self-Review（spec 対応チェック）

- 起動直後に基準表表示 → Task 9（未設定でも表描画）✓
- 性別/体重の入力・localStorage 保存・復元 → Task 7・9 ✓
- 種目切替（ベンチ/スクワット/デッド）→ Task 8・9 ✓
- 各レベル基準値の表示（基準表＋1kg精度サマリー）→ Task 4・8・9 ✓
- 線形補間（70kg→中級80.3）/ クランプ / plus 行 → Task 4 ✓
- ≤100kg 中間行挿入 / kg フォーマット → Task 5・3 ✓
- データ6テーブル・構造・昇順検証 → Task 2 ✓
- コンポーネントテスト（初回案内・ハイライト・サマリー・種目切替）→ Task 9 ✓
- バリデーション（30〜250kg・範囲外注記）→ Task 6・8・9 ✓
- PWA（manifest+SW）/ 出典表記 / Vercel 公開 → Task 1・10 ✓
- DESIGN.md 視覚システム反映（@theme トークン・フォント・帯/罫線・タブュラー数字・The One Red Rule・三重表現ハイライト・reduced-motion）→ Task 1・8 ✓
- 拡張点（`domain/level.ts` MAX判定、年齢帯、WR、曲線補間）→ 構造で担保（YAGNIにつき v1 では未実装、データに `worldRecord`/`ageBand` 保持済み）
