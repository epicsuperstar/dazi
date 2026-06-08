'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'

const ACTIVITIES: { name: string; emoji: string }[] = [
  { name: 'Badminton', emoji: '🏸' },
  { name: 'Pickleball', emoji: '🏓' },
  { name: 'Padel', emoji: '🎾' },
  { name: 'Run', emoji: '🏃' },
  { name: 'Gym', emoji: '🏋️' },
]

const LEVELS = ['All levels', 'Beginner', 'Intermediate', 'Advanced']

const VISIBILITY: { value: string; label: string; hint: string }[] = [
  { value: 'public', label: 'Public', hint: 'Anyone on Dazi can see it' },
  { value: 'followers', label: 'Followers', hint: 'Only people who follow you' },
  { value: 'invite', label: 'Private · link only', hint: 'Hidden from the feed. Only people you send the link to' },
]

export default function PostPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [activity, setActivity] = useState(ACTIVITIES[0].name)
  const [level, setLevel] = useState(LEVELS[0])
  const [visibility, setVisibility] = useState('public')
  const [location, setLocation] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [directions, setDirections] = useState('')
  const [startTime, setStartTime] = useState('19:00')
  const [duration, setDuration] = useState('120')
  const [price, setPrice] = useState('')
  const [payNote, setPayNote] = useState('')
  const [cap, setCap] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!user) throw new Error('Not authenticated')

      const [hours, minutes] = startTime.split(':')
      const startsAt = new Date()
      startsAt.setHours(parseInt(hours), parseInt(minutes), 0, 0)

      const postId = `${user.id}-${Date.now()}`

      const { error: postError } = await supabase.from('posts').insert({
        id: postId,
        author_id: user.id,
        activity,
        level,
        visibility,
        location,
        postal_code: postalCode.trim() || null,
        directions: directions.trim() || null,
        starts_at: startsAt.toISOString(),
        duration_min: parseInt(duration),
        price: price ? parseFloat(price) : null,
        pay_note: price && payNote.trim() ? payNote.trim() : null,
        cap: cap ? parseInt(cap) : null,
        status: 'upcoming',
      })

      if (postError) throw postError

      // Land on the activity's shareable page so the host can invite people.
      router.push(`/a/${postId}`)
    } catch (err: any) {
      setError(err.message || 'Failed to create activity')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf7] px-5 pb-16">
      <div className="mx-auto w-full max-w-[440px]">
        <button
          onClick={() => router.back()}
          className="mt-7 mb-6 text-sm font-semibold text-[#8a8a82] transition hover:text-[#0a0a0a]"
        >
          ← Back
        </button>

        <h1 className="font-display text-[28px] font-bold tracking-tight text-[#0a0a0a]">
          Start something
        </h1>
        <p className="mt-1 mb-7 text-[15px] text-[#8a8a82]">
          Post it and let people jump in.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="rounded-xl bg-[#ffeae6] px-4 py-3 text-sm font-medium text-[#d23a1c]">
              {error}
            </div>
          )}

          {/* Activity chips */}
          <div>
            <Label>Activity</Label>
            <div className="flex flex-wrap gap-2">
              {ACTIVITIES.map((a) => {
                const selected = a.name === activity
                return (
                  <button
                    key={a.name}
                    type="button"
                    onClick={() => setActivity(a.name)}
                    className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition active:scale-95 ${
                      selected
                        ? 'border-[#ff4d2e] bg-[#ff4d2e] text-white'
                        : 'border-[#e4e4dc] bg-white text-[#0a0a0a]'
                    }`}
                  >
                    <span className="mr-1.5">{a.emoji}</span>
                    {a.name}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <Label>Player level</Label>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((l) => {
                const selected = l === level
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLevel(l)}
                    className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition active:scale-95 ${
                      selected
                        ? 'border-[#ff4d2e] bg-[#ff4d2e] text-white'
                        : 'border-[#e4e4dc] bg-white text-[#0a0a0a]'
                    }`}
                  >
                    {l}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <Label>Who can see it</Label>
            <div className="flex flex-col gap-2">
              {VISIBILITY.map((v) => {
                const selected = v.value === visibility
                return (
                  <button
                    key={v.value}
                    type="button"
                    onClick={() => setVisibility(v.value)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition active:scale-[0.99] ${
                      selected ? 'border-[#ff4d2e] bg-[#fff1ee]' : 'border-[#e4e4dc] bg-white'
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-bold text-[#0a0a0a]">
                        {v.label}
                      </span>
                      <span className="block text-[12.5px] text-[#8a8a82]">{v.hint}</span>
                    </span>
                    <span
                      className={`ml-3 h-4 w-4 shrink-0 rounded-full border-2 ${
                        selected ? 'border-[#ff4d2e] bg-[#ff4d2e]' : 'border-[#cfcfc6]'
                      }`}
                    />
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <Label>Where</Label>
            <Input
              placeholder="Venue, e.g. Tiong Bahru CC, Court 2"
              value={location}
              onChange={setLocation}
              required
            />
          </div>

          <div>
            <Label>
              Postal code{' '}
              <span className="font-normal text-[#a3a399]">· links to Maps</span>
            </Label>
            <Input
              type="text"
              placeholder="e.g. 168732"
              value={postalCode}
              onChange={setPostalCode}
            />
          </div>

          <div>
            <Label>
              Getting there{' '}
              <span className="font-normal text-[#a3a399]">· optional</span>
            </Label>
            <textarea
              value={directions}
              onChange={(e) => setDirections(e.target.value)}
              placeholder="Which gate, level, what to bring, where to meet…"
              rows={3}
              maxLength={280}
              className="w-full resize-none rounded-2xl border border-[#e4e4dc] bg-white px-4 py-3.5 text-[15px] text-[#0a0a0a] placeholder-[#a3a399] outline-none transition focus:border-[#ff4d2e]"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <Label>Start time</Label>
              <Input type="time" value={startTime} onChange={setStartTime} required />
            </div>
            <div className="flex-1">
              <Label>Minutes</Label>
              <Input
                type="number"
                placeholder="120"
                value={duration}
                onChange={setDuration}
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <Label>
                Price <span className="font-normal text-[#a3a399]">· optional</span>
              </Label>
              <Input
                type="number"
                placeholder="Free"
                value={price}
                onChange={setPrice}
                step="0.01"
              />
            </div>
            <div className="flex-1">
              <Label>
                Spots <span className="font-normal text-[#a3a399]">· optional</span>
              </Label>
              <Input
                type="number"
                placeholder="Any"
                value={cap}
                onChange={setCap}
              />
            </div>
          </div>

          {price.trim() !== '' && (
            <div>
              <Label>
                How to pay{' '}
                <span className="font-normal text-[#a3a399]">· shown to joiners</span>
              </Label>
              <Input
                placeholder="e.g. PayNow 9123 4567 (Marcus) on arrival"
                value={payNote}
                onChange={setPayNote}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-2xl bg-[#ff4d2e] py-3.5 text-[15px] font-bold text-white transition hover:bg-[#f0421f] active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? 'Posting…' : 'Post activity'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-[12px] font-bold tracking-[0.04em] text-[#6e6e66]">
      {children}
    </label>
  )
}

function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  step,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
  step?: string
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      step={step}
      className="w-full rounded-2xl border border-[#e4e4dc] bg-white px-4 py-3.5 text-[15px] text-[#0a0a0a] placeholder-[#a3a399] outline-none transition focus:border-[#ff4d2e]"
    />
  )
}
