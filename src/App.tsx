import { useState, useMemo, useEffect } from 'react'
import type { Config } from './types'
import { DEFAULT_CONFIG, PAGE_SIZE } from './defaults'
import { matchesWord } from './lib/format'
import { buildWebUrl } from './lib/googleNews'
import { SITE_CATALOG, normalizeDomain } from './sources'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useFeeds } from './hooks/useFeeds'
import { Toolbar } from './components/Toolbar'
import { ArticleCard } from './components/ArticleCard'
import { SettingsDrawer } from './components/SettingsDrawer'
import { PaperShader } from './components/PaperShader'

export default function App() {
  const [config, setConfig] = useLocalStorage<Config>('pns-config', DEFAULT_CONFIG)
  const [activeTopic, setActiveTopic] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [onlySites, setOnlySites] = useState<string[]>([])
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [limit, setLimit] = useState(PAGE_SIZE)

  const topicById = useMemo(() => new Map(config.topics.map((t) => [t.id, t])), [config.topics])
  const activeTopicObj = activeTopic ? topicById.get(activeTopic) ?? null : null
  const activeKeywords = activeTopicObj?.keywords ?? []
  const favorites = activeTopicObj?.favoriteSites ?? []

  const suggestions = useMemo(() => {
    if (!activeTopic) return []
    return (SITE_CATALOG[activeTopic] ?? []).filter((s) => !favorites.includes(s.domain))
  }, [activeTopic, favorites])

  const terms = useMemo(() => {
    const t = [...activeKeywords]
    if (search.trim()) t.push(search.trim())
    return t
  }, [activeKeywords, search])

  const baseUrl = useMemo(
    () => buildWebUrl(activeTopicObj, terms, onlySites),
    [activeTopicObj, terms, onlySites],
  )
  const boostUrl = useMemo(
    () => (favorites.length > 0 && onlySites.length === 0 ? buildWebUrl(activeTopicObj, terms, favorites) : null),
    [activeTopicObj, terms, favorites, onlySites],
  )
  const webUrls = useMemo(() => (boostUrl ? [baseUrl, boostUrl] : [baseUrl]), [baseUrl, boostUrl])

  const followed = useMemo(
    () => (activeTopic ? config.feeds.filter((f) => f.topicId === activeTopic) : config.feeds),
    [config.feeds, activeTopic],
  )

  const { articles, loading, errors, lastUpdated, refresh } = useFeeds({
    webUrls,
    webTopicId: activeTopic ?? '',
    followed,
    refreshInterval: config.refreshInterval,
  })

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return articles.filter((a) => {
      if (a.origin === 'web') return true
      const haystack = `${a.title} ${a.summary}`
      if (activeKeywords.length > 0 && !activeKeywords.some((k) => matchesWord(haystack, k))) return false
      if (q && !haystack.toLowerCase().includes(q)) return false
      return true
    })
  }, [articles, activeKeywords, search])

  useEffect(() => {
    setLimit(PAGE_SIZE)
  }, [webUrls])

  useEffect(() => {
    setOnlySites([])
  }, [activeTopic])

  function setTopicKeywords(raw: string) {
    if (!activeTopic) return
    const keywords = raw.split(',').map((k) => k.trim()).filter(Boolean)
    setConfig({
      ...config,
      topics: config.topics.map((t) => (t.id === activeTopic ? { ...t, keywords } : t)),
    })
  }

  function toggleOnly(domain: string) {
    setOnlySites((cur) => (cur.includes(domain) ? cur.filter((d) => d !== domain) : [...cur, domain]))
  }

  function addOnly(raw: string) {
    const d = normalizeDomain(raw)
    if (!d) return alert('Enter a site like espn.com')
    setOnlySites((cur) => (cur.includes(d) ? cur : [...cur, d]))
  }

  function favorite(raw: string) {
    const d = normalizeDomain(raw)
    if (!d) return alert('Enter a site like espn.com')
    if (!activeTopic) return
    setConfig({
      ...config,
      topics: config.topics.map((t) =>
        t.id === activeTopic && !(t.favoriteSites ?? []).includes(d)
          ? { ...t, favoriteSites: [...(t.favoriteSites ?? []), d] }
          : t,
      ),
    })
  }

  function unfavorite(domain: string) {
    if (!activeTopic) return
    setConfig({
      ...config,
      topics: config.topics.map((t) =>
        t.id === activeTopic ? { ...t, favoriteSites: (t.favoriteSites ?? []).filter((d) => d !== domain) } : t,
      ),
    })
  }

  const shown = visible.slice(0, limit)

  return (
    <div className="app">
      <PaperShader className="bg-vector" />
      <Toolbar
        topics={config.topics}
        activeTopic={activeTopic}
        onTopic={setActiveTopic}
        keywordValue={activeKeywords.join(', ')}
        onKeywords={setTopicKeywords}
        favorites={favorites}
        suggestions={suggestions}
        onlySites={onlySites}
        onToggleOnly={toggleOnly}
        onAddOnly={addOnly}
        onFavorite={favorite}
        onUnfavorite={unfavorite}
        onClearOnly={() => setOnlySites([])}
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
          {errors.length} source{errors.length > 1 ? 's' : ''} failed to load.
        </div>
      )}

      {visible.length === 0 && !loading ? (
        <div className="empty">No stories found. Try a different search or category.</div>
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
