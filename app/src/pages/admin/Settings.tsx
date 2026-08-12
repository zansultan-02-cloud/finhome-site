import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus, Trash2 } from 'lucide-react'
import { AdminLayout } from '../../components/AdminLayout'
import { supabase } from '../../lib/supabaseClient'
import { useCategories } from '../../hooks/useStories'
import { useAuth } from '../../hooks/useAuth'
import type { Category } from '../../types'

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё\s-]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/[а-яё]/g, (ch) => {
      const map: Record<string, string> = {
        а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
        й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
        у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
        э: 'e', ю: 'yu', я: 'ya',
      }
      return map[ch] ?? ch
    })
}

function SortableCategoryRow({
  category,
  onRename,
  onDelete,
}: {
  category: Category
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 border-b border-[#e7e7ea] bg-white px-4 py-3 last:border-b-0"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-[#6b6b73] active:cursor-grabbing"
      >
        <GripVertical size={16} />
      </button>
      <input
        defaultValue={category.name}
        onBlur={(e) => onRename(category.id, e.target.value)}
        className="flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm hover:border-[#e7e7ea] focus:border-[#ff3b5c] focus:outline-none"
      />
      <span className="text-xs text-[#6b6b73]">{category.slug}</span>
      <button
        onClick={() => onDelete(category.id)}
        className="rounded-lg p-1.5 text-[#b0002d] hover:bg-[#fff5f7]"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

export function Settings() {
  const { categories, reload } = useCategories()
  const { session } = useAuth()
  const [newName, setNewName] = useState('')

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const list = categories

  const handleAdd = async () => {
    if (!newName.trim()) return
    await supabase.from('categories').insert({
      name: newName.trim(),
      slug: slugify(newName) || `category-${Date.now()}`,
      sort_order: list.length,
    })
    setNewName('')
    reload()
  }

  const handleRename = async (id: string, name: string) => {
    if (!name.trim()) return
    await supabase.from('categories').update({ name: name.trim() }).eq('id', id)
    reload()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить категорию? Истории в ней останутся без категории.')) return
    await supabase.from('categories').delete().eq('id', id)
    reload()
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = list.findIndex((c) => c.id === active.id)
    const newIndex = list.findIndex((c) => c.id === over.id)
    const reordered = arrayMove(list, oldIndex, newIndex)
    await Promise.all(
      reordered.map((c, i) => supabase.from('categories').update({ sort_order: i }).eq('id', c.id))
    )
    reload()
  }

  return (
    <AdminLayout>
      <h1 className="mb-6 text-2xl font-bold">Настройки</h1>

      <div className="mb-8 rounded-[22px] border border-[#e7e7ea] bg-white p-6">
        <h2 className="mb-1 text-lg font-bold">Аккаунт</h2>
        <p className="text-sm text-[#6b6b73]">{session?.user.email}</p>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Категории</h2>
      </div>

      <div className="mb-4 overflow-hidden rounded-[22px] border border-[#e7e7ea]">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={list.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            {list.map((category) => (
              <SortableCategoryRow
                key={category.id}
                category={category}
                onRename={handleRename}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
        {list.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-[#6b6b73]">Категорий пока нет.</div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Название новой категории"
          className="flex-1 rounded-xl border border-[#e7e7ea] px-3 py-2 text-sm outline-none focus:border-[#ff3b5c]"
        />
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 rounded-xl bg-[#ff3b5c] px-4 py-2 text-sm font-bold text-white"
        >
          <Plus size={16} />
          Добавить
        </button>
      </div>
    </AdminLayout>
  )
}
