# Recipe import: known site compatibility

`POST /api/recipes/import-from-url` works by fetching a page's raw HTML
and reading a `<script type="application/ld+json">` tag containing a
[schema.org Recipe](https://schema.org/Recipe) object — structured data
many recipe sites embed for search engines. It does **not** run
JavaScript, so it only sees whatever the server sends back directly.

This list is a snapshot from real testing on 2026-08-28, not a
guarantee — sites change their pages over time.

## Confirmed working

- [Budget Bytes](https://www.budgetbytes.com/)
- [Cookie and Kate](https://cookieandkate.com/)
- [King Arthur Baking](https://www.kingarthurbaking.com/) — confirmed through the actual app UI, not just `curl`

## Confirmed not working, and why

| Site | Reason |
|---|---|
| Allrecipes | No JSON-LD in the raw HTML — recipe data is added by JavaScript after the page loads, which a plain server-side fetch never runs |
| Food Network, Bon Appétit, Epicurious, Food.com, Pioneer Woman, Smitten Kitchen, Damn Delicious | Same as Allrecipes — no JSON-LD in the raw HTML |
| Skinnytaste, Half Baked Harvest, Minimalist Baker, The Kitchn | JSON-LD *is* present, but only for `WebSite`/`Organization` info (or, for The Kitchn, just `WebPage`) — no `Recipe` type in it at all. Their actual recipe data comes from some other mechanism on the page, not yet investigated. **Correction:** an earlier version of this doc listed Minimalist Baker and The Kitchn as "not yet tested" under Confirmed working — that was based only on checking that a `application/ld+json` tag existed, not that it actually contained recipe data. Running them through the real importer showed it doesn't. |

## Known parsing limitations (on sites that otherwise work)

- Ingredient quantity ranges ("½ to ⅔ cup") aren't handled — only the
  first number is read.
- A parenthetical note in the *middle* of an ingredient line (not at the
  very end) isn't stripped, only a trailing one.
- Fraction quantities are recognized as Unicode glyphs (`¼`), plain text
  (`"1/4"`), or HTML entities (`&frac14;`) — but only for `¼`, `½`, `¾`,
  and `⅛`. Any other fraction (thirds, fifths, ...) falls through to
  `parseFloat` and comes out `NaN`.
- Mixed numbers like `"1½"` (a whole number glued directly to a
  fraction glyph, no space) come out as just `1` — `parseFloat` reads
  the leading digit and stops at the first non-numeric character.
