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
