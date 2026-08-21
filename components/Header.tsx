import { ToggleTheme } from './toggle-theme'

interface HeaderProps {
  showLogo?: boolean
}

export function Header(props: HeaderProps) {
  return (
    <header className="site-header">
      {props.showLogo === false ? null : (
        <a className="site-logo" href="/">
          <img src="/static/img/kobaken.jpg" alt="" />
          <span>kobaken.co</span>
        </a>
      )}
      <nav className="site-nav">
        <a href="/profile">Profile</a>
        <a href="/blog">Blog</a>
        <a href="/slides">Slides</a>
        <ToggleTheme />
      </nav>
    </header>
  )
}
