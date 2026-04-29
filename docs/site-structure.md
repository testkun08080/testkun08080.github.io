# Website Structure Decision Doc

## Purpose

This document fixes the website information architecture and navigation behavior so future implementation stays consistent.

## Experience Direction

- Keep the hero as the signature moment.
- Place a shader-based logo at the center of the hero.
- Surround the logo with continuously flowing text animation to maintain motion and atmosphere.
- Reuse the current animation tone (scroll-linked, subtle depth, readable first).

## Page Structure

The page follows this section order:

1. `hero`
2. `greeting`
3. `about`
4. `work`
5. `skills`
6. `contact`
7. `footer`

## Section Roles

### `hero`

- First impression area.
- Central shader logo + surrounding text animation.
- Primary visual identity and entry point.

### `greeting`

- Short personal greeting/introduction.
- Bridges hero atmosphere to profile and content sections.

### `about`

- Explain profile, focus areas, and values.
- Clarify who you are and what perspective you bring.

### `work`

- Showcase selected works with clear priority.
- Present strongest projects first.

### `skills`

- Organize technical skills and tools by category.
- Keep it scannable and practical for visitors.

### `contact`

- Provide direct contact actions (form or external links).
- Keep CTA simple and obvious.

### `footer`

- Final support area for copyright and supplemental links.
- End-of-page navigation fallback.

## Navigation Decision

### Sticky Header

- Keep header sticky throughout the page.
- Header content stays minimal: brand and light context only.
- Avoid competing with hero visuals.

### Bottom-Right Sticky Menu

- Place a fixed button at the bottom-right corner.
- On click/tap, open a simple menu with exactly:
  - `work`
  - `about`
  - `contact`
- Each item scrolls smoothly to its section anchor.
- Keep interaction quick for both desktop and mobile.

## Section ID Contract

Implementation must use these section IDs:

- `hero`
- `greeting`
- `about`
- `work`
- `skills`
- `contact`
- `footer`

## Motion and Readability Rules

- Motion supports content, not the opposite.
- Keep text readable over animated backgrounds.
- Prefer lightweight loops and scroll-linked transitions.
- Reduce animation intensity on small screens and low-power contexts.
- Keep menu transitions short and clear.

## Implementation Note

Use this file as the source of truth before coding layout and interaction updates.
