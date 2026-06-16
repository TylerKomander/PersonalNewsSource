import type { Topic } from '../types'

const SUFFIX = 'hl=en-US&gl=US&ceid=US:en'

export function searchUrl(query: string): string {
  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&${SUFFIX}`
}

export function topicUrl(topic: string): string {
  return `https://news.google.com/rss/headlines/section/topic/${topic}?${SUFFIX}`
}

export function topUrl(): string {
  return `https://news.google.com/rss?${SUFFIX}`
}

// Google News titles arrive as "Headline - Outlet". Split off the real outlet.
export function splitTitleSource(title: string): { title: string; source: string | null } {
  const i = title.lastIndexOf(' - ')
  if (i > 0 && title.length - i < 45) {
    return { title: title.slice(0, i).trim(), source: title.slice(i + 3).trim() }
  }
  return { title, source: null }
}

export function buildWebUrl(topic: Topic | null, terms: string[]): string {
  const clean = terms.map((t) => t.trim()).filter(Boolean)
  if (clean.length > 0) {
    const q = [topic?.query, ...clean].filter(Boolean).join(' ')
    return searchUrl(q)
  }
  if (topic?.topic) return topicUrl(topic.topic)
  if (topic?.query) return searchUrl(topic.query)
  return topUrl()
}
