'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [handle, setHandle] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, handle: handle.replace(/^@/, '') },
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('No user returned')

      if (!authData.session) {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError
      }

      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Make plans, together."
      subtitle="Post what you’re doing. Friends jump in."
    >
      <form onSubmit={handleSignup} className="flex flex-col gap-3">
        {error && <ErrorNote>{error}</ErrorNote>}
        <Field placeholder="Your name" value={name} onChange={setName} autoFocus />
        <Field placeholder="Username" value={handle} onChange={setHandle} />
        <Field placeholder="Email" type="email" value={email} onChange={setEmail} />
        <Field
          placeholder="Password"
          type="password"
          value={password}
          onChange={setPassword}
        />
        <SubmitButton loading={loading} idle="Create account" busy="Creating…" />
      </form>
      <p className="mt-5 text-center text-sm text-[#8a8a82]">
        Already have an account?{' '}
        <a href="/login" className="font-semibold text-[#ff4d2e]">
          Log in
        </a>
      </p>
    </AuthShell>
  )
}

/* Shared auth UI — also used by the login screen. */

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#fafaf7] px-6">
      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-12">
        <div className="mb-9">
          <div className="font-display text-[34px] font-bold tracking-tight text-[#0a0a0a]">
            dazi
          </div>
          <h1 className="mt-6 font-display text-[28px] font-bold leading-tight tracking-tight text-[#0a0a0a]">
            {title}
          </h1>
          <p className="mt-2 text-[15px] text-[#8a8a82]">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Field({
  value,
  onChange,
  placeholder,
  type = 'text',
  autoFocus = false,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  type?: string
  autoFocus?: boolean
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      autoFocus={autoFocus}
      onChange={(e) => onChange(e.target.value)}
      required
      className="w-full rounded-2xl border border-[#e4e4dc] bg-white px-4 py-3.5 text-[15px] text-[#0a0a0a] placeholder-[#a3a399] outline-none transition focus:border-[#ff4d2e]"
    />
  )
}

export function SubmitButton({
  loading,
  idle,
  busy,
}: {
  loading: boolean
  idle: string
  busy: string
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-2 w-full rounded-2xl bg-[#ff4d2e] py-3.5 text-[15px] font-bold text-white transition hover:bg-[#f0421f] active:scale-[0.99] disabled:opacity-60"
    >
      {loading ? busy : idle}
    </button>
  )
}

export function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-[#ffeae6] px-4 py-3 text-sm font-medium text-[#d23a1c]">
      {children}
    </div>
  )
}
