import { useState, useMemo } from 'react'
import type { Config } from './types'
import { DEFAULT_CONFIG } from './defaults'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useFeeds } from './hooks/useFeeds'
import { Toolbar } from './components/Toolbar'
import { ArticleCard } from './components/ArticleCard'
import { SettingsDrawer } from './components/SettingsDrawer'

export default function App() {
  const [config, setConfig] = useLocalStorage<Config>('pns-config', DEFAULT_CONFIG)
  const [activeTopic, setActiveTopic] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)

  const { articles, loading, errors, lastUpdated, refresh } = useFeeds(config)

  const topicById = useMemo(
    () => new Map(config.topics.map((t) => [t.id, t])),
    [config.topics],
  )

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    const topic = activeTopic ? topicById.get(activeTopic) : null
    const keywords = topic?.keywords ?? []
    return articles.filter((a) => {
      if (activeTopic && a.topicId !== activeTopic) return false
      const haystack = `${a.title} ${a.summary}`.toLowerCase()
      if (keywords.length > 0 && !keywords.some((k) => haystack.includes(k.toLowerCase()))) return false
      if (q && !haystack.includes(q)) return false
      return true
    })
  }, [articles, activeTopic, search, topicById])

  function setRefreshInterval(refreshInterval: number) {
    setConfig({ ...config, refreshInterval })
  }

  return (
    <div className="app">
      <Toolbar
        topics={config.topics}
        activeTopic={activeTopic}
        onTopic={setActiveTopic}
        search={search}
        onSearch={setSearch}
        refreshInterval={config.refreshInterval}
        onInterval={setRefreshInterval}
        onRefresh={refresh}
        onOpenSettings={() => setSettingsOpen(true)}
        loading={loading}
        lastUpdated={lastUpdated}
        count={visible.length}
      />

      {errors.length > 0 && (
        <div className="errors">
          {errors.length} feed{errors.length > 1 ? 's' : ''} failed to load.
        </div>
      )}

      {visible.length === 0 && !loading ? (
        <div className="empty">
          {config.feeds.length === 0
            ? 'No feeds yet — open Settings to add one.'
            : 'No stories match the current filter.'}
        </div>
      ) : (
        <main className="grid">
          {visible.map((a, i) => (
            <ArticleCard key={`${a.link}-${i}`} article={a} topic={topicById.get(a.topicId)} />
          ))}
        </main>
      )}

      {settingsOpen && (
        <SettingsDrawer config={config} onChange={setConfig} onClose={() => setSettingsOpen(false)} />
      )}
    </div>
  )
}
