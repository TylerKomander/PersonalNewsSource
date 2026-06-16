import type { Article, SourceType, Topic } from '../types'
import { relativeTime, hostname } from '../lib/format'

const TYPE_BADGE: Record<SourceType, string> = { rss: 'RSS', reddit: 'Reddit', github: 'GitHub' }

export function ArticleCard({ article, topic }: { article: Article; topic?: Topic }) {
  return (
    <a className="card" href={article.link} target="_blank" rel="noreferrer">
      {article.image && (
        <div className="card-image">
          <img src={article.image} alt="" loading="lazy" referrerPolicy="no-referrer" />
        </div>
      )}
      <div className="card-body">
        <div className="card-meta">
          {topic && (
            <span className="topic-dot" style={{ background: topic.color }} title={topic.name} />
          )}
          {article.sourceType && (
            <span className={`src-badge src-${article.sourceType}`}>{TYPE_BADGE[article.sourceType]}</span>
          )}
          <span className="card-source">{article.source || hostname(article.link)}</span>
          <span className="card-time">{relativeTime(article.publishedAt)}</span>
        </div>
        <h3 className="card-title">{article.title}</h3>
        {article.summary && <p className="card-summary">{article.summary}</p>}
      </div>
    </a>
  )
}
