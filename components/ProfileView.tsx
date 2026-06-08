'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Profile } from '@/lib/types'
import { Avatar } from '@/components/Avatar'
import { FollowButton } from '@/components/FollowButton'
import {
  activityEmoji,
  formatHours,
  formatTime,
  linkLabel,
  normalizeUrl,
  relativeDay,
} from '@/lib/ui'

type Row = {
  id: string
  activity: string
  location: string
  starts_at: string
  duration_min: number
  price: number | null
  status: string
  role: 'Host' | 'Going'
}

export function ProfileView({
  profile,
  isSelf,
  viewerId,
  onLogout,
  onEdit,
}: {
  profile: Profile
  isSelf: boolean
  viewerId?: string
  onLogout?: () => void
  onEdit?: () => void
}) {
  const [rows, setRows] = useState<Row[]>([])
  const [circle, setCircle] = useState(0)
  const [hosted, setHosted] = useState(0)
  const [joinedCount, setJoinedCount] = useState(0)
  const [followers, setFollowers] = useState(0)
  const [followingN, setFollowingN] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  const [shared, setShared] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.id])

  async function load() {
    setLoading(true)
    const [
      hostedRes,
      joinedRes,
      circleRes,
      followersRes,
      followingRes,
      followRes,
      sharedRes,
    ] = await Promise.all([
        supabase
          .from('posts')
          .select('id, activity, location, starts_at, duration_min, price, status')
          .eq('author_id', profile.id),
        supabase
          .from('joins')
          .select(
            'post:posts(id, activity, location, starts_at, duration_min, price, status)',
          )
          .eq('user_id', profile.id),
        supabase.rpc('played_with', { p_user: profile.id }),
        supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', profile.id),
        supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', profile.id),
        !isSelf && viewerId
          ? supabase
              .from('follows')
              .select('follower_id')
              .eq('follower_id', viewerId)
              .eq('following_id', profile.id)
              .maybeSingle()
          : Promise.resolve({ data: null }),
        !isSelf && viewerId
          ? supabase.rpc('shared_history', { p_user: viewerId, p_other: profile.id })
          : Promise.resolve({ data: [] }),
      ])

    const byId = new Map<string, Row>()
    for (const p of (hostedRes.data as any[]) || []) byId.set(p.id, { ...p, role: 'Host' })
    for (const j of (joinedRes.data as any[]) || []) {
      const p = Array.isArray(j.post) ? j.post[0] : j.post
      if (p && !byId.has(p.id)) byId.set(p.id, { ...p, role: 'Going' })
    }

    setHosted((hostedRes.data as any[])?.length || 0)
    setJoinedCount((joinedRes.data as any[])?.length || 0)
    setCircle(((circleRes.data as any[]) || []).length)
    setFollowers(followersRes.count || 0)
    setFollowingN(followingRes.count || 0)
    setIsFollowing(!!(followRes as any).data)
    setShared((((sharedRes as any).data as Row[]) || []).map((p) => ({ ...p, role: 'Going' })))
    setRows([...byId.values()])
    setLoading(false)
  }

  const upcoming = rows
    .filter((r) => r.status === 'upcoming')
    .sort((a, b) => +new Date(a.starts_at) - +new Date(b.starts_at))
  const past = rows
    .filter((r) => r.status !== 'upcoming')
    .sort((a, b) => +new Date(b.starts_at) - +new Date(a.starts_at))

  return (
    <div className="min-h-screen bg-[#fafaf7] pb-24">
      <div className="mx-auto w-full max-w-[440px] px-5">
        <div className="flex items-center justify-between pt-8">
          <div className="text-[11px] font-semibold tracking-[0.08em] text-[#8a8a82]">
            {isSelf ? 'YOUR PROFILE' : 'PROFILE'}
          </div>
          {isSelf && onLogout && (
            <button
              onClick={onLogout}
              className="text-xs font-semibold text-[#a3a399] transition hover:text-[#0a0a0a]"
            >
              Log out
            </button>
          )}
        </div>

        {/* Identity */}
        <div className="mt-4 flex items-center gap-4">
          <Avatar name={profile.name} handle={profile.handle} url={profile.avatar_url} size={68} />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[24px] font-bold leading-tight tracking-tight text-[#0a0a0a]">
              {profile.name}
            </h1>
            <div className="text-[14px] text-[#8a8a82]">
              @{profile.handle}
              {profile.neighborhood ? ` · ${profile.neighborhood}` : ''}
            </div>
          </div>
        </div>

        {profile.bio && (
          <p className="mt-4 text-[15px] leading-relaxed text-[#3a3a36]">{profile.bio}</p>
        )}

        {(() => {
          const raw =
            profile.link ||
            (profile.instagram ? `https://instagram.com/${profile.instagram}` : '')
          if (!raw) return null
          const url = normalizeUrl(raw)
          return (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-[13px] font-semibold text-[#ff4d2e]"
            >
              ↗ {linkLabel(url)}
            </a>
          )
        })()}

        {/* Follow row */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-[13.5px] text-[#6e6e66]">
            <b className="font-display text-[#0a0a0a]">{followers}</b> followers
            <span className="mx-1.5 text-[#d6d6cc]">·</span>
            <b className="font-display text-[#0a0a0a]">{followingN}</b> following
          </div>
          {isSelf ? (
            <button
              onClick={onEdit}
              className="rounded-full border border-[#e4e4dc] bg-white px-5 py-2.5 text-[14px] font-bold text-[#0a0a0a] transition active:scale-95"
            >
              Edit profile
            </button>
          ) : (
            viewerId && (
              <FollowButton
                viewerId={viewerId}
                targetId={profile.id}
                initialFollowing={isFollowing}
                onChange={(f) => setFollowers((n) => n + (f ? 1 : -1))}
              />
            )
          )}
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-[18px] border border-[#eaeae2] bg-white">
          <StatBox n={hosted} label="Hosted" />
          <StatBox n={joinedCount} label="Joined" border />
          <StatBox n={circle} label="Played with" />
        </div>

        {!isSelf && shared.length > 0 && (
          <div className="mt-5 rounded-[18px] border border-[#ffd9cf] bg-[#fff6f3] p-4">
            <div className="font-display text-[15px] font-bold text-[#0a0a0a]">
              You + {profile.name?.split(' ')[0] || profile.handle}
            </div>
            <div className="mt-1 text-[13.5px] text-[#6e6e66]">
              <b className="text-[#ff4d2e]">
                {formatHours(shared.reduce((s, r) => s + (r.duration_min || 0), 0))}
              </b>{' '}
              together over{' '}
              <b className="text-[#0a0a0a]">{shared.length}</b>{' '}
              {shared.length === 1 ? 'session' : 'sessions'}.
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {shared.slice(0, 4).map((r) => (
                <div key={r.id} className="flex items-center gap-2 text-[13px] text-[#3a3a36]">
                  <span className="text-[16px]">{activityEmoji(r.activity)}</span>
                  <span className="font-semibold">{r.activity}</span>
                  <span className="text-[#a3a399]">
                    · {relativeDay(r.starts_at)} {formatTime(r.starts_at)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <p className="mt-10 text-center text-[#8a8a82]">Loading…</p>
        ) : (
          <>
            <Section title={isSelf ? 'Your upcoming' : 'Upcoming'}>
              {upcoming.length === 0 ? (
                <Empty>Nothing coming up.</Empty>
              ) : (
                upcoming.map((r) => <PostRow key={r.id} r={r} />)
              )}
            </Section>

            {past.length > 0 && (
              <Section title="Recent">
                {past.map((r) => (
                  <PostRow key={r.id} r={r} dim />
                ))}
              </Section>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function StatBox({ n, label, border }: { n: number; label: string; border?: boolean }) {
  return (
    <div className={`px-3 py-4 text-center ${border ? 'border-x border-[#eaeae2]' : ''}`}>
      <div className="font-display text-[22px] font-bold text-[#0a0a0a]">{n}</div>
      <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#a3a399]">
        {label}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-7">
      <h2 className="mb-3 text-[12px] font-bold uppercase tracking-[0.06em] text-[#6e6e66]">
        {title}
      </h2>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  )
}

function PostRow({ r, dim }: { r: Row; dim?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-[18px] border border-[#eaeae2] bg-white p-3 ${
        dim ? 'opacity-70' : ''
      }`}
    >
      <span className="text-[22px]">{activityEmoji(r.activity)}</span>
      <div className="min-w-0 flex-1">
        <div className="truncate font-display text-[15px] font-bold text-[#0a0a0a]">
          {r.activity}
        </div>
        <div className="truncate text-[12.5px] text-[#8a8a82]">
          {r.location.split(',')[0]} · {relativeDay(r.starts_at)} {formatTime(r.starts_at)}
        </div>
      </div>
      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
          r.role === 'Host' ? 'bg-[#fff1ee] text-[#ff4d2e]' : 'bg-[#f1f1ec] text-[#6e6e66]'
        }`}
      >
        {r.role}
      </span>
    </div>
  )
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-[#8a8a82]">{children}</p>
}
