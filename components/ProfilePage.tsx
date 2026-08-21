import { css } from 'hono/css'

import { Activities } from './activities'

export function ProfilePage() {
  return (
    <div className={css` margin: 0 auto; max-width: 800px; padding: 0 20px;`}>
      <Activities />
    </div>
  )
}
