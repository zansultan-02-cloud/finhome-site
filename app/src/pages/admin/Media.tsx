import { useEffect, useRef, useState } from 'react'
import { Upload, Trash2, Copy, Loader2, Image as ImageIcon } from 'lucide-react'
import { AdminLayout } from '../../components/AdminLayout'
import { supabase } from '../../lib/supabaseClient'
import { uploadImage } from '../../lib/uploadImage'

interface MediaItem {
  name: string
  path: string
  url: string
}

export function Media() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copiedPath, setCopiedPath] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    // Библиотека собрана из папок stories: перебираем верхний уровень бакета
    const { data: folders } = await supabase.storage.from('story-images').list('', { limit: 200 })
    const all: MediaItem[] = []

    for (const entry of folders ?? []) {
      // entry без id — это "папка" (id === null для директорий в Supabase Storage)
      if (entry.id === null) {
        const { data: files } = await supabase.storage
          .from('story-images')
          .list(entry.name, { limit: 200, sortBy: { column: 'created_at', order: 'desc' } })
        for (const f of files ?? []) {
          const path = `${entry.name}/${f.name}`
          const { data } = supabase.storage.from('story-images').getPublicUrl(path)
          all.push({ name: f.name, path, url: data.publicUrl })
        }
      } else {
        const { data } = supabase.storage.from('story-images').getPublicUrl(entry.name)
        all.push({ name: entry.name, path: entry.name, url: data.publicUrl })
      }
    }

    setItems(all)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      await uploadImage(file, 'library')
      await load()
    } catch (err) {
      alert('Не удалось загрузить: ' + (err as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (path: string) => {
    if (!confirm('Удалить изображение? Если оно используется в истории, там оно перестанет отображаться.'))
      return
    await supabase.storage.from('story-images').remove([path])
    setItems((prev) => prev.filter((i) => i.path !== path))
  }

  const handleCopy = async (url: string, path: string) => {
    await navigator.clipboard.writeText(url)
    setCopiedPath(path)
    setTimeout(() => setCopiedPath(null), 1500)
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Медиа</h1>
          <p className="text-sm text-[#6b6b73]">Все изображения, загруженные в Storage.</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 rounded-xl bg-[#ff3b5c] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          Загрузить
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-[#6b6b73]">Загрузка…</div>
      ) : items.length === 0 ? (
        <div className="rounded-[22px] border border-dashed border-[#e7e7ea] py-16 text-center text-sm text-[#6b6b73]">
          Пока нет загруженных изображений.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map((item) => (
            <div
              key={item.path}
              className="group relative aspect-square overflow-hidden rounded-xl border border-[#e7e7ea] bg-[#f0f0f2]"
            >
              {item.url ? (
                <img src={item.url} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon size={20} className="m-auto text-[#6b6b73]" />
              )}
              <div className="absolute inset-0 flex items-end justify-end gap-1.5 bg-gradient-to-t from-black/50 via-transparent to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => handleCopy(item.url, item.path)}
                  className="rounded-lg bg-white/90 p-1.5 text-[#111111]"
                  title="Скопировать URL"
                >
                  <Copy size={14} />
                </button>
                <button
                  onClick={() => handleDelete(item.path)}
                  className="rounded-lg bg-white/90 p-1.5 text-[#b0002d]"
                  title="Удалить"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              {copiedPath === item.path && (
                <div className="absolute inset-x-0 top-0 bg-[#0a7a35] py-1 text-center text-[10px] font-bold text-white">
                  Скопировано
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
