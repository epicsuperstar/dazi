'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function AuthForm({ mode }: { mode: 'signin' | 'signup' }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [usePassword, setUsePassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function sendLink(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
        shouldCreateUser: true,
      },
    })
    setLoading(false)
    if (error) setError(error.message)
    else setSent(true)
  }

  async function withPassword(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
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
      setError(err.message || 'Something went wrong')
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
      {sent ? (
        <div className="rounded-2xl border border-[#eaeae2] bg-white p-6 text-center">
          <div className="text-3xl">📬</div>
          <p className="mt-3 font-display text-lg font-bold text-[#0a0a0a]">
            Check your inbox
          </p>
          <p className="mt-1 text-sm text-[#8a8a82]">
            We sent a sign-in link to <b className="text-[#0a0a0a]">{email}</b>. Tap it
            to finish, no password needed.
          </p>
          <button
            onClick={() => setSent(false)}
            className="mt-5 text-[13px] font-semibold text-[#ff4d2e]"
          >
            Use a different email
          </button>
        </div>
      ) : (
        <form
          onSubmit={usePassword ? withPassword : sendLink}
          className="flex flex-col gap-3"
        >
          {error && (
            <div className="rounded-xl bg-[#ffeae6] px-4 py-3 text-sm font-medium text-[#d23a1c]">
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            className="w-full rounded-2xl border border-[#e4e4dc] bg-white px-4 py-3.5 text-[15px] text-[#0a0a0a] placeholder-[#a3a399] outline-none transition focus:border-[#ff4d2e]"
          />

          {usePassword && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-2xl border border-[#e4e4dc] bg-white px-4 py-3.5 text-[15px] text-[#0a0a0a] placeholder-[#a3a399] outline-none transition focus:border-[#ff4d2e]"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-2xl bg-[#ff4d2e] py-3.5 text-[15px] font-bold text-white transition hover:bg-[#f0421f] active:scale-[0.99] disabled:opacity-60"
          >
            {loading
              ? 'One sec…'
              : usePassword
                ? mode === 'signup'
                  ? 'Create account'
                  : 'Log in'
                : 'Email me a sign-in link'}
          </button>

          <button
            type="button"
            onClick={() => {
              setUsePassword((v) => !v)
              setError('')
            }}
            className="mt-1 text-center text-[13px] font-semibold text-[#8a8a82] transition hover:text-[#0a0a0a]"
          >
            {usePassword ? 'Use a magic link instead' : 'Prefer a password?'}
          </button>
        </form>
      )}

      {!sent && (
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
      )}
    </AuthShell>
  )
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
