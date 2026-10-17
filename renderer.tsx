import 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'
import { raw } from 'hono/html'
import { BfScripts } from '@barefootjs/hono/scripts'
import { themeInitScript } from './theme-script'
import { twitterEmbedsScript } from './twitter-embeds-script'
import { Assets } from './dist/bf-assets'
import { assetVersion } from './dist/asset-version'
import { type Lang, LANGS, OG_LOCALE, localized } from './i18n'

declare module 'hono' {
  interface ContextRenderer {
    (
      content: unknown,
      props: {
        lang: Lang,
        title?: string,
        description?: string,
        // The page's path without its language, e.g. "/blog/hello-blog";
        // the page itself is at /<lang><path>.
        path: string,
        // The languages the page is in, this one included. With more than
        // one, each version names the others (hreflang), and the path
        // without a language — which leads readers to their language — is
        // the x-default.
        alternates?: Lang[],
        // Path (not absolute URL) to a page-specific OGP image, e.g.
        // "/en/blog/hello-blog/og.png". Falls back to the default share card.
        image?: string,
        // 'article' for a blog/diary post, 'website' (default) for
        // everything else — decides og:type and whether the
        // article:published_time/modified_time tags are emitted.
        type?: 'website' | 'article',
        publishedTime?: string,
      }): Response
  }
}

const SITE_URL = 'https://kobaken.co'

// <link rel="alternate" hreflang> for each version of a page, written as
// HTML rather than JSX: the JSX renderer keeps one <link> per href, so the
// version of the page itself — at the canonical URL — would be dropped,
// and hreflang must name it too.
const hreflangLinks = (path: string, langs: Lang[]) =>
  raw(
    [...langs.map((l) => [l, `${SITE_URL}${localized(path, l)}`]), ['x-default', `${SITE_URL}${path}`]]
      .map(([hreflang, href]) => `<link rel="alternate" hreflang="${hreflang}" href="${escapeAttr(href)}"/>`)
      .join(''),
  )

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export const renderer = jsxRenderer(
  ({ children, lang, title, description, path, alternates = [lang], image, type = 'website', publishedTime }) => {
    const url = `${SITE_URL}${localized(path, lang)}`
    const versions = LANGS.filter((l) => alternates.includes(l))
    const imageUrl = `${SITE_URL}${image ?? '/static/img/og-default.jpg'}`

    return (
      <html lang={lang}>
        <head>
          <meta charset="utf-8" />
          <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-N1NZRELLMR"></script>
          <script src="/static/gtag.js"></script>
          {/* Loaded once here (not per-post): a <script> tag inside
              dangerouslySetInnerHTML markdown HTML never executes, so
              this can't come from the post body itself. twitterEmbedsScript
              re-triggers widgets.js's DOM scan after client-side
              navigation, once this has already loaded. */}
          <script async src="https://platform.x.com/widgets.js"></script>
          <script dangerouslySetInnerHTML={{ __html: twitterEmbedsScript }} />
          <title>{title}</title>
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" type="image/jpg" href="/static/img/favicon.ico" />
          <link rel="canonical" href={url} />
          {versions.length > 1 && hreflangLinks(path, versions)}
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
          <meta property="og:locale" content={OG_LOCALE[lang]} />
          <meta property="og:url" content={url} />
          <meta property="og:image" content={imageUrl} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:type" content={type} />
          {type === 'article' && publishedTime && <meta property="article:published_time" content={publishedTime} />}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
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
