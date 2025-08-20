# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Deploy to GitHub Pages (builds automatically)
npm run deploy
```

### Testing
This project doesn't have a dedicated test suite. Manual testing through the development server and visual inspection are the primary QA methods.

## Project Architecture

### Tech Stack
- **Frontend**: React 19 with React Router DOM
- **Build Tool**: Vite 6.x
- **Styling**: Tailwind CSS 4.x + DaisyUI
- **Internationalization**: i18next + react-i18next (Japanese/English)
- **Deployment**: GitHub Pages via gh-pages
- **Content**: Markdown blog posts with front-matter

### Key Architecture Patterns

#### Route Structure
The app uses a simple single-page application pattern with React Router:
- `/` - Under maintenance page (default route)
- `/sunaba` - Main sandbox/portfolio page
- `/about` - About page with bilingual content
- `/reels` - Video reels showcase
- `/contact` - Contact information
- `/blog/:slug` - Dynamic blog post pages
- `*` - 404 Not Found page

#### Component Architecture
- **Global Context**: `MenuDrawerProvider` for mobile menu state
- **Layout Components**: `Header`, `Footer`, `NoiseCanvas` (background effect)
- **Page Components**: Located in `src/pages/`
- **Reusable Components**: Located in `src/components/`
- **Menu System**: Context-based drawer navigation for mobile

#### Internationalization (i18n)
- **Languages**: Japanese (default) and English
- **Implementation**: All translations centralized in `src/i18n.js`
- **Usage Pattern**: Import `useTranslation` hook in components
- **Default Language**: Japanese (`lng: 'ja'`, `fallbackLng: 'ja'`)
- **Translation Keys**: Nested structure with page-specific prefixes (e.g., `about_`, `reels_`)

#### Blog System
- **Content**: Markdown files in `src/blog/` directory
- **Front-matter**: Uses `front-matter` library for metadata parsing
- **Dynamic Loading**: Vite's `import.meta.glob` for dynamic imports
- **URL Pattern**: `/blog/:slug` where slug matches filename portions
- **Rendering**: ReactMarkdown for content display

### File Structure Conventions
```
src/
├── components/          # Reusable React components
├── pages/              # Route-specific page components
├── blog/               # Markdown blog posts
├── assets/             # Static assets (images, icons, fonts)
├── i18n.js            # Internationalization configuration
├── main.jsx           # App entry point
├── App.jsx            # Main app component with routing
└── App.css            # Global styles
```

## Development Guidelines

### Component Development
- Use functional components with hooks
- Follow React 19 patterns and best practices
- Implement responsive design mobile-first with Tailwind
- Use DaisyUI components when available for consistent styling

### Internationalization
- Always use translation keys for user-facing text
- Add both Japanese and English translations for new content
- Use the `useTranslation` hook: `const { t } = useTranslation();`
- Translation key naming: `section_element` (e.g., `about_name`, `reels_title`)

### Styling Approach
- Primary: Tailwind CSS utility classes
- Secondary: DaisyUI component classes
- Custom styles: Use CSS modules or styled-components sparingly
- Responsive: Mobile-first approach with Tailwind breakpoints

### Blog Content
- Create markdown files in `src/blog/` with descriptive filenames
- Include front-matter with at least `title` and `date` fields
- Use slug-friendly filenames as they determine the URL structure
- Content should be in markdown format for ReactMarkdown compatibility

### Deployment Notes
- **GitHub Pages**: Automatic deployment via `npm run deploy`
- **Base Path**: Configured for GitHub Pages in vite.config.js
- **Build Output**: `dist/` directory (ignored by git)
- **Analytics**: Google Analytics integrated (GA4: G-EY0MWFVRQB)