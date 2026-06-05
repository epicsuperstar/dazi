'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'
import { Profile } from '@/lib/types'
import { ProfileView } from '@/components/ProfileView'
import { TabBar } from '@/components/TabBar'

export default function YouPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/signup')
      return
    }
    supabase
      .from('profiles')
      .select('id, name, handle, neighborhood, bio, instagram, tiktok')
      .eq('id', user.id)
      .single()
      .then(({ data }) => setProfile(data as Profile))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/signup')
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[#8a8a82]">
        Loading…
      </div>
    )
  }

  return (
    <>
      <ProfileView profile={profile} isSelf onLogout={handleLogout} />
      <TabBar />
    </>
  )
}
