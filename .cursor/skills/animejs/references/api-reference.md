# Anime.js v4 — API sitemap

Use this as a checklist; exact signatures live in [official docs](https://animejs.com/documentation).

## Timer (`createTimer`)

- **Playback**: `delay`, `duration`, `loop`, `loopDelay`, `alternate`, `reversed`, `autoplay`, `frameRate`, `playbackRate`
- **Callbacks**: `onBegin`, `onComplete`, `onUpdate`, `onLoop`, `onPause`, `then()`
- **Methods**: `play`, `reverse`, `pause`, `restart`, `alternate`, `resume`, `complete`, `reset`, `cancel`, `revert`, `seek`, `stretch`

## Animation (`animate`)

- **Targets**: selector string, elements, objects, arrays
- **Properties**: CSS, transforms, variables, object keys, HTML/SVG attributes
- **Values**: numbers, units, relative (`+=`, `-=`, `*=`), colors, CSS vars, functions `(el, i, len) => …`
- **Tween params**: `to`, `from`, `delay`, `duration`, `ease`, `composition`, `modifier`
- **Keyframes**: per-property arrays of tweens; duration- or percentage-based segments
- **Playback**: same family as timer + `playbackEase`, `persist`
- **Callbacks**: `onBegin`, `onComplete`, `onBeforeUpdate`, `onUpdate`, `onRender`, `onLoop`, `onPause`, `then()`
- **Methods**: `play`, `reverse`, `pause`, `restart`, `alternate`, `resume`, `complete`, `cancel`, `revert`, `reset`, `seek`, `stretch`, `refresh`

## Timeline (`createTimeline`)

- Add timers, animations, sync WAAPI, nested timelines, function calls
- **Position**: absolute ms, relative (`<`, `>`, `+=`, `-=`), labels
- **API**: `add`, `set`, `sync`, `label`, `remove`, `call`, `init`, plus shared playback controls

## Draggable (`createDraggable`)

- **Axes**: `x`, `y`, `snap`, `modifier`, `mapTo`
- **Settings**: `trigger`, `container`, friction/stiffness/damping, velocity limits, scroll thresholds, cursor
- **Callbacks**: `onGrab`, `onDrag`, `onUpdate`, `onRelease`, `onSnap`, `onSettle`, `onResize`, `onAfterResize`

## Layout (`createLayout`)

- Root, display transitions, staggered children, enter/exit, reorder, swap parent, modals
- **States**: `enterFrom`, `leaveTo`, `swapAt`
- **Methods**: `record`, `animate`, `update`, `revert`

## Scope (`createScope`)

- `root`, `defaults`, `mediaQueries`
- **Methods**: `add`, `addOnce`, `keepTime`, `revert`, `refresh`

## Scroll (`onScroll`)

- **Settings**: `container`, `target`, `debug`, `axis`, `repeat`
- **Thresholds**: numbers, shorthand positions, relative values, min/max
- **Sync modes**: method names, playback progress, smooth/eased scroll
- **Callbacks**: `onEnter`, `onEnterForward`, `onEnterBackward`, `onLeave`, `onLeaveForward`, `onLeaveBackward`, `onUpdate`, `onSyncComplete`, `onResize`

## SVG

- `morphTo()` — shape morphing
- `createDrawable()` — stroke draw
- `createMotionPath()` — motion along path

## Text (`splitText`)

- **Options**: `lines`, `words`, `chars`, `debug`, `includeSpaces`, `accessible`
- **Split**: `class`, `wrap`, `clone`
- **Methods**: `addEffect`, `revert`, `refresh`

## Utilities (non-exhaustive)

- `stagger()` — time/value/grid staggering
- `$()`, `get()`, `set()`, `cleanInlineStyles()`, `remove()`, `sync()`, `keepTime()`
- `random`, `createSeededRandom`, `randomPick`, `shuffle`
- `round`, `clamp`, `snap`, `wrap`, `mapRange`, `lerp`, `damp`
- `degToRad`, `radToDeg`

## Easings

- Built-ins: linear; ease in/out/inOut × Quad, Cubic, Quart, Quint, Sine, Expo, Circ, Back, Elastic, Bounce
- Custom: cubic-bezier, multi-point linear, steps, irregular
- Spring: `createSpring({ stiffness, damping, mass, velocity })`

## WAAPI

- When to prefer native WAAPI vs JS engine; `waapi.convertEase()` where relevant

## Engine

- `timeUnit`, `speed`, `fps`, `precision`, `pauseOnDocumentHidden`
- `update`, `pause`, `resume`
