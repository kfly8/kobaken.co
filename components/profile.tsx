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
      <section className={ProfileClass}>
          <img src="/static/img/kobaken.jpg" alt="icon" />
          <div>
            <h1>kobaken</h1>
            <ul>
              <li><a href="https://github.com/kfly8"><i className="icon-github"></i><span className="sr-only">GitHub</span></a></li>
              <li><a href="https://twitter.com/kfly8"><i className="icon-twitter"></i><span className="sr-only">Twitter</span></a></li>
              <li><a href="mailto:kentafly88@gmail.com"><i className="icon-mail"></i><span className="sr-only">Mail</span></a></li>
            </ul>
          </div>
      </section>
    </>
  )
}

