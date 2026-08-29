import 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'
import { BfScripts } from '@barefootjs/hono/scripts'
import { themeInitScript } from './theme-script'
import { Assets } from './dist/bf-assets'
import { assetVersion } from './dist/asset-version'

declare module 'hono' {
  interface ContextRenderer {
    (
      content: unknown,
      props: {
        title?: string,
        description?: string,
        canonical: string,
        // Path (not absolute URL) to a page-specific OGP image, e.g.
        // "/blog/hello-blog/og.png". Falls back to the profile photo.
        image?: string,
      }): Response
  }
}

const SITE_URL = 'https://kobaken.co'

export const renderer = jsxRenderer(
  ({ children, title, description, canonical, image }) => {
    const url = `${SITE_URL}${canonical}`
    const imageUrl = `${SITE_URL}${image ?? '/static/img/kobaken.jpg'}`

    return (
      <html lang="ja">
        <head>
          <meta charset="utf-8" />
          <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-N1NZRELLMR"></script>
          <script src="/static/gtag.js"></script>
          {/* Loaded once here (not per-post): a <script> tag inside
              dangerouslySetInnerHTML markdown HTML never executes, so
              this can't come from the post body itself. TwitterEmbeds
              (components/TwitterEmbeds.tsx) re-triggers widgets.js's
              DOM scan after client-side navigation, once this has
              already loaded. */}
          <script async src="https://platform.x.com/widgets.js"></script>
          <title>{title}</title>
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" type="image/jpg" href="/static/img/favicon.ico" />
          <link rel="canonical" href={url} />
          <link href={`/static/fontello-embedded.css?v=${assetVersion}`} rel="stylesheet" />
          <link href={`/static/reset.css?v=${assetVersion}`} rel="stylesheet" />
          <link href={`/static/style.css?v=${assetVersion}`} rel="stylesheet" />
          <link href={`/static/header.css?v=${assetVersion}`} rel="stylesheet" />
          <link href={`/static/slides.css?v=${assetVersion}`} rel="stylesheet" />
          <link href={`/static/blog.css?v=${assetVersion}`} rel="stylesheet" />
          <link href={`/static/uno.css?v=${assetVersion}`} rel="stylesheet" />
          <script src={`/static/script.js?v=${assetVersion}`} defer />
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:site_name" content="kobaken.co" />
          <meta property="og:url" content={url} />
          <meta property="og:image" content={imageUrl} />
          {image && <meta property="og:image:width" content="1200" />}
          {image && <meta property="og:image:height" content="630" />}
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
          <meta name="twitter:image" content={imageUrl} />
          <meta name="twitter:site" content="@kfly8" />
          <meta name="twitter:creator" content="@kfly8" />
        </head>
        <body>
          {children}
          <BfScripts />
          <script type="module" src={Assets.RouterEntry} />
        </body>
      </html>
    )
  },
  {
    docType: true
  }
)
