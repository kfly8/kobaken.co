import { css } from 'hono/css'

export const Tagline = () => {

  const TaglineClass = css`
    font-size: medium;
    font-weight: 300;
    font-family: monospace;
    position: absolute;
    right: 0;
    top: 50svh;
    transform: translate(-30px,44em) rotate(90deg);
    transform-origin: right;
    letter-spacing: 0.1em;
    white-space: nowrap;
  `

  return (
    <>
      <div class={TaglineClass}>
        Software Engineer | Engineering Manager | Tech Conference Organizer
      </div>
    </>
  )
}


