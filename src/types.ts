export type Topic = {
  id: string
  name: string
  color: string
  keywords: string[]
}

export type SourceType = 'rss' | 'reddit' | 'github'

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

export type Article = {
  title: string
  link: string
  source: string
  feedUrl: string
  publishedAt: string | null
  summary: string
  image: string | null
  topicId: string
}

export type FeedResult = {
  url: string
  items: Omit<Article, 'topicId'>[]
  error?: string
}
