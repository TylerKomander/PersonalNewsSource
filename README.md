# 📰 Personal News Source

**Your own news dashboard — the news *you* want, on a machine *you* control.**

Search the whole web for stories, narrow them to the topics and sites you trust,
and follow specific RSS / Reddit / GitHub sources — all in one clean card feed.

No accounts to make. No database to run. Nothing leaves your machine: the app
runs locally and your whole setup lives in your browser. Fork it, tweak it, host
it for your household — it's yours.

## What you can do

- 🔎 **Search the open web** — the search bar pulls live news from across the web
  (via Google News), not just a fixed list of feeds.
- 🗂️ **15 topic categories** — Tech, World, Sports, Finance, and more. All editable.
- 🎯 **Zero in with keywords** — narrow any category to the terms you care about
  (*Tech → "cyber security"*). Saved per topic.
- ⭐ **Pick your sources** — restrict a search to specific sites, or **favorite**
  the ones you trust so they surface more often.
- 📡 **Follow anything** — add any RSS/Atom feed, a subreddit, or a GitHub repo's
  releases and it merges right into your feed.
- 🔄 **Refresh on your schedule**, 💾 **export/import your config**, and keep
  **everything local** (it all lives in `localStorage`).

## Get it running

You'll need [Node.js](https://nodejs.org) 20 or newer. That's the only requirement.

**The easy way — just double-click the launcher:**
- **Windows:** `start.cmd`
- **Mac/Linux:** `./start.sh`

It installs everything, builds the app, opens your browser, and starts the
server. Prefer to do it by hand? Two commands:

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
