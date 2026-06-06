# Google Site Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage Pagefind search overlay with a compact Google site search form that derives its restriction from `site.BaseURL`, rewrites the outgoing query into `site:<host> <keyword>`, and updates the theme documentation to match.

**Architecture:** Render a plain HTML `<form>` in `layouts/_partials/search.html` with the configured site target exposed through theme-controlled data attributes. Add a small `assets/js/search-form.js` helper that rewrites the submitted `q` value to `site:<host> <keyword>` before navigation, keep the compact homepage CSS bundle, stop loading the old overlay script, and document the new request shape in `README.md`.

**Tech Stack:** Hugo templates, Hugo Pipes, vanilla JavaScript, Node built-in test runner, CSS, Markdown

---

### Task 1: Add a regression test for Google query composition

**Files:**
- Create: `tests/search-form.test.js`
- Create: `assets/js/search-form.js`

- [ ] **Step 1: Write the failing test**

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const { composeGoogleSiteQuery, normalizeSiteTarget } = require("../assets/js/search-form.js");

test("composeGoogleSiteQuery prefixes the configured site and trims the keyword", () => {
  assert.equal(composeGoogleSiteQuery("example.org", "  hugo   theme  "), "site:example.org hugo theme");
});

test("composeGoogleSiteQuery strips a user-provided leading site operator", () => {
  assert.equal(composeGoogleSiteQuery("example.org", "site:other.example search"), "site:example.org search");
});

test("composeGoogleSiteQuery keeps an empty search restricted to the configured site", () => {
  assert.equal(composeGoogleSiteQuery("example.org", "   "), "site:example.org");
});

test("normalizeSiteTarget collapses a raw baseURL fallback to the host portion", () => {
  assert.equal(normalizeSiteTarget("https://example.org/blog/"), "example.org");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/search-form.test.js`

Expected: FAIL because `assets/js/search-form.js` does not exist yet.

- [ ] **Step 3: Write minimal implementation**

```js
function composeGoogleSiteQuery(siteTarget, keyword) {
  const normalizedSiteTarget = normalizeSiteTarget(siteTarget);
  const normalizedKeyword = normalizeWhitespace(stripLeadingSiteOperator(keyword));

  if (!normalizedSiteTarget) {
    return normalizedKeyword;
  }

  if (!normalizedKeyword) {
    return "site:" + normalizedSiteTarget;
  }

  return "site:" + normalizedSiteTarget + " " + normalizedKeyword;
}
```

The finished file must also expose `normalizeSiteTarget`, bind submit handlers to `[data-search-form]`, and avoid reading from `window.location`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/search-form.test.js`

Expected: PASS with 4 passing tests.

### Task 2: Replace the homepage search partial and wire the new script

**Files:**
- Modify: `layouts/_partials/search.html`
- Modify: `layouts/home.html`
- Verify: `exampleSite/public/index.html`

- [ ] **Step 1: Record the required rendered HTML shape**

```html
<form class="home-search" action="https://www.google.com/search" method="get" data-search-form data-search-site="example.org">
  <input type="search" name="q" data-search-input />
</form>
```

- [ ] **Step 2: Build and confirm the current homepage output still reflects the incomplete implementation**

Run: `hugo --source exampleSite --themesDir ..\\.. --destination public`

Run: `rg -n "as_sitesearch|data-search-site|search-form\\.js|search-overlay" exampleSite/public/index.html`

Expected: Hugo build succeeds, the generated homepage still shows the intermediate `as_sitesearch` version, and no `search-form.js` asset is referenced yet.

- [ ] **Step 3: Render the form with theme-controlled site data and remove `as_sitesearch`**

```go-html-template
{{ $baseURL := strings.TrimSpace (printf "%v" site.BaseURL) }}
{{ $siteSearchTarget := $baseURL }}
{{ with urls.Parse $baseURL }}
  {{ with .Host }}
    {{ $siteSearchTarget = . }}
  {{ end }}
{{ end }}

<form class="home-search" action="https://www.google.com/search" method="get" data-search-form data-search-site="{{ $siteSearchTarget }}">
  <label class="search-input-wrap home-search-input-wrap">
    <span class="visually-hidden">Google 搜索本站</span>
    <input type="search" name="q" class="search-input home-search-input" data-search-input />
  </label>
</form>
```

- [ ] **Step 4: Load the lightweight submit-time script from the homepage template**

```go-html-template
{{ define "scripts" }}
  {{ $searchScript := resources.Get "js/search-form.js" | minify | fingerprint }}
  <script src="{{ $searchScript.RelPermalink }}" integrity="{{ $searchScript.Data.Integrity }}" defer></script>
{{ end }}
```

- [ ] **Step 5: Rebuild and confirm the homepage ships the correct search shape**

Run: `hugo --source exampleSite --themesDir ..\\.. --destination public`

Run: `rg -n "google.com/search|data-search-site|data-search-input|search-form|as_sitesearch|search-overlay" exampleSite/public/index.html`

Expected: The generated homepage contains the Google form, `data-search-site`, and the new script reference, while `as_sitesearch` and overlay markers are gone.

### Task 3: Keep the compact search styling and refresh the docs

**Files:**
- Modify: `assets/css/search.css`
- Modify: `README.md`
- Leave unreferenced: `assets/js/search-overlay.js`

- [ ] **Step 1: Keep only compact navigation-form CSS**

```css
.home-search {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
}
```

The stylesheet should style the inline form for desktop and small screens and should not reintroduce overlay-only selectors such as `.search-overlay`, `.search-panel`, `.search-close`, `.search-results`, or `body.search-open`.

- [ ] **Step 2: Rewrite the README search section to describe the actual request shape**

```md
首页导航内置了一个 Google 站点搜索表单。
主题会在提交时把关键词改写为 `site:<configured-host> <keyword>`。
站点限制值来自 Hugo 的 `baseURL`，不是浏览器当前地址。
```

- [ ] **Step 3: Run final verification**

Run: `node --test tests/search-form.test.js`

Run: `hugo --source exampleSite --themesDir ..\\.. --destination public`

Expected: Node tests pass, Hugo exits with code `0`, and there are no template or asset errors.
