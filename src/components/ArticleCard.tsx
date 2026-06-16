import type { Article, Topic } from '../types'
import { relativeTime, hostname } from '../lib/format'

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
          <span className="card-source">{article.source || hostname(article.link)}</span>
          <span className="card-time">{relativeTime(article.publishedAt)}</span>
        </div>
        <h3 className="card-title">{article.title}</h3>
        {article.summary && <p className="card-summary">{article.summary}</p>}
      </div>
    </a>
  )
}
