import { css } from 'hono/css'

export const Profile = () => {

  const ProfileClass = css`
    display: flex;
    align-items: center;
    min-height: 100svh;

    // icon
    & img {
      border-radius: 50%;
      width: 80px;
      height: 80px;
      object-fit: cover;
      display: inline-block;
      margin-right: 20px;
    }

    // name
    & h1 {
      font-size: xx-large;
      font-family: Inter, sans-serif;
      font-weight: 900;
    }

    // sns links
    & ul {
      margin: 0 auto;
      margin-left: -2px;

      & li {
        display: inline-block;
        margin-right: 1rem;
      }

      & i {
        font-size: xx-large;
      }
    }
  `

  return (
    <>
      <section class={ProfileClass}>
          <img src="/static/img/kobaken.jpg" alt="icon" />
          <div>
            <h1>kobaken</h1>
            <ul>
              <li><a href="https://kfly8.hatenablog.com/"><i class="icon-rss"></i><span class="sr-only">Blog</span></a></li>
              <li><a href="https://github.com/kfly8"><i class="icon-github"></i><span class="sr-only">GitHub</span></a></li>
              <li><a href="https://twitter.com/kfly8"><i class="icon-twitter"></i><span class="sr-only">Twitter</span></a></li>
              <li><a href="mailto:kentafly88@gmail.com"><i class="icon-mail"></i><span class="sr-only">Mail</span></a></li>
            </ul>
          </div>
      </section>
    </>
  )
}

