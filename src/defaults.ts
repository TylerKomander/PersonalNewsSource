import type { Config } from './types'

export const REFRESH_OPTIONS: { label: string; value: number }[] = [
  { label: 'Off', value: 0 },
  { label: '15 min', value: 15 * 60_000 },
  { label: '30 min', value: 30 * 60_000 },
  { label: 'Daily', value: 24 * 60 * 60_000 },
]

export const DEFAULT_CONFIG: Config = {
  refreshInterval: 30 * 60_000,
  topics: [
    { id: 'tech', name: 'Tech', color: '#4f9dff', keywords: [] },
    { id: 'world', name: 'World', color: '#34c759', keywords: [] },
    { id: 'finance', name: 'Finance', color: '#ffb020', keywords: [] },
    { id: 'hobby', name: 'Hobby', color: '#c06bff', keywords: [] },
  ],
  feeds: [
    { id: 'f-hn', url: 'https://hnrss.org/frontpage', title: 'Hacker News', topicId: 'tech' },
    { id: 'f-verge', url: 'https://www.theverge.com/rss/index.xml', title: 'The Verge', topicId: 'tech' },
    { id: 'f-bbc', url: 'http://feeds.bbci.co.uk/news/world/rss.xml', title: 'BBC World', topicId: 'world' },
    { id: 'f-npr', url: 'https://feeds.npr.org/1001/rss.xml', title: 'NPR News', topicId: 'world' },
    { id: 'f-cnbc', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', title: 'CNBC Finance', topicId: 'finance' },
  ],
}
