'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function NotifBell({ userId }: { userId: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let active = true
    supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false)
      .then(({ count }) => {
        if (active) setCount(count || 0)
      })
    return () => {
      active = false
    }
  }, [userId])

  return (
    <Link
      href="/notifications"
      aria-label="Notifications"
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#eaeae2] bg-white text-[17px] transition active:scale-95"
    >
      🔔
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ff4d2e] px-1 text-[11px] font-bold text-white">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  )
}
