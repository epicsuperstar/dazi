'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function FollowButton({
  viewerId,
  targetId,
  initialFollowing,
  size = 'lg',
  onChange,
}: {
  viewerId: string
  targetId: string
  initialFollowing: boolean
  size?: 'lg' | 'sm'
  onChange?: (following: boolean) => void
}) {
  const [following, setFollowing] = useState(initialFollowing)
  const [busy, setBusy] = useState(false)

  // The real follow status often resolves after first render (the parent
  // fetches it async), so adopt it when it arrives.
  useEffect(() => {
    setFollowing(initialFollowing)
  }, [initialFollowing])

  async function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (busy) return
    setBusy(true)
    const next = !following
    setFollowing(next) // optimistic
    if (next) {
      const { error } = await supabase
        .from('follows')
        .insert({ follower_id: viewerId, following_id: targetId })
      if (error && error.code !== '23505') setFollowing(false)
    } else {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', viewerId)
        .eq('following_id', targetId)
      if (error) setFollowing(true)
    }
    setBusy(false)
    onChange?.(next)
  }

  const base =
    size === 'lg'
      ? 'rounded-full px-5 py-2.5 text-[14px] font-bold transition active:scale-95'
      : 'rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition active:scale-95'

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`${base} ${
        following
          ? 'border border-[#e4e4dc] bg-white text-[#6e6e66]'
          : 'bg-[#ff4d2e] text-white hover:bg-[#f0421f]'
      }`}
    >
      {following ? 'Following' : 'Follow'}
    </button>
  )
}
