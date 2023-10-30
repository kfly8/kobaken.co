import { Hono } from 'hono'
import { renderer } from './renderer'

const app = new Hono()

app.get('*', renderer)

app.get('/', (c) => {
  return c.render(
    <>
      <h1>kobaken a.k.a @kfly8</h1>
    </>,
    {
        title: 'kobaken'
    }
  )
})

export default app
