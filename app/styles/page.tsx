import { Space_Grotesk, Plus_Jakarta_Sans, Inter } from 'next/font/google'

const display = Space_Grotesk({ subsets: ['latin'], weight: ['500', '600', '700'] })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['500', '600', '700', '800'] })
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

type Card = {
  emoji: string
  activity: string
  handle: string
  place: string
  time: string
  mins: string
  price?: string
  joined?: boolean
}

const CARDS: Card[] = [
  { emoji: '🏸', activity: 'Badminton', handle: 'marcus', place: 'Central Park, Court 3', time: '7:00 PM', mins: '120', price: '15' },
  { emoji: '🏃', activity: 'Run', handle: 'james', place: 'East Coast Park', time: '5:30 PM', mins: '50' },
  { emoji: '🎾', activity: 'Padel', handle: 'sarah', place: 'Padel Club, Kallang', time: '8:00 PM', mins: '90', price: '22', joined: true },
]

export default function StylesPage() {
  return (
    <div style={{ background: '#e9e9ec', minHeight: '100vh' }} className={inter.className}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 64px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 4 }}>Dazi · three directions</h1>
        <p style={{ color: '#666', fontSize: 14, marginBottom: 32 }}>
          Same feed, three looks. Tell me the one (A, B, or C) and I&apos;ll build the whole app in it.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 28, alignItems: 'start' }}>
          <Column label="A · Daylight" sub="Strava-clean, bright, sporty">
            <Daylight />
          </Column>
          <Column label="B · Sunset" sub="Tinder-warm, playful, social">
            <Sunset />
          </Column>
          <Column label="C · Night" sub="Modern dark, sleek, premium">
            <Night />
          </Column>
        </div>
      </div>
    </div>
  )
}

function Column({ label, sub, children }: { label: string; sub: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 700, color: '#111', fontSize: 15 }}>{label}</div>
        <div style={{ color: '#777', fontSize: 13 }}>{sub}</div>
      </div>
      <div style={{ borderRadius: 36, overflow: 'hidden', boxShadow: '0 18px 50px rgba(0,0,0,0.18)', border: '8px solid #111', width: 360, maxWidth: '100%' }}>
        {children}
      </div>
    </div>
  )
}

/* ----------------------------- A · DAYLIGHT ----------------------------- */
function Daylight() {
  const bg = '#FAFAF7', ink = '#0A0A0A', accent = '#FF4D2E', muted = '#8A8A82', line = '#EAEAE2'
  return (
    <div style={{ background: bg, height: 720, overflow: 'hidden' }} className={display.className}>
      <div style={{ padding: '26px 22px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 13, color: muted, fontWeight: 600, letterSpacing: 0.5 }}>FRIDAY · TONIGHT</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: ink, letterSpacing: -1 }}>dazi</div>
        </div>
        <button style={{ background: accent, color: '#fff', border: 'none', borderRadius: 999, padding: '11px 18px', fontWeight: 700, fontSize: 14 }}>+ Post</button>
      </div>
      <div style={{ padding: '6px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {CARDS.map((c) => (
          <div key={c.activity} style={{ background: '#fff', border: `1px solid ${line}`, borderRadius: 22, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>{c.emoji}</span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: ink, letterSpacing: -0.4 }}>{c.activity}</div>
                  <div style={{ fontSize: 12.5, color: muted, fontWeight: 500 }} className={inter.className}>with @{c.handle}</div>
                </div>
              </div>
              {c.price
                ? <span style={{ color: accent, fontWeight: 700, fontSize: 16 }}>${c.price}</span>
                : <span style={{ color: muted, fontWeight: 600, fontSize: 12, letterSpacing: 0.5 }}>FREE</span>}
            </div>
            <div style={{ display: 'flex', gap: 22, marginTop: 16, marginBottom: 16 }} className={inter.className}>
              <Stat ink={ink} muted={muted} k="WHERE" v={c.place.split(',')[0]} />
              <Stat ink={ink} muted={muted} k="WHEN" v={c.time} />
              <Stat ink={ink} muted={muted} k="FOR" v={`${c.mins}m`} />
            </div>
            <button style={{
              width: '100%', borderRadius: 14, padding: '12px 0', fontWeight: 700, fontSize: 14.5, border: 'none',
              background: c.joined ? '#F1F1EC' : accent, color: c.joined ? muted : '#fff',
            }} className={inter.className}>
              {c.joined ? '✓ You’re in' : c.price ? `Join · $${c.price}` : 'I’m in'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
function Stat({ k, v, ink, muted }: { k: string; v: string; ink: string; muted: string }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: muted, fontWeight: 700, letterSpacing: 0.6 }}>{k}</div>
      <div style={{ fontSize: 14, color: ink, fontWeight: 600 }}>{v}</div>
    </div>
  )
}

/* ------------------------------ B · SUNSET ------------------------------ */
function Sunset() {
  const ink = '#2B1B2E', pink = '#FF3D7F'
  return (
    <div style={{ background: 'linear-gradient(160deg, #FF7A59 0%, #FF5C8A 45%, #A65CFF 100%)', height: 720, overflow: 'hidden' }} className={jakarta.className}>
      <div style={{ padding: '26px 22px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: '#fff', fontSize: 30, fontWeight: 800, letterSpacing: -0.5 }}>dazi</div>
        <button style={{ background: 'rgba(255,255,255,0.95)', color: ink, border: 'none', borderRadius: 999, padding: '11px 18px', fontWeight: 800, fontSize: 14 }}>+ Post</button>
      </div>
      <div style={{ padding: '4px 22px 8px', color: 'rgba(255,255,255,0.95)', fontWeight: 700, fontSize: 15 }}>Hey Marcus 👋 who&apos;s playing tonight?</div>
      <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {CARDS.map((c) => (
          <div key={c.activity} style={{ background: '#fff', borderRadius: 28, padding: 18, boxShadow: '0 10px 30px rgba(120,40,90,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: 16, background: 'linear-gradient(140deg,#FFE3D0,#FFD0E0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{c.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: ink }}>{c.activity}</div>
                <div style={{ fontSize: 13, color: '#9A8A9E', fontWeight: 600 }}>@{c.handle} · {c.place.split(',')[0]}</div>
              </div>
              {c.price && <div style={{ background: '#FFEAF2', color: pink, fontWeight: 800, fontSize: 13, padding: '6px 12px', borderRadius: 999 }}>${c.price}</div>}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14, marginBottom: 16 }}>
              <Chip>🕐 {c.time}</Chip>
              <Chip>⏱ {c.mins}m</Chip>
              {!c.price && <Chip>✨ Free</Chip>}
            </div>
            <button style={{
              width: '100%', borderRadius: 999, padding: '13px 0', fontWeight: 800, fontSize: 15, border: 'none',
              background: c.joined ? '#F3EEF6' : pink, color: c.joined ? '#A98FB0' : '#fff',
            }}>
              {c.joined ? '✓ You’re in' : c.price ? `Join for $${c.price}` : 'I’m in'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
function Chip({ children }: { children: React.ReactNode }) {
  return <span style={{ background: '#F6F1F8', color: '#6E5B72', fontWeight: 700, fontSize: 12.5, padding: '6px 11px', borderRadius: 999 }}>{children}</span>
}

/* ------------------------------- C · NIGHT ------------------------------ */
function Night() {
  const bg = '#0B0B0C', card = '#141416', line = '#1F1F22', lime = '#C6FF3D', muted = '#8B8B90'
  return (
    <div style={{ background: bg, height: 720, overflow: 'hidden' }} className={display.className}>
      <div style={{ padding: '26px 22px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: -0.8 }}>dazi</div>
          <div style={{ fontSize: 12.5, color: muted, fontWeight: 500 }} className={inter.className}>3 sessions near you tonight</div>
        </div>
        <button style={{ background: lime, color: '#0B0B0C', border: 'none', borderRadius: 999, padding: '11px 18px', fontWeight: 700, fontSize: 14 }}>+ Post</button>
      </div>
      <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {CARDS.map((c) => (
          <div key={c.activity} style={{ background: card, border: `1px solid ${line}`, borderRadius: 22, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <span style={{ fontSize: 23 }}>{c.emoji}</span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: -0.3 }}>{c.activity}</div>
                  <div style={{ fontSize: 12.5, color: muted, fontWeight: 500 }} className={inter.className}>@{c.handle}</div>
                </div>
              </div>
              {c.price
                ? <span style={{ background: 'rgba(198,255,61,0.12)', color: lime, fontWeight: 700, fontSize: 13, padding: '5px 11px', borderRadius: 999 }}>${c.price}</span>
                : <span style={{ color: muted, fontWeight: 600, fontSize: 11, letterSpacing: 0.6 }}>FREE</span>}
            </div>
            <div style={{ display: 'flex', gap: 18, marginTop: 15, marginBottom: 16 }} className={inter.className}>
              <span style={{ color: '#C9C9CE', fontSize: 13, fontWeight: 500 }}>📍 {c.place.split(',')[0]}</span>
              <span style={{ color: '#C9C9CE', fontSize: 13, fontWeight: 500 }}>🕐 {c.time}</span>
              <span style={{ color: '#C9C9CE', fontSize: 13, fontWeight: 500 }}>⏱ {c.mins}m</span>
            </div>
            <button style={{
              width: '100%', borderRadius: 14, padding: '12px 0', fontWeight: 700, fontSize: 14.5, border: 'none',
              background: c.joined ? '#1C1C1F' : lime, color: c.joined ? muted : '#0B0B0C',
            }} className={inter.className}>
              {c.joined ? '✓ You’re in' : c.price ? `Join · $${c.price}` : 'I’m in'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
