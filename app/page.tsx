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
    setGreeting(
      data?.name?.split(' ')[0] || data?.handle || user.email?.split('@')[0] || '',
    )
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
      <div className="flex min-h-screen items-center justify-center text-[#8a8a82]">
        Loading…
      </div>
    )
  }

  const dateLabel = new Date()
    .toLocaleDateString([], { weekday: 'long' })
    .toUpperCase()

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <div className="mx-auto w-full max-w-[440px] px-5 pb-16">
        {/* Header */}
        <header className="pt-8 pb-3">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] font-semibold tracking-[0.08em] text-[#8a8a82]">
                {dateLabel} · TONIGHT
              </div>
              <div className="font-display text-[30px] font-bold tracking-tight text-[#0a0a0a]">
                dazi
              </div>
            </div>
            <button
              onClick={() => router.push('/post')}
              className="rounded-full bg-[#ff4d2e] px-[18px] py-[11px] text-sm font-bold text-white transition active:scale-95"
            >
              + Post
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm font-medium text-[#6e6e66]">
              {greeting ? `Hi, ${greeting}` : 'Welcome back'}
            </p>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-[#a3a399] transition hover:text-[#0a0a0a]"
            >
              Log out
            </button>
          </div>
        </header>

        {/* Feed */}
        {posts.length === 0 ? (
          <div className="mt-10 rounded-[22px] border border-[#eaeae2] bg-white px-6 py-14 text-center">
            <div className="text-3xl">🌱</div>
            <p className="mt-3 font-display text-lg font-bold text-[#0a0a0a]">
              Nothing on yet
            </p>
            <p className="mt-1 text-sm text-[#8a8a82]">
              Be the first to start something.
            </p>
            <button
              onClick={() => router.push('/post')}
              className="mt-6 rounded-full bg-[#ff4d2e] px-6 py-3 text-sm font-bold text-white transition active:scale-95"
            >
              Post an activity
            </button>
          </div>
        ) : (
          <div className="mt-2 flex flex-col gap-[14px]">
            {posts.map((post) => {
              const author = authorOf(post)
              const isJoined = joined.has(post.id)
              const emoji = ACTIVITY_EMOJI[post.activity] ?? '📍'
              return (
                <article
                  key={post.id}
                  className="rounded-[22px] border border-[#eaeae2] bg-white p-[18px]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[10px]">
                      <span className="text-2xl">{emoji}</span>
                      <div>
                        <h3 className="font-display text-[18px] font-bold tracking-tight text-[#0a0a0a]">
                          {post.activity}
                        </h3>
                        <p className="text-[12.5px] font-medium text-[#8a8a82]">
                          with @{author?.handle ?? 'someone'}
                        </p>
                      </div>
                    </div>
                    {post.price != null ? (
                      <span className="text-[16px] font-bold text-[#ff4d2e]">
                        ${formatPrice(post.price)}
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold tracking-[0.06em] text-[#a3a399]">
                        FREE
                      </span>
                    )}
                  </div>

                  <div className="mt-4 mb-4 flex gap-7">
                    <Stat k="WHERE" v={post.location.split(',')[0]} />
                    <Stat k="WHEN" v={formatTime(post.starts_at)} />
                    <Stat k="FOR" v={`${post.duration_min}m`} />
                  </div>

                  <button
                    onClick={() => joinActivity(post.id)}
                    disabled={isJoined || joining === post.id}
                    className={`w-full rounded-[14px] py-3 text-[14.5px] font-bold transition active:scale-[0.99] ${
                      isJoined
                        ? 'bg-[#f1f1ec] text-[#8a8a82]'
                        : 'bg-[#ff4d2e] text-white hover:bg-[#f0421f] disabled:opacity-70'
                    }`}
                  >
                    {isJoined
                      ? '✓ You’re in'
                      : joining === post.id
                        ? 'Joining…'
                        : post.price != null
                          ? `Join · $${formatPrice(post.price)}`
                          : 'I’m in'}
                  </button>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold tracking-[0.07em] text-[#a3a399]">
        {k}
      </div>
      <div className="mt-0.5 text-[14px] font-semibold text-[#0a0a0a]">{v}</div>
    </div>
  )
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function formatPrice(price: number): string {
  return Number.isInteger(price) ? String(price) : price.toFixed(2)
}
