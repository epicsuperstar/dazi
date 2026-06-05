'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/', label: 'Today', icon: '◎' },
  { href: '/for-you', label: 'For You', icon: '✦' },
  { href: '/people', label: 'People', icon: '◍' },
  { href: '/you', label: 'You', icon: '⬡' },
]

export function TabBar() {
  const pathname = usePathname()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#eaeae2] bg-[#fafaf7]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[440px] items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {TABS.map((t) => {
          const active =
            t.href === '/' ? pathname === '/' : pathname.startsWith(t.href)
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10.5px] font-bold tracking-wide transition ${
                active ? 'text-[#ff4d2e]' : 'text-[#a3a399] hover:text-[#6e6e66]'
              }`}
            >
              <span className="text-[18px] leading-none">{t.icon}</span>
              {t.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
