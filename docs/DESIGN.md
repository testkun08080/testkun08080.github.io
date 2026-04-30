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

## Suggested CSS Variables

```css
:root {
  --text-heading: #0f172a;
  --text-subtitle: #64748b;
  --text-body: #334155;
  --text-muted: #475569;
  --text-inverse: #f8fafc;
}
```

## Quick Mapping

- `h1`, `h2`: `var(--text-heading)`
- Section subtitle / eyebrow / small uppercase labels: `var(--text-subtitle)`
- Paragraphs, list labels, default inline text: `var(--text-body)`
- Supplemental captions/meta text: `var(--text-muted)`
