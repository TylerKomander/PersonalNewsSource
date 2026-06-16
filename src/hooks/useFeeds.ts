import { useState, useEffect, useCallback, useRef } from 'react'
import type { Article, Config } from '../types'
import { fetchFeeds } from '../lib/api'

type State = {
  articles: Article[]
  loading: boolean
  errors: string[]
  lastUpdated: number | null
}

export function useFeeds(config: Config) {
  const [state, setState] = useState<State>({
    articles: [],
    loading: false,
    errors: [],
    lastUpdated: null,
  })

  const topicByUrl = useRef<Map<string, string>>(new Map())
  topicByUrl.current = new Map(config.feeds.map((f) => [f.url, f.topicId]))

  const urls = config.feeds.map((f) => f.url)
  const urlKey = urls.join('|')

  const refresh = useCallback(async () => {
    if (urls.length === 0) {
      setState({ articles: [], loading: false, errors: [], lastUpdated: Date.now() })
      return
    }
    setState((s) => ({ ...s, loading: true }))
    try {
      const results = await fetchFeeds(urls)
      const errors: string[] = []
      const articles: Article[] = []
      for (const r of results) {
        if (r.error) errors.push(`${r.url}: ${r.error}`)
        const topicId = topicByUrl.current.get(r.url) ?? ''
        for (const item of r.items) articles.push({ ...item, topicId })
      }
      articles.sort((a, b) => {
        const ta = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
        const tb = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
        return tb - ta
      })
      setState({ articles, loading: false, errors, lastUpdated: Date.now() })
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        errors: [err instanceof Error ? err.message : String(err)],
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKey])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    if (config.refreshInterval <= 0) return
    const id = setInterval(refresh, config.refreshInterval)
    return () => clearInterval(id)
  }, [config.refreshInterval, refresh])

  return { ...state, refresh }
}
