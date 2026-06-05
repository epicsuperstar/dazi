'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'

type Author = { name: string; handle: string }

type Post = {
  id: string
  activity: string
  location: string
  starts_at: string
  duration_min: number
  price: number | null
  cap: number | null
  author: Author | Author[] | null
  author_id: string
  status: string
}

const ACTIVITY_EMOJI: Record<string, string> = {
  Badminton: '🏸',
  Pickleball: '🏓',
  Padel: '🎾',
  Run: '🏃',
  Gym: '🏋️',
}

function authorOf(post: Post): Author | null {
  return Array.isArray(post.author) ? post.author[0] ?? null : post.author
}

export default function Home() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [joined, setJoined] = useState<Set<string>>(new Set())
  const [joining, setJoining] = useState<string | null>(null)
  const [greeting, setGreeting] = useState<string>('')

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/signup')
      return
    }

    fetchProfile()
    fetchPosts()
    fetchJoined()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading])

  async function fetchProfile() {
    if (!user) return
    const { data } = await supabase
      .from('profiles')
      .select('name, handle')
      .eq('id', user.id)
      .single()
    setGreeting(data?.name?.split(' ')[0] || data?.handle || user.email?.split('@')[0] || '')
  }

  async function fetchPosts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select(
        `id, activity, location, starts_at, duration_min, price, cap, author_id, status, author:profiles(name, handle)`,
      )
      .eq('status', 'upcoming')
      .order('starts_at', { ascending: true })

    if (error) {
      console.error('Error fetching posts:', error)
      setLoading(false)
      return
    }

    setPosts((data as unknown as Post[]) || [])
    setLoading(false)
  }

  async function fetchJoined() {
    if (!user) return
    const { data } = await supabase
      .from('joins')
      .select('post_id')
      .eq('user_id', user.id)

    if (data) setJoined(new Set(data.map((j) => j.post_id)))
  }

  async function joinActivity(postId: string) {
    if (!user || joined.has(postId)) return
    setJoining(postId)
    const { error } = await supabase
      .from('joins')
      .insert({ post_id: postId, user_id: user.id })

    // A unique-violation just means they already joined — treat as success.
    if (!error || error.code === '23505') {
      setJoined((prev) => new Set([...prev, postId]))
    }
    setJoining(null)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/signup')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-slate-400">
        Loading activities…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 pt-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Dazi</h1>
            {greeting && <p className="text-slate-400 text-sm">Hi, {greeting}</p>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/post')}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
            >
              + Post
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Activities */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-300 font-medium">No activities yet.</p>
            <p className="text-slate-500 text-sm mt-1">Be the first to post one!</p>
            <button
              onClick={() => router.push('/post')}
              className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              + Post an activity
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const author = authorOf(post)
              const isJoined = joined.has(post.id)
              const emoji = ACTIVITY_EMOJI[post.activity] ?? '📍'
              return (
                <div
                  key={post.id}
                  className="bg-slate-700/50 border border-slate-600 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h3 className="text-white font-semibold text-base">
                        <span className="text-xl mr-1.5">{emoji}</span>
                        {post.activity}
                      </h3>
                      <p className="text-slate-400 text-xs mt-1">
                        @{author?.handle ?? 'someone'}
                      </p>
                    </div>
                    {post.price != null && (
                      <span className="shrink-0 rounded-full bg-teal-500/15 text-teal-300 text-xs font-semibold px-3 py-1">
                        💎 ${formatPrice(post.price)}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 space-y-1.5 text-sm text-slate-300">
                    <p>📍 {post.location}</p>
                    <p>🕐 {formatTime(post.starts_at)}</p>
                    <p>⏱️ {post.duration_min}m</p>
                  </div>

                  <button
                    onClick={() => joinActivity(post.id)}
                    disabled={isJoined || joining === post.id}
                    className={`mt-4 w-full py-2.5 rounded-lg font-semibold text-sm transition ${
                      isJoined
                        ? 'bg-slate-600 text-slate-300 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60'
                    }`}
                  >
                    {isJoined
                      ? '✓ Joined'
                      : joining === post.id
                        ? 'Joining…'
                        : post.price != null
                          ? `Join for $${formatPrice(post.price)}`
                          : "I'm in"}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function formatTime(iso: string): string {
  // starts_at is timestamptz, so the value already carries an offset/Z.
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatPrice(price: number): string {
  return Number.isInteger(price) ? String(price) : price.toFixed(2)
}
