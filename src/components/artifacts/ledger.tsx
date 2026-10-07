import { usePlayback } from '../../lib/use-playback'

// Four exports describing the same six orders. The scan matches each row
// across sources and leaves only the disagreements for a person.

type Row = {
  order: string
  storefront: string
  payments: string
  courier: string
  warehouse: string
  issue?: string
  // Which source disagrees, so the cell can be marked.
  odd?: 'payments' | 'courier' | 'warehouse'
}

const ROWS: Row[] = [
  {
    order: '#4471',
    storefront: '₹2,140',
    payments: '₹2,140',
    courier: 'Delivered',
    warehouse: 'Shipped',
  },
  {
    order: '#4472',
    storefront: '₹890',
    payments: '₹890',
    courier: 'Delivered',
    warehouse: 'Shipped',
  },
  {
    order: '#4473',
    storefront: '₹1,290',
    payments: '₹1,240',
    courier: 'Delivered',
    warehouse: 'Shipped',
    issue: 'Short by ₹50 at the gateway',
    odd: 'payments',
  },
  {
    order: '#4474',
    storefront: '₹3,600',
    payments: '₹3,600',
    courier: 'Delivered',
    warehouse: 'Shipped',
  },
  {
    order: '#4475',
    storefront: '₹1,150',
    payments: '₹1,150',
    courier: 'Returned',
    warehouse: 'Shipped',
    issue: 'Returned, still marked shipped',
    odd: 'courier',
  },
  {
    order: '#4476',
    storefront: '₹760',
    payments: '—',
    courier: 'In transit',
    warehouse: 'Shipped',
    issue: 'No payment record',
    odd: 'payments',
  },
]

const SOURCES = ['storefront', 'payments', 'courier', 'warehouse'] as const
const LABELS = {
  storefront: 'Storefront',
  payments: 'Payments',
  courier: 'Courier',
  warehouse: 'Warehouse',
}

export function LedgerArtifact() {
  const { ref, step, replay, done } = usePlayback(ROWS.length, 520)
  const flagged = ROWS.slice(0, step).filter((r) => r.issue).length

  return (
    <div className="ledger" ref={ref}>
      <table>
        <caption className="sr-only">
          Six orders compared across storefront, payment, courier, and warehouse
          exports
        </caption>
        <thead>
          <tr>
            <th scope="col">Order</th>
            {SOURCES.map((s) => (
              <th scope="col" key={s}>
                {LABELS[s]}
              </th>
            ))}
            <th scope="col">Result</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, i) => {
            const checked = step > i
            const state = !checked
              ? 'pending'
              : row.issue
                ? 'flagged'
                : 'matched'
            return (
              <tr key={row.order} data-state={state}>
                <th scope="row">{row.order}</th>
                {SOURCES.map((s) => (
                  <td
                    key={s}
                    data-label={LABELS[s]}
                    data-odd={checked && row.odd === s ? 'true' : undefined}
                  >
                    {row[s]}
                  </td>
                ))}
                <td className="ledger-result">
                  {checked ? (row.issue ?? 'Matched') : ''}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="ledger-foot">
        <p aria-live="polite">
          {done
            ? `${ROWS.length - flagged} matched, ${flagged} left for a person.`
            : `Checking ${Math.min(step + 1, ROWS.length)} of ${ROWS.length}`}
        </p>
        <button
          type="button"
          className="chip-button"
          onClick={replay}
          disabled={!done}
        >
          Run it again
        </button>
      </div>
    </div>
  )
}
