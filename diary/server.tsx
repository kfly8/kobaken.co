import { collection } from './content'
import { createSection } from '../content/section'
import type { Lang } from '../i18n'

export const diary = (lang: Lang) =>
  createSection(collection, { base: '/diary', label: 'Diary', description: (l) => (l === 'en' ? 'Diary' : '日記') }, lang)
