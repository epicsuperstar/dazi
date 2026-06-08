'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'
import { useJoins } from '@/lib/useJoins'
import { ActivityCard, ActivityCardData } from '@/components/ActivityCard'
import { TabBar } from '@/components/TabBar'
import { NotifBell } from '@/components/NotifBell'

type Rec = ActivityCardData & { joins_count: number }

export default function ForYouPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [recs, setRecs] = useState<Rec[]>([])
  const [loading, setLoading] = useState(true)
  const { joined, joining, join } = useJoins(user?.id)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/signup')
      return
    }
    supabase
      .rpc('recommended_posts', { p_user: user.id })
      .then(({ data }) => {
        const rows = (data as any[]) || []
        setRecs(
          rows.map((r) => ({
            id: r.id,
            activity: r.activity,
            location: r.location,
            postal_code: r.postal_code,
            directions: r.directions,
            level: r.level,
            starts_at: r.starts_at,
            duration_min: r.duration_min,
            price: r.price,
            hostName: r.author_name,
            hostHandle: r.author_handle,
            reason: r.reason,
            joins_count: r.joins_count,
          })),
        )
        setLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading])

  return (
    <div className="min-h-screen bg-[#fafaf7] pb-24">
      <div className="mx-auto w-full max-w-[440px] px-5">
        <header className="flex items-start justify-between pt-8 pb-3">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.08em] text-[#8a8a82]">
              PICKED FOR YOU
            </div>
            <h1 className="font-display text-[30px] font-bold tracking-tight text-[#0a0a0a]">
              For You
            </h1>
            <p className="mt-1 text-sm font-medium text-[#6e6e66]">
              Based on what you play and who you play with.
            </p>
          </div>
          {user && <NotifBell userId={user.id} />}
        </header>

        {loading ? (
          <p className="mt-10 text-center text-[#8a8a82]">Finding your matches…</p>
        ) : recs.length === 0 ? (
          <div className="mt-10 rounded-[22px] border border-[#eaeae2] bg-white px-6 py-14 text-center">
            <div className="text-3xl">✦</div>
            <p className="mt-3 font-display text-lg font-bold text-[#0a0a0a]">
              Nothing to suggest yet
            </p>
            <p className="mt-1 text-sm text-[#8a8a82]">
              Join a few activities and we&apos;ll learn what you like.
            </p>
          </div>
        ) : (
          <div className="mt-2 flex flex-col gap-[14px]">
            {recs.map((r) => (
              <ActivityCard
                key={r.id}
                data={r}
                joined={joined.has(r.id)}
                joining={joining === r.id}
                onJoin={() => join(r.id)}
              />
            ))}
          </div>
        )}
      </div>
      <TabBar />
    </div>
  )
}
