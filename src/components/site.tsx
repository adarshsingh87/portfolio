import { Link } from '@tanstack/react-router'
import { SITE } from '../data/site'
import { GitHubIcon, LinkedInIcon, XIcon } from './icons'

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0b]/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Adarsh Singh home">
          <span
            aria-hidden
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#d6fd51] text-[13px] font-extrabold text-black"
          >
            A
          </span>
          <span className="text-sm font-semibold tracking-tight text-zinc-100">
            Adarsh Singh
            <span className="ml-2 hidden font-mono text-[11px] font-normal text-zinc-500 sm:inline">
              cto / engineer
            </span>
          </span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1">
          <a href="/#work" className="hidden rounded-md px-2.5 py-1.5 text-[13px] text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100 sm:inline-block">
            Work
          </a>
          <a href="/#experience" className="hidden rounded-md px-2.5 py-1.5 text-[13px] text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100 sm:inline-block">
            Experience
          </a>
          <a href="/#stack" className="hidden rounded-md px-2.5 py-1.5 text-[13px] text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100 sm:inline-block">
            Stack
          </a>
          <Link
            to="/blog"
            className="rounded-md px-2.5 py-1.5 text-[13px] text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100"
          >
            Blog
          </Link>
          <a href="/#contact" className="hidden rounded-md px-2.5 py-1.5 text-[13px] text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100 sm:inline-block">
            Contact
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="ml-1 rounded-full bg-zinc-100 px-3.5 py-1.5 text-[13px] font-semibold text-black transition-colors hover:bg-[#d6fd51]"
          >
            Email me
          </a>
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-200">Adarsh Singh</p>
          <p className="mt-1 text-[13px] text-zinc-500">
            CTO at{' '}
            <a href={SITE.companyUrl} className="underline underline-offset-4 hover:text-zinc-300">
              SmokeTrees Digital
            </a>{' '}
            · {SITE.education}
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
          <a href={SITE.github} className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-100">
            <GitHubIcon size={15} /> GitHub
          </a>
          <a href={SITE.linkedin} className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-100">
            <LinkedInIcon size={15} /> LinkedIn
          </a>
          <a href={SITE.twitter} className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-100">
            <XIcon size={14} /> X / Twitter
          </a>
          <a href={`mailto:${SITE.email}`} className="text-zinc-400 hover:text-zinc-100">{SITE.email}</a>
        </nav>
      </div>
    </footer>
  )
}

export function SectionHead(props: { index: string; title: string; note?: string }) {
  return (
    <div className="mb-8 flex items-baseline justify-between gap-6">
      <h2 className="flex items-baseline gap-3 text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">
        <span className="font-mono text-xs font-medium text-[#d6fd51]">{props.index}</span>
        {props.title}
      </h2>
      {props.note ? <p className="hidden max-w-xs text-right text-[13px] leading-relaxed text-zinc-500 sm:block">{props.note}</p> : null}
    </div>
  )
}
