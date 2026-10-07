import { Layout } from './Layout'
import { Profile } from './Profile'

export const Root = () => {
  return (
    <Layout className="home" showLogo={false}>
      <Profile />
      <nav className="home-ai-links" aria-labelledby="home-ai-label">
        <p id="home-ai-label">AI-written articles</p>
        <div>
          <a href="https://dot.kobaken.co/">dot <span aria-hidden="true">↗</span><span className="sr-only"> (dot.kobaken.co)</span></a>
          <a href="https://notes.kobaken.co/">Notes <span aria-hidden="true">↗</span><span className="sr-only"> (notes.kobaken.co)</span></a>
        </div>
      </nav>
    </Layout>
  )
}
