import { useState, useMemo, useEffect } from 'react'
import type { Config } from './types'
import { DEFAULT_CONFIG, PAGE_SIZE } from './defaults'
import { matchesWord } from './lib/format'
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
  const [limit, setLimit] = useState(PAGE_SIZE)

  const { articles, loading, errors, lastUpdated, refresh } = useFeeds(config)

  const topicById = useMemo(
    () => new Map(config.topics.map((t) => [t.id, t])),
    [config.topics],
  )

  const activeKeywords = activeTopic ? topicById.get(activeTopic)?.keywords ?? [] : []

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return articles.filter((a) => {
      if (activeTopic && a.topicId !== activeTopic) return false
      const haystack = `${a.title} ${a.summary}`
      if (activeKeywords.length > 0 && !activeKeywords.some((k) => matchesWord(haystack, k))) return false
      if (q && !haystack.toLowerCase().includes(q)) return false
      return true
    })
  }, [articles, activeTopic, activeKeywords, search])

  useEffect(() => {
    setLimit(PAGE_SIZE)
  }, [activeTopic, search, activeKeywords])

  function setTopicKeywords(raw: string) {
    if (!activeTopic) return
    const keywords = raw.split(',').map((k) => k.trim()).filter(Boolean)
    setConfig({
      ...config,
      topics: config.topics.map((t) => (t.id === activeTopic ? { ...t, keywords } : t)),
    })
  }

  const shown = visible.slice(0, limit)

  return (
    <div className="app">
      <Toolbar
        topics={config.topics}
        activeTopic={activeTopic}
        onTopic={setActiveTopic}
        keywordValue={activeKeywords.join(', ')}
        onKeywords={setTopicKeywords}
        search={search}
        onSearch={setSearch}
        refreshInterval={config.refreshInterval}
        onInterval={(refreshInterval) => setConfig({ ...config, refreshInterval })}
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
        <>
          <main className="grid">
            {shown.map((a, i) => (
              <ArticleCard key={`${a.link}-${i}`} article={a} topic={topicById.get(a.topicId)} />
            ))}
          </main>
          {limit < visible.length && (
            <div className="load-more">
              <button className="btn ghost" onClick={() => setLimit((n) => n + PAGE_SIZE)}>
                Load more ({visible.length - limit} left)
              </button>
            </div>
          )}
        </>
      )}

      {settingsOpen && (
        <SettingsDrawer config={config} onChange={setConfig} onClose={() => setSettingsOpen(false)} />
      )}
    </div>
  )
}
