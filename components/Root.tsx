import { Layout } from './Layout'
import { Profile } from './Profile'

export const Root = () => {
  return (
    <Layout className="home" showLogo={false}>
      <Profile />
      <nav className="home-ai-links" aria-label="Related sites">
        <svg className="home-ai-robot" viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="16" cy="16" r="16" fill="currentColor" opacity="0.06" />
          <g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="13" width="14" height="10" rx="2.5" />
            <path d="M16 10v3" />
            <circle cx="16" cy="8.5" r="1.5" />
          </g>
          <circle cx="13" cy="17.5" r="1" fill="currentColor" />
          <circle cx="19" cy="17.5" r="1" fill="currentColor" />
        </svg>
        <a href="https://dot.kobaken.co/">Dot<span className="sr-only"> (dot.kobaken.co)</span></a>
        <span aria-hidden="true">/</span>
        <a href="https://notes.kobaken.co/">Notes<span className="sr-only"> (notes.kobaken.co)</span></a>
      </nav>
    </Layout>
  )
}
