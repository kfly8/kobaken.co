import 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'

declare module 'hono' {
  interface ContextRenderer {
    (content: string, props?: { title?: string }): Response
  }
}

export const renderer = jsxRenderer(
  ({ children, title }) => {
    return (
      <html>
        <head>
          <meta charset="utf-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" type="image/jpg" href="/static/img/favicon.ico" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap" rel="stylesheet" />
          <link href="/static/fontello-embedded.css" rel="stylesheet" />
          <link href="/static/reset.css" rel="stylesheet" />
          <link href="/static/style.css" rel="stylesheet" />
          <title>{title}</title>
        </head>
        <body>{children}</body>
      </html>
    )
  },
  {
    docType: true
  }
)
