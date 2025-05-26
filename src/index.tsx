import { Hono } from 'hono'
import { renderer } from './renderer'

import { Root } from './components/root'

const app = new Hono()

app.get('*', renderer)

app.get('/', (c) => {

  return c.render(
    <Root />,
    {
        title: 'kobaken',
        description: "I'm a software engineer and preparing to start my own business. Event organizer for YAPC::Tokyo 2019, YAPC::Japan::Online 2022, and YAPC::Hiroshima 2024."
    }
  )
})

export default app
