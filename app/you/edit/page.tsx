'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'
import { Avatar } from '@/components/Avatar'

export default function EditProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')
  const [handle, setHandle] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [bio, setBio] = useState('')
  const [instagram, setInstagram] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/signup')
      return
    }
    supabase
      .from('profiles')
      .select('name, handle, neighborhood, bio, instagram, avatar_url')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setName(data.name || '')
          setHandle(data.handle || '')
          setNeighborhood(data.neighborhood || '')
          setBio(data.bio || '')
          setInstagram(data.instagram || '')
          setAvatarUrl(data.avatar_url || null)
        }
        setReady(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading])

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setError('')
    setUploading(true)
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const path = `${user.id}/avatar-${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, cacheControl: '3600' })
    if (upErr) {
      setError('Could not upload that image. Try a different one.')
      setUploading(false)
      return
    }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    setAvatarUrl(data.publicUrl)
    setUploading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setError('')
    setSaving(true)
    const { error: upErr } = await supabase
      .from('profiles')
      .update({
        name: name.trim(),
        handle: handle.trim().replace(/^@/, ''),
        neighborhood: neighborhood.trim() || null,
        bio: bio.trim() || null,
        instagram: instagram.trim().replace(/^@/, '') || null,
        avatar_url: avatarUrl,
      })
      .eq('id', user.id)
    setSaving(false)
    if (upErr) {
      setError(
        upErr.code === '23505'
          ? 'That username is already taken.'
          : 'Could not save. Please try again.',
      )
      return
    }
    router.push('/you')
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[#8a8a82]">
        Loading…
      </div>
    )
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
          Edit profile
        </h1>

        {/* Photo */}
        <div className="mt-6 flex items-center gap-4">
          <Avatar name={name} handle={handle} url={avatarUrl} size={72} />
          <div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="rounded-full border border-[#e4e4dc] bg-white px-4 py-2 text-[13.5px] font-bold text-[#0a0a0a] transition active:scale-95 disabled:opacity-60"
            >
              {uploading ? 'Uploading…' : avatarUrl ? 'Change photo' : 'Add photo'}
            </button>
            {avatarUrl && (
              <button
                type="button"
                onClick={() => setAvatarUrl(null)}
                className="ml-2 text-[13px] font-semibold text-[#a3a399]"
              >
                Remove
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handlePhoto}
            className="hidden"
          />
        </div>

        <form onSubmit={handleSave} className="mt-7 flex flex-col gap-5">
          {error && (
            <div className="rounded-xl bg-[#ffeae6] px-4 py-3 text-sm font-medium text-[#d23a1c]">
              {error}
            </div>
          )}

          <Field label="Name">
            <Input value={name} onChange={setName} placeholder="Your name" required />
          </Field>
          <Field label="Username">
            <Input value={handle} onChange={setHandle} placeholder="username" required />
          </Field>
          <Field label="Neighbourhood">
            <Input value={neighborhood} onChange={setNeighborhood} placeholder="e.g. Tiong Bahru" />
          </Field>
          <Field label="Bio">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="What do you play? When are you free?"
              rows={3}
              maxLength={160}
              className="w-full resize-none rounded-2xl border border-[#e4e4dc] bg-white px-4 py-3.5 text-[15px] text-[#0a0a0a] placeholder-[#a3a399] outline-none transition focus:border-[#ff4d2e]"
            />
          </Field>
          <Field label="Instagram">
            <Input value={instagram} onChange={setInstagram} placeholder="yourhandle" />
          </Field>

          <button
            type="submit"
            disabled={saving || uploading}
            className="mt-1 w-full rounded-2xl bg-[#ff4d2e] py-3.5 text-[15px] font-bold text-white transition hover:bg-[#f0421f] active:scale-[0.99] disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-[12px] font-bold tracking-[0.04em] text-[#6e6e66]">
        {label}
      </label>
      {children}
    </div>
  )
}

function Input({
  value,
  onChange,
  placeholder,
  required = false,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-2xl border border-[#e4e4dc] bg-white px-4 py-3.5 text-[15px] text-[#0a0a0a] placeholder-[#a3a399] outline-none transition focus:border-[#ff4d2e]"
    />
  )
}
