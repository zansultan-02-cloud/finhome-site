import type { StoryStatus } from '../../../types'

const STYLES: Record<StoryStatus, string> = {
  draft: 'bg-[#f0f0f2] text-[#6b6b73]',
  published: 'bg-[#e6f7ec] text-[#0a7a35]',
  hidden: 'bg-[#ffe9ee] text-[#b0002d]',
}

const LABELS: Record<StoryStatus, string> = {
  draft: 'Черновик',
  published: 'Опубликовано',
  hidden: 'Скрыто',
}

export function StatusBadge({ status }: { status: StoryStatus }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  )
}
