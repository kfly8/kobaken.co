'use client'

import { ToggleTheme } from './ToggleTheme'
import type { LanguageMenu } from '../i18n'

interface HeaderProps {
  lang: string
  showLogo?: boolean
  active?: 'profile' | 'blog' | 'diary' | 'slides'
  menu: LanguageMenu
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
        {/* The language menu: a globe with the current language's code,
            which opens the list of languages, each in its own name, the
            current one marked. A page with no version in the other language
            lists it without a link. The link loads the page in full
            (data-bf-router="false"): <html lang> is outside the region the
            client router swaps, and would keep this page's language. */}
        <details className="lang-menu">
          <summary aria-label={props.menu.menuLabel} title={props.menu.menuLabel}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18" />
              <path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
            </svg>
            <span className="lang-code" aria-hidden="true">{props.menu.code}</span>
          </summary>
          <ul>
            <li>
              <span className="lang-option" aria-current="true">{props.menu.name}</span>
            </li>
            <li>
              {props.menu.otherHref ? (
                <a
                  className="lang-option"
                  href={props.menu.otherHref}
                  hreflang={props.menu.otherLang}
                  lang={props.menu.otherLang}
                  data-bf-router="false"
                >{props.menu.otherName}</a>
              ) : (
                <span className="lang-option" lang={props.menu.otherLang} aria-disabled="true" title={props.menu.notTranslated}>{props.menu.otherName}</span>
              )}
            </li>
          </ul>
        </details>
        <ToggleTheme />
      </nav>
    </header>
  )
}
