// The site is English first, with Japanese beside it. Every page has a
// fixed-language URL — /en/... or /ja/... — so a link, a bookmark or a
// search result always opens the same text. The paths without a language
// (/, /blog/<slug>, ...) are entry points that send readers to the
// language they prefer; see negotiate() in server.tsx.

export type Lang = 'en' | 'ja'

export const LANGS: Lang[] = ['en', 'ja']

// The language for readers who have no preference we can read, crawlers
// included (Googlebot sends no Accept-Language).
export const DEFAULT_LANG: Lang = 'en'

// A post file without a language in its name (content/blog/<slug>.md) was
// written before the site had English, in Japanese.
export const UNMARKED_LANG: Lang = 'ja'

export const COOKIE = 'lang'

export const isLang = (value: unknown): value is Lang => value === 'en' || value === 'ja'

export const otherLang = (lang: Lang): Lang => (lang === 'en' ? 'ja' : 'en')

// localized('/blog/x', 'ja') is /ja/blog/x; localized('/', 'en') is /en.
export const localized = (path: string, lang: Lang): string => (path === '/' ? `/${lang}` : `/${lang}${path}`)

export const OG_LOCALE: Record<Lang, string> = { en: 'en_US', ja: 'ja_JP' }

// The name of each language, written in that language: the language menu
// lists them so, for readers who may not read the current one.
export const LANG_NAME: Record<Lang, string> = { en: 'English', ja: '日本語' }

// The name of each language in the page's language, for text on the page:
// an English list says a post is "(Japanese)".
export const LANG_NAME_IN: Record<Lang, Record<Lang, string>> = {
  en: { en: 'English', ja: 'Japanese' },
  ja: { en: '英語', ja: '日本語' },
}

// The two-letter code the header shows for the language a page is in.
export const LANG_CODE: Record<Lang, string> = { en: 'EN', ja: 'JA' }

export const messages = {
  en: {
    homeDescription:
      "I'm a software engineer and preparing to start my own business. Event organizer for YAPC::Tokyo 2019, YAPC::Japan::Online 2022, and YAPC::Hiroshima 2024.",
    profileDescription: 'Career, talks and writing',
    slidesDescription: 'Slides from my talks',
    tagDescription: (tag: string) => `Posts tagged "${tag}"`,
    noPosts: 'No posts yet.',
    related: 'Related posts',
    backTo: (label: string) => `← Back to ${label}`,
    reply: 'Reply on X',
    replyText: 'Read it 👍',
    languageMenu: 'Language',
    notTranslated: 'This page is not in Japanese yet',
  },
  ja: {
    homeDescription:
      'ソフトウェアエンジニア。自分の事業を立ち上げる準備をしている。YAPC::Tokyo 2019、YAPC::Japan::Online 2022、YAPC::Hiroshima 2024 のオーガナイザー。',
    profileDescription: '経歴・登壇・寄稿など',
    slidesDescription: '登壇スライド一覧',
    tagDescription: (tag: string) => `タグ「${tag}」の記事一覧`,
    noPosts: 'まだ記事がありません。',
    related: '関連記事',
    backTo: (label: string) => `← Back to ${label}`,
    reply: 'おたよりはコチラ',
    replyText: '読んだよ👍',
    languageMenu: '言語',
    notTranslated: 'このページの英語版はまだありません',
  },
} satisfies Record<Lang, Record<string, unknown>>

// What the header's language menu shows for a page in lang at path (its
// path without a language): the current language, and the link to the
// page in the other one, which goes through the entry point with ?lang=,
// so the choice is kept in a cookie (negotiate() in server.tsx). A page
// with no version in the other language passes translated: false, and the
// menu lists that language without a link.
export interface LanguageMenu {
  lang: Lang
  code: string
  name: string
  menuLabel: string
  otherLang: Lang
  otherName: string
  otherHref?: string
  notTranslated: string
}

export const languageMenu = (path: string, lang: Lang, translated = true): LanguageMenu => {
  const other = otherLang(lang)
  return {
    lang,
    code: LANG_CODE[lang],
    name: LANG_NAME[lang],
    menuLabel: `${messages[lang].languageMenu}: ${LANG_NAME[lang]}`,
    otherLang: other,
    otherName: LANG_NAME[other],
    otherHref: translated ? `${path}?lang=${other}` : undefined,
    notTranslated: messages[lang].notTranslated,
  }
}
