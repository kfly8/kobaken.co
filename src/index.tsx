import { Hono } from 'hono'
import { renderer } from './renderer'

const app = new Hono()

const Header = () => {
    return (
      <>
        <header>
            <img class="icon" src="/static/img/kobaken.jpg" alt="icon" />
            <div>
              <h1 class="name">kobaken</h1>
              <p class="title">Software Engineer | Event Organizer</p>
              <ul class="sns-links">
                <li><a href="https://github.com/kfly8"><i class="icon-rss"></i><span class="sr-only">Blog</span></a></li>
                <li><a href="https://github.com/kfly8"><i class="icon-github"></i><span class="sr-only">GitHub</span></a></li>
                <li><a href="https://twitter.com/kfly8"><i class="icon-twitter"></i><span class="sr-only">Twitter</span></a></li>
              </ul>
            </div>
        </header>
      </>
    )
}

const Activities = () => {
    const activities = [
      { url: 'https://kfly8.hatenablog.com/entry/2023/06/17/133950', title: '最近プログラミングが楽しい', date: '2023-06-17' },
    ]

    return (
      <>
        <section class="activities">
          <h2>Activities</h2>
          <ul>
            { activities.map((activity) => (
              <li><a href={activity.url}>{activity.date} {activity.title}</a></li>
            ))}
          </ul>
        </section>
      </>
    )
}

app.get('*', renderer)

app.get('/', (c) => {
  return c.render(
    <>
      <div class="main">
        <Header />
        <Activities />
      </div>
    </>,
    {
        title: 'kobaken'
    }
  )
})

export default app
