import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react'
import { AdminLayout } from '../../../components/AdminLayout'
import { useStories, useCategories } from '../../../hooks/useStories'
import { StatusBadge } from './StatusBadge'
import { SortableRow } from './SortableRow'
import type { StoryStatus } from '../../../types'

export function StoriesList() {
  const { stories, loading, error, createStory, setStatus, deleteStory, reorder } = useStories()
  const { categories } = useCategories()
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const categoryName = (id: string | null) =>
    categories.find((c) => c.id === id)?.name ?? '—'

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = stories.findIndex((s) => s.id === active.id)
    const newIndex = stories.findIndex((s) => s.id === over.id)
    const newOrder = arrayMove(stories, oldIndex, newIndex).map((s) => s.id)
    reorder(newOrder)
  }

  const handleCreate = async () => {
    setCreating(true)
    try {
      const story = await createStory({})
      navigate(`/admin/stories/${story.id}`)
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Удалить историю «${title}»? Это действие нельзя отменить.`)) return
    await deleteStory(id)
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stories</h1>
          <p className="text-sm text-[#6b6b73]">
            Перетаскивайте строки, чтобы изменить порядок в приложении.
          </p>
        </div>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="flex items-center gap-2 rounded-xl bg-[#ff3b5c] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          <Plus size={16} />
          Новая история
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-[#ffe9ee] bg-[#fff5f7] px-4 py-3 text-sm text-[#b0002d]">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-[22px] border border-[#e7e7ea] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#e7e7ea] bg-[#f7f7f8] text-xs uppercase tracking-wide text-[#6b6b73]">
            <tr>
              <th className="w-8"></th>
              <th className="px-3 py-3">Обложка</th>
              <th className="px-3 py-3">Название</th>
              <th className="px-3 py-3">Категория</th>
              <th className="px-3 py-3">Статус</th>
              <th className="px-3 py-3">Экраны</th>
              <th className="w-24 px-3 py-3"></th>
            </tr>
          </thead>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={stories.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <tbody>
                {stories.map((story) => (
                  <SortableRow key={story.id} id={story.id}>
                    <td className="px-3 py-2">
                      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-[#f0f0f2]">
                        {story.cover_image_url ? (
                          <img
                            src={story.cover_image_url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon size={16} className="text-[#6b6b73]" />
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="font-medium">{story.card_title}</div>
                      <div className="text-xs text-[#6b6b73]">{story.title}</div>
                    </td>
                    <td className="px-3 py-2 text-[#6b6b73]">{categoryName(story.category_id)}</td>
                    <td className="px-3 py-2">
                      <select
                        value={story.status}
                        onChange={(e) => setStatus(story.id, e.target.value as StoryStatus)}
                        className="rounded-lg border border-[#e7e7ea] bg-transparent px-2 py-1 text-xs"
                      >
                        <option value="draft">Черновик</option>
                        <option value="published">Опубликовано</option>
                        <option value="hidden">Скрыто</option>
                      </select>
                      <div className="mt-1">
                        <StatusBadge status={story.status} />
                      </div>
                    </td>
                    <td className="px-3 py-2 text-[#6b6b73]">{story.story_pages?.length ?? 0}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/stories/${story.id}`)}
                          className="rounded-lg p-2 text-[#6b6b73] hover:bg-[#f7f7f8]"
                          title="Редактировать"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(story.id, story.card_title)}
                          className="rounded-lg p-2 text-[#b0002d] hover:bg-[#fff5f7]"
                          title="Удалить"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </SortableRow>
                ))}
              </tbody>
            </SortableContext>
          </DndContext>
        </table>

        {!loading && stories.length === 0 && (
          <div className="px-6 py-12 text-center text-sm text-[#6b6b73]">
            Историй пока нет. Нажмите «Новая история», чтобы создать первую.
          </div>
        )}
        {loading && <div className="px-6 py-12 text-center text-sm text-[#6b6b73]">Загрузка…</div>}
      </div>
    </AdminLayout>
  )
}
