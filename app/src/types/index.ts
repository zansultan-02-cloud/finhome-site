export type StoryStatus = 'draft' | 'published' | 'hidden'
export type StoryButtonType = 'none' | 'externalURL' | 'whatsapp' | 'deepLink'

export interface Category {
  id: string
  name: string
  slug: string
  sort_order: number
  created_at: string
}

export interface StoryPage {
  id: string
  story_id: string
  image_url: string | null
  title: string | null
  body: string | null
  sort_order: number
  button_title: string | null
  button_type: StoryButtonType
  button_url: string | null
  created_at: string
  updated_at: string
}

export interface Story {
  id: string
  title: string
  card_title: string
  category_id: string | null
  cover_image_url: string | null
  status: StoryStatus
  sort_order: number
  published_at: string | null
  expires_at: string | null
  created_at: string
  updated_at: string
  story_pages?: StoryPage[]
}
