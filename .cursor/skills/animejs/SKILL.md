---
name: animejs
description: Guides Anime.js v4 installation, animate(), timelines, stagger, scroll, SVG, draggable, scope, and React patterns. Use when implementing anime.js or animejs, JS-driven tweens, timelines, SVG morph/draw/path, scroll-sync animation, spring easing, or micro-interactions on the web.
---

# Anime.js v4

Lightweight, modular JavaScript animation for CSS properties, SVG, DOM attributes, and plain objects. Prefer the official docs for parameter-level detail: [animejs.com/documentation](https://animejs.com/documentation).

## When to use vs Motion (this repo)

See [.cursor/rules/animation-motion-vs-anime.mdc](../../rules/animation-motion-vs-anime.mdc): large scroll-driven sections → Motion; small UI tweens and short sequences → anime.js. Do not stack both on the same element.

## Installation

**NPM**

```bash
npm install animejs
```

**ES modules**

```javascript
import { animate } from 'animejs';
```

**CDN (ESM)**

```javascript
import { animate } from 'https://esm.sh/animejs';
```

**CDN (UMD)**

```html
<script src="https://cdn.jsdelivr.net/npm/animejs/dist/bundles/anime.umd.min.js"></script>
<script>
  const { animate } = anime;
</script>
```

## Modular imports (tree-shaking)

```javascript
import { animate, createTimeline, stagger, createDraggable } from 'animejs';

import { animate } from 'animejs/animation';
import { createTimeline } from 'animejs/timeline';
import { createTimer } from 'animejs/timer';
```

## API map (overview)

| Area | Main entry | Typical use |
|------|------------|-------------|
| Playback | `createTimer` | Delays, loops, callbacks, time control |
| Tweens | `animate` | CSS/attrs/objects, keyframes, easing |
| Sequencing | `createTimeline` | Chains, offsets (`<`, `+=`), labels |
| Interaction | `createDraggable` | Drag with spring release, containers |
| Reactive values | `createAnimatable` | Get/set animated numbers |
| Scroll | `onScroll` | Enter/leave thresholds, sync progress |
| Layout | `createLayout` | Enter/exit, staggered children, FLIP-style |
| Scoped setup | `createScope` | React/root defaults, media queries |
| SVG | `morphTo`, `createDrawable`, `createMotionPath` | Morph, stroke draw, path motion |
| Text | `splitText` | Line/word/char splits + effects |
| Utilities | `stagger`, `get`/`set`, `random`, springs, math | Stagger grids, helpers |

Full outline: [references/api-reference.md](references/api-reference.md)

## Quick patterns

Copy-paste recipes: [references/examples.md](references/examples.md)

## Bundle sizes (minified + gzip, approximate)

| Module | ~Size |
|--------|-------|
| Full | ~24.5 KB |
| Timer | ~5.6 KB |
| Animation | +5.2 KB |
| Timeline | +0.55 KB |
| Draggable | +6.4 KB |
| Scroll | +4.3 KB |
| Spring | +0.52 KB |

## Links

- [Documentation](https://animejs.com/documentation)
- [Easing editor](https://animejs.com/easing-editor)
- [CodePen collection](https://codepen.io/collection/Poerqa)
- [GitHub](https://github.com/juliangarnier/anime)

## Additional resources in this skill

- [references/api-reference.md](references/api-reference.md) — API sitemap and module notes
- [references/examples.md](references/examples.md) — Common code patterns
