import { Link } from 'react-router-dom'
import { AdminLayout } from '../../components/AdminLayout'
import { useStories } from '../../hooks/useStories'
import { StatusBadge } from './Stories/StatusBadge'

export function Dashboard() {
  const { stories, loading } = useStories()

  const counts = {
    published: stories.filter((s) => s.status === 'published').length,
    draft: stories.filter((s) => s.status === 'draft').length,
    hidden: stories.filter((s) => s.status === 'hidden').length,
  }

  return (
    <AdminLayout>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Опубликовано', value: counts.published },
          { label: 'Черновики', value: counts.draft },
          { label: 'Скрыто', value: counts.hidden },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-[22px] border border-[#e7e7ea] bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.06)]"
          >
            <div className="text-3xl font-bold">{loading ? '—' : stat.value}</div>
            <div className="text-sm text-[#6b6b73]">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Недавние истории</h2>
        <Link to="/admin/stories" className="text-sm font-medium text-[#ff3b5c]">
          Все Stories →
        </Link>
      </div>

      <div className="overflow-hidden rounded-[22px] border border-[#e7e7ea] bg-white">
        {stories.slice(0, 5).map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between border-b border-[#e7e7ea] px-5 py-3 last:border-b-0"
          >
            <span className="font-medium">{s.card_title}</span>
            <StatusBadge status={s.status} />
          </div>
        ))}
        {!loading && stories.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-[#6b6b73]">Историй пока нет.</div>
        )}
      </div>
    </AdminLayout>
  )
}
