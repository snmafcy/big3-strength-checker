---
name: BIG3 レベルチェッカー
description: 体重からBIG3の筋力目安が一目で分かる、硬派アスレチックなPWA
colors:
  bg: "oklch(1 0 0)"
  surface: "oklch(0.965 0 0)"
  surface-sunken: "oklch(0.93 0 0)"
  ink: "oklch(0.18 0 0)"
  bar: "oklch(0.15 0 0)"
  muted: "oklch(0.44 0 0)"
  hairline: "oklch(0.85 0 0)"
  primary: "oklch(0.48 0.20 22)"
  primary-deep: "oklch(0.40 0.18 22)"
  primary-tint: "oklch(0.95 0.03 22)"
  warn: "oklch(0.82 0.14 75)"
  warn-ink: "oklch(0.30 0.06 70)"
  level-untrained: "oklch(0.50 0 0)"
  level-novice: "oklch(0.50 0.09 30)"
  level-intermediate: "oklch(0.50 0.14 26)"
  level-advanced: "oklch(0.49 0.18 24)"
  level-elite: "oklch(0.47 0.21 22)"
typography:
  display:
    fontFamily: "Zen Kaku Gothic New, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 6vw, 2.25rem)"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "Zen Kaku Gothic New, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0"
  body:
    fontFamily: "Zen Kaku Gothic New, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  label:
    fontFamily: "Zen Kaku Gothic New, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.08em"
  data:
    fontFamily: "Spline Sans Mono, ui-monospace, monospace"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.01em"
  data-hero:
    fontFamily: "Spline Sans Mono, ui-monospace, monospace"
    fontSize: "clamp(1.5rem, 7vw, 2rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "16px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  "2xl": "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.bg}"
    typography: "{typography.heading}"
    rounded: "{rounded.sm}"
    padding: "16px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.bg}"
  segment-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
  segment-unselected:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
  tab-active:
    backgroundColor: "{colors.bar}"
    textColor: "{colors.primary}"
    typography: "{typography.heading}"
    height: "56px"
  tab-inactive:
    backgroundColor: "{colors.bar}"
    textColor: "oklch(0.72 0 0)"
    typography: "{typography.body}"
    height: "56px"
  chip-warn:
    backgroundColor: "{colors.warn}"
    textColor: "{colors.warn-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
  input-underline:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    typography: "{typography.data-hero}"
    padding: "8px 0"
---

# Design System: BIG3 レベルチェッカー

## 1. Overview

**Creative North Star: "The Record Board"**

陸上トラックの記録掲示板と、リソグラフ印刷のスポーツポスターが交わる場所。純白の紙の上に、インクのように黒い数字が刷られ、"そこだけ"に一色の赤が乗る。このプロダクトの主役は終始 **重量の数字** であり、UIはそれを最速・最正確に読ませる掲示板に徹する。装飾は数字の可読性を一度も邪魔しない。

力強さ（硬派アスレチック）は、エフェクトの量ではなく **コントラスト・タイポの重み・余白の引き算** で出す。重い見出しウェイト、ぴたりと揃ったモノスペースの数字、広い白、そして規律ある一点の赤。これがこのシステムの全エネルギー源である。

このシステムが明確に拒否するもの：(1) 筋トレアプリの定番反射である「ダークモード＋ネオン」——白基調はその第二反射すら避けるための積極的選択。(2) 量産型SaaSダッシュボード（角丸カード＋アイコン＋薄いグレー文字の没個性テンプレ、同サイズカードの反復）。(3) どぎつい筋トレ広告（過剰グラデ・煽り）。(4) ExRx原典のような装飾なし生HTML罫線表。

**Key Characteristics:**
- 純白 (`oklch(1 0 0)`) のキャンバス、インクブラックの数字、規律ある赤一色。
- 数字はすべてモノスペース（Spline Sans Mono）でタブュラー整列。
- カードではなく "バンド（帯）" と "罫線（ルール）" で構造化する。
- 影は原則ゼロ。浮くのは設定シートだけ。
- 強さ＝レベルの「熱量ランプ」：グレー→赤で5段階を示す。

## 2. Colors

純白・インク黒・規律ある赤を基軸に、5段階レベルだけを「グレー→赤」の単一色相ランプで温度づけする、ほぼモノクロームの掲示板パレット。

### Primary
- **Platform Red** (`oklch(0.48 0.20 22)`): アクティブ種目タブ、ハイライト行、保存ボタン、フォーカスリングなど「いま効いている一点」だけに使う赤。白地で本文比 4.5:1 以上、白文字を載せても 4.5:1 以上を満たす深さに調整済み。エラー色ではなく **強度・到達** の色。

### Secondary
- **Warning Amber** (`oklch(0.82 0.14 75)` / 文字 `oklch(0.30 0.06 70)`): 「範囲外」注記の塗りチップ専用。地が明るいので必ず濃いインクの文字と組で使い、コントラストを担保する。赤（Platform Red）とは役割を絶対に混ぜない。

### Tertiary — Level Intensity Ramp
5段階を等明度・彩度上昇で表す「熱量ランプ」。**ラベル/ドットにのみ使用し、数字そのものは常にインク黒**（数字が主役の原則）。
- **Untrained** (`oklch(0.50 0 0)`): 無彩のグレー。出発点。
- **Novice** (`oklch(0.50 0.09 30)`): わずかに熱を帯びる。
- **Intermediate** (`oklch(0.50 0.14 26)`): 中間の赤み。
- **Advanced** (`oklch(0.49 0.18 24)`): 濃い赤。
- **Elite** (`oklch(0.47 0.21 22)`): 最も深い赤 = 頂点。

### Neutral
- **Ink** (`oklch(0.18 0 0)`): 本文と全数字。白地で約 14:1。
- **Bar** (`oklch(0.15 0 0)`): 画面下部バーの面。白い紙面に対する硬いアンカー。
- **Muted** (`oklch(0.44 0 0)`): 副次テキスト（現在の種目・性別、注記）。白地で約 4.8:1（本文基準も満たす）。
- **Surface** (`oklch(0.965 0 0)`) / **Surface Sunken** (`oklch(0.93 0 0)`): サマリー帯・表ヘッダ帯・ゼブラ。ほぼ無彩で紙の地続き。
- **Hairline** (`oklch(0.85 0 0)`): 罫線・境界。1px のみ。

### Named Rules
**The One Red Rule.** 赤（Platform Red）は1画面内で「いま効いている対象」にのみ乗る——アクティブ種目・ハイライト行・主要アクション・フォーカス。それ以外を赤くしない。赤の希少さがメッセージである。

**The Numbers Stay Ink Rule.** レベルの色分け（熱量ランプ）はラベルとドットまで。**重量の数字は何があってもインク黒**。色で数字の可読性を下げない。

## 3. Typography

**Display / UI Font:** Zen Kaku Gothic New (with system-ui, sans-serif) — 日本語＋ラテンを1ファミリーで賄う、硬質で芯のあるゴシック。900ウェイトで掲示板の重量感を出す。
**Numeric / Data Font:** Spline Sans Mono (with ui-monospace, monospace) — 全重量・体重・表の数字に使うモノスペース。タブュラー整列と技術的な精度感を担保。

**Character:** 重いヒューマニスト・ゴシック（Zen Kaku）と精密なモノスペース（Spline Sans Mono）を **コントラスト軸**（似た2書体ではなく、性格の違う2書体）で対比。「スコアボード × スペックシート」。

### Hierarchy
- **Display** (900, clamp(1.5rem, 6vw, 2.25rem), 1.05, -0.02em): ワードマーク「BIG3 レベルチェッカー」。`text-wrap: balance`。
- **Heading** (700, 1rem, 1.3): セクション見出し、ボタンラベル、アクティブタブ。
- **Body** (400, 0.875rem, 1.6): 注記・案内文。最大行長 65–75ch（モバイル幅では自然に収まる）。
- **Label** (700, 0.6875rem, +0.08em): レベル列見出し（熱量ランプ色）。短い語のみに限定し、全セクションには付けない。
- **Data** (Spline Sans Mono 500, 0.9375rem, タブュラー): 表内の全数値・体重列。右揃え。
- **Data Hero** (Spline Sans Mono 700, clamp(1.5rem, 7vw, 2rem)): サマリー帯の大きな目安数値、設定シートの体重入力。

### Named Rules
**The Tabular Rule.** 比較される数字（表・サマリー）は必ずモノスペースで縦に桁を揃える。プロポーショナル数字でガタつかせない。

**The Quiet Eyebrow Rule.** 小さい大文字トラッキングのラベルはレベル列見出し **だけ** の役割。装飾の「eyebrow」を全セクション頭に撒かない。

## 4. Elevation

原則フラット（印刷物の美学）。奥行きは影ではなく **黒い下部バー** と **1px の罫線** と **面のトーン差**（surface / surface-sunken）で表現する。影を持つのは、コンテンツの上に物理的に浮く **設定シートと、そのバックドロップ** だけ。

### Shadow Vocabulary
- **Sheet Lift** (`box-shadow: 0 -8px 32px oklch(0.15 0 0 / 0.18)`): 下から立ち上がる設定シートの上端にのみ。シートが紙面から持ち上がっていることを示す唯一の影。

### Named Rules
**The Flat-By-Default Rule.** 面は静止時フラット。影は「浮く」という意味を持つシート以外には決して付けない。ホバーで影を盛らない。2014年風の濃いドロップシャドウは禁止。

## 5. Components

### Buttons
- **Shape:** ほぼ直角の硬い角（4px / `{rounded.sm}`）。丸めすぎない。
- **Primary:** Platform Red 塗り＋白文字（`button-primary`）、padding 16px 24px、700。保存などの主要アクション。フル幅で使うことが多い。
- **Hover / Active:** 背景を `primary-deep` へ（`button-primary-hover`）、`transform: translateY(-1px)` を 150ms ease-out。`:active` で translateY(0)。
- **Focus:** `outline: 2px solid {colors.primary}; outline-offset: 2px`（白地でも視認できる赤リング）。

### Chips
- **Warning Chip:** 「範囲外」表示専用（`chip-warn`）。Warning Amber 塗り＋濃インク文字、4px 角、padding 2px 6px、Label タイポ。色のみに依存せず文言「範囲外」を必ず併記。

### Segmented Control (性別)
- **Style:** 2つの等幅ボタン。選択 = Ink 塗り＋白文字（`segment-selected`）、未選択 = Surface 地＋インク文字（`segment-unselected`）。4px 角。タップ高さ ≥48px。
- **State:** 選択は塗りの濃さで判別（色相だけに頼らない）。

### Bands & Rules（カードの代替）
- **Summary Band:** 角丸カードにしない。白地に上下 1px hairline の **帯**。左に「あなた(70kg)の目安 (kg)」(Heading)、その下に5カラム grid：各カラム＝熱量ランプ色の Label ＋ Data Hero の大きな数値（インク黒）。範囲外なら見出し脇に Warning Chip。
- **Internal Padding:** 上下 16px（`{spacing.lg}`）、左右は本文コンテナ準拠。
- **Nesting は禁止**（帯の中に帯を入れない）。

### Standards Table（シグネチャ）
- **Layout:** フル幅。体重列は左揃え（Data, モノ）。各レベル列は右揃え（Data, モノ、タブュラー）。
- **Header:** スティッキー。レベル名は Label を熱量ランプ色で。地は surface-sunken の薄帯。
- **Zebra:** 偶数行に surface の極薄トーン（彩度ゼロ）。やりすぎない。
- **Highlight Row（設定体重に最近接）:** `primary-tint` 背景 ＋ 行全体を 700 太字 ＋ 行頭に ▶ マーカー ＋ 上下を 2px の primary 罫線で挟む。**色・太字・マーカーの三重**で表し、色のみに依存しない（a11y）。
- **Plus Row:** 末尾に `145+`/`90+` を「(上限)超」として通常行スタイルで表示。

### Inputs / Fields
- **Style:** 下線（underline）型（`input-underline`）。背景なし、下 1px hairline、Data Hero の大きなモノ数字。塗りボックスにしない。
- **Focus:** 下線が primary に変わり、太さ 2px ＋ 赤フォーカスリング。
- **Error:** 下線を warn 寄りにし、直下に Body で警告文（例「30〜250kgで入力してください」）＋ `role="alert"`。

### Navigation — Bottom Bar
- **Style:** 画面下部固定の **Bar（near-black 塗り）**。3種目タブ＋⚙設定。高さ 56px、`padding-bottom: env(safe-area-inset-bottom)`。
- **States:** アクティブ = primary 文字 ＋ 上辺 2px の primary インジケータ（`transform: scaleX` で 180ms スライド）。非アクティブ = `oklch(0.72 0 0)` 文字。タップ領域 ≥56px。
- **z-index:** header(10) < bottom-bar(20) < sheet-backdrop(30) < sheet(40)。任意の 999/9999 は禁止。

### Settings Sheet
- 下から立ち上がるボトムシート。白地、上端 16px 角（`{rounded.lg}`）、Sheet Lift 影。バックドロップ = `oklch(0.15 0 0 / 0.5)`。
- 内容：性別 Segmented Control → 体重 underline 入力 → primary 保存ボタン（フル幅）。
- **Motion:** `translateY(100%)→0` を 240ms ease-out-expo、バックドロップは opacity フェード。`prefers-reduced-motion: reduce` では即時表示＋フェードのみ。

## 6. Do's and Don'ts

### Do:
- **Do** すべての比較数値を Spline Sans Mono のタブュラーで桁揃えする（The Tabular Rule）。
- **Do** 赤は「いま効いている一点」だけに使う（The One Red Rule）：アクティブ種目・ハイライト行・保存・フォーカス。
- **Do** レベルの識別は熱量ランプ色 ＋ 位置で行い、**数字は常にインク黒**に保つ（The Numbers Stay Ink Rule）。
- **Do** ハイライト行は背景色 ＋ 太字 ＋ ▶ マーカーの三重で示し、色覚に依存させない。
- **Do** 本文 4.5:1・大文字/太字 3:1・プレースホルダ 4.5:1 のコントラストを必ず満たす。
- **Do** すべてのアニメーションに `prefers-reduced-motion: reduce` の代替（即時/フェード）を用意する。
- **Do** カードの代わりに帯（band）と 1px 罫線で構造を作る。
- **Do** タッチターゲットを最低 48–56px 確保する。

### Don't:
- **Don't** ダークモード＋ネオンの「筋トレアプリ反射」に落ちる。白基調の積極的選択を崩さない。
- **Don't** 量産型SaaSダッシュボード（角丸カード＋アイコン＋薄いグレー文字、同サイズカードの反復）にしない。
- **Don't** どぎつい筋トレ広告（過剰グラデ・煽り文句・ビフォーアフター）にしない。
- **Don't** ExRx原典のような装飾なし生HTML罫線表のまま見せない。
- **Don't** `border-left`/`border-right` を 1px 超の色付きストライプとしてカードや行に使わない（サイドストライプ禁止）。
- **Don't** グラデーション文字（`background-clip: text`）を使わない。強調はウェイトとサイズで。
- **Don't** グラスモーフィズムや装飾的な影を既定にしない。影はシートだけ。
- **Don't** 全セクション頭に小さい大文字トラッキングの eyebrow を撒かない。
- **Don't** 重量の数字を色付け・薄グレー化して可読性を落とさない。
- **Don't** 999 / 9999 のような場当たり z-index を使わない（定義済みスケールのみ）。
