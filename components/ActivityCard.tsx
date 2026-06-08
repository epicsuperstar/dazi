'use client'

import Link from 'next/link'
import {
  activityEmoji,
  formatPrice,
  formatTime,
  mapsUrl,
  relativeDay,
  whatsappInvite,
} from '@/lib/ui'
import { Avatar } from '@/components/Avatar'

export type Attendee = {
  id?: string
  name?: string | null
  handle?: string | null
  avatar_url?: string | null
}

export type ActivityCardData = {
  id: string
  activity: string
  location: string
  postal_code?: string | null
  directions?: string | null
  level?: string | null
  pay_note?: string | null
  starts_at: string
  duration_min: number
  price: number | null
  hostName?: string | null
  hostHandle?: string | null
  reason?: string | null
  attendees?: Attendee[]
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
            <div className="flex items-center gap-2">
              <h3 className="font-display text-[18px] font-bold tracking-tight text-[#0a0a0a]">
                {data.activity}
              </h3>
              {data.level && data.level !== 'All levels' && (
                <span className="rounded-full bg-[#eef3ff] px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-[#3a66e0]">
                  {data.level}
                </span>
              )}
            </div>
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

      <div className="mt-4 mb-3 flex gap-7">
        <Stat k="WHERE" v={data.location.split(',')[0]} />
        <Stat k="WHEN" v={`${relativeDay(data.starts_at)} · ${formatTime(data.starts_at)}`} />
        <Stat k="FOR" v={`${data.duration_min}m`} />
      </div>

      {(() => {
        const url = mapsUrl({ postal_code: data.postal_code, location: data.location })
        return url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-2 inline-flex items-center gap-1 text-[13px] font-semibold text-[#ff4d2e]"
          >
            📍 Open in Maps ↗
            {data.postal_code ? (
              <span className="font-normal text-[#a3a399]">· S{data.postal_code}</span>
            ) : null}
          </a>
        ) : null
      })()}

      {data.directions && (
        <p className="mb-2 rounded-xl bg-[#f6f6f1] px-3 py-2 text-[12.5px] leading-relaxed text-[#6e6e66]">
          🧭 {data.directions}
        </p>
      )}

      {data.price != null && data.pay_note && (
        <p className="mb-3 rounded-xl bg-[#fff7ed] px-3 py-2 text-[12.5px] leading-relaxed text-[#b45309]">
          💵 How to pay: {data.pay_note}
        </p>
      )}

      {data.attendees && data.attendees.length > 0 && (
        <div className="mb-3 flex items-center gap-2">
          <div className="flex -space-x-2">
            {data.attendees.slice(0, 5).map((a, i) => (
              <span
                key={a.id || i}
                className="rounded-full ring-2 ring-white"
                title={a.name || a.handle || ''}
              >
                <Avatar name={a.name} handle={a.handle} url={a.avatar_url} size={26} />
              </span>
            ))}
          </div>
          <span className="text-[12.5px] font-medium text-[#8a8a82]">
            {goingLabel(data.attendees)}
          </span>
        </div>
      )}

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

      <button
        onClick={() =>
          whatsappInvite(`/a/${data.id}`, `Come play ${data.activity} with me on Dazi`)
        }
        className="mt-2 w-full text-center text-[13px] font-semibold text-[#8a8a82] transition hover:text-[#1f8a70]"
      >
        Invite friends ↗
      </button>
    </article>
  )
}

function goingLabel(attendees: Attendee[]): string {
  const n = attendees.length
  const first = attendees[0]?.name?.split(' ')[0] || attendees[0]?.handle || 'Someone'
  if (n === 1) return `${first} is going`
  if (n === 2) {
    const second =
      attendees[1]?.name?.split(' ')[0] || attendees[1]?.handle || 'someone'
    return `${first} & ${second} are going`
  }
  return `${first} & ${n - 1} others going`
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold tracking-[0.07em] text-[#a3a399]">{k}</div>
      <div className="mt-0.5 text-[14px] font-semibold text-[#0a0a0a]">{v}</div>
    </div>
  )
}
