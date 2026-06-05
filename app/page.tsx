'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'

type Post = {
  id: string
  activity: string
  location: string
  starts_at: string
  duration_min: number
  price: number | null
  cap: number | null
  author: {name: string; handle: string} | {name: string; handle: string}[]
  author_id: string
  status: string
}

export default function Home() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [joined, setJoined] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/signup')
      return
    }

    fetchPosts()
    fetchJoined()
  }, [user, authLoading])

  async function fetchPosts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        activity,
        location,
        starts_at,
        duration_min,
        price,
        cap,
        author_id,
        status,
        author:profiles(name, handle)
      `)
      .eq('status', 'upcoming')
      .order('starts_at', { ascending: true })

    if (error) {
      console.error('Error fetching posts:', error)
      return
    }

    // Handle Supabase response format
    const posts = data?.map((p: any) => ({
      ...p,
      author: Array.isArray(p.author) ? p.author[0] : p.author
    })) || []

    setPosts(posts as Post[])
    setLoading(false)
  }

  async function fetchJoined() {
    if (!user) return
    const { data } = await supabase
      .from('joins')
      .select('post_id')
      .eq('user_id', user.id)

    if (data) {
      setJoined(new Set(data.map(j => j.post_id)))
    }
  }

  async function joinActivity(postId: string) {
    if (!user) return

    const { error } = await supabase
      .from('joins')
      .insert({ post_id: postId, user_id: user.id })

    if (!error) {
      setJoined(prev => new Set([...prev, postId]))
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/signup')
  }

  if (authLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading activities...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pt-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Dazi</h1>
            <p className="text-slate-400 text-sm">Hi, {user?.email?.split('@')[0]}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/post')}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
            >
              + Post
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Activities */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">No activities yet. Be the first to post!</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-semibold">
                      {post.activity} <span className="text-2xl">🎾</span>
                    </h3>
                    <p className="text-slate-400 text-sm">
                      @{Array.isArray(post.author) ? post.author[0]?.handle : post.author?.handle}
                    </p>
                  </div>
                </div>

                <p className="text-slate-300 text-sm mb-2">📍 {post.location}</p>
                <p className="text-slate-300 text-sm mb-2">
                  🕐 {new Date(post.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-slate-300 text-sm mb-3">⏱️ {post.duration_min}m</p>

                {post.price && (
                  <p className="text-blue-400 text-sm font-semibold mb-3">💎 ${post.price}</p>
                )}

                <button
                  onClick={() => joinActivity(post.id)}
                  disabled={joined.has(post.id)}
                  className={`w-full py-2 rounded-lg font-semibold transition ${
                    joined.has(post.id)
                      ? 'bg-green-600/30 text-green-400 cursor-default'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {joined.has(post.id) ? '✓ Joined' : post.price ? `Join for $${post.price}` : 'I\'m in'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
