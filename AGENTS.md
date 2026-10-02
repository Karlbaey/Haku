## Project Overview

Haku is a content-first Hugo theme for Chinese-language blogs. It's a standalone Hugo theme (not a site using a theme) — theme files live at the repository root, and `exampleSite/` provides a minimal demo site for testing.

**Key constraint**: No npm ecosystem. All JavaScript must be vanilla, and CSS is hand-written. Hugo Pipes handles asset bundling.

## Development Commands

### Preview the example site (for theme development)
```bash
hugo server --source exampleSite --themesDir ../.. -D
```

### Preview a user's site (when testing theme integration)
From the user's site root:
```bash
hugo server -D
```

### Build static site
```bash
hugo
```

## Architecture

### Template Organization

- **baseof.html**: Base template with `{{ block }}` sections for meta, styles, main, scripts, extra_head
- **Partials**: Heavily modular — SEO logic split across `_partials/seo-*.html`, reusable components in `_partials/*.html`
- **Content-type layouts**: 
  - `home.html` - article stream with pagination
  - `friends/` - links page with optional application form
  - `_default/single.html` - article detail page
- **Render hooks**: Custom markdown rendering in `_markup/render-*.html` (images, links, code blocks, blockquotes, passthrough for math)
- **Shortcodes**: `ruby`, `mwfigure`, `admonition`, `fold`

### Asset Bundling

Hugo Pipes bundles assets via `_partials/style-bundle.html`. JavaScript is loaded per-page as needed (e.g., `toc.js` only on article pages with TOC, `comments.js` only when comments configured).

### SEO System

Multi-layered SEO implementation:
- `seo-context.html` gathers all metadata
- `seo-image.html` resolves cover images with fallback chain: `seo.images[0]` → `images[0]` → `cover` → page bundle `cover*` → `params.seo.defaultImage` → favicon
- `seo-schema.html` outputs JSON-LD (BlogPosting/CollectionPage/WebSite)
- Open Graph, Twitter Card, canonical URLs, robots meta all automated

### Comment System Integration

- Supports Giscus, Sodesu and LINUX DO embed (Discourse)
- Sodesu loads frontend via CDN (no npm install required)
- Configuration: `params.comments.providers` (array of strict lowercase names) + `params.comments.{giscus,sodesu,linuxdo}` tables
- `providers` order is the tab order left to right, and the first entry is the initially expanded one
- A provider listed in `providers` must be fully configured, otherwise the build fails with an error
- Rendering: `_partials/comments.html` + `assets/js/comments.js`

## Important Conventions

### Front Matter Fields

**Standard posts**:
- Use `date` for publish date, `lastmod` for updates
- SEO override via `seo.title`, `seo.description`, `seo.images`, `seo.canonical`, `seo.noindex`
- Math support detected via page store, not front matter flag

**Friends page**:
- Must be at `content/friends/_index.md`
- Reads link data from `data/friends.toml`

### File Naming

- CSS files in `assets/css/` are scoped by feature (`comments.css`, `toc.css`)
- JS files in `assets/js/` follow `feature-name.js` pattern
- Partials use kebab-case: `article-card.html`, `seo-image.html`

### Responsive Breakpoints

- Mobile: `<768px`
- Tablet: `768px - 1024px`
- Desktop: `>1024px`
- Content max-width: `760px`

### Asset Loading Strategy

- Critical CSS bundled in baseof.html via `style-bundle.html`
- KaTeX CSS loaded conditionally when `.Page.Store.Get "hasMath"` is true
- JavaScript loaded per-page in template `{{ block "scripts" }}` sections
- No inline styles; all styling through CSS files

### Hugo Configuration Requirements

Users must set these in their site config for full functionality:
- `enableRobotsTXT = true`
- `disablePathToLower = true`
- `taxonomies.tag = "tags"`
- `outputs.home = ["HTML", "RSS"]`
- `params.mainSections` (typically `["posts"]`)
- Goldmark `unsafe = true` for HTML in markdown
- Math passthrough delimiters if using LaTeX

## Testing Changes

Always test in `exampleSite/` before claiming completion:
1. Start dev server: `hugo server --source exampleSite --themesDir .. -D`
2. Verify the change in browser (both desktop and mobile viewports)
3. Check browser console for JavaScript errors
4. Test both light and dark system themes
5. For layout changes, test with real content (multiple paragraph lengths, varied image sizes, long code blocks)

## Do Not

- Add npm dependencies or build tools
- Create README.md or documentation files unless explicitly requested
- Modify example site content casually — it demonstrates theme features
- Change `baseURL` in example site (it's intentionally `example.org` for testing)
- Add generic Hugo features available in all themes — focus on Haku-specific architecture
