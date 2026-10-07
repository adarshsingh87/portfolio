import { useState } from 'react'

// The backend kit as a stack of glass planes. The planes separate as the
// diagram scrolls into view (CSS scroll timeline, static where unsupported).

const LAYERS = [
  {
    name: 'node-template-ts',
    terms: ['generate.sh', 'Result', 'AGENTS.md'],
    body: 'Where a new service starts. One script scaffolds an entity, every function returns a Result, and AGENTS.md tells coding agents where to stop.',
  },
  {
    name: 'smoke-context',
    terms: ['context', 'log'],
    body: 'Request-scoped context on top of AsyncLocalStorage. A request ID follows every await, so a log line ten calls deep still knows which request it belongs to.',
  },
  {
    name: 'postgres-backend',
    terms: ['BaseEntity', 'Dao', 'Service', 'ServiceController'],
    body: 'Abstract classes for the CRUD layer. Read, list, create, update, and delete come written. Swagger docs come from decorators on the controllers.',
  },
  {
    name: 'Express, TypeORM, PostgreSQL',
    terms: ['Inversify', 'Mocha'],
    body: 'The parts we did not write and do not want to re-choose for every project. Tests run against a real Postgres, not a mock of one.',
  },
]

export function LayersArtifact() {
  const [active, setActive] = useState(0)

  return (
    <div className="layers">
      <div className="layers-scene" aria-hidden="true">
        <div className="layers-stack">
          {LAYERS.map((layer, i) => (
            <div
              key={layer.name}
              className="layer"
              data-active={active === i}
              style={{ '--i': LAYERS.length - 1 - i } as React.CSSProperties}
            >
              <span className="layer-name">{layer.name}</span>
              <span className="layer-terms">
                {layer.terms.map((t) => (
                  <i key={t}>{t}</i>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>

      <ol className="layers-key">
        {LAYERS.map((layer, i) => (
          <li key={layer.name}>
            <button
              type="button"
              aria-pressed={active === i}
              onClick={() => setActive(i)}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="layers-key-name">{layer.name}</span>
              <span className="layers-key-body">{layer.body}</span>
            </button>
          </li>
        ))}
      </ol>

      <pre className="terminal" aria-label="Scaffolding an entity">
        <code>
          <span className="terminal-prompt">$ ./generate.sh Invoice</span>
          {'\n'}
          <span>{'  '}src/app/Invoice/IInvoice.ts</span>
          {'\n'}
          <span>{'  '}src/app/Invoice/Invoice.entity.ts</span>
          {'\n'}
          <span>{'  '}src/app/Invoice/Invoice.dao.ts</span>
          {'\n'}
          <span>{'  '}src/app/Invoice/Invoice.service.ts</span>
          {'\n'}
          <span>{'  '}src/app/Invoice/Invoice.controller.ts</span>
          {'\n'}
          <span className="terminal-note">
            {'  '}registered in database.ts and setup.ts
          </span>
        </code>
      </pre>
    </div>
  )
}
