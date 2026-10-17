import { collection } from './content'
import { createSection } from '../content/section'
import type { Lang } from '../i18n'

export const blog = (lang: Lang) =>
  createSection(
    collection,
    { base: '/blog', label: 'Blog', description: (l) => (l === 'en' ? 'Technical posts' : '技術ブログ記事一覧') },
    lang,
  )
