import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import type { Article, Feed, RawItem } from '../types'
import { fetchFeeds } from '../lib/api'
import { splitTitleSource } from '../lib/googleNews'

type Opts = {
  webUrl: string
  webTopicId: string
  followed: Feed[]
  refreshInterval: number
}

function tagWeb(items: RawItem[], topicId: string): Article[] {
  return items.map((it) => {
    const { title, source } = splitTitleSource(it.title)
    return { ...it, title, source: source ?? it.source, topicId, origin: 'web' as const }
  })
}

export function useFeeds({ webUrl, webTopicId, followed, refreshInterval }: Opts) {
  const [web, setWeb] = useState<{ items: Article[]; loading: boolean; error: string | null }>({
    items: [], loading: false, error: null,
  })
  const [foll, setFoll] = useState<{ items: Article[]; errors: string[] }>({ items: [], errors: [] })
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)

  const feedByUrl = useRef<Map<string, Feed>>(new Map())
  feedByUrl.current = new Map(followed.map((f) => [f.url, f]))
  const followedKey = followed.map((f) => f.url).join('|')

  const loadWeb = useCallback(async () => {
    setWeb((s) => ({ ...s, loading: true }))
    try {
      const res = await fetchFeeds([webUrl])
      const r = res[0]
      setWeb({ items: r ? tagWeb(r.items, webTopicId) : [], loading: false, error: r?.error ?? null })
      setLastUpdated(Date.now())
    } catch (e) {
      setWeb({ items: [], loading: false, error: e instanceof Error ? e.message : String(e) })
    }
  }, [webUrl, webTopicId])

  const loadFollowed = useCallback(async () => {
    const urls = followed.map((f) => f.url)
    if (urls.length === 0) {
      setFoll({ items: [], errors: [] })
      return
    }
    try {
      const res = await fetchFeeds(urls)
      const items: Article[] = []
      const errors: string[] = []
      for (const r of res) {
        if (r.error) errors.push(`${r.url}: ${r.error}`)
        const feed = feedByUrl.current.get(r.url)
        for (const it of r.items) {
          items.push({ ...it, topicId: feed?.topicId ?? '', sourceType: feed?.type, origin: 'followed' })
        }
      }
      setFoll({ items, errors })
    } catch (e) {
      setFoll({ items: [], errors: [e instanceof Error ? e.message : String(e)] })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followedKey])

  useEffect(() => {
    const id = setTimeout(loadWeb, 400)
    return () => clearTimeout(id)
  }, [loadWeb])

  useEffect(() => {
    loadFollowed()
  }, [loadFollowed])

  useEffect(() => {
    if (refreshInterval <= 0) return
    const id = setInterval(() => {
      loadWeb()
      loadFollowed()
    }, refreshInterval)
    return () => clearInterval(id)
  }, [refreshInterval, loadWeb, loadFollowed])

  const articles = useMemo(() => {
    const all = [...web.items, ...foll.items]
    all.sort((a, b) => {
      const ta = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
      const tb = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
      return tb - ta
    })
    const seen = new Set<string>()
    return all.filter((a) => {
      const key = a.link || a.title
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [web.items, foll.items])

  const refresh = useCallback(() => {
    loadWeb()
    loadFollowed()
  }, [loadWeb, loadFollowed])

  const errors = [...(web.error ? [web.error] : []), ...foll.errors]

  return { articles, loading: web.loading, errors, lastUpdated, refresh }
}
