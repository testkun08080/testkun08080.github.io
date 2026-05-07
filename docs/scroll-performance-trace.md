# Scroll Performance Trace (Before / After)

## Target Flow

1. Open top page.
2. Scroll through hero bridge.
3. Continue into sticky side sections.
4. Expand and collapse skills/tools cards.
5. Open quick menu while scrolling.

## Trace Setup

- Chrome DevTools Performance
- CPU throttling: 4x
- Network throttling: disabled
- Record duration: 20-30s
- Run count: 3 times for each baseline/after

## Capture Commands

- Baseline tag: `perf-scroll-before`
- After tag: `perf-scroll-after`

Use the same flow and viewport size for both runs.

## Metrics to Record

- Dropped frames count
- Long tasks (>50ms) count
- Main-thread scripting time (ms)
- Main-thread rendering + painting time (ms)
- FPS floor on sticky/bridge sections

## Result Table Template

| Tag | Dropped Frames | Long Tasks | Scripting (ms) | Render+Paint (ms) | Notes |
| --- | --- | --- | --- | --- | --- |
| perf-scroll-before #1 |  |  |  |  |  |
| perf-scroll-before #2 |  |  |  |  |  |
| perf-scroll-before #3 |  |  |  |  |  |
| perf-scroll-after #1 |  |  |  |  |  |
| perf-scroll-after #2 |  |  |  |  |  |
| perf-scroll-after #3 |  |  |  |  |  |

## Acceptance

- Long tasks reduced by at least 30% vs baseline average.
- Scripting time reduced with no visible animation regression.
- No obvious stutter in hero bridge and sticky side sections.
