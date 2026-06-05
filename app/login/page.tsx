'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AuthShell, Field, SubmitButton, ErrorNote } from '../signup/page'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Welcome back." subtitle="Let’s find your next session.">
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        {error && <ErrorNote>{error}</ErrorNote>}
        <Field placeholder="Email" type="email" value={email} onChange={setEmail} autoFocus />
        <Field
          placeholder="Password"
          type="password"
          value={password}
          onChange={setPassword}
        />
        <SubmitButton loading={loading} idle="Log in" busy="Logging in…" />
      </form>
      <p className="mt-5 text-center text-sm text-[#8a8a82]">
        New here?{' '}
        <a href="/signup" className="font-semibold text-[#ff4d2e]">
          Create an account
        </a>
      </p>
    </AuthShell>
  )
}
