export type Author = { name: string; handle: string }

export type Post = {
  id: string
  activity: string
  location: string
  postal_code: string | null
  directions: string | null
  starts_at: string
  duration_min: number
  price: number | null
  cap: number | null
  author: Author | Author[] | null
  author_id: string
  status: string
}

export type Profile = {
  id: string
  name: string | null
  handle: string | null
  neighborhood: string | null
  bio: string | null
  instagram: string | null
  tiktok: string | null
  link: string | null
  avatar_url: string | null
}
