'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'
import { formatHours } from '@/lib/ui'
import { Avatar } from '@/components/Avatar'
import { FollowButton } from '@/components/FollowButton'
import { TabBar } from '@/components/TabBar'
import { NotifBell } from '@/components/NotifBell'

type Played = {
  id: string
  name: string | null
  handle: string | null
  neighborhood: string | null
  avatar_url: string | null
  together: number
  minutes: number
  activities: string | null
}

type Spark = {
  id: string
  name: string | null
  handle: string | null
  neighborhood: string | null
  avatar_url: string | null
  reason: string
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
  const [bonds, setBonds] = useState<Played[]>([])
  const [sparks, setSparks] = useState<Spark[]>([])
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
    const [{ data: pw }, { data: sp }, { data: all }, { data: follows }] =
      await Promise.all([
        supabase.rpc('played_with', { p_user: uid }),
        supabase.rpc('connection_sparks', { p_user: uid }),
        supabase
          .from('profiles')
          .select('id, name, handle, neighborhood, bio, avatar_url')
          .neq('id', uid),
        supabase.from('follows').select('following_id').eq('follower_id', uid),
      ])

    const playedRows = ((pw as any[]) || []).map((r) => ({
      ...r,
      together: Number(r.together),
      minutes: Number(r.minutes),
    })) as Played[]
    const sparkRows = (sp as Spark[]) || []

    setBonds(playedRows.filter((p) => p.together >= 2))
    setSparks(sparkRows)
    setFollowingSet(new Set(((follows as any[]) || []).map((f) => f.following_id)))

    const known = new Set<string>([
      ...playedRows.map((p) => p.id),
      ...sparkRows.map((s) => s.id),
    ])
    setDiscover(((all as Person[]) || []).filter((p) => !known.has(p.id)))
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#fafaf7] pb-24">
      <div className="mx-auto w-full max-w-[440px] px-5">
        <header className="flex items-start justify-between pt-8 pb-4">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.08em] text-[#8a8a82]">
              YOUR CIRCLE
            </div>
            <h1 className="font-display text-[30px] font-bold tracking-tight text-[#0a0a0a]">
              People
            </h1>
          </div>
          {user && <NotifBell userId={user.id} />}
        </header>

        {loading ? (
          <p className="mt-10 text-center text-[#8a8a82]">Loading your circle…</p>
        ) : (
          <>
            <SectionTitle>
              Your bonds{' '}
              {bonds.length > 0 && <span className="text-[#a3a399]">· {bonds.length}</span>}
            </SectionTitle>
            {bonds.length === 0 ? (
              <p className="mb-7 text-sm text-[#8a8a82]">
                Play with someone twice and they become a bond here.
              </p>
            ) : (
              <div className="mb-8 flex flex-col gap-2.5">
                {bonds.map((p) => (
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
                    <div className="shrink-0 text-right">
                      <div className="font-display text-[15px] font-bold text-[#ff4d2e]">
                        {formatHours(p.minutes)}
                      </div>
                      <div className="text-[11px] font-semibold text-[#a3a399]">
                        {p.together} sessions
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {sparks.length > 0 && (
              <>
                <SectionTitle>People to meet</SectionTitle>
                <div className="mb-8 flex flex-col gap-2.5">
                  {sparks.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-[18px] border border-[#eaeae2] bg-white p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/u/${s.handle}`}
                          className="flex min-w-0 flex-1 items-center gap-3"
                        >
                          <Avatar name={s.name} handle={s.handle} url={s.avatar_url} size={46} />
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-display text-[15px] font-bold text-[#0a0a0a]">
                              {s.name}
                            </div>
                            <div className="truncate text-[12.5px] text-[#ff7a59]">
                              ✦ {s.reason}
                            </div>
                          </div>
                        </Link>
                        {user && (
                          <FollowButton
                            viewerId={user.id}
                            targetId={s.id}
                            initialFollowing={followingSet.has(s.id)}
                            size="sm"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
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
