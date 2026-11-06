export type SlideDeck = {
  slug: string
  date: string
  title: string
  width: number
  height: number
  slides: {
    number: number
    key: string
    src: string
    title: string
    description: string
    version: string
  }[]
}
