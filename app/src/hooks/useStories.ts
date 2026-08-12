import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Category, Story, StoryStatus } from '../types'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('categories').select('*').order('sort_order')
    setCategories(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { categories, loading, reload }
}

export function useStories() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('stories')
      .select('*, story_pages(*)')
      .order('sort_order')
    if (error) setError(error.message)
    setStories(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const createStory = async (input: Partial<Story>) => {
    const { data, error } = await supabase
      .from('stories')
      .insert({
        title: input.title ?? 'Новая история',
        card_title: input.card_title ?? 'Новая история',
        category_id: input.category_id ?? null,
        status: 'draft',
        sort_order: stories.length,
      })
      .select()
      .single()
    if (error) throw error
    await reload()
    return data as Story
  }

  const updateStory = async (id: string, patch: Partial<Story>) => {
    const { error } = await supabase
      .from('stories')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
    await reload()
  }

  const setStatus = async (id: string, status: StoryStatus) => {
    const patch: Partial<Story> = { status }
    if (status === 'published') patch.published_at = new Date().toISOString()
    await updateStory(id, patch)
  }

  const deleteStory = async (id: string) => {
    const { error } = await supabase.from('stories').delete().eq('id', id)
    if (error) throw error
    await reload()
  }

  const reorder = async (orderedIds: string[]) => {
    setStories((prev) => {
      const byId = new Map(prev.map((s) => [s.id, s]))
      return orderedIds.map((id, i) => ({ ...byId.get(id)!, sort_order: i }))
    })
    await Promise.all(
      orderedIds.map((id, i) => supabase.from('stories').update({ sort_order: i }).eq('id', id))
    )
  }

  return { stories, loading, error, reload, createStory, updateStory, setStatus, deleteStory, reorder }
}
