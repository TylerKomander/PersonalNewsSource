import type { Config, Topic } from './types'

export const REFRESH_OPTIONS: { label: string; value: number }[] = [
  { label: 'Off', value: 0 },
  { label: '15 min', value: 15 * 60_000 },
  { label: '30 min', value: 30 * 60_000 },
  { label: 'Daily', value: 24 * 60 * 60_000 },
]

export const DEFAULT_TOPICS: Topic[] = [
  { id: 'tech', name: 'Tech', color: '#4f9dff', keywords: [] },
  { id: 'ai', name: 'AI', color: '#8b5cf6', keywords: [] },
  { id: 'science', name: 'Science', color: '#14b8a6', keywords: [] },
  { id: 'world', name: 'World', color: '#34c759', keywords: [] },
  { id: 'politics', name: 'Politics', color: '#ef4444', keywords: [] },
  { id: 'business', name: 'Business', color: '#f59e0b', keywords: [] },
  { id: 'finance', name: 'Finance', color: '#ffb020', keywords: [] },
  { id: 'crypto', name: 'Crypto', color: '#f7931a', keywords: [] },
  { id: 'sports', name: 'Sports', color: '#22c55e', keywords: [] },
  { id: 'gaming', name: 'Gaming', color: '#ec4899', keywords: [] },
  { id: 'entertainment', name: 'Entertainment', color: '#d946ef', keywords: [] },
  { id: 'health', name: 'Health', color: '#06b6d4', keywords: [] },
  { id: 'climate', name: 'Climate', color: '#10b981', keywords: [] },
  { id: 'space', name: 'Space', color: '#6366f1', keywords: [] },
  { id: 'hobby', name: 'Hobby', color: '#c06bff', keywords: [] },
]

export const DEFAULT_CONFIG: Config = {
  refreshInterval: 30 * 60_000,
  topics: DEFAULT_TOPICS,
  feeds: [
    { id: 'f-hn', url: 'https://hnrss.org/frontpage', title: 'Hacker News', topicId: 'tech' },
    { id: 'f-verge', url: 'https://www.theverge.com/rss/index.xml', title: 'The Verge', topicId: 'tech' },
    { id: 'f-bbc', url: 'http://feeds.bbci.co.uk/news/world/rss.xml', title: 'BBC World', topicId: 'world' },
    { id: 'f-npr', url: 'https://feeds.npr.org/1001/rss.xml', title: 'NPR News', topicId: 'world' },
    { id: 'f-cnbc', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', title: 'CNBC Finance', topicId: 'finance' },
    { id: 'f-sci', url: 'https://www.sciencedaily.com/rss/all.xml', title: 'ScienceDaily', topicId: 'science' },
    { id: 'f-espn', url: 'https://www.espn.com/espn/rss/news', title: 'ESPN', topicId: 'sports' },
    { id: 'f-polygon', url: 'https://www.polygon.com/rss/index.xml', title: 'Polygon', topicId: 'gaming' },
    { id: 'f-coindesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', title: 'CoinDesk', topicId: 'crypto' },
  ],
}

export const PAGE_SIZE = 50
