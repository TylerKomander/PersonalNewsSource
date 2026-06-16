import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { networkInterfaces } from 'node:os'
import Parser from 'rss-parser'

const ROOT = fileURLToPath(new URL('.', import.meta.url))
const DIST = join(ROOT, 'dist')
const PORT = Number(process.env.PORT) || 4173

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'PersonalNewsSource/0.1 (RSS reader; +https://github.com/personal-news-source)',
    Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml; q=0.9, */*; q=0.8',
  },
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: true }],
      ['media:thumbnail', 'mediaThumbnail'],
    ],
  },
})

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim()
}

function extractImage(item) {
  const enclosure = item.enclosure
  if (enclosure?.url && (enclosure.type ?? '').startsWith('image')) return enclosure.url
  const thumb = item.mediaThumbnail
  if (thumb?.$?.url) return thumb.$.url
  const media = item.mediaContent
  const pic = media?.find((m) => m.$?.medium === 'image' || /\.(jpg|jpeg|png|webp|gif)/i.test(m.$?.url ?? ''))
  if (pic?.$?.url) return pic.$.url
  const content = item['content:encoded'] ?? item.content ?? ''
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i)
  return match ? match[1] : null
}

async function fetchOne(url) {
  try {
    const feed = await parser.parseURL(url)
    const source = feed.title ?? new URL(url).hostname
    const items = (feed.items ?? []).slice(0, 40).map((item) => {
      const summaryRaw = item.contentSnippet ?? item.content ?? item['content:encoded'] ?? ''
      return {
        title: item.title?.trim() ?? '(untitled)',
        link: item.link ?? '',
        source,
        feedUrl: url,
        publishedAt: item.isoDate ?? (item.pubDate ? new Date(item.pubDate).toISOString() : null),
        summary: stripHtml(summaryRaw).slice(0, 280),
        image: extractImage(item),
      }
    })
    return { url, items }
  } catch (err) {
    return { url, items: [], error: err instanceof Error ? err.message : String(err) }
  }
}

function getUrls(reqUrl) {
  const u = new URL(reqUrl, 'http://local')
  const raw = u.searchParams.get('urls') ?? u.searchParams.get('url') ?? ''
  return raw.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 30)
}

async function feedHandler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
  const urls = getUrls(req.url ?? '')
  if (urls.length === 0) {
    res.statusCode = 400
    res.end(JSON.stringify({ error: 'Provide ?url= or ?urls=comma,separated' }))
    return
  }
  const feeds = await Promise.all(urls.map(fetchOne))
  res.statusCode = 200
  res.end(JSON.stringify({ feeds }))
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
}

async function serveStatic(req, res) {
  const pathname = decodeURIComponent(new URL(req.url, 'http://local').pathname)
  let filePath = normalize(join(DIST, pathname === '/' ? '/index.html' : pathname))
  if (!filePath.startsWith(DIST)) {
    res.statusCode = 403
    res.end('Forbidden')
    return
  }
  try {
    const s = await stat(filePath)
    if (s.isDirectory()) filePath = join(filePath, 'index.html')
    const data = await readFile(filePath)
    res.setHeader('Content-Type', MIME[extname(filePath)] ?? 'application/octet-stream')
    res.end(data)
  } catch {
    try {
      const html = await readFile(join(DIST, 'index.html'))
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.end(html)
    } catch {
      res.statusCode = 404
      res.end('Build not found. Run `npm run build` first.')
    }
  }
}

const server = createServer((req, res) => {
  if ((req.url ?? '').startsWith('/api/feed')) return feedHandler(req, res)
  return serveStatic(req, res)
})

server.listen(PORT, '0.0.0.0', () => {
  const lan = Object.values(networkInterfaces())
    .flat()
    .filter((i) => i && i.family === 'IPv4' && !i.internal)
    .map((i) => i.address)
  console.log('\n  📰 Personal News Source is running:\n')
  console.log(`     Local:    http://localhost:${PORT}`)
  for (const ip of lan) console.log(`     Network:  http://${ip}:${PORT}   (open this on phones/other devices)`)
  console.log('\n  Press Ctrl+C to stop.\n')
})
