export const ACTIVITY_EMOJI: Record<string, string> = {
  Badminton: '🏸',
  Pickleball: '🏓',
  Padel: '🎾',
  Run: '🏃',
  Gym: '🏋️',
}

export function activityEmoji(activity: string): string {
  return ACTIVITY_EMOJI[activity] ?? '📍'
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatPrice(price: number): string {
  return Number.isInteger(price) ? String(price) : price.toFixed(2)
}

/** "Today", "Tomorrow", "Mon" or "5 Jun" for older dates. */
export function relativeDay(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate())
  const days = Math.round(
    (startOf(d).getTime() - startOf(now).getTime()) / 86400000,
  )
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days === -1) return 'Yesterday'
  if (days > 1 && days < 7) return d.toLocaleDateString('en-US', { weekday: 'short' })
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
}

const AVATAR_PALETTE = [
  '#FF4D2E', '#1F8A70', '#3A66E0', '#E0A21F', '#B5479B',
  '#2BB3C0', '#E0552E', '#6B5BD2', '#3FA34D', '#D23A6B',
]

export function avatarColor(seed: string): string {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return AVATAR_PALETTE[h % AVATAR_PALETTE.length]
}

/** A Google Maps link from a Singapore postal code (preferred) or address text. */
export function mapsUrl(opts: {
  postal_code?: string | null
  location?: string | null
}): string | null {
  const q = opts.postal_code
    ? `Singapore ${opts.postal_code}`
    : (opts.location || '').trim()
  if (!q.trim()) return null
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
}

export function normalizeUrl(raw: string): string {
  const s = raw.trim()
  if (!s) return ''
  if (/^https?:\/\//i.test(s)) return s
  return 'https://' + s.replace(/^\/+/, '')
}

/** Friendly label for a profile link, inferred from its domain. */
export function linkLabel(url: string): string {
  try {
    const u = new URL(normalizeUrl(url))
    const host = u.hostname.replace(/^www\./, '')
    const map: Record<string, string> = {
      'instagram.com': 'Instagram',
      'tiktok.com': 'TikTok',
      't.me': 'Telegram',
      'telegram.me': 'Telegram',
      'twitter.com': 'X',
      'x.com': 'X',
      'facebook.com': 'Facebook',
      'linkedin.com': 'LinkedIn',
      'youtube.com': 'YouTube',
      'wa.me': 'WhatsApp',
      'linktr.ee': 'Linktree',
      'strava.com': 'Strava',
    }
    return map[host] || host
  } catch {
    return 'Link'
  }
}

export function initials(name?: string | null, handle?: string | null): string {
  const src = (name || handle || '?').trim()
  const parts = src.split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return src.slice(0, 2).toUpperCase()
}
