import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { V1Glass } from '../../designs/v1-glass'
import { V2NeuDark } from '../../designs/v2-neu-dark'
import { V3Editorial } from '../../designs/v3-editorial'
import { V4Hairline } from '../../designs/v4-hairline'
import { V5Serif } from '../../designs/v5-serif'

const MAP: Record<string, () => React.JSX.Element> = {
  v1: V1Glass,
  v2: V2NeuDark,
  v3: V3Editorial,
  v4: V4Hairline,
  v5: V5Serif,
}

export const Route = createFileRoute('/designs/$variant')({
  loader: ({ params }) => {
    if (!MAP[params.variant]) throw notFound()
    return { variant: params.variant }
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.variant.toUpperCase()} preview — Adarsh Singh` }],
  }),
  component: Variant,
})

function Variant() {
  const { variant } = Route.useLoaderData()
  const Cmp = MAP[variant] ?? V3Editorial
  return (
    <div>
      <div className="sticky top-0 z-[60] border-b border-white/10 bg-black/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2.5 font-mono text-xs">
          <span className="text-zinc-400">Previewing <span className="text-white">{variant.toUpperCase()}</span> · dark-minimal set</span>
          <span className="flex gap-3">
            <Link to="/designs" className="text-zinc-400 hover:text-white">← All variants</Link>
            <Link to="/" className="text-[#d6fd51]">Production (V3) →</Link>
          </span>
        </div>
      </div>
      <main id="main">
        <Cmp />
      </main>
    </div>
  )
}
