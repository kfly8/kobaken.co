import { css } from 'hono/css'

import { Tagline } from './tagline'
import { Activities } from './activities'
import { Profile } from './profile'


export const Root = () => {

  return (
    <>
      <Tagline />
      <div className={css` margin: 0 auto; max-width: 800px; padding: 0 20px;`}>
        <Profile />
        <Activities />
      </div>
    </>
  )
}

