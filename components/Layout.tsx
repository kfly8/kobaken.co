'use client'

import { Region } from '@barefootjs/client'

interface LayoutProps {
  children?: unknown
  className?: string
}

export function Layout(props: LayoutProps) {
  return (
    <Region>
      <main className={props.className ? `page-layout ${props.className}` : 'page-layout'}>
        {props.children}
      </main>
    </Region>
  )
}
