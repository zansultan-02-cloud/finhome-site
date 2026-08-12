import { useEffect, useRef, useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { Plus, Upload, Loader2 } from 'lucide-react'
import { supabase } from '../../../lib/supabaseClient'
import { uploadImage } from '../../../lib/uploadImage'
import type { StoryButtonType, StoryPage } from '../../../types'
import { SortableThumb } from './SortableThumb'
import { PhonePreview } from './PhonePreview'

export function PagesEditor({ storyId }: { storyId: string }) {
  const [pages, setPages] = useState<StoryPage[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('story_pages')
      .select('*')
      .eq('story_id', storyId)
      .order('sort_order')
    setPages(data ?? [])
    if (data && data.length > 0 && !selectedId) setSelectedId(data[0].id)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId])

  const selected = pages.find((p) => p.id === selectedId) ?? null

  const addPage = async () => {
    const { data, error } = await supabase
      .from('story_pages')
      .insert({ story_id: storyId, sort_order: pages.length, button_type: 'none' })
      .select()
      .single()
    if (error) return
    setPages((prev) => [...prev, data as StoryPage])
    setSelectedId((data as StoryPage).id)
  }

  const removePage = async (id: string) => {
    if (!confirm('Удалить этот экран?')) return
    await supabase.from('story_pages').delete().eq('id', id)
    const remaining = pages.filter((p) => p.id !== id)
    setPages(remaining)
    if (selectedId === id) setSelectedId(remaining[0]?.id ?? null)
  }

  const updateSelected = (patch: Partial<StoryPage>) => {
    if (!selected) return
    setPages((prev) => prev.map((p) => (p.id === selected.id ? { ...p, ...patch } : p)))
  }

  const saveSelected = async () => {
    if (!selected) return
    await supabase
      .from('story_pages')
      .update({
        image_url: selected.image_url,
        title: selected.title,
        body: selected.body,
        button_title: selected.button_title,
        button_type: selected.button_type,
        button_url: selected.button_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', selected.id)
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const url = await uploadImage(file, storyId)
      updateSelected({ image_url: url })
      await supabase.from('story_pages').update({ image_url: url }).eq('id', selected!.id)
    } catch (err) {
      alert('Не удалось загрузить изображение: ' + (err as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = pages.findIndex((p) => p.id === active.id)
    const newIndex = pages.findIndex((p) => p.id === over.id)
    const reordered = arrayMove(pages, oldIndex, newIndex)
    setPages(reordered)
    await Promise.all(
      reordered.map((p, i) => supabase.from('story_pages').update({ sort_order: i }).eq('id', p.id))
    )
  }

  if (loading) return <div className="text-sm text-[#6b6b73]">Загрузка экранов…</div>

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_220px]">
      <div>
        <div className="mb-4 flex items-center gap-3 overflow-x-auto pb-2">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={pages.map((p) => p.id)} strategy={horizontalListSortingStrategy}>
              {pages.map((page, i) => (
                <SortableThumb
                  key={page.id}
                  page={page}
                  index={i}
                  active={page.id === selectedId}
                  onSelect={() => setSelectedId(page.id)}
                  onRemove={() => removePage(page.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
          <button
            onClick={addPage}
            className="flex h-20 w-14 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#e7e7ea] text-[#6b6b73] hover:border-[#ff3b5c] hover:text-[#ff3b5c]"
          >
            <Plus size={18} />
            <span className="text-[10px] font-medium">Экран</span>
          </button>
        </div>

        {selected ? (
          <div className="rounded-[22px] border border-[#e7e7ea] bg-white p-6">
            <label className="mb-1 block text-sm font-medium text-[#6b6b73]">Изображение</label>
            <div className="mb-4 flex items-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 rounded-xl border border-[#e7e7ea] px-3 py-2 text-sm font-medium hover:bg-[#f7f7f8] disabled:opacity-60"
              >
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {uploading ? 'Загрузка…' : 'Загрузить фото'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              />
              <input
                value={selected.image_url ?? ''}
                onChange={(e) => updateSelected({ image_url: e.target.value })}
                onBlur={saveSelected}
                placeholder="или вставьте URL"
                className="flex-1 rounded-xl border border-[#e7e7ea] px-3 py-2 text-sm outline-none focus:border-[#ff3b5c]"
              />
            </div>

            <label className="mb-1 block text-sm font-medium text-[#6b6b73]">Заголовок</label>
            <input
              value={selected.title ?? ''}
              onChange={(e) => updateSelected({ title: e.target.value })}
              onBlur={saveSelected}
              className="mb-4 w-full rounded-xl border border-[#e7e7ea] px-3 py-2 outline-none focus:border-[#ff3b5c]"
            />

            <label className="mb-1 block text-sm font-medium text-[#6b6b73]">Текст</label>
            <textarea
              value={selected.body ?? ''}
              onChange={(e) => updateSelected({ body: e.target.value })}
              onBlur={saveSelected}
              rows={3}
              className="mb-4 w-full rounded-xl border border-[#e7e7ea] px-3 py-2 outline-none focus:border-[#ff3b5c]"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#6b6b73]">Тип кнопки</label>
                <select
                  value={selected.button_type}
                  onChange={(e) => {
                    updateSelected({ button_type: e.target.value as StoryButtonType })
                    setTimeout(saveSelected, 0)
                  }}
                  className="w-full rounded-xl border border-[#e7e7ea] px-3 py-2 outline-none focus:border-[#ff3b5c]"
                >
                  <option value="none">Нет</option>
                  <option value="externalURL">Внешняя ссылка</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="deepLink">Deep link (в приложении)</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#6b6b73]">Текст кнопки</label>
                <input
                  value={selected.button_title ?? ''}
                  onChange={(e) => updateSelected({ button_title: e.target.value })}
                  onBlur={saveSelected}
                  className="w-full rounded-xl border border-[#e7e7ea] px-3 py-2 outline-none focus:border-[#ff3b5c]"
                />
              </div>
            </div>

            {selected.button_type !== 'none' && (
              <div className="mt-3">
                <label className="mb-1 block text-sm font-medium text-[#6b6b73]">
                  {selected.button_type === 'whatsapp' ? 'Номер WhatsApp' : 'URL / deep link'}
                </label>
                <input
                  value={selected.button_url ?? ''}
                  onChange={(e) => updateSelected({ button_url: e.target.value })}
                  onBlur={saveSelected}
                  className="w-full rounded-xl border border-[#e7e7ea] px-3 py-2 outline-none focus:border-[#ff3b5c]"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-[22px] border border-dashed border-[#e7e7ea] p-10 text-center text-sm text-[#6b6b73]">
            Нет экранов. Нажмите «Экран», чтобы добавить первый.
          </div>
        )}
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <div className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-[#6b6b73]">
          Превью
        </div>
        <PhonePreview page={selected} />
      </div>
    </div>
  )
}
