export function SignalField() {
  return (
    <div
      className="orbital-stage"
      role="img"
      aria-label="An orbital systems instrument showing architecture, delivery, and operations"
    >
      <div className="orbital-noise" aria-hidden="true" />
      <div className="orbital-topline">
        <span>Signal / 001</span>
        <span>Live system study</span>
      </div>
      <div className="orbital-object" aria-hidden="true">
        <div className="orbital-shadow" />
        <div className="orbital-ring orbital-ring-outer" />
        <div className="orbital-ring orbital-ring-mid" />
        <div className="orbital-ring orbital-ring-inner" />
        <div className="orbital-axis orbital-axis-x" />
        <div className="orbital-axis orbital-axis-y" />
        <div className="orbital-core">
          <span>01 / 03</span>
          <strong>make</strong>
          <em>it real</em>
        </div>
        <div className="orbital-node orbital-node-top">
          <span>architecture</span>
          <strong>model</strong>
        </div>
        <div className="orbital-node orbital-node-right">
          <span>operations</span>
          <strong>3Cr+ / day</strong>
        </div>
        <div className="orbital-node orbital-node-bottom">
          <span>delivery</span>
          <strong>50–60% less manual work</strong>
        </div>
      </div>
      <div className="orbital-bottomline">
        <span>systems that stay</span>
        <span>01—∞</span>
      </div>
    </div>
  )
}
