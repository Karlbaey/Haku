# Google Site Search Design

## Summary

Replace the current homepage `pagefind` search overlay with a lightweight search form that submits Google queries in `site:example.com keyword` form, with the site restriction derived from Hugo configuration.

## Goals

- Keep a search entry in the homepage navigation.
- Let users type a keyword before leaving the site.
- Use Google search results instead of local `pagefind` indexing.
- Derive the target site from Hugo configuration without adding a new theme parameter.
- Encode the site restriction directly inside the submitted `q` value instead of using a separate Google parameter.
- Remove the now-unused homepage search overlay script path.

## Non-Goals

- Adding a dedicated in-site search results page.
- Expanding the search UI to pages beyond the current homepage navigation.
- Keeping `pagefind` as a fallback or secondary search provider.
- Adding JavaScript-driven autocomplete, suggestions, or overlay behavior.

## Current State

- The homepage navigation renders `layouts/_partials/search.html`.
- That partial already renders an inline Google search form.
- The current form submits the user keyword as `q` and the site restriction separately as `as_sitesearch`.
- The site restriction is already derived from Hugo configuration via `site.BaseURL`, not from the browser location.
- The homepage bundle includes `assets/css/search.css` for the compact navigation search form.
- The README already documents Google-based search, but it still describes the old `as_sitesearch`-style request shape rather than the desired `site:` syntax.

## Proposed Behavior

### User Experience

- The homepage navigation keeps a search affordance in roughly the same location.
- Instead of opening an overlay, the UI shows a small inline search form in the navigation.
- Users enter a keyword and submit the form with Enter or a submit button.
- Submission opens Google search results for the keyword, restricted to the current site.
- The outgoing query format is `site:<configured-host> <keyword>`.

### Search Request Shape

- The form submits a `GET` request to `https://www.google.com/search`.
- The outgoing request uses a single `q` parameter.
- Before submission, the theme rewrites the outgoing `q` value to `site:<configured-host> <keyword>`.
- The configured host is derived from `site.BaseURL` and reduced to the host portion so Google receives a clean site restriction.
- The site restriction source is Hugo configuration only; the browser address bar is never used to infer the host.

## Template Changes

### `layouts/_partials/search.html`

- Replace the `home-search` custom element markup with a standard HTML `<form>`.
- Keep the inline form structure, but remove the hidden `as_sitesearch` field.
- Keep the visible input as a plain keyword field so users do not need to type `site:` themselves.
- Preserve the existing visual language as much as practical by reusing the current search class names where they still fit.
- Render the configured host into the form as theme-controlled data so submit-time logic can build the final `q` string.

### Host Derivation

- Use Hugo template functions to derive the host from `site.BaseURL`.
- The derived value is exposed to submit-time logic, not read from `window.location`.
- If host extraction fails unexpectedly, the partial should fall back to the raw `site.BaseURL` string rather than rendering an empty site restriction.

### Query Composition

- The visible input remains a plain keyword field for the user.
- On submit, the theme composes the final Google query as `site:<configured-host> <trimmed-keyword>`.
- If the user submits an empty value, the theme still submits `site:<configured-host>` so Google stays restricted to the configured site.
- If the typed value already starts with a `site:` operator, the theme should strip that leading operator before prepending its own configured-site prefix. This keeps the Hugo configuration authoritative and avoids duplicate `site:` clauses.

## Asset Changes

### `assets/css/search.css`

- Keep styles required for the compact navigation search form.
- Ensure the form works on both desktop and small screens within the existing homepage header layout.

### `assets/js/search-form.js`

- Add a small homepage script dedicated to submit-time query rewriting.
- The script should read the configured host from rendered form data, not from `window.location`.
- The script should transform the outgoing request into a single `q=site:<host> <keyword>` parameter before the browser leaves the page.

### `assets/js/search-overlay.js`

- Stop loading this script from the homepage template.
- Leave file deletion as an implementation choice; the important requirement is that the theme no longer references it.

### `layouts/home.html`

- Keep the existing CSS bundle entry because `search.css` still owns the navigation search form styles.
- Load the lightweight `search-form.js` script for submit-time query rewriting.

## Documentation Changes

### `README.md`

- Keep the Google site search documentation.
- Update the search section so it describes the actual request shape as `site:<configured-host> <keyword>`.
- State explicitly that the site part comes from Hugo `baseURL`, not from the browser's current address.

## Error Handling and Edge Cases

- Empty search submissions should still submit a site-restricted Google query for the configured host.
- Host derivation should avoid including a trailing slash or path segment in the generated `site:` operator.
- The search UI should remain usable if CSS fails to load.
- If the submit-time script fails to run, the request may degrade to a plain Google keyword search; this is acceptable as a failure mode, but the normal path must produce the `site:`-prefixed query.

## Testing and Verification

### Manual Verification

- Build the example site with:
  - `hugo --source exampleSite --themesDir ..\\.. --destination public`
- Open the generated homepage and confirm:
  - a search form appears in the homepage navigation
  - submitting a keyword sends the browser to Google
  - the outgoing request includes a single `q=site:<site-host> <keyword>` parameter
  - no `as_sitesearch` parameter is sent
- Confirm there are no Hugo template errors or broken asset references in the build output.

### Regression Focus

- Confirm the homepage still renders its navigation and header layout correctly.
- Confirm the new submission script uses the configured host rather than the browser location.
- Confirm README instructions match the shipped request shape.

## Implementation Notes

- This is a behavior change, not a new subsystem.
- The smallest correct implementation is preferred over preserving the old search architecture.
- The change should stay limited to homepage search UI, related styling, and matching documentation.
