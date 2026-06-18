# Personal News Source

A self-hostable news dashboard that searches the whole live web for news, scopes it by topic,
favorites the sites you trust, and folds in specific RSS, Reddit and GitHub sources — all into one
card feed. **It runs entirely on your own machine: no account, no database, nothing public, and your
whole configuration lives in your browser.**

Not a feed reader wired to a fixed list, and not a hosted service that logs what you read: the search
hits the live web through Google News rather than a curated set of feeds, and every setting — your
categories, keywords, favorites and followed sources — sits in your browser's `localStorage`, so no
server anywhere knows what you look at.

## Run it

You need [Node.js](https://nodejs.org) 20 or newer.

The launcher does everything — install, build, open the browser, start the server:

- **Windows:** double-click `start.cmd`
- **macOS / Linux:** `./start.sh`

Or by hand:

```bash
npm install
npm run serve
```

`serve` builds the app and starts a small local server. It prints a **Local** URL and a **Network**
URL — open the Local one on this machine, or the Network one (e.g. `http://192.168.1.50:4173`) from
your phone or any other device on the same Wi-Fi. This machine has to stay on for others to reach it.
Change the port with `PORT=8080 npm run start` after a build.

The first time on Windows, allow Node through the firewall on **Private networks** when prompted, or
other devices can't connect — the Network URL is served by this machine and Windows blocks it by
default until you say otherwise.

### With Docker

```bash
docker compose up -d
```

Then open `http://<this-machine-ip>:4173`. That is the whole install.

### Development

```bash
npm run dev
```

The Vite dev server handles `/api/feed` in-process, so feeds work with no extra setup. Use this while
changing code; use `npm run serve` to run it for real.

## What's in it

- **Web search** — the search bar queries news from across the web through Google News, not a fixed
  list of feeds.
- **15 topic categories** — scope the search to Tech, World, Sports, Finance and the rest; each one
  is editable.
- **Keyword scoping** — narrow a category to the terms you care about (e.g. *Tech → "cyber
  security"*), saved per category.
- **Site control** — restrict a search to specific sites with **Only**, or **favorite** sites per
  topic so they surface more often.
- **Followed sources** — add any RSS/Atom feed, a subreddit, or a GitHub repo's releases, and they
  merge into the same feed.
- **Choosable refresh, export/import config, zero backend state** — the entire configuration lives in
  `localStorage`, so there is nothing server-side to back up or leak.

## How it works

Browsers can't fetch arbitrary feeds directly — CORS blocks it — so a small server endpoint
`/api/feed` fetches and parses them server-side and hands back normalized JSON. That endpoint is
provided three ways, all sharing the same code:

- `server.mjs` — the standalone self-host server (`npm run serve`).
- a Vite dev middleware — for `npm run dev`.
- `api/feed.ts` — a serverless function, if you'd rather deploy to Vercel.

The frontend turns your category, keywords and site filters into a Google News query, merges in any
followed sources, then dedupes, filters and renders the result.

## Where it stands

- **Your configuration is only in your browser.** Clear `localStorage` and it is gone — there is no
  account and no server-side copy. That is deliberate: the trade for having nothing public to leak is
  that a backup is your export file, not a database.
- **Search quality is Google News's.** The feed is only as good as what that query returns; this app
  scopes and merges results, it does not rank or fact-check them.
- **Others reach it only while this machine is on.** Self-hosting on your own hardware is the point —
  the Vercel path below is the escape hatch if you want a URL that is always up.

## Deploy to Vercel (optional)

The `api/` directory works as a Vercel serverless function as-is — `vercel` deploys it with no
config. Only do this if you *want* a public URL; self-hosting needs no cloud account at all.

## License

MIT — see [LICENSE](./LICENSE). Not affiliated with Google News, Reddit, GitHub or any source it
aggregates; it only queries their public feeds.
