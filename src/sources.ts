import type { SourceType } from './types'

export type CatalogSource = { name: string; url: string; type: SourceType }

export const SOURCE_CATALOG: Record<string, CatalogSource[]> = {
  tech: [
    { name: 'Hacker News', url: 'https://hnrss.org/frontpage', type: 'rss' },
    { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', type: 'rss' },
    { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', type: 'rss' },
    { name: 'Engadget', url: 'https://www.engadget.com/rss.xml', type: 'rss' },
    { name: 'r/programming', url: 'https://www.reddit.com/r/programming/.rss', type: 'reddit' },
    { name: 'r/technology', url: 'https://www.reddit.com/r/technology/.rss', type: 'reddit' },
  ],
  ai: [
    { name: 'Hugging Face', url: 'https://huggingface.co/blog/feed.xml', type: 'rss' },
    { name: 'Google AI', url: 'https://blog.google/technology/ai/rss/', type: 'rss' },
    { name: 'r/MachineLearning', url: 'https://www.reddit.com/r/MachineLearning/.rss', type: 'reddit' },
    { name: 'r/artificial', url: 'https://www.reddit.com/r/artificial/.rss', type: 'reddit' },
  ],
  science: [
    { name: 'ScienceDaily', url: 'https://www.sciencedaily.com/rss/all.xml', type: 'rss' },
    { name: 'Nature', url: 'https://www.nature.com/nature.rss', type: 'rss' },
    { name: 'Quanta', url: 'https://api.quantamagazine.org/feed/', type: 'rss' },
    { name: 'r/science', url: 'https://www.reddit.com/r/science/.rss', type: 'reddit' },
  ],
  world: [
    { name: 'BBC World', url: 'http://feeds.bbci.co.uk/news/world/rss.xml', type: 'rss' },
    { name: 'NPR News', url: 'https://feeds.npr.org/1001/rss.xml', type: 'rss' },
    { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', type: 'rss' },
    { name: 'r/worldnews', url: 'https://www.reddit.com/r/worldnews/.rss', type: 'reddit' },
  ],
  politics: [
    { name: 'NPR Politics', url: 'https://feeds.npr.org/1014/rss.xml', type: 'rss' },
    { name: 'The Hill', url: 'https://thehill.com/rss/syndicator/19110', type: 'rss' },
    { name: 'r/politics', url: 'https://www.reddit.com/r/politics/.rss', type: 'reddit' },
  ],
  business: [
    { name: 'r/business', url: 'https://www.reddit.com/r/business/.rss', type: 'reddit' },
    { name: 'r/Economics', url: 'https://www.reddit.com/r/Economics/.rss', type: 'reddit' },
  ],
  finance: [
    { name: 'CNBC Finance', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', type: 'rss' },
    { name: 'MarketWatch', url: 'http://feeds.marketwatch.com/marketwatch/topstories/', type: 'rss' },
    { name: 'r/investing', url: 'https://www.reddit.com/r/investing/.rss', type: 'reddit' },
  ],
  crypto: [
    { name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', type: 'rss' },
    { name: 'Cointelegraph', url: 'https://cointelegraph.com/rss', type: 'rss' },
    { name: 'r/CryptoCurrency', url: 'https://www.reddit.com/r/CryptoCurrency/.rss', type: 'reddit' },
  ],
  sports: [
    { name: 'ESPN', url: 'https://www.espn.com/espn/rss/news', type: 'rss' },
    { name: 'CBS Sports', url: 'https://www.cbssports.com/rss/headlines/', type: 'rss' },
    { name: 'r/sports', url: 'https://www.reddit.com/r/sports/.rss', type: 'reddit' },
  ],
  gaming: [
    { name: 'Polygon', url: 'https://www.polygon.com/rss/index.xml', type: 'rss' },
    { name: 'IGN', url: 'https://feeds.ign.com/ign/all', type: 'rss' },
    { name: 'Kotaku', url: 'https://kotaku.com/rss', type: 'rss' },
    { name: 'r/gaming', url: 'https://www.reddit.com/r/gaming/.rss', type: 'reddit' },
  ],
  entertainment: [
    { name: 'Variety', url: 'https://variety.com/feed/', type: 'rss' },
    { name: 'r/movies', url: 'https://www.reddit.com/r/movies/.rss', type: 'reddit' },
    { name: 'r/television', url: 'https://www.reddit.com/r/television/.rss', type: 'reddit' },
  ],
  health: [
    { name: 'ScienceDaily Health', url: 'https://www.sciencedaily.com/rss/health_medicine.xml', type: 'rss' },
    { name: 'r/health', url: 'https://www.reddit.com/r/health/.rss', type: 'reddit' },
  ],
  climate: [
    { name: 'Grist', url: 'https://grist.org/feed/', type: 'rss' },
    { name: 'r/climate', url: 'https://www.reddit.com/r/climate/.rss', type: 'reddit' },
  ],
  space: [
    { name: 'Space.com', url: 'https://www.space.com/feeds/all', type: 'rss' },
    { name: 'r/space', url: 'https://www.reddit.com/r/space/.rss', type: 'reddit' },
  ],
  hobby: [
    { name: 'r/DIY', url: 'https://www.reddit.com/r/DIY/.rss', type: 'reddit' },
    { name: 'r/woodworking', url: 'https://www.reddit.com/r/woodworking/.rss', type: 'reddit' },
  ],
}

export function subredditUrl(input: string): string | null {
  const name = input.trim().replace(/^https?:\/\/(www\.)?reddit\.com/i, '').replace(/^\/?r\//i, '').replace(/\/.*$/, '').trim()
  if (!/^[\w]+$/.test(name)) return null
  return `https://www.reddit.com/r/${name}/.rss`
}

export function githubUrl(input: string, kind: 'releases' | 'commits' = 'releases'): string | null {
  const path = input.trim().replace(/^https?:\/\/github\.com\//i, '')
  const m = path.match(/^([\w.-]+)\/([\w.-]+)/)
  if (!m) return null
  const suffix = kind === 'commits' ? 'commits.atom' : 'releases.atom'
  return `https://github.com/${m[1]}/${m[2]}/${suffix}`
}
