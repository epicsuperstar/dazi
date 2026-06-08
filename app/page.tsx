'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'
import { useJoins } from '@/lib/useJoins'
import { Post } from '@/lib/types'
import { ActivityCard } from '@/components/ActivityCard'
import { TabBar } from '@/components/TabBar'
import { NotifBell } from '@/components/NotifBell'

function authorOf(post: Post) {
  return Array.isArray(post.author) ? post.author[0] ?? null : post.author
}

export default function Home() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState('')
  const [filter, setFilter] = useState<'all' | 'following'>('all')
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set())
  const { joined, joining, join } = useJoins(user?.id)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/signup')
      return
    }
    fetchProfile()
    fetchPosts()
    fetchFollowing()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading])

  async function fetchFollowing() {
    if (!user) return
    const { data } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.id)
    if (data) setFollowingIds(new Set(data.map((f) => f.following_id)))
  }

  async function fetchProfile() {
    if (!user) return
    const { data } = await supabase
      .from('profiles')
      .select('name, handle')
      .eq('id', user.id)
      .single()
    setGreeting(data?.name?.split(' ')[0] || data?.handle || '')
  }

  async function fetchPosts() {
    setLoading(true)
    const { data } = await supabase
      .from('posts')
      .select(
        `id, activity, location, postal_code, directions, level, pay_note, starts_at, duration_min, price, cap, author_id, status, author:profiles(name, handle)`,
      )
      .eq('status', 'upcoming')
      .order('starts_at', { ascending: true })
    setPosts((data as unknown as Post[]) || [])
    setLoading(false)
  }

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[#8a8a82]">
        Loading…
      </div>
    )
  }

  const dateLabel = new Date()
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toUpperCase()

  const visiblePosts =
    filter === 'following'
      ? posts.filter((p) => followingIds.has(p.author_id))
      : posts

  return (
    <div className="min-h-screen bg-[#fafaf7] pb-24">
      <div className="mx-auto w-full max-w-[440px] px-5">
        <header className="pt-8 pb-3">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] font-semibold tracking-[0.08em] text-[#8a8a82]">
                {dateLabel} · WHAT&apos;S ON
              </div>
              <div className="font-display text-[30px] font-bold tracking-tight text-[#0a0a0a]">
                dazi
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user && <NotifBell userId={user.id} />}
              <button
                onClick={() => router.push('/post')}
                className="rounded-full bg-[#ff4d2e] px-[18px] py-[11px] text-sm font-bold text-white transition active:scale-95"
              >
                + Post
              </button>
            </div>
          </div>
          <p className="mt-2 text-sm font-medium text-[#6e6e66]">
            {greeting ? `Hi, ${greeting}` : 'Welcome back'}
          </p>

          {/* Filter */}
          <div className="mt-4 inline-flex rounded-full border border-[#eaeae2] bg-white p-1">
            {(['all', 'following'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-1.5 text-[13px] font-bold capitalize transition ${
                  filter === f ? 'bg-[#ff4d2e] text-white' : 'text-[#8a8a82]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        {visiblePosts.length === 0 ? (
          filter === 'following' ? (
            <FollowingEmpty onBrowse={() => setFilter('all')} />
          ) : (
            <EmptyFeed onPost={() => router.push('/post')} />
          )
        ) : (
          <div className="mt-2 flex flex-col gap-[14px]">
            {visiblePosts.map((post) => {
              const author = authorOf(post)
              return (
                <ActivityCard
                  key={post.id}
                  data={{
                    id: post.id,
                    activity: post.activity,
                    location: post.location,
                    postal_code: post.postal_code,
                    directions: post.directions,
                    level: post.level,
                    pay_note: post.pay_note,
                    starts_at: post.starts_at,
                    duration_min: post.duration_min,
                    price: post.price,
                    hostName: author?.name,
                    hostHandle: author?.handle,
                  }}
                  joined={joined.has(post.id)}
                  joining={joining === post.id}
                  onJoin={() => join(post.id)}
                />
              )
            })}
          </div>
        )}
      </div>
      <TabBar />
    </div>
  )
}

function FollowingEmpty({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="mt-10 rounded-[22px] border border-[#eaeae2] bg-white px-6 py-14 text-center">
      <div className="text-3xl">👀</div>
      <p className="mt-3 font-display text-lg font-bold text-[#0a0a0a]">
        No activities from people you follow
      </p>
      <p className="mt-1 text-sm text-[#8a8a82]">
        Follow a few people and their plans show up here.
      </p>
      <button
        onClick={onBrowse}
        className="mt-6 rounded-full bg-[#ff4d2e] px-6 py-3 text-sm font-bold text-white transition active:scale-95"
      >
        Browse everything
      </button>
    </div>
  )
}

function EmptyFeed({ onPost }: { onPost: () => void }) {
  return (
    <div className="mt-10 rounded-[22px] border border-[#eaeae2] bg-white px-6 py-14 text-center">
      <div className="text-3xl">🌱</div>
      <p className="mt-3 font-display text-lg font-bold text-[#0a0a0a]">Nothing on yet</p>
      <p className="mt-1 text-sm text-[#8a8a82]">Be the first to start something.</p>
      <button
        onClick={onPost}
        className="mt-6 rounded-full bg-[#ff4d2e] px-6 py-3 text-sm font-bold text-white transition active:scale-95"
      >
        Post an activity
      </button>
    </div>
  )
}
