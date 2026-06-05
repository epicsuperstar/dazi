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

export function initials(name?: string | null, handle?: string | null): string {
  const src = (name || handle || '?').trim()
  const parts = src.split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return src.slice(0, 2).toUpperCase()
}
