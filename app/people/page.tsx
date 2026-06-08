'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'
import { Avatar } from '@/components/Avatar'
import { FollowButton } from '@/components/FollowButton'
import { TabBar } from '@/components/TabBar'

type Played = {
  id: string
  name: string | null
  handle: string | null
  neighborhood: string | null
  avatar_url: string | null
  together: number
  activities: string | null
}

type Person = {
  id: string
  name: string | null
  handle: string | null
  neighborhood: string | null
  bio: string | null
  avatar_url: string | null
}

export default function PeoplePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [played, setPlayed] = useState<Played[]>([])
  const [discover, setDiscover] = useState<Person[]>([])
  const [followingSet, setFollowingSet] = useState<Set<string>>(new Set())
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
    const [{ data: pw }, { data: all }, { data: follows }] = await Promise.all([
      supabase.rpc('played_with', { p_user: uid }),
      supabase
        .from('profiles')
        .select('id, name, handle, neighborhood, bio, avatar_url')
        .neq('id', uid),
      supabase.from('follows').select('following_id').eq('follower_id', uid),
    ])
    const playedRows = ((pw as any[]) || []).map((r) => ({
      ...r,
      together: Number(r.together),
    })) as Played[]
    setPlayed(playedRows)
    setFollowingSet(new Set(((follows as any[]) || []).map((f) => f.following_id)))
    const knownIds = new Set(playedRows.map((p) => p.id))
    setDiscover(((all as Person[]) || []).filter((p) => !knownIds.has(p.id)))
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#fafaf7] pb-24">
      <div className="mx-auto w-full max-w-[440px] px-5">
        <header className="pt-8 pb-4">
          <div className="text-[11px] font-semibold tracking-[0.08em] text-[#8a8a82]">
            YOUR CIRCLE
          </div>
          <h1 className="font-display text-[30px] font-bold tracking-tight text-[#0a0a0a]">
            People
          </h1>
        </header>

        {loading ? (
          <p className="mt-10 text-center text-[#8a8a82]">Loading your circle…</p>
        ) : (
          <>
            <SectionTitle>
              Played with{' '}
              {played.length > 0 && (
                <span className="text-[#a3a399]">· {played.length}</span>
              )}
            </SectionTitle>
            {played.length === 0 ? (
              <p className="mb-6 text-sm text-[#8a8a82]">
                Join an activity and the people you meet show up here.
              </p>
            ) : (
              <div className="mb-7 flex flex-col gap-2.5">
                {played.map((p) => (
                  <Link
                    key={p.id}
                    href={`/u/${p.handle}`}
                    className="flex items-center gap-3 rounded-[18px] border border-[#eaeae2] bg-white p-3 transition active:scale-[0.99]"
                  >
                    <Avatar name={p.name} handle={p.handle} url={p.avatar_url} size={46} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-display text-[15px] font-bold text-[#0a0a0a]">
                        {p.name}
                      </div>
                      <div className="truncate text-[12.5px] text-[#8a8a82]">
                        {p.activities || 'Activities'}
                        {p.neighborhood ? ` · ${p.neighborhood}` : ''}
                      </div>
                    </div>
                    <div className="shrink-0 rounded-full bg-[#fff1ee] px-2.5 py-1 text-[11px] font-bold text-[#ff4d2e]">
                      {p.together}×
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <SectionTitle>Discover</SectionTitle>
            <div className="flex flex-col gap-2.5">
              {discover.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-[18px] border border-[#eaeae2] bg-white p-3"
                >
                  <Link
                    href={`/u/${p.handle}`}
                    className="flex min-w-0 flex-1 items-center gap-3"
                  >
                    <Avatar name={p.name} handle={p.handle} url={p.avatar_url} size={46} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-display text-[15px] font-bold text-[#0a0a0a]">
                        {p.name}
                      </div>
                      <div className="truncate text-[12.5px] text-[#8a8a82]">
                        {p.bio || `@${p.handle}`}
                      </div>
                    </div>
                  </Link>
                  {user && (
                    <FollowButton
                      viewerId={user.id}
                      targetId={p.id}
                      initialFollowing={followingSet.has(p.id)}
                      size="sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <TabBar />
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-[12px] font-bold uppercase tracking-[0.06em] text-[#6e6e66]">
      {children}
    </h2>
  )
}
