# 📰 Personal News Source

A self-hostable personal news dashboard. Search the whole web for news, scope it
by topic, favorite the sites you trust, and follow specific RSS / Reddit / GitHub
sources — all in one card feed. No accounts, no database, nothing public: it runs
on your own machine and your setup lives in your browser.

## Features

- **Web search** — the search bar queries news from across the web (via Google
  News), not just a fixed list of feeds.
- **15 topic categories** — scope the search to Tech, World, Sports, Finance, etc.
  Each is editable.
- **Keyword scoping** — narrow a category to terms you care about (e.g. *Tech →
  "cyber security"*); saved per category.
- **Site control** — restrict a search to specific sites ("Only"), or **favorite**
  sites per topic so they show up more often.
- **Follow sources** — add any RSS/Atom feed, a subreddit, or a GitHub repo's
  releases; they merge into the feed.
- **Choosable refresh**, **export/import config**, **zero backend state**
  (config lives in `localStorage`).

## Run it yourself

You need [Node.js](https://nodejs.org) 20+. Then:

```bash
npm install
npm run serve
```

`serve` builds the app and starts a small local server. It prints a **Local** URL
and a **Network** URL — open the Local one on this machine, or the Network one
(e.g. `http://192.168.1.50:4173`) from your phone or any other device on the same
Wi-Fi. Keep this machine on for others to reach it.

> First time on Windows, allow Node through the firewall on **Private networks**
> when prompted, so other devices can connect.

Change the port with `PORT=8080 npm run start` (after a build).

### With Docker

```bash
docker compose up -d
```

Then open `http://<this-machine-ip>:4173`. That's the whole install.

### Development (hot reload)

```bash
npm run dev
```

The Vite dev server handles `/api/feed` in-process, so feeds work with no extra
setup. Use this while changing code.

## How it works

Browsers can't fetch arbitrary feeds directly (CORS), so a small server endpoint
`/api/feed` fetches and parses them server-side and returns normalized JSON. That
endpoint is provided three ways, all sharing the same logic:

- `server.mjs` — the standalone self-host server (`npm run serve`).
- A Vite dev middleware — for `npm run dev`.
- `api/feed.ts` — a serverless function if you'd rather deploy to Vercel.

The frontend turns your category + keywords + site filters into a Google News
query, merges in any followed sources, then dedupes, filters, and renders.

## Optional: deploy to Vercel

The `api/` directory works as a Vercel serverless function as-is — `vercel`
deploys it with no config. Only do this if you *want* a public URL; self-hosting
needs no cloud account.

## License

MIT — see [LICENSE](./LICENSE).
