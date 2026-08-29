'use client'

import { ToggleTheme } from './ToggleTheme'

interface HeaderProps {
  showLogo?: boolean
  active?: 'profile' | 'blog' | 'diary' | 'slides'
}

export function Header(props: HeaderProps) {
  return (
    <header className="site-header">
      {props.showLogo === false ? null : (
        <a className="site-logo" href="/">
          {/* data-bf-permanent: the region is fully rebuilt on every swap,
              which would otherwise recreate this <img> node every navigation
              — a visible flicker even though the file is cache-hot. This
              keeps the live node when the incoming page has one too. */}
          <img src="/static/img/kobaken.jpg" alt="" data-bf-permanent="site-logo-img" />
          <span>kobaken.co</span>
        </a>
      )}
      <nav className="site-nav">
        <a href="/profile" aria-current={props.active === 'profile' ? 'page' : undefined}>Profile</a>
        <a href="/blog" aria-current={props.active === 'blog' ? 'page' : undefined}>Blog</a>
        <a href="/diary" aria-current={props.active === 'diary' ? 'page' : undefined}>Diary</a>
        <a href="/slides" aria-current={props.active === 'slides' ? 'page' : undefined}>Slides</a>
        <ToggleTheme />
      </nav>
    </header>
  )
}
