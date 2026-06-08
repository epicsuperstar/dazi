'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const DISMISS_KEY = 'dazi_install_dismissed'

type BIPEvent = Event & { prompt: () => void; userChoice: Promise<unknown> }

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null)
  const [variant, setVariant] = useState<'android' | 'ios' | null>(null)
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Already installed, or previously dismissed → never show.
    const standalone =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true
    if (standalone) return
    if (localStorage.getItem(DISMISS_KEY)) return

    // Only nudge people who are signed in (i.e. have seen some value).
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSignedIn(true)
    })

    const onBIP = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BIPEvent)
      setVariant('android')
    }
    window.addEventListener('beforeinstallprompt', onBIP)

    // iOS Safari has no install event; detect it and show instructions.
    const ua = navigator.userAgent || ''
    const isIOS = /iphone|ipad|ipod/i.test(ua)
    if (isIOS) setVariant('ios')

    return () => window.removeEventListener('beforeinstallprompt', onBIP)
  }, [])

  if (!signedIn || !variant) return null

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, '1')
    setVariant(null)
  }

  async function install() {
    if (deferred) {
      deferred.prompt()
      await deferred.userChoice.catch(() => {})
      dismiss()
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-[84px] z-40 px-4">
      <div className="mx-auto flex w-full max-w-[440px] items-center gap-3 rounded-2xl border border-[#eaeae2] bg-white p-3 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ff4d2e] font-display text-[22px] font-bold text-white">
          d
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-bold text-[#0a0a0a]">Add Dazi to your home screen</div>
          {variant === 'ios' ? (
            <div className="text-[12.5px] text-[#8a8a82]">
              Tap Share, then “Add to Home Screen”.
            </div>
          ) : (
            <div className="text-[12.5px] text-[#8a8a82]">
              Open it like an app, one tap away.
            </div>
          )}
        </div>
        {variant === 'android' ? (
          <button
            onClick={install}
            className="shrink-0 rounded-full bg-[#ff4d2e] px-4 py-2 text-[13px] font-bold text-white"
          >
            Add
          </button>
        ) : null}
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 px-1 text-[18px] leading-none text-[#a3a399]"
        >
          ×
        </button>
      </div>
    </div>
  )
}
