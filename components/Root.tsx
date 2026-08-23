import { Layout } from './Layout'
import { Profile } from './Profile'

export const Root = () => {
  return (
    <Layout className="home" showLogo={false}>
      <Profile />
    </Layout>
  )
}

