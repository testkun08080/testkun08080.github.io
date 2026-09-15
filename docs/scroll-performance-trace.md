# パフォーマンス計測 (Before / After)

## 1. アイドル時ベースライン計測（2026-09-14 実施）

### 背景

「スマホで見ていると端末が発熱する」という症状の原因を切り分けるため、
**ユーザーが何も操作していない状態**でのメインスレッド負荷を計測した。

スクロール時ではなく「トップページを開いて放置しているだけ」の状態を主対象にしている。
発熱は継続的な負荷で起きるため、操作していない間に CPU/GPU が回り続けているかどうかが本質だから。

### 計測環境

| 項目 | 値 |
| --- | --- |
| 対象 | `npm run build` + `vike prerender` 済みの `dist/client` をローカル配信 |
| ツール | Playwright 1.56.1 + Chrome DevTools Protocol (`Performance.getMetrics`, `LayerTree`) |
| モバイル条件 | 390×844 / DPR 3 / isMobile / タッチ有 / **CPU 4x スロットル** |
| デスクトップ条件 | 1440×900 / DPR 2 / スロットルなし |
| シナリオ | トップページを開き、ヒーロー位置で**無操作のまま放置** |
| 計測窓 | モバイル 15s × 3回 / デスクトップ 10s × 2回、中央値を採用 |

> **重要な制約**: 計測環境に GPU が無く、WebGL は **SwiftShader（ソフトウェアラスタライズ）**で動作した
> (`ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero)), SwiftShader driver)`)。
> そのため **WebGL シェーダーの負荷は実機より過大に出る**。
> 逆に、メインスレッド側の数値（style recalc / long task / script 時間）と、
> 合成レイヤー枚数・レイヤーメモリ・DOM ノード数は構造的な指標であり、実機にもそのまま当てはまる。

### 結果: ベースライン（無操作・放置）

| 指標 | モバイル(4x) | デスクトップ |
| --- | --- | --- |
| **メインスレッド占有率** | **98.9 %** | **96.3 %** |
| **実効 FPS** | **13.1** | **6.8** |
| ロングタスク数 (>50ms) | 199 / 15s | 69 / 10s |
| ロングタスク合計時間 | 14,551 ms / 15,000 ms (97%) | — |
| style recalc | 108.8 ms/秒 | 16.8 ms/秒 |
| script | 114.9 ms/秒 | 55.1 ms/秒 |
| **合成レイヤー枚数** | **867** | **1,170** |
| **レイヤーメモリ** | **46.1 MB** | **200.3 MB** |
| DOM ノード数 | 1,808 | 2,093 |
| `will-change` が付いた要素 | 134 | — |
| 無限ループアニメーション | 66 | — |
| 転送量 / リクエスト数 | 1,346 KB / 56 | 1,522 KB / 56 |

**何も操作していないのにメインスレッドがほぼ 100% 占有されている。**
これが発熱・バッテリー消費・サーマルスロットリングの直接原因。

### 要因の切り分け（モバイル 4x / 10s / 中央値）

各要素を個別に無効化して寄与を測定した。

| # | 条件 | CPU占有 | FPS | ロングタスク | style ms/秒 | レイヤー枚数 |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | ベースライン | 100.0 % | 13.4 | 136 | 115.2 | 867 |
| 1 | `mix-blend-mode` を無効化 | 100.4 % | 13.7 | 139 | 110.7 | 867 |
| 2 | ノイズレイヤーを非表示 | 99.6 % | 13.3 | 135 | 109.3 | 865 |
| 3 | マーキーのアニメーション停止 | 100.5 % | 13.6 | 139 | 101.9 | 867 |
| 4 | `will-change` を全解除 | 100.6 % | 12.9 | 130 | 110.2 | 864 |
| 5 | **3Dバーコードを非表示** | 101.9 % | **19.9** | **84** | **35.7** | **148** |
| 6 | **WebGL を無効化** | 91.2 % | **30.7** | **14** | 249.7 * | 866 |
| 7 | **5 + 6 の両方** | **45.3 %** | **59.5** | **0** | 91.1 | 147 |
| 8 | `prefers-reduced-motion: reduce`（全停止） | **5.2 %** | **60.1** | **0** | 0.0 | 142 |

\* #6 の style ms/秒 が増えているのは、WebGL が無くなって**フレームが多く回るようになった**ための
レート換算上の増加であり、悪化ではない。

### 読み取れること

1. **単体で効く対策は無い**。#1〜#4 はいずれも単独ではほぼ効果ゼロ。
   「どれか一つを直せば解決」ではなく、重い要素が積み重なって飽和している。
2. **3Dバーコードが合成レイヤーの主因**。非表示にすると **867 → 148 枚（-83%）**、
   style recalc が **115 → 36 ms/秒（-69%）**。
   これはメインスレッド側のコストなので**実機でもそのまま効く**。
3. **WebGL シェーダーはロングタスクの主因**（136 → 14）。
   ただし前述の通りソフトウェアGL環境のため、**実機 GPU では過大評価**。実機での寄与は要再検証。
4. **3Dバーコードと WebGL を両方止めても CPU 45%** が残る。
   これはマーキー・ノイズ canvas・animejs のタイムライン群の合計。無視できない。
5. **全部止めれば 5% / 60fps**。つまり現状は本来必要な負荷の約 20 倍を消費している。

### 主な原因箇所

| 要素 | 実装 | 構造的な問題 |
| --- | --- | --- |
| 3Dバーコード | `components/portfolio/PathBarcodeTemplate3D.tsx` | 文字数 152(モバイル)/209(デスクトップ)、1文字 = 5要素 → 760/1045 ノード。`placeItems()` が**毎フレーム `getBoundingClientRect()`（強制同期レイアウト）**＋**152要素に transform 書き込み**。別タイムラインが **608要素**の `rotateX`/`opacity` を無限アニメーション。CSS は `perspective` + 文字ごとに `transform-style: preserve-3d` |
| マーキー | `components/curtain/CurtainMarquee.tsx`, `ProductionHomePage.module.css` | モバイル最大32行 × 2半分 × 2コピー = **128 `<p>`**、各15回テキスト反復。`.half` と `.marqueeTrack` の両方に **`will-change: transform` を常時付与**。`infinite` で**画面外でも停止しない** |
| ノイズ | `components/AnimatedNoise.tsx`（ルートレイアウト = **全ページ**） | 描画は 10-18fps に制限されているが **rAF ループ自体は毎フレーム起床**して CPU を idle に落とさない。`resize` が debounce 無しで、モバイルの URL バー開閉のたびにバッファ全再生成。`TARGET_PATHS` 判定が mount 時1回のみで SPA 遷移に追従しない |
| WebGLロゴ | `components/portfolio/HeroLogoInkWebGL.tsx` | `antialias: true` だが**全画面 quad なのでジオメトリのエッジが無く MSAA は無意味**。`precision highp float`。fbm 5オクターブ×5回 + 12タップブラー |

いずれも `heavyEffectsPaused` はブリッジ進捗 85% でしか立たないため、
**ページを開いた直後（最も一般的な状態）は全部が同時に動く**。

### 再現手順

```bash
cd app
npm install
npm run build && npx vike prerender
npx serve dist/client -l 4173
# 別シェルで Playwright + CDP から Performance.getMetrics の差分を取る
```

---

## 2. フェーズA（見た目を変えない最適化）の結果

### 変更内容

| # | 変更 | ファイル |
| --- | --- | --- |
| A1 | `antialias: false`（全画面 quad なので MSAA は元々効いていない） | `components/portfolio/HeroLogoInkWebGL.tsx` |
| A2 | 毎フレームの `getBoundingClientRect()`（強制同期レイアウト）を除去。bounds をキャッシュし `ResizeObserver` でのみ更新 | `components/portfolio/PathBarcodeTemplate3D.tsx` |
| A3 | ヒーローが画面外になったら WebGL とバーコードを停止（既存の `paused` prop に配線） | `components/dev-integrated/HeroBurstLogoSection.tsx` |
| A4 | 画面外でマーキーを `animation-play-state: paused` | `components/production/ProductionHomePage.tsx` / `.module.css` |
| A5 | ノイズの rAF が描画しないフレームでも毎回起床していたのを、フレーム予算ぶん待ってから起床するよう変更 | `components/AnimatedNoise.tsx` |
| A6 | ノイズの `resize` を debounce | `components/AnimatedNoise.tsx` |
| A7 | ルート判定が SPA 遷移に追従しないバグを修正（`usePageContext` 経由に） | `components/AnimatedNoise.tsx` |

### 計測方法の補正

セクション1のベースラインは別時間帯に取ったもので、コンテナの負荷が違うと FPS が大きくぶれる
（同じベースラインが 13.1fps と 8.7fps の両方を示した）。
そのためフェーズAの評価では **baseline と phaseA を別ポートで同時に配信し、1回ずつ交互に3往復**して
中央値を比較した。YouTube 埋め込みはこの環境から到達できずリトライがノイズになるため、
**両方の計測で同一にオリジン外リクエストをブロック**している。

### 結果 A: ヒーロー表示のまま放置（モバイル4x / 12s / 交互3回の中央値）

| 指標 | baseline | phaseA | 差 |
| --- | --- | --- | --- |
| メインスレッド占有率 | 99.9 % | 99.4 % | -0.5 % |
| 実効 FPS | 8.7 | 9.5 | **+9.2 %** |
| script | 123.8 ms/秒 | 107.4 ms/秒 | **-13.2 %** |
| frame P50 | 116.6 ms | 100.0 ms | **-14.2 %** |
| ロングタスク合計時間 | 11,747 ms | 11,685 ms | -0.5 % |
| **合成レイヤー枚数** | **869** | **869** | **±0** |

### 結果 B: ヒーローを通り過ぎてページ下部で放置（モバイル4x / 12s / 交互2回の中央値）

| 指標 | baseline | phaseA | 差 |
| --- | --- | --- | --- |
| **実効 FPS** | **7.2** | **22.6** | **+213 %** |
| **frame P50** | **133.4 ms** | **41.7 ms** | **-68.7 %** |
| script | 117.2 ms/秒 | 97.3 ms/秒 | -17.0 % |
| ロングタスク数 | 88.5 | 72.5 | -18.1 % |
| メインスレッド占有率 | 103.2 % | 100.9 % | -2.2 % |

### 見た目が変わっていないことの確認

- ノイズ canvas（原理的に毎フレーム乱数なので一致しえない）を両方で非表示にしたうえで、
  ヒーローのスクリーンショットを比較 → **完全にピクセル一致（差分 0 バイト / 3,951,608）**
- マーキーの `animationPlayState` を実測:
  - ヒーロー表示中: baseline / phaseA ともに **64本すべて running**（= 見えている間の挙動は同一）
  - ページ下部: baseline は **64本 running のまま**、phaseA は **64本すべて paused**
- 既存テスト 20件すべて green

### 結論

**見た目を変えない範囲では、ヒーロー放置時の発熱はほぼ解消できない。**

- ヒーローを表示したまま放置する状態では **メインスレッド占有率 99% は変わらず**、
  **合成レイヤー 869枚も1枚も減らない**。改善は FPS +9%、script -13% 程度にとどまる。
- レイヤー869枚の主因は 3Dバーコードの `perspective` + 文字ごとの `transform-style: preserve-3d`
  （152文字 × 5要素）であり、**要素数そのものを減らさない限り下がらない**。
  これは見た目の変更なしには不可能。
- 一方で **ヒーローを通り過ぎた後は FPS が3倍以上**になった。
  実際の閲覧では下までスクロールして読む時間の方が長いので、体感の改善は大きいはず。

次の一手（要相談・見た目に影響）:
バーコードの文字数削減、マーキーの行数 / `REPEAT_N` 削減、シェーダーの fbm オクターブ削減、
モバイルでの WebGL 30fps 制限、YouTube 埋め込みの facade 化。

---

## 3. スクロール時計測（未実施・テンプレート）

### Target Flow

1. Open top page.
2. Scroll through hero bridge.
3. Continue into sticky side sections.
4. Expand and collapse skills/tools cards.
5. Open quick menu while scrolling.

### Metrics to Record

- Dropped frames count
- Long tasks (>50ms) count
- Main-thread scripting time (ms)
- Main-thread rendering + painting time (ms)
- FPS floor on sticky/bridge sections

### Result Table Template

| Tag | Dropped Frames | Long Tasks | Scripting (ms) | Render+Paint (ms) | Notes |
| --- | --- | --- | --- | --- | --- |
| perf-scroll-before #1 |  |  |  |  |  |
| perf-scroll-after #1 |  |  |  |  |  |

### Acceptance

- Long tasks reduced by at least 30% vs baseline average.
- Scripting time reduced with no visible animation regression.
- No obvious stutter in hero bridge and sticky side sections.
