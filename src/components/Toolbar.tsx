import { useState } from 'react'
import type { Topic } from '../types'
import type { SiteOption } from '../sources'
import { REFRESH_OPTIONS } from '../defaults'
import { relativeTime } from '../lib/format'

type Props = {
  topics: Topic[]
  activeTopic: string | null
  onTopic: (id: string | null) => void
  keywordValue: string
  onKeywords: (v: string) => void
  favorites: string[]
  suggestions: SiteOption[]
  onlySites: string[]
  onToggleOnly: (domain: string) => void
  onAddOnly: (raw: string) => void
  onFavorite: (raw: string) => void
  onUnfavorite: (domain: string) => void
  onClearOnly: () => void
  search: string
  onSearch: (v: string) => void
  refreshInterval: number
  onInterval: (v: number) => void
  onRefresh: () => void
  onOpenSettings: () => void
  loading: boolean
  lastUpdated: number | null
  count: number
}

export function Toolbar(props: Props) {
  const active = props.activeTopic ? props.topics.find((t) => t.id === props.activeTopic) : null
  const [siteInput, setSiteInput] = useState('')

  function submitOnly() {
    if (!siteInput.trim()) return
    props.onAddOnly(siteInput)
    setSiteInput('')
  }
  function submitFav() {
    if (!siteInput.trim()) return
    props.onFavorite(siteInput)
    setSiteInput('')
  }

  return (
    <header className="toolbar">
      <div className="toolbar-row">
        <h1 className="brand">📰 Personal News</h1>
        <input
          className="search"
          type="search"
          placeholder="Search the web for news…"
          value={props.search}
          onChange={(e) => props.onSearch(e.target.value)}
        />
        <select
          className="interval"
          value={props.refreshInterval}
          onChange={(e) => props.onInterval(Number(e.target.value))}
          title="Auto-refresh"
        >
          {REFRESH_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>⟳ {o.label}</option>
          ))}
        </select>
        <button className="btn" onClick={props.onRefresh} disabled={props.loading}>
          {props.loading ? 'Refreshing…' : 'Refresh'}
        </button>
        <button className="btn ghost" onClick={props.onOpenSettings}>Settings</button>
      </div>

      <div className="toolbar-row chips">
        <button
          className={`chip ${props.activeTopic === null ? 'active' : ''}`}
          onClick={() => props.onTopic(null)}
        >
          All
        </button>
        {props.topics.map((t) => (
          <button
            key={t.id}
            className={`chip ${props.activeTopic === t.id ? 'active' : ''}`}
            style={props.activeTopic === t.id ? { background: t.color, borderColor: t.color } : undefined}
            onClick={() => props.onTopic(t.id)}
          >
            {t.name}
          </button>
        ))}
      </div>

      {active && (
        <div className="toolbar-row keyword-row">
          <span className="topic-dot" style={{ background: active.color }} />
          <input
            className="keyword-box"
            type="text"
            placeholder={`Narrow ${active.name} — e.g. cyber security, ransomware`}
            value={props.keywordValue}
            onChange={(e) => props.onKeywords(e.target.value)}
          />
          {props.keywordValue && (
            <button className="btn ghost" onClick={() => props.onKeywords('')}>Clear</button>
          )}
          <span className="status">{props.count} stories</span>
        </div>
      )}

      {active && (
        <div className="toolbar-row site-row">
          <span className="site-label">Sites:</span>
          {props.favorites.map((d) => (
            <button
              key={d}
              className={`chip site-chip ${props.onlySites.includes(d) ? 'active' : ''}`}
              onClick={() => props.onToggleOnly(d)}
              title={`Click to show only ${d}`}
            >
              ★ {d}
              <span
                className="tag-x"
                role="button"
                onClick={(e) => { e.stopPropagation(); props.onUnfavorite(d) }}
                title="Unfavorite"
              >
                ✕
              </span>
            </button>
          ))}
          {props.onlySites.filter((d) => !props.favorites.includes(d)).map((d) => (
            <button key={d} className="chip site-chip active" onClick={() => props.onToggleOnly(d)} title="Click to remove">
              {d} ✕
            </button>
          ))}
          <input
            className="site-input"
            type="text"
            placeholder="type a site, e.g. espn.com"
            value={siteInput}
            onChange={(e) => setSiteInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitOnly()}
          />
          <button className="btn tiny" onClick={submitOnly} title="Show only this site">Only</button>
          <button className="btn tiny" onClick={submitFav} title="Favorite — show it more often">★ Favorite</button>
          {props.onlySites.length > 0 && (
            <button className="btn ghost" onClick={props.onClearOnly}>All sites</button>
          )}
          {props.suggestions.length > 0 && <span className="site-label">Suggested:</span>}
          {props.suggestions.map((s) => (
            <button
              key={s.domain}
              className="chip site-chip suggest"
              onClick={() => props.onFavorite(s.domain)}
              title={`Favorite ${s.domain}`}
            >
              + {s.name}
            </button>
          ))}
        </div>
      )}

      {!active && (
        <div className="toolbar-row">
          <span className="status">
            {props.count} stories
            {props.lastUpdated ? ` · updated ${relativeTime(new Date(props.lastUpdated).toISOString())}` : ''}
          </span>
        </div>
      )}
    </header>
  )
}
