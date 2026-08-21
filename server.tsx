import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { renderer } from './renderer'
import { blog } from './blog/server'

import { Root } from '@/components/root'
import { SlidesIndex } from '@/components/SlidesIndex'

const app = new Hono()

app.use('/api/*', cors())
app.route('/blog', blog)
app.use('*', renderer)

app.get('/', (c) => {
  return c.render(
    <Root />,
    {
        title: 'kobaken',
        description: "I'm a software engineer and preparing to start my own business. Event organizer for YAPC::Tokyo 2019, YAPC::Japan::Online 2022, and YAPC::Hiroshima 2024.",
        isHome: true
    }
  )
})

app.get('/slides', (c) => {
  return c.render(
    <SlidesIndex />,
    {
        title: 'Slides | kobaken',
        description: '登壇スライド一覧'
    }
  )
})


export default app
