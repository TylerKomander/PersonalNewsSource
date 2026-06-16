import type { FeedResult } from '../types'

export async function fetchFeeds(urls: string[]): Promise<FeedResult[]> {
  if (urls.length === 0) return []
  const query = encodeURIComponent(urls.join(','))
  const res = await fetch(`/api/feed?urls=${query}`)
  if (!res.ok) throw new Error(`Feed request failed: ${res.status}`)
  const data = (await res.json()) as { feeds: FeedResult[] }
  return data.feeds ?? []
}
