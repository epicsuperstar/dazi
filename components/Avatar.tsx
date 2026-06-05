import { avatarColor, initials } from '@/lib/ui'

export function Avatar({
  name,
  handle,
  size = 44,
}: {
  name?: string | null
  handle?: string | null
  size?: number
}) {
  const bg = avatarColor(handle || name || '?')
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-display font-bold text-white"
      style={{
        width: size,
        height: size,
        background: bg,
        fontSize: size * 0.38,
      }}
      aria-hidden
    >
      {initials(name, handle)}
    </div>
  )
}
