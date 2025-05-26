import 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Style } from 'hono/css'

declare module 'hono' {
  interface ContextRenderer {
    (
      content: string | Promise<string>,
      props?: {
        title: string,
        description: string,
      }): Response
  }
}

export const renderer = jsxRenderer(
  ({ children, title, description }) => {
    const asset_version = 202312022357

    return (
      <html lang="ja">
        <head>
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-N1NZRELLMR"></script>
          <script src="/static/gtag.js"></script>
          <meta charset="utf-8" />
          <title>{title}</title>
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" type="image/jpg" href="/static/img/favicon.ico" />
          <link rel="preload" as="font" href="/static/font/Inter-ExtraBold.woff2" CrossOrigin />
          <link href={`/static/fontello-embedded.css?v=${asset_version}`} rel="stylesheet" />
          <link href={`/static/reset.css?v=${asset_version}`} rel="stylesheet" />
          <link href={`/static/style.css?v=${asset_version}`} rel="stylesheet" />
          <Style />
          <script src={`/static/script.js?v=${asset_version}`} defer />
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
