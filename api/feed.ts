import Parser from 'rss-parser'
import type { IncomingMessage, ServerResponse } from 'node:http'

type FeedItem = {
  title: string
  link: string
  source: string
  feedUrl: string
  publishedAt: string | null
  summary: string
  image: string | null
}

const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'PersonalNewsSource/0.1 (+https://github.com)' },
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: true }],
      ['media:thumbnail', 'mediaThumbnail'],
    ],
  },
})

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractImage(item: Record<string, unknown>): string | null {
  const enclosure = item.enclosure as { url?: string; type?: string } | undefined
  if (enclosure?.url && (enclosure.type ?? '').startsWith('image')) return enclosure.url

  const thumb = item.mediaThumbnail as { $?: { url?: string } } | undefined
  if (thumb?.$?.url) return thumb.$.url

  const media = item.mediaContent as Array<{ $?: { url?: string; medium?: string } }> | undefined
  const pic = media?.find((m) => m.$?.medium === 'image' || /\.(jpg|jpeg|png|webp|gif)/i.test(m.$?.url ?? ''))
  if (pic?.$?.url) return pic.$.url

  const content = (item['content:encoded'] as string) ?? (item.content as string) ?? ''
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i)
  return match ? match[1] : null
}

async function fetchOne(url: string): Promise<{ url: string; items: FeedItem[]; error?: string }> {
  try {
    const feed = await parser.parseURL(url)
    const source = feed.title ?? new URL(url).hostname
    const items: FeedItem[] = (feed.items ?? []).slice(0, 40).map((item) => {
      const raw = item as unknown as Record<string, unknown>
      const summaryRaw = (item.contentSnippet ?? item.content ?? (raw['content:encoded'] as string) ?? '') as string
      return {
        title: item.title?.trim() ?? '(untitled)',
        link: item.link ?? '',
        source,
        feedUrl: url,
        publishedAt: item.isoDate ?? (item.pubDate ? new Date(item.pubDate).toISOString() : null),
        summary: stripHtml(summaryRaw).slice(0, 280),
        image: extractImage(raw),
      }
    })
    return { url, items }
  } catch (err) {
    return { url, items: [], error: err instanceof Error ? err.message : String(err) }
  }
}

function getUrls(reqUrl: string): string[] {
  const u = new URL(reqUrl, 'http://local')
  const multi = u.searchParams.get('urls')
  const single = u.searchParams.get('url')
  const raw = multi ?? single ?? ''
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 30)
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')

  const urls = getUrls(req.url ?? '')
  if (urls.length === 0) {
    res.statusCode = 400
    res.end(JSON.stringify({ error: 'Provide ?url= or ?urls=comma,separated' }))
    return
  }

  const results = await Promise.all(urls.map(fetchOne))
  res.statusCode = 200
  res.end(JSON.stringify({ feeds: results }))
}
