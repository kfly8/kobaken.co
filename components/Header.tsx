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
          <a href={props.switchHref} hreflang={props.switchLang} lang={props.switchLang} aria-label={props.switchLabel} data-bf-router="false">
            {/* The name on wide screens, the two-letter code on a phone,
                where the nav has no room for "English". */}
            <span className="lang-name">{props.switchLabel}</span>
            <span className="lang-code">{props.switchLang === 'ja' ? 'JA' : 'EN'}</span>
          </a>
        ) : null}
        <ToggleTheme />
      </nav>
    </header>
  )
}
