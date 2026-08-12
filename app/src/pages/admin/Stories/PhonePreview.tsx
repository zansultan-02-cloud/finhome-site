import type { StoryPage } from '../../../types'

export function PhonePreview({ page }: { page: StoryPage | null }) {
  return (
    <div className="mx-auto w-[220px]">
      <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[28px] border-[6px] border-[#111111] bg-black shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
        {page?.image_url ? (
          <img src={page.image_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1c1c1e] text-xs text-[#6b6b73]">
            Нет изображения
          </div>
        )}

        {/* progress bar imitation */}
        <div className="absolute left-2 right-2 top-2 flex gap-1">
          <div className="h-[3px] flex-1 rounded-full bg-white/80" />
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 pt-10">
          {page?.title && <div className="mb-1 text-sm font-bold text-white">{page.title}</div>}
          {page?.body && <div className="mb-3 text-xs leading-snug text-white/90">{page.body}</div>}
          {page?.button_type && page.button_type !== 'none' && page.button_title && (
            <div className="inline-block rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-black">
              {page.button_title}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
