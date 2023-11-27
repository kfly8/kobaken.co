import 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'

declare module 'hono' {
  interface ContextRenderer {
    (
      content: string,
      props?: {
        title: string,
        description: string,
      }): Response
  }
}

export const renderer = jsxRenderer(
  ({ children, title, description }) => {
    const css_version = Date.now()

    return (
      <html>
        <head>
          <meta charset="utf-8" />
          <title>{title}</title>
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" type="image/jpg" href="/static/img/favicon.ico" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;900&display=swap" rel="stylesheet" />
          <link href={`/static/fontello-embedded.css?v=${css_version}`} rel="stylesheet" />
          <link href={`/static/reset.css?v=${css_version}`} rel="stylesheet" />
          <link href={`/static/style.css?v=${css_version}`} rel="stylesheet" />
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:site_name" content="kobaken.co" />
          <meta property="og:url" content="https://kobaken.co" />
          <meta property="og:image" content="https://kobaken.co/static/img/kobaken.jpg" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@kfly8" />
          <meta name="twitter:creator" content="@kfly8" />
        </head>
        <body>{children}</body>
      </html>
    )
  },
  {
    docType: true
  }
)
