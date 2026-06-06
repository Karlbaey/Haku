# Google Site Search Design

## Summary

Replace the current homepage `pagefind` search overlay with a lightweight search form that submits user queries to Google and limits results to the current site.

## Goals

- Keep a search entry in the homepage navigation.
- Let users type a keyword before leaving the site.
- Use Google search results instead of local `pagefind` indexing.
- Derive the target site from Hugo configuration without adding a new theme parameter.
- Remove the now-unused homepage search overlay script path.

## Non-Goals

- Adding a dedicated in-site search results page.
- Expanding the search UI to pages beyond the current homepage navigation.
- Keeping `pagefind` as a fallback or secondary search provider.
- Adding JavaScript-driven autocomplete, suggestions, or overlay behavior.

## Current State

- The homepage navigation renders `layouts/_partials/search.html`.
- That partial currently mounts a `home-search` custom element and an overlay UI.
- The homepage loads `assets/js/search-overlay.js`.
- The homepage bundle includes `assets/css/search.css`, which contains both trigger styles and overlay/result styles.
- The README documents `pagefind` as the theme search solution.

## Proposed Behavior

### User Experience

- The homepage navigation keeps a search affordance in roughly the same location.
- Instead of opening an overlay, the UI shows a small inline search form in the navigation.
- Users enter a keyword and submit the form with Enter or a submit button.
- Submission opens Google search results for the keyword, restricted to the current site.

### Search Request Shape

- The form submits a `GET` request to `https://www.google.com/search`.
- The visible input uses the `q` parameter for the keyword.
- A hidden input uses the `as_sitesearch` parameter to limit results to the current site host.
- The hidden site value is derived from `site.BaseURL` and reduced to the host portion so Google receives a clean site restriction.

## Template Changes

### `layouts/_partials/search.html`

- Replace the `home-search` custom element markup with a standard HTML `<form>`.
- Remove overlay-specific attributes and elements such as:
  - trigger-only button wiring
  - overlay container
  - dialog header
  - status text
  - result list
- Keep the form self-contained so it can render without JavaScript.
- Preserve the existing visual language as much as practical by reusing the current search class names where they still fit.

### Host Derivation

- Use Hugo template functions to derive the host from `site.BaseURL`.
- The derived value is written into the hidden `as_sitesearch` field.
- If host extraction fails unexpectedly, the partial should fall back to the raw `site.BaseURL` string rather than rendering an empty site restriction.

## Asset Changes

### `assets/css/search.css`

- Keep styles required for the compact navigation search form.
- Remove styles that exist only for the overlay implementation:
  - full-screen overlay container
  - modal panel
  - close button behavior
  - search status text
  - result list and result cards
  - body lock state for open overlay
- Ensure the form works on both desktop and small screens within the existing homepage header layout.

### `assets/js/search-overlay.js`

- Stop loading this script from the homepage template.
- Leave file deletion as an implementation choice; the important requirement is that the theme no longer references it.

### `layouts/home.html`

- Remove the script include for `search-overlay.js`.
- Keep the existing CSS bundle entry if `search.css` still owns the navigation search form styles after cleanup.

## Documentation Changes

### `README.md`

- Update the feature list and search documentation to describe Google site search instead of `pagefind`.
- Remove instructions that claim search requires `pagefind` for the theme to function.
- Keep unrelated `pagefind` references only if they still serve another documented feature; otherwise remove them to avoid misleading setup steps.

## Error Handling and Edge Cases

- Empty search submissions should still follow native browser behavior; no custom validation is required.
- The form must not depend on JavaScript, so failure modes are limited to Google handling the request.
- Host derivation should avoid including a trailing slash or path segment in `as_sitesearch`.
- The search UI should remain usable if CSS fails to load.

## Testing and Verification

### Manual Verification

- Build the example site with:
  - `hugo --source exampleSite --themesDir ..\\.. --destination public`
- Open the generated homepage and confirm:
  - a search form appears in the homepage navigation
  - submitting a keyword sends the browser to Google
  - the outgoing request includes `q=<keyword>`
  - the outgoing request includes `as_sitesearch=<site-host>`
- Confirm there are no Hugo template errors or broken asset references in the build output.

### Regression Focus

- Confirm the homepage still renders its navigation and header layout correctly.
- Confirm removing the overlay script does not leave broken markup hooks or dead controls.
- Confirm README instructions no longer describe a search setup path that the theme does not use.

## Implementation Notes

- This is a behavior change, not a new subsystem.
- The smallest correct implementation is preferred over preserving the old search architecture.
- The change should stay limited to homepage search UI, related styling, and matching documentation.
