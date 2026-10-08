import { Layout } from './Layout'
import { Profile } from './Profile'

export const Root = () => {
  return (
    <Layout className="home" showLogo={false}>
      <Profile />
      <nav className="home-ai-links" aria-label="Related sites">
        <a href="https://dot.kobaken.co/">dot<span className="sr-only"> (dot.kobaken.co)</span></a>
        <span aria-hidden="true">/</span>
        <a href="https://notes.kobaken.co/">Notes<span className="sr-only"> (notes.kobaken.co)</span></a>
      </nav>
    </Layout>
  )
}
