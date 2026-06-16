export type SourceType = 'rss' | 'reddit' | 'github'

export type Topic = {
  id: string
  name: string
  color: string
  keywords: string[]
  query: string
  topic?: string
  favoriteSites?: string[]
}

export type Feed = {
  id: string
  url: string
  title: string
  topicId: string
  type?: SourceType
}

export type Config = {
  feeds: Feed[]
  topics: Topic[]
  refreshInterval: number
}

export type RawItem = {
  title: string
  link: string
  source: string
  feedUrl: string
  publishedAt: string | null
  summary: string
  image: string | null
}

export type Article = RawItem & {
  topicId: string
  origin: 'web' | 'followed'
  sourceType?: SourceType
}

export type FeedResult = {
  url: string
  items: RawItem[]
  error?: string
}
