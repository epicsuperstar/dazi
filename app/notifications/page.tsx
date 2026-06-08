'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'
import { timeAgo } from '@/lib/ui'
import { TabBar } from '@/components/TabBar'

type Notif = {
  id: string
  type: string
  title: string
  body: string | null
  link: string | null
  read: boolean
  created_at: string
}

const ICON: Record<string, string> = {
  join: '🙌',
  milestone: '🤝',
  follow: '➕',
  post: '📣',
  spark: '✦',
  reminder: '⏰',
}

export default function NotificationsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [items, setItems] = useState<Notif[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/signup')
      return
    }
    load(user.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading])

  async function load(uid: string) {
    const { data } = await supabase
      .from('notifications')
      .select('id, type, title, body, link, read, created_at')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(50)
    setItems((data as Notif[]) || [])
    setLoading(false)
    // Mark everything read once seen.
    if ((data || []).some((n: any) => !n.read)) {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', uid)
        .eq('read', false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf7] pb-24">
      <div className="mx-auto w-full max-w-[440px] px-5">
        <header className="pt-8 pb-4">
          <div className="text-[11px] font-semibold tracking-[0.08em] text-[#8a8a82]">
            WHAT YOU MISSED
          </div>
          <h1 className="font-display text-[30px] font-bold tracking-tight text-[#0a0a0a]">
            Notifications
          </h1>
        </header>

        {loading ? (
          <p className="mt-10 text-center text-[#8a8a82]">Loading…</p>
        ) : items.length === 0 ? (
          <div className="mt-10 rounded-[22px] border border-[#eaeae2] bg-white px-6 py-14 text-center">
            <div className="text-3xl">🔔</div>
            <p className="mt-3 font-display text-lg font-bold text-[#0a0a0a]">
              Nothing yet
            </p>
            <p className="mt-1 text-sm text-[#8a8a82]">
              Joins, new bonds, and follows will show up here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {items.map((n) => {
              const body = (
                <div
                  className={`flex items-start gap-3 rounded-[18px] border p-3.5 ${
                    n.read
                      ? 'border-[#eaeae2] bg-white'
                      : 'border-[#ffd9cf] bg-[#fff6f3]'
                  }`}
                >
                  <span className="text-[20px]">{ICON[n.type] ?? '•'}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14.5px] font-bold leading-snug text-[#0a0a0a]">
                      {n.title}
                    </div>
                    {n.body && (
                      <div className="mt-0.5 text-[13px] text-[#6e6e66]">{n.body}</div>
                    )}
                    <div className="mt-1 text-[11.5px] font-semibold text-[#a3a399]">
                      {timeAgo(n.created_at)}
                    </div>
                  </div>
                </div>
              )
              return n.link ? (
                <button
                  key={n.id}
                  onClick={() => router.push(n.link!)}
                  className="text-left transition active:scale-[0.99]"
                >
                  {body}
                </button>
              ) : (
                <div key={n.id}>{body}</div>
              )
            })}
          </div>
        )}
      </div>
      <TabBar />
    </div>
  )
}
