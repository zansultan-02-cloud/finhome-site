import { supabase } from './supabaseClient'

export async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${folder}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from('story-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error

  const { data } = supabase.storage.from('story-images').getPublicUrl(path)
  return data.publicUrl
}
