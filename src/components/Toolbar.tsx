import type { Topic } from '../types'
import { REFRESH_OPTIONS } from '../defaults'
import { relativeTime } from '../lib/format'

type Props = {
  topics: Topic[]
  activeTopic: string | null
  onTopic: (id: string | null) => void
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
  return (
    <header className="toolbar">
      <div className="toolbar-row">
        <h1 className="brand">📰 Personal News</h1>
        <input
          className="search"
          type="search"
          placeholder="Search headlines…"
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
            <option key={o.value} value={o.value}>
              ⟳ {o.label}
            </option>
          ))}
        </select>
        <button className="btn" onClick={props.onRefresh} disabled={props.loading}>
          {props.loading ? 'Refreshing…' : 'Refresh'}
        </button>
        <button className="btn ghost" onClick={props.onOpenSettings}>
          Settings
        </button>
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
            style={props.activeTopic === t.id ? { background: t.color, borderColor: t.color } : { borderColor: t.color }}
            onClick={() => props.onTopic(t.id)}
          >
            {t.name}
          </button>
        ))}
        <span className="status">
          {props.count} stories
          {props.lastUpdated ? ` · updated ${relativeTime(new Date(props.lastUpdated).toISOString())}` : ''}
        </span>
      </div>
    </header>
  )
}
