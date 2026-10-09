import { createCssVariablesTheme, createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import type { HighlighterCore } from 'shiki/core'

// Syntax highlighting for code blocks in posts. Runs on the server only:
// blog.ts loads this module when it renders a post, never for index pages.
//
// The JavaScript regex engine avoids loading WASM, which Cloudflare Workers
// will not compile at runtime. Only the languages below are bundled; a fence
// in any other language falls back to plain text.

// Colours are CSS variables (--code-*, set in styles/blog.css), so code
// follows the site's signals, and a dropped wallpaper, like everything else.
export const CODE_THEME = 'signals'

const theme = createCssVariablesTheme({
  name: CODE_THEME,
  variablePrefix: '--code-',
  fontStyle: true,
})

let highlighter: Promise<HighlighterCore> | undefined

export function getHighlighter() {
  highlighter ??= createHighlighterCore({
    themes: [theme],
    langs: [
      import('shiki/langs/typescript.mjs'),
      import('shiki/langs/tsx.mjs'),
      import('shiki/langs/javascript.mjs'),
      import('shiki/langs/json.mjs'),
      import('shiki/langs/go.mjs'),
      import('shiki/langs/sql.mjs'),
      import('shiki/langs/shellscript.mjs'),
      import('shiki/langs/yaml.mjs'),
      import('shiki/langs/diff.mjs'),
      import('shiki/langs/markdown.mjs'),
    ],
    engine: createJavaScriptRegexEngine(),
  })
  return highlighter
}
