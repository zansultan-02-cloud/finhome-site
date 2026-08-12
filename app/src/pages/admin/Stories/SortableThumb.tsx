import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Image as ImageIcon, X } from 'lucide-react'
import type { StoryPage } from '../../../types'

export function SortableThumb({
  page,
  index,
  active,
  onSelect,
  onRemove,
}: {
  page: StoryPage
  index: number
  active: boolean
  onSelect: () => void
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: page.id,
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
      {...attributes}
      {...listeners}
      onClick={onSelect}
      className={`relative flex h-20 w-14 shrink-0 cursor-pointer touch-none items-center justify-center overflow-hidden rounded-xl border-2 bg-[#f0f0f2] ${
        active ? 'border-[#ff3b5c]' : 'border-transparent'
      }`}
    >
      {page.image_url ? (
        <img src={page.image_url} alt="" className="h-full w-full object-cover" />
      ) : (
        <ImageIcon size={16} className="text-[#6b6b73]" />
      )}
      <span className="absolute bottom-1 left-1 rounded bg-black/50 px-1 text-[10px] font-bold text-white">
        {index + 1}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="absolute right-1 top-1 rounded-full bg-black/50 p-0.5 text-white"
      >
        <X size={10} />
      </button>
    </div>
  )
}
