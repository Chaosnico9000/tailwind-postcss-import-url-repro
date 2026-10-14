# `@tailwindcss/postcss` + Vite: relative `url()` from an `@import`ed stylesheet is not resolved in production builds

Minimal reproduction. The app imports a stylesheet from a package
(`example-font`, a local `file:` dependency) in its Tailwind entry CSS. That
stylesheet references its font with a relative URL:

```css
/* example-font/fonts.css */
@font-face {
  font-family: "Example Sans";
  src: url("./fonts/ExampleSans.woff2") format("woff2");
}
```

```css
/* src/index.css */
@import "tailwindcss";
@import "example-font/fonts.css";
```

Tailwind runs through `@tailwindcss/postcss` (`postcss.config.mjs`).
`vite.config.mjs` only sets `build.assetsInlineLimit: 0`, so the tiny test font
is emitted as a file instead of being inlined as a `data:` URL. The bug is the
same without it.

Versions are pinned in `package.json`: `tailwindcss` and `@tailwindcss/postcss`
4.3.3, Vite 8.3.4.

## Steps

```sh
npm install
npm run build
```

### Actual

Vite warns:

```text
./fonts/ExampleSans.woff2 referenced in ./fonts/ExampleSans.woff2 didn't resolve at build time, it will remain unchanged to be resolved at runtime
```

`dist/assets/` contains no font, and the built CSS keeps
`url(./fonts/ExampleSans.woff2)`, which 404s in the browser.

### Expected

The font is emitted to `dist/assets/` and the URL rewritten, e.g.
`url(/assets/ExampleSans-<hash>.woff2)`.

## Controls (all of these work)

| Command | Difference | Result |
| --- | --- | --- |
| `npm run dev`, then open `/src/index.css?direct` | dev server | URL rewritten, font served |
| `npm run build:no-optimize` | `@tailwindcss/postcss` with `optimize: false` | font emitted, URL rewritten |
| `NODE_ENV=development npx vite build` | `optimize` defaults to off | font emitted, URL rewritten |
| `npm run build:tailwind-vite` | `@tailwindcss/vite` instead of `@tailwindcss/postcss` | font emitted, URL rewritten |

`transformAssetUrls: false` does not change the result.

The same happens with `bun install` / `bun run build`, and with a plain
relative import of a stylesheet in a subdirectory (`@import "./fonts/local.css"`
with `url("./ExampleSans.woff2")` next to it), so it is not specific to packages.
