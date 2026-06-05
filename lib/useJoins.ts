'use client'

import { useEffect, useState } from 'react'
import { supabase } from './supabase'

/** Shared join state + action, used by the feed, For You, and profile pages. */
export function useJoins(userId: string | undefined) {
  const [joined, setJoined] = useState<Set<string>>(new Set())
  const [joining, setJoining] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    supabase
      .from('joins')
      .select('post_id')
      .eq('user_id', userId)
      .then(({ data }) => {
        if (data) setJoined(new Set(data.map((j) => j.post_id)))
      })
  }, [userId])

  async function join(postId: string) {
    if (!userId || joined.has(postId)) return
    setJoining(postId)
    const { error } = await supabase
      .from('joins')
      .insert({ post_id: postId, user_id: userId })
    if (!error || error.code === '23505') {
      setJoined((prev) => new Set([...prev, postId]))
    }
    setJoining(null)
  }

  return { joined, joining, join }
}
