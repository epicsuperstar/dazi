'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'
import { Profile } from '@/lib/types'
import { ProfileView } from '@/components/ProfileView'
import { TabBar } from '@/components/TabBar'

export default function UserProfilePage() {
  const params = useParams<{ handle: string }>()
  const handle = decodeURIComponent(params.handle)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing'>('loading')

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/signup')
      return
    }
    supabase
      .from('profiles')
      .select('id, name, handle, neighborhood, bio, instagram, tiktok')
      .eq('handle', handle)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setProfile(data as Profile)
          setStatus('ready')
        } else {
          setStatus('missing')
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, handle])

  if (status === 'loading' || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[#8a8a82]">
        Loading…
      </div>
    )
  }

  if (status === 'missing' || !profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#fafaf7] px-6 text-center">
        <div className="text-3xl">🤷</div>
        <p className="font-display text-lg font-bold text-[#0a0a0a]">
          No one here by @{handle}
        </p>
        <Link href="/people" className="text-sm font-semibold text-[#ff4d2e]">
          Back to People
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[440px] px-5">
        <button
          onClick={() => router.back()}
          className="pt-7 text-sm font-semibold text-[#8a8a82] transition hover:text-[#0a0a0a]"
        >
          ← Back
        </button>
      </div>
      <ProfileView profile={profile} isSelf={user?.id === profile.id} />
      <TabBar />
    </>
  )
}
