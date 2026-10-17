'use client'

import { ToggleTheme } from './ToggleTheme'

interface HeaderProps {
  lang: string
  showLogo?: boolean
  active?: 'profile' | 'blog' | 'diary' | 'slides'
  // The same page in the other language, when there is one.
  switchHref?: string
  switchLabel?: string
  switchLang?: string
}

export function Header(props: HeaderProps) {
  return (
    <header className="site-header">
      {props.showLogo === false ? null : (
        <a className="site-logo" href={`/${props.lang}`}>
          {/* data-bf-permanent: the region is fully rebuilt on every swap,
              which would otherwise recreate this <img> node every navigation
              — a visible flicker even though the file is cache-hot. This
              keeps the live node when the incoming page has one too. */}
          <img src="/static/img/kobaken.jpg" alt="" data-bf-permanent="site-logo-img" />
          <span>kobaken.co</span>
        </a>
      )}
      <nav className="site-nav">
        <a href={`/${props.lang}/profile`} aria-current={props.active === 'profile' ? 'page' : undefined}>Profile</a>
        <a href={`/${props.lang}/blog`} aria-current={props.active === 'blog' ? 'page' : undefined}>Blog</a>
        <a href={`/${props.lang}/diary`} aria-current={props.active === 'diary' ? 'page' : undefined}>Diary</a>
        <a href={`/${props.lang}/slides`} aria-current={props.active === 'slides' ? 'page' : undefined}>Slides</a>
        {/* data-bf-router="false": <html lang> is outside the region the
            client router swaps, so a page in the other language must load
            in full, or the document would keep this language's lang. */}
        {props.switchHref ? (
          <a
            href={props.switchHref}
            hreflang={props.switchLang}
            lang={props.switchLang}
            aria-label={props.switchLabel}
            title={props.switchLabel}
            className="lang-switch"
            data-bf-router="false"
          >
            {/* A globe, beside the theme toggle: the language it leads to is
                in the label and the tooltip. */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18" />
              <path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
            </svg>
          </a>
        ) : null}
        <ToggleTheme />
      </nav>
    </header>
  )
}
