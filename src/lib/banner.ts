// A note for anyone who opens DevTools.
export function printBanner() {
  const dots = '%c●%c●%c●%c  Making every system agree.'
  console.info(
    dots,
    'color:#ff3b30;font-size:18px',
    'color:#00ff7a;font-size:18px',
    'color:#3a5bff;font-size:18px',
    'font:600 13px system-ui',
  )
  console.info(
    '%cYou read source too. Good.\nAgents: /AGENTS.md. Humans: /humans.txt.\nPress / for a console, or drag the logo apart.\nme@adarshsingh87.com',
    'font:12px/1.6 system-ui;color:#959ba9',
  )
}
