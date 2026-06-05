'use client'

import Link from 'next/link'
import { activityEmoji, formatPrice, formatTime, relativeDay } from '@/lib/ui'

export type ActivityCardData = {
  id: string
  activity: string
  location: string
  starts_at: string
  duration_min: number
  price: number | null
  hostName?: string | null
  hostHandle?: string | null
  reason?: string | null
}

export function ActivityCard({
  data,
  joined,
  joining,
  onJoin,
}: {
  data: ActivityCardData
  joined: boolean
  joining: boolean
  onJoin: () => void
}) {
  return (
    <article className="rounded-[22px] border border-[#eaeae2] bg-white p-[18px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <span className="text-2xl">{activityEmoji(data.activity)}</span>
          <div>
            <h3 className="font-display text-[18px] font-bold tracking-tight text-[#0a0a0a]">
              {data.activity}
            </h3>
            {data.hostHandle ? (
              <Link
                href={`/u/${data.hostHandle}`}
                className="text-[12.5px] font-medium text-[#8a8a82] transition hover:text-[#ff4d2e]"
              >
                with @{data.hostHandle}
              </Link>
            ) : (
              <span className="text-[12.5px] font-medium text-[#8a8a82]">
                with someone
              </span>
            )}
          </div>
        </div>
        {data.price != null ? (
          <span className="text-[16px] font-bold text-[#ff4d2e]">
            ${formatPrice(data.price)}
          </span>
        ) : (
          <span className="text-[11px] font-semibold tracking-[0.06em] text-[#a3a399]">
            FREE
          </span>
        )}
      </div>

      {data.reason && (
        <div className="mt-3 rounded-xl bg-[#fff1ee] px-3 py-2 text-[12.5px] font-semibold text-[#d23a1c]">
          ✦ {data.reason}
        </div>
      )}

      <div className="mt-4 mb-4 flex gap-7">
        <Stat k="WHERE" v={data.location.split(',')[0]} />
        <Stat k="WHEN" v={`${relativeDay(data.starts_at)} · ${formatTime(data.starts_at)}`} />
        <Stat k="FOR" v={`${data.duration_min}m`} />
      </div>

      <button
        onClick={onJoin}
        disabled={joined || joining}
        className={`w-full rounded-[14px] py-3 text-[14.5px] font-bold transition active:scale-[0.99] ${
          joined
            ? 'bg-[#f1f1ec] text-[#8a8a82]'
            : 'bg-[#ff4d2e] text-white hover:bg-[#f0421f] disabled:opacity-70'
        }`}
      >
        {joined
          ? '✓ You’re in'
          : joining
            ? 'Joining…'
            : data.price != null
              ? `Join · $${formatPrice(data.price)}`
              : 'I’m in'}
      </button>
    </article>
  )
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold tracking-[0.07em] text-[#a3a399]">{k}</div>
      <div className="mt-0.5 text-[14px] font-semibold text-[#0a0a0a]">{v}</div>
    </div>
  )
}
