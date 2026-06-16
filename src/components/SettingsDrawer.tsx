import { useState, useRef } from 'react'
import type { Config, Feed, SourceType } from '../types'
import { DEFAULT_CONFIG } from '../defaults'
import { SOURCE_CATALOG, subredditUrl, githubUrl, normalizeDomain } from '../sources'
import { hostname } from '../lib/format'

type Props = {
  config: Config
  onChange: (next: Config) => void
  onClose: () => void
}

const TYPE_BADGE: Record<SourceType, string> = { rss: 'RSS', reddit: 'Reddit', github: 'GitHub' }

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export function SettingsDrawer({ config, onChange, onClose }: Props) {
  const [topicId, setTopicId] = useState(config.topics[0]?.id ?? '')
  const [url, setUrl] = useState('')
  const [sub, setSub] = useState('')
  const [repo, setRepo] = useState('')
  const [site, setSite] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const added = new Set(config.feeds.map((f) => f.url))

  function addSource(feedUrl: string, title: string, type: SourceType) {
    if (added.has(feedUrl)) return
    const feed: Feed = { id: makeId('f'), url: feedUrl, title, topicId, type }
    onChange({ ...config, feeds: [...config.feeds, feed] })
  }

  function addCustom() {
    const trimmed = url.trim()
    if (!trimmed) return
    addSource(trimmed, hostname(trimmed), 'rss')
    setUrl('')
  }

  function addSubreddit() {
    const built = subredditUrl(sub)
    if (!built) {
      alert('Enter a subreddit name, e.g. programming')
      return
    }
    addSource(built, `r/${sub.trim().replace(/^\/?r\//i, '')}`, 'reddit')
    setSub('')
  }

  function addRepo() {
    const built = githubUrl(repo)
    if (!built) {
      alert('Enter a repo as owner/name, e.g. vercel/next.js')
      return
    }
    addSource(built, repo.trim().replace(/^https?:\/\/github\.com\//i, ''), 'github')
    setRepo('')
  }

  function removeFeed(id: string) {
    onChange({ ...config, feeds: config.feeds.filter((f) => f.id !== id) })
  }

  function addSite() {
    const domain = normalizeDomain(site)
    if (!domain) {
      alert('Enter a website like espn.com')
      return
    }
    onChange({
      ...config,
      topics: config.topics.map((t) =>
        t.id === topicId && !(t.favoriteSites ?? []).includes(domain)
          ? { ...t, favoriteSites: [...(t.favoriteSites ?? []), domain] }
          : t,
      ),
    })
    setSite('')
  }

  function removeSite(domain: string) {
    onChange({
      ...config,
      topics: config.topics.map((t) =>
        t.id === topicId ? { ...t, favoriteSites: (t.favoriteSites ?? []).filter((d) => d !== domain) } : t,
      ),
    })
  }

  function exportConfig() {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'news-config.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  function importConfig(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as Config
        if (Array.isArray(parsed.feeds) && Array.isArray(parsed.topics)) onChange(parsed)
        else alert('That file is not a valid config.')
      } catch {
        alert('Could not parse that file.')
      }
    }
    reader.readAsText(file)
  }

  const catalog = SOURCE_CATALOG[topicId] ?? []
  const activeTopic = config.topics.find((t) => t.id === topicId)

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <h2>Sources</h2>
          <button className="btn ghost" onClick={onClose}>Close</button>
        </div>

        <section>
          <h3>Add to category</h3>
          <select className="cat-select" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
            {config.topics.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <h4>Suggested for {activeTopic?.name}</h4>
          {catalog.length === 0 ? (
            <p className="hint">No presets for this category yet — add your own below.</p>
          ) : (
            <ul className="catalog">
              {catalog.map((s) => {
                const isAdded = added.has(s.url)
                return (
                  <li key={s.url}>
                    <span className={`src-badge src-${s.type}`}>{TYPE_BADGE[s.type]}</span>
                    <span className="feed-name">{s.name}</span>
                    <button
                      className="btn tiny"
                      disabled={isAdded}
                      onClick={() => addSource(s.url, s.name, s.type)}
                    >
                      {isAdded ? '✓ Added' : '+ Add'}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}

          <h4>Add a subreddit</h4>
          <div className="add-feed">
            <input placeholder="programming" value={sub}
              onChange={(e) => setSub(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSubreddit()} />
            <button className="btn" onClick={addSubreddit}>Add</button>
          </div>

          <h4>Add a GitHub repo (releases)</h4>
          <div className="add-feed">
            <input placeholder="vercel/next.js" value={repo}
              onChange={(e) => setRepo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addRepo()} />
            <button className="btn" onClick={addRepo}>Add</button>
          </div>

          <h4>Add any RSS/Atom URL</h4>
          <div className="add-feed">
            <input type="url" placeholder="https://example.com/rss.xml" value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustom()} />
            <button className="btn" onClick={addCustom}>Add</button>
          </div>
        </section>

        <section>
          <h3>Favorite sites for {activeTopic?.name}</h3>
          <p className="hint">
            Favorited sites show up more often in this category, and you can tap one
            on the feed to see only its stories. Popular sites are suggested there too.
          </p>
          <div className="site-tags">
            {(activeTopic?.favoriteSites ?? []).length === 0 && (
              <span className="hint">No favorites yet.</span>
            )}
            {(activeTopic?.favoriteSites ?? []).map((d) => (
              <span key={d} className="site-tag custom">
                ★ {d}
                <button className="tag-x" onClick={() => removeSite(d)} title="Remove">✕</button>
              </span>
            ))}
          </div>
          <div className="add-feed">
            <input placeholder="favorite a site, e.g. espn.com" value={site}
              onChange={(e) => setSite(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSite()} />
            <button className="btn" onClick={addSite}>★ Favorite</button>
          </div>
        </section>

        <section>
          <h3>Your feeds ({config.feeds.length})</h3>
          <ul className="feed-list">
            {config.feeds.map((f) => {
              const topic = config.topics.find((t) => t.id === f.topicId)
              return (
                <li key={f.id}>
                  <span className="topic-dot" style={{ background: topic?.color ?? '#888' }} />
                  {f.type && <span className={`src-badge src-${f.type}`}>{TYPE_BADGE[f.type]}</span>}
                  <span className="feed-name">{f.title}</span>
                  <span className="feed-url">{topic?.name}</span>
                  <button className="btn tiny" onClick={() => removeFeed(f.id)}>✕</button>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="io">
          <button className="btn ghost" onClick={exportConfig}>Export config</button>
          <button className="btn ghost" onClick={() => fileRef.current?.click()}>Import config</button>
          <input ref={fileRef} type="file" accept="application/json" hidden
            onChange={(e) => e.target.files?.[0] && importConfig(e.target.files[0])} />
          <button className="btn ghost danger"
            onClick={() => confirm('Reset all feeds and categories to defaults?') && onChange(DEFAULT_CONFIG)}>
            Reset to defaults
          </button>
        </section>
      </aside>
    </div>
  )
}
