import { useState, useRef } from 'react'
import type { Config, Feed } from '../types'
import { DEFAULT_CONFIG } from '../defaults'
import { hostname } from '../lib/format'

type Props = {
  config: Config
  onChange: (next: Config) => void
  onClose: () => void
}

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export function SettingsDrawer({ config, onChange, onClose }: Props) {
  const [url, setUrl] = useState('')
  const [topicId, setTopicId] = useState(config.topics[0]?.id ?? '')
  const fileRef = useRef<HTMLInputElement>(null)

  function addFeed() {
    const trimmed = url.trim()
    if (!trimmed) return
    const feed: Feed = { id: makeId('f'), url: trimmed, title: hostname(trimmed), topicId }
    onChange({ ...config, feeds: [...config.feeds, feed] })
    setUrl('')
  }

  function removeFeed(id: string) {
    onChange({ ...config, feeds: config.feeds.filter((f) => f.id !== id) })
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

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <h2>Settings</h2>
          <button className="btn ghost" onClick={onClose}>Close</button>
        </div>

        <section>
          <h3>Add a feed</h3>
          <div className="add-feed">
            <input
              type="url"
              placeholder="https://example.com/rss.xml"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addFeed()}
            />
            <select value={topicId} onChange={(e) => setTopicId(e.target.value)}>
              {config.topics.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <button className="btn" onClick={addFeed}>Add</button>
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
                  <span className="feed-name">{f.title}</span>
                  <span className="feed-url">{hostname(f.url)}</span>
                  <button className="btn tiny" onClick={() => removeFeed(f.id)}>✕</button>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="io">
          <button className="btn ghost" onClick={exportConfig}>Export config</button>
          <button className="btn ghost" onClick={() => fileRef.current?.click()}>Import config</button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => e.target.files?.[0] && importConfig(e.target.files[0])}
          />
          <button
            className="btn ghost danger"
            onClick={() => confirm('Reset all feeds and categories to defaults?') && onChange(DEFAULT_CONFIG)}
          >
            Reset to defaults
          </button>
        </section>
      </aside>
    </div>
  )
}
