# DESIGN Color Guidelines

This document defines the default text color usage for page UI so sections stay visually consistent regardless of background changes.

## Core Text Roles

- Header title (primary heading): `#0f172a`
- Subtitle / section label / eyebrow: `#64748b`
- Body text (default paragraph): `#334155`
- Muted helper text: `#475569`
- Inverse text on dark surfaces only: `#f8fafc`

## Usage Rules

- Do not hardcode section-specific background colors unless the section concept explicitly requires it.
- If a component can appear on both light and dark backgrounds, prefer neutral text roles above and only switch to inverse text through a wrapper class.
- Keep subtitle contrast lower than header titles, but maintain readability target close to body contrast standards.
- For cards and list rows over dynamic backgrounds, prefer transparent surface + border + blur instead of colored overlays.
- For clipped/folded content indicators (for example, collapsed grid tail), avoid color gradients; use blur + mask transitions.

## CSS Variables (Source of Truth)

```css
:root {
  --color-text-heading: #0f172a;
  --color-text-subtitle: #64748b;
  --color-text-body: #334155;
  --color-text-muted: #475569;
  --color-text-inverse: #f8fafc;
  --color-border-subtle: rgb(148 163 184 / 0.32);
  --color-border-strong: rgb(148 163 184 / 0.46);
  --surface-card: rgb(255 255 255 / 0.7);
  --surface-card-strong: rgb(255 255 255 / 0.84);
  --fx-collapse-blur: 7px;
}
```

Defined in: `app/pages/Layout.css`

## Floating Parameter Tuning

- `app/pages/dev-integrated/+Page.tsx` includes a floating Leva panel.
- Panel component: `app/components/dev-integrated/FloatingThemeControls.tsx`
- You can tune these in real time:
  - heading/subtitle/body/muted/inverse text colors
  - subtle/strong border colors
  - card surface opacity colors
  - collapsed-grid blur strength (`--fx-collapse-blur`)

## Quick Mapping

- `h1`, `h2`: `var(--color-text-heading)`
- Section subtitle / eyebrow / small uppercase labels: `var(--color-text-subtitle)`
- Paragraphs, list labels, default inline text: `var(--color-text-body)`
- Supplemental captions/meta text: `var(--color-text-muted)`
