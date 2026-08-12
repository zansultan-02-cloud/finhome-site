import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AdminLayout } from '../../../components/AdminLayout'
import { supabase } from '../../../lib/supabaseClient'
import { useCategories } from '../../../hooks/useStories'
import type { Story, StoryStatus } from '../../../types'
import { PagesEditor } from './PagesEditor'

export function StoryEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { categories } = useCategories()
  const [story, setStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    supabase
      .from('stories')
      .select('*, story_pages(*)')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setStory(data as Story)
        setLoading(false)
      })
  }, [id])

  const handleSave = async () => {
    if (!story) return
    setSaving(true)
    const { error } = await supabase
      .from('stories')
      .update({
        title: story.title,
        card_title: story.card_title,
        category_id: story.category_id,
        cover_image_url: story.cover_image_url,
        status: story.status,
        expires_at: story.expires_at,
        updated_at: new Date().toISOString(),
      })
      .eq('id', story.id)
    setSaving(false)
    if (!error) navigate('/admin/stories')
  }

  if (loading || !story) {
    return (
      <AdminLayout>
        <div className="text-sm text-[#6b6b73]">Загрузка…</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <button
        onClick={() => navigate('/admin/stories')}
        className="mb-4 flex items-center gap-1.5 text-sm text-[#6b6b73] hover:text-[#111111]"
      >
        <ArrowLeft size={16} />К списку Stories
      </button>

      <div className="mb-6 max-w-xl">
        <div className="rounded-[22px] border border-[#e7e7ea] bg-white p-6">
          <h1 className="mb-5 text-xl font-bold">Настройки истории</h1>

          <label className="mb-1 block text-sm font-medium text-[#6b6b73]">
            Заголовок карточки (в списке Stories)
          </label>
          <input
            value={story.card_title}
            onChange={(e) => setStory({ ...story, card_title: e.target.value })}
            className="mb-4 w-full rounded-xl border border-[#e7e7ea] px-3 py-2 outline-none focus:border-[#ff3b5c]"
          />

          <label className="mb-1 block text-sm font-medium text-[#6b6b73]">
            Внутреннее название (для админки)
          </label>
          <input
            value={story.title}
            onChange={(e) => setStory({ ...story, title: e.target.value })}
            className="mb-4 w-full rounded-xl border border-[#e7e7ea] px-3 py-2 outline-none focus:border-[#ff3b5c]"
          />

          <label className="mb-1 block text-sm font-medium text-[#6b6b73]">Категория</label>
          <select
            value={story.category_id ?? ''}
            onChange={(e) => setStory({ ...story, category_id: e.target.value || null })}
            className="mb-4 w-full rounded-xl border border-[#e7e7ea] px-3 py-2 outline-none focus:border-[#ff3b5c]"
          >
            <option value="">Без категории</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <label className="mb-1 block text-sm font-medium text-[#6b6b73]">
            URL обложки (миниатюра в списке Stories)
          </label>
          <input
            value={story.cover_image_url ?? ''}
            onChange={(e) => setStory({ ...story, cover_image_url: e.target.value })}
            placeholder="https://…"
            className="mb-4 w-full rounded-xl border border-[#e7e7ea] px-3 py-2 outline-none focus:border-[#ff3b5c]"
          />

          <label className="mb-1 block text-sm font-medium text-[#6b6b73]">Статус</label>
          <select
            value={story.status}
            onChange={(e) => setStory({ ...story, status: e.target.value as StoryStatus })}
            className="mb-6 w-full rounded-xl border border-[#e7e7ea] px-3 py-2 outline-none focus:border-[#ff3b5c]"
          >
            <option value="draft">Черновик</option>
            <option value="published">Опубликовано</option>
            <option value="hidden">Скрыто</option>
          </select>

          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-[#ff3b5c] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {saving ? 'Сохраняем…' : 'Сохранить'}
          </button>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-bold">Экраны истории</h2>
      <PagesEditor storyId={story.id} />
    </AdminLayout>
  )
}
