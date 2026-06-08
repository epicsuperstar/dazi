import { avatarColor, initials } from '@/lib/ui'

export function Avatar({
  name,
  handle,
  url,
  size = 44,
}: {
  name?: string | null
  handle?: string | null
  url?: string | null
  size?: number
}) {
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={name || handle || 'avatar'}
        width={size}
        height={size}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    )
  }
  const bg = avatarColor(handle || name || '?')
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-display font-bold text-white"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.38 }}
      aria-hidden
    >
      {initials(name, handle)}
    </div>
  )
}
