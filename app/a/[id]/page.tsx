'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'
import { useJoins } from '@/lib/useJoins'
import { whatsappInvite } from '@/lib/ui'
import { ActivityCard, ActivityCardData } from '@/components/ActivityCard'
import { TabBar } from '@/components/TabBar'

export default function ActivitySharePage() {
  const params = useParams<{ id: string }>()
  const id = decodeURIComponent(params.id)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { joined, joining, join } = useJoins(user?.id)
  const [card, setCard] = useState<ActivityCardData | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing'>('loading')

  useEffect(() => {
    supabase.rpc('get_post', { p_id: id }).then(({ data }) => {
      const r = (data as any[])?.[0]
      if (!r) {
        setStatus('missing')
        return
      }
      setCard({
        id: r.id,
        activity: r.activity,
        location: r.location,
        postal_code: r.postal_code,
        directions: r.directions,
        level: r.level,
        pay_note: r.pay_note,
        starts_at: r.starts_at,
        duration_min: r.duration_min,
        price: r.price,
        hostName: r.author_name,
        hostHandle: r.author_handle,
      })
      setStatus('ready')
    })
  }, [id])

  if (status === 'loading' || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[#8a8a82]">
        Loading…
      </div>
    )
  }

  if (status === 'missing' || !card) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#fafaf7] px-6 text-center">
        <div className="text-3xl">🤷</div>
        <p className="font-display text-lg font-bold text-[#0a0a0a]">
          This activity isn’t available
        </p>
        <Link href="/" className="text-sm font-semibold text-[#ff4d2e]">
          Go to Dazi
        </Link>
      </div>
    )
  }

  function onJoin() {
    if (!user) {
      router.push('/signup')
      return
    }
    join(card!.id)
  }

  const shareText = `Come play ${card.activity} with me on Dazi`

  return (
    <div className="min-h-screen bg-[#fafaf7] pb-24">
      <div className="mx-auto w-full max-w-[440px] px-5">
        <header className="flex items-center justify-between pt-8 pb-4">
          <Link href="/" className="font-display text-[24px] font-bold tracking-tight text-[#0a0a0a]">
            dazi
          </Link>
          {!user && (
            <Link
              href="/login"
              className="rounded-full border border-[#e4e4dc] bg-white px-4 py-2 text-sm font-bold text-[#0a0a0a]"
            >
              Log in
            </Link>
          )}
        </header>

        <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.06em] text-[#8a8a82]">
          You’re invited
        </p>

        <ActivityCard
          data={card}
          joined={joined.has(card.id)}
          joining={joining === card.id}
          onJoin={onJoin}
        />

        <button
          onClick={() => whatsappInvite(`/a/${card.id}`, shareText)}
          className="mt-3 w-full rounded-2xl border border-[#1f8a70] bg-white py-3 text-[14.5px] font-bold text-[#1f8a70] transition active:scale-[0.99]"
        >
          Invite friends via WhatsApp ↗
        </button>

        {!user && (
          <p className="mt-4 text-center text-[13px] text-[#8a8a82]">
            New to Dazi?{' '}
            <Link href="/signup" className="font-semibold text-[#ff4d2e]">
              Create an account
            </Link>{' '}
            to join.
          </p>
        )}
      </div>
      {user && <TabBar />}
    </div>
  )
}
