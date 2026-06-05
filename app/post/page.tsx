'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'

const ACTIVITIES = ['Badminton', 'Pickleball', 'Padel', 'Run', 'Gym']

export default function PostPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [activity, setActivity] = useState(ACTIVITIES[0])
  const [location, setLocation] = useState('')
  const [startTime, setStartTime] = useState('19:00')
  const [duration, setDuration] = useState('120')
  const [price, setPrice] = useState('')
  const [cap, setCap] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!user) throw new Error('Not authenticated')

      // Create ISO timestamp for today at the specified time
      const today = new Date()
      const [hours, minutes] = startTime.split(':')
      const startsAt = new Date(today)
      startsAt.setHours(parseInt(hours), parseInt(minutes), 0, 0)

      const postId = `${user.id}-${Date.now()}`

      const { error: postError } = await supabase
        .from('posts')
        .insert({
          id: postId,
          author_id: user.id,
          activity,
          location,
          starts_at: startsAt.toISOString(),
          duration_min: parseInt(duration),
          price: price ? parseFloat(price) : null,
          cap: cap ? parseInt(cap) : null,
          status: 'upcoming',
        })

      if (postError) throw postError

      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Failed to create activity')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-md mx-auto p-4">
        <button
          onClick={() => router.back()}
          className="text-slate-400 hover:text-white mb-6 mt-4"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-white mb-8">Post an Activity</h1>

        <form onSubmit={handleSubmit} className="space-y-4 bg-slate-800 p-6 rounded-lg">
          {error && (
            <div className="p-3 rounded bg-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="text-slate-300 text-sm font-medium block mb-2">
              Activity
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {ACTIVITIES.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-300 text-sm font-medium block mb-2">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g. Central Park"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm font-medium block mb-2">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm font-medium block mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              placeholder="120"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm font-medium block mb-2">
              Price per person (optional)
            </label>
            <input
              type="number"
              placeholder="15"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm font-medium block mb-2">
              Capacity (optional)
            </label>
            <input
              type="number"
              placeholder="4"
              value={cap}
              onChange={(e) => setCap(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50 transition"
          >
            {loading ? 'Creating...' : 'Post Activity'}
          </button>
        </form>
      </div>
    </div>
  )
}
