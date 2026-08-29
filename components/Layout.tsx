'use client'

import { Region } from '@barefootjs/client'
import { Header } from './Header'

interface LayoutProps {
  children?: unknown
  className?: string
  showLogo?: boolean
  active?: 'profile' | 'blog' | 'diary' | 'slides'
}

export function Layout(props: LayoutProps) {
  return (
    <Region>
      {/* Header lives inside the region (not in renderer.tsx's <body>) so
          that a per-page prop like showLogo gets re-evaluated on every
          Router navigation — anything outside the region is left alone
          by partial navigation and would keep stale props. */}
      <Header showLogo={props.showLogo} active={props.active} />
      <main className={props.className ? `page-layout ${props.className}` : 'page-layout'}>
        {props.children}
      </main>
    </Region>
  )
}
