'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function deriveHandle(name: string, email: string): string {
  const base = (name.trim() || email.split('@')[0] || 'dazi')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 20)
  return base || 'dazi'
}

export function AuthForm({ mode }: { mode: 'signin' | 'signup' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name.trim(), handle: deriveHandle(name, email) } },
        })
        if (error) throw error
        // Email confirmation is auto-confirmed by a DB trigger, so we can sign
        // straight in if signUp didn't already return a session.
        if (!data.session) {
          const { error: e2 } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          if (e2) throw e2
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
      router.push('/')
    } catch (err: any) {
      setError(friendlyError(err?.message))
    } finally {
      setLoading(false)
    }
  }

  const title = mode === 'signup' ? 'Make plans, together.' : 'Welcome back.'
  const subtitle =
    mode === 'signup'
      ? 'Post what you’re doing. Friends jump in.'
      : 'Let’s find your next session.'

  return (
    <AuthShell title={title} subtitle={subtitle}>
      <form onSubmit={submit} className="flex flex-col gap-3">
        {error && (
          <div className="rounded-xl bg-[#ffeae6] px-4 py-3 text-sm font-medium text-[#d23a1c]">
            {error}
          </div>
        )}

        {mode === 'signup' && (
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            className="w-full rounded-2xl border border-[#e4e4dc] bg-white px-4 py-3.5 text-[15px] text-[#0a0a0a] placeholder-[#a3a399] outline-none transition focus:border-[#ff4d2e]"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus={mode === 'signin'}
          autoComplete="email"
          className="w-full rounded-2xl border border-[#e4e4dc] bg-white px-4 py-3.5 text-[15px] text-[#0a0a0a] placeholder-[#a3a399] outline-none transition focus:border-[#ff4d2e]"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          className="w-full rounded-2xl border border-[#e4e4dc] bg-white px-4 py-3.5 text-[15px] text-[#0a0a0a] placeholder-[#a3a399] outline-none transition focus:border-[#ff4d2e]"
        />

        {mode === 'signup' && (
          <p className="px-1 text-[12.5px] text-[#a3a399]">At least 6 characters.</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 w-full rounded-2xl bg-[#ff4d2e] py-3.5 text-[15px] font-bold text-white transition hover:bg-[#f0421f] active:scale-[0.99] disabled:opacity-60"
        >
          {loading ? 'One sec…' : mode === 'signup' ? 'Create account' : 'Log in'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-[#8a8a82]">
        {mode === 'signup' ? (
          <>
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-[#ff4d2e]">
              Log in
            </a>
          </>
        ) : (
          <>
            New here?{' '}
            <a href="/signup" className="font-semibold text-[#ff4d2e]">
              Create an account
            </a>
          </>
        )}
      </p>
    </AuthShell>
  )
}

function friendlyError(msg?: string): string {
  if (!msg) return 'Something went wrong. Please try again.'
  if (/invalid login credentials/i.test(msg)) return 'Wrong email or password.'
  if (/already registered|already exists/i.test(msg))
    return 'That email already has an account. Try logging in.'
  if (/password should be at least/i.test(msg))
    return 'Password must be at least 6 characters.'
  return msg
}

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
