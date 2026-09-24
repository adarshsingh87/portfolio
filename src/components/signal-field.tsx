import { useEffect, useState } from 'react'

type SignalNodeName = 'Product' | 'APIs' | 'Data' | 'Teams'

type SignalNode = {
  name: SignalNodeName
  index: string
  detail: string
  className: string
}

const NODES: SignalNode[] = [
  {
    name: 'Product',
    index: '01',
    detail: 'intent',
    className: 'signal-node-product',
  },
  {
    name: 'APIs',
    index: '02',
    detail: 'contracts',
    className: 'signal-node-api',
  },
  {
    name: 'Data',
    index: '03',
    detail: 'evidence',
    className: 'signal-node-data',
  },
  {
    name: 'Teams',
    index: '04',
    detail: 'ownership',
    className: 'signal-node-team',
  },
]

function SignalNodeButton({
  node,
  selected,
  onSelect,
  onHover,
}: {
  node: SignalNode
  selected: boolean
  onSelect: () => void
  onHover: (hovering: boolean) => void
}) {
  return (
    <button
      type="button"
      className={`signal-node ${node.className} ${selected ? 'signal-node-selected' : ''}`}
      aria-pressed={selected}
      data-cursor="Inspect"
      onClick={onSelect}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
    >
      <span>{node.index}</span>
      <strong>{node.name}</strong>
      <small>{node.detail}</small>
    </button>
  )
}

export function SignalField() {
  const [selectedNode, setSelectedNode] = useState<SignalNodeName | null>(null)
  const [hoveredNode, setHoveredNode] = useState<SignalNodeName | null>(null)
  const [incidentState, setIncidentState] = useState<
    'quiet' | 'warning' | 'acknowledged'
  >('quiet')

  useEffect(() => {
    if (!hoveredNode) return
    const timer = window.setTimeout(() => setIncidentState('warning'), 5000)
    return () => window.clearTimeout(timer)
  }, [hoveredNode])

  const selected = NODES.find((node) => node.name === selectedNode)

  return (
    <div
      className="signal-field"
      role="group"
      aria-label="A technical map showing product intent moving through APIs, data, infrastructure, and teams"
    >
      <div className="signal-field-header">
        <span>system map / 01</span>
        <span>adarshsingh87.com</span>
      </div>
      <div className="signal-field-grid" aria-hidden="true" />
      <div className="signal-route" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      {NODES.map((node) => (
        <SignalNodeButton
          key={node.name}
          node={node}
          selected={selectedNode === node.name}
          onSelect={() => setSelectedNode(node.name)}
          onHover={(hovering) => {
            if (hovering) setHoveredNode(node.name)
            else if (hoveredNode === node.name) setHoveredNode(null)
          }}
        />
      ))}
      <div className="signal-field-center" aria-hidden="true">
        <i />
      </div>
      <div className="signal-inspector" aria-live="polite">
        {selected ? (
          <>
            <div className="signal-inspector-head">
              <span>inspect / {selected.index}</span>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                aria-label={`Close ${selected.name} inspection`}
              >
                close
              </button>
            </div>
            <strong>{selected.name}</strong>
            <p>{selected.detail} / mapped and owned</p>
          </>
        ) : (
          <span>select a node to inspect</span>
        )}
      </div>
      {incidentState !== 'quiet' ? (
        <button
          type="button"
          className={`signal-incident ${incidentState === 'acknowledged' ? 'signal-incident-acknowledged' : ''}`}
          onClick={() => setIncidentState('acknowledged')}
          aria-live="polite"
        >
          <span className="signal-incident-mark">!</span>
          <span>
            {incidentState === 'warning'
              ? `warning: someone has been hovering over ${hoveredNode?.toLowerCase() ?? 'a node'} for 30 seconds`
              : 'node is now emotionally attached to the user'}
          </span>
        </button>
      ) : null}
      <div className="signal-field-footer">
        <span>built to keep working</span>
        <span>01—04</span>
      </div>
    </div>
  )
}
