import type { Config, Topic } from './types'

export const REFRESH_OPTIONS: { label: string; value: number }[] = [
  { label: 'Off', value: 0 },
  { label: '15 min', value: 15 * 60_000 },
  { label: '30 min', value: 30 * 60_000 },
  { label: 'Daily', value: 24 * 60 * 60_000 },
]

export const DEFAULT_TOPICS: Topic[] = [
  { id: 'tech', name: 'Tech', color: '#4f9dff', keywords: [], query: 'technology', topic: 'TECHNOLOGY' },
  { id: 'ai', name: 'AI', color: '#8b5cf6', keywords: [], query: 'artificial intelligence' },
  { id: 'science', name: 'Science', color: '#14b8a6', keywords: [], query: 'science', topic: 'SCIENCE' },
  { id: 'world', name: 'World', color: '#34c759', keywords: [], query: 'world news', topic: 'WORLD' },
  { id: 'politics', name: 'Politics', color: '#ef4444', keywords: [], query: 'politics' },
  { id: 'business', name: 'Business', color: '#f59e0b', keywords: [], query: 'business', topic: 'BUSINESS' },
  { id: 'finance', name: 'Finance', color: '#ffb020', keywords: [], query: 'stock market finance' },
  { id: 'crypto', name: 'Crypto', color: '#f7931a', keywords: [], query: 'cryptocurrency' },
  { id: 'sports', name: 'Sports', color: '#22c55e', keywords: [], query: 'sports', topic: 'SPORTS' },
  { id: 'gaming', name: 'Gaming', color: '#ec4899', keywords: [], query: 'video games' },
  { id: 'entertainment', name: 'Entertainment', color: '#d946ef', keywords: [], query: 'entertainment', topic: 'ENTERTAINMENT' },
  { id: 'health', name: 'Health', color: '#06b6d4', keywords: [], query: 'health', topic: 'HEALTH' },
  { id: 'climate', name: 'Climate', color: '#10b981', keywords: [], query: 'climate change' },
  { id: 'space', name: 'Space', color: '#6366f1', keywords: [], query: 'space exploration' },
  { id: 'hobby', name: 'Hobby', color: '#c06bff', keywords: [], query: 'hobbies' },
]

export const DEFAULT_CONFIG: Config = {
  refreshInterval: 30 * 60_000,
  topics: DEFAULT_TOPICS,
  feeds: [
    { id: 'f-hn', url: 'https://hnrss.org/frontpage', title: 'Hacker News', topicId: 'tech', type: 'rss' },
    { id: 'f-verge', url: 'https://www.theverge.com/rss/index.xml', title: 'The Verge', topicId: 'tech', type: 'rss' },
    { id: 'f-bbc', url: 'http://feeds.bbci.co.uk/news/world/rss.xml', title: 'BBC World', topicId: 'world', type: 'rss' },
    { id: 'f-npr', url: 'https://feeds.npr.org/1001/rss.xml', title: 'NPR News', topicId: 'world', type: 'rss' },
    { id: 'f-cnbc', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', title: 'CNBC Finance', topicId: 'finance', type: 'rss' },
    { id: 'f-sci', url: 'https://www.sciencedaily.com/rss/all.xml', title: 'ScienceDaily', topicId: 'science', type: 'rss' },
    { id: 'f-espn', url: 'https://www.espn.com/espn/rss/news', title: 'ESPN', topicId: 'sports', type: 'rss' },
    { id: 'f-polygon', url: 'https://www.polygon.com/rss/index.xml', title: 'Polygon', topicId: 'gaming', type: 'rss' },
    { id: 'f-coindesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', title: 'CoinDesk', topicId: 'crypto', type: 'rss' },
  ],
}

export const PAGE_SIZE = 50
