## Project Overview

Haku is a content-first Hugo theme for Chinese-language blogs. It's a standalone Hugo theme (not a site using a theme) — theme files live at the repository root, and `exampleSite/` provides a minimal demo site for testing.

**Key constraint**: No npm ecosystem. All JavaScript must be vanilla, and CSS is hand-written. Hugo Pipes handles asset bundling.

## Development Commands

### Preview the example site (for theme development)
```bash
hugo server --source exampleSite --themesDir .. -D
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

### Create new archiving post
```bash
hugo new archiving/my-archive-post.md
```

## Architecture

### Template Organization

- **baseof.html**: Base template with `{{ block }}` sections for meta, styles, main, scripts, extra_head
- **Partials**: Heavily modular — SEO logic split across `_partials/seo-*.html`, reusable components in `_partials/*.html`
- **Content-type layouts**: 
  - `home.html` - article stream with pagination
  - `archiving/` - timeline layout for archived internet posts
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

### Friends Link System

- **Data source**: `data/friends.toml` (TOML array of link objects)
- **Field schema**: `data/friend_link_fields.toml` defines form fields
- **Application flow**: `assets/js/friends-application.js` builds GitHub issue body with TOML code block
- **Enable**: Create `content/friends/_index.md` + set `params.friendsApplication.enabled = true`

### Comment System Integration

- Supports Giscus and Sodesu
- Sodesu loads frontend via CDN (no npm install required)
- Configuration: `params.comments.giscus` or `params.comments.sodesu` in Hugo config
- Rendering: `_partials/comments.html` + `assets/js/comments.js`

## Current Development Focus

Active optimization work tracked in `优化需求文档.md`:

1. **Friends form TOML output** (highest priority) - `assets/js/friends-application.js` must generate TOML format, not TypeScript. Add `<!-- id: result -->` and `<!-- id: toml -->` field identifiers.

2. **Mobile pagination layout** - `assets/css/global.css` pagination breaks into two rows on mobile. Need responsive refinement for `<768px`.

3. **Code block folding** - Long code blocks (>20 lines) should get collapse/expand UI. Implement in `assets/js/article-enhancements.js` or new file. Default to expanded state.

4. **Comment lazy loading** - Delay Sodesu initialization until scroll or manual trigger to reduce Vercel function invocations and Neon DB queries. Modify `assets/js/comments.js` and `_partials/comments.html`.

5. **Desktop sticky TOC** - Fixed TOC in left margin when viewport >1024px and scroll >200px. Requires `assets/css/toc.css` and `assets/js/toc.js` updates. Must not break existing mobile TOC.

## Important Conventions

### Front Matter Fields

**Standard posts**:
- Use `date` for publish date, `lastmod` for updates
- SEO override via `seo.title`, `seo.description`, `seo.images`, `seo.canonical`, `seo.noindex`
- Math support detected via page store, not front matter flag

**Archiving posts**:
- `originalDate` - original post date on external platform
- `platform` - platform name (Twitter, Mastodon, etc.)
- `platformUrl` - link to original post
- `coverImage` - featured image for the archive card

**Friends page**:
- Must be at `content/friends/_index.md`
- Reads link data from `data/friends.toml`

### File Naming

- CSS files in `assets/css/` are scoped by feature (`archiving.css`, `comments.css`, `toc.css`)
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
