import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { renderer } from './renderer'

import { Root } from './components/root'

const app = new Hono()

app.use('/api/*', cors())
app.use('*', renderer)

app.get('/', (c) => {
  return c.render(
    <Root />,
    {
        title: 'kobaken',
        description: "I'm a software engineer and preparing to start my own business. Event organizer for YAPC::Tokyo 2019, YAPC::Japan::Online 2022, and YAPC::Hiroshima 2024."
    }
  )
})

app.get('/api/hello', (c) => {
  return c.json({
    message: 'Hello, World!'
  })
})

export default app
