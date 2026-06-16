# 📰 Personal News Source

A self-hostable personal news dashboard. Bring your own RSS feeds, tag them by
topic, narrow each topic with keyword filters, and read everything in one
searchable card feed. No accounts, no database — your setup lives in your
browser.

## Features

- **Your feeds, your topics** — add any RSS/Atom feed and assign it a topic.
- **Keyword filters** — narrow a broad topic (e.g. *Tech*) to just the terms you
  care about.
- **Search** across every loaded headline.
- **Choosable refresh** — manual, or auto every 15m / 30m / daily.
- **Export / import** your config as JSON to back it up or move browsers.
- **Zero backend state** — config is stored in `localStorage`; feeds are fetched
  through a single serverless function to dodge browser CORS limits.

## Stack

- Vite + React + TypeScript
- One Vercel serverless function (`api/feed.ts`) using
  [`rss-parser`](https://github.com/rbren/rss-parser)

## Run locally

```bash
npm install
npm run dev
```

The dev server handles `/api/feed` in-process via a Vite middleware, so feed
fetching works locally with no extra tooling. Open the printed localhost URL.

## Deploy

Deploys to [Vercel](https://vercel.com) as-is — the `api/` directory becomes a
serverless function automatically. No environment variables required.

```bash
npm i -g vercel
vercel
```

## How it works

Browsers can't fetch arbitrary RSS feeds directly (CORS). `api/feed.ts` fetches
and parses feeds server-side and returns normalized JSON
(`{ title, link, source, publishedAt, summary, image }`). The frontend tags each
article with its feed's topic, then filters and renders client-side.

## License

MIT — see [LICENSE](./LICENSE).
