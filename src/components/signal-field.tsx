export function SignalField() {
  return (
    <div
      className="signal-field"
      role="img"
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
      <div className="signal-node signal-node-product">
        <span>01</span>
        <strong>Product</strong>
        <small>intent</small>
      </div>
      <div className="signal-node signal-node-api">
        <span>02</span>
        <strong>APIs</strong>
        <small>contracts</small>
      </div>
      <div className="signal-node signal-node-data">
        <span>03</span>
        <strong>Data</strong>
        <small>evidence</small>
      </div>
      <div className="signal-node signal-node-team">
        <span>04</span>
        <strong>Teams</strong>
        <small>ownership</small>
      </div>
      <div className="signal-field-center" aria-hidden="true">
        <i />
      </div>
      <div className="signal-field-footer">
        <span>built to keep working</span>
        <span>01—04</span>
      </div>
    </div>
  )
}
