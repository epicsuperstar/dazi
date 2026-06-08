# Dazi - Product PRD (v2)

> Living document. JW owns product, voice, and decisions. Claude owns engineering.
> Status legend: [BUILT] live now · [PARTIAL] some of it exists · [NEXT] up next · [PLANNED] agreed, not started · [IDEA] needs a decision

---

## 1. One-liner

Dazi is where you post what you are doing, friends jump in, and the time you spend together quietly turns into a social graph that pulls you back and introduces you to people you should know.

## 2. The thesis (why this works)

Most activity apps stop at logistics: post a game, people RSVP, done. Dazi's edge is the layer on top:

1. **Coordination is the hook** - low-friction posting and joining of real-world activities.
2. **The social graph is the habit** - every shared activity deepens a visible bond ("you and Mei have spent 6 hours on court together"). Seeing that relationship grow is the dopamine hit that brings people back even when they are not looking for a game.
3. **Sparks are the growth loop** - the graph quietly surfaces people you keep crossing paths with but have not connected with yet, and nudges a first hello. Real-world friendships become the retention and referral engine.

If we only build #1 we are a scheduling tool. #2 and #3 are the product.

## 3. Principles

- **Real-world first.** Everything points to meeting in person, not more screen time.
- **Warm, not gamey.** Celebrate real bonds and time spent. Avoid hollow points and badges.
- **Low friction.** Posting, joining, and signing in should each take seconds.
- **Privacy with intent.** Surfacing "you have played with X" is fine; exposing precise habits to strangers is not.
- **Non-extractive.** When money is involved, organisers keep the vast majority.

## 4. Who it is for

- **Organisers** - run recurring games/sessions (badminton, padel, runs, gym). Want it easy to fill spots and, later, to earn.
- **Regulars** - join often, want to see friends and keep the streak going.
- **Newcomers** - new to a city or a sport, want a low-pressure way in and to meet people.

---

## 5. Feature areas

### A. Onboarding and sign-in  [BUILT]
Passwordless magic-link sign-in (enter email, tap the link). Password kept as a fallback.

User stories:
- [BUILT] As a new user, I can sign in with just my email so that I do not have to create or remember a password.
- [BUILT] As a returning user, I stay signed in across visits.
- [IDEA] As a user, I can sign in with Google for one-tap access. (Needs Google + Supabase setup.)

### B. Post an activity  [BUILT]
Activity type, venue, postal code (links to Google Maps), "getting there" notes, time, duration, optional price, optional spots.

User stories:
- [BUILT] As an organiser, I can post an activity in under a minute.
- [BUILT] As an organiser, I can add a postal code and directions so people can find the spot.
- [PLANNED] As an organiser, I can make an activity recurring (e.g. every Tuesday) so I do not repost weekly.
- [IDEA] As an organiser, I can set a skill level so the right people join.

### C. Discover and join  [BUILT]
Feed of upcoming activities, All vs Following filter, one-tap join, "For You" recommendations with reasons.

User stories:
- [BUILT] As a user, I can browse all upcoming activities and join in one tap.
- [BUILT] As a user, I can filter the feed to just people I follow.
- [BUILT] As a user, I get recommendations explained ("because you play badminton", "hosted by someone you have played with").
- [PLANNED] As a user, I can see "spots left" and an activity fills up so I know to act fast.
- [IDEA] As a user, I can filter by sport, neighbourhood, or time.

### D. Profiles and history  [BUILT]
Editable profile (name, handle, neighbourhood, bio, photo, one link of any platform), stats, and a history of hosted and joined activities.

User stories:
- [BUILT] As a user, I can edit my profile and upload a photo.
- [BUILT] As a user, I can add a single link of my choice (Instagram, TikTok, Telegram, anything).
- [BUILT] As a user, I can see my upcoming and past activities.
- [BUILT] As a user, I can view anyone's profile and follow them.

### E. Social graph and connection sparks - the dopamine engine  [PARTIAL]
This is the heart of the product and is mostly still to build. Today we only show a "played with N times" count and a Discover list.

What it should become:
- **Time together.** Show the real bond: "You and Mei: 4 sessions, 6h 10m on court, first played 12 Mar." Sum of shared activity durations, not just a count.
- **Relationship cards.** Tapping a person shows your shared history together: every activity you both did, a small timeline, shared sports, mutual connections.
- **Milestones.** Gentle celebrations: "5th game with Wei", "first time you played with 3 new people in a week". Warm, not confetti-spam.
- **Streaks.** "3 weeks active in a row", optionally per-person ("you and the Tuesday crew, 5 weeks running").
- **Recaps.** A monthly "your month in activities" (people met, hours played, top sport) that is nice enough to screenshot and share. Doubles as a growth loop.
- **Connection sparks.** The graph proactively suggests people you should meet: you keep joining the same sessions, or you share 3+ mutuals, or you both follow the same organiser. Each spark has a human reason and a low-pressure action ("say hi", "invite to your next game").

User stories:
- [PARTIAL] As a user, I can see who I have played with and how often.
- [PLANNED] As a user, I can see how much time I have spent with each person so the friendship feels real and worth growing.
- [PLANNED] As a user, I get a small celebration when a bond hits a milestone, so coming back feels good.
- [PLANNED] As a user, I get a monthly recap of who I met and what I played, that I can share.
- [PLANNED] As a user, I am introduced to people I keep crossing paths with, with a reason and an easy first hello.
- [IDEA] As a user, I can mark someone as a friend / close circle to prioritise their activities and sparks.
- [IDEA] As a user, I can see "people you both know" on a profile to make an intro feel safe.

Open questions for this area are in section 7.

### F. Notifications  [PLANNED]
None exist today. Notifications are how the dopamine engine actually reaches people when they are not in the app. This is the single biggest retention lever still missing.

Proposed notification types:
- **Activity activity:** someone joined your activity; your activity is nearly full; an activity you joined is starting soon (reminder).
- **Social:** new follower; someone you follow posted a new activity; someone you have played with posted.
- **Dopamine:** a bond hit a milestone ("5th game with Wei"); your monthly recap is ready.
- **Sparks:** "You and Sofia have now joined 3 of Chloe's runs, say hi"; "3 people you should meet this week".
- **Recommendations:** "Padel near you on Saturday" when it matches your history.

Channels (in priority order):
1. [NEXT] In-app notification centre (a bell with a list). Works immediately, no setup.
2. [PLANNED] Web push (browser notifications) for re-engagement without an app store.
3. [IDEA] Email digest (weekly) as a low-effort fallback.
4. [IDEA] Native iOS/Android push (later, if we go native).

Controls:
- [PLANNED] Per-type on/off toggles and quiet hours, so we never feel spammy.

User stories:
- [NEXT] As a user, I see a notification when someone joins my activity, so hosting feels rewarding.
- [NEXT] As a user, I get a reminder before an activity I joined, so I do not forget.
- [PLANNED] As a user, I can opt into push so I hear about the right things without opening the app.
- [PLANNED] As a user, I control which notifications I get so it never feels noisy.

### G. Payments  [DEFERRED by decision]
Paid activities show a price for info; joining is a free RSVP. Real charging needs a Stripe account and stays off until we decide to turn it on. Organisers would keep 97.5%.

### H. Parking lot  [IDEA]
In-app chat / activity group chat, ratings and reliability ("shows up" score), capacity waitlists, calendar sync, maps with live distance, clubs/communities.

---

## 6. Success metrics

- **North star:** weekly active participants (people who joined or hosted at least one activity this week).
- **Habit:** repeat join rate, sessions per active user per month.
- **Graph health:** average number of people each active user has played with; share of users with at least 3 connections.
- **Spark effectiveness:** sparks shown to first-hello / co-join conversion.
- **Notification health:** opt-in rate, click-through, and crucially the unsubscribe / mute rate (keep it low).
- **Growth:** invites sent per active user, recap shares.

---

## 7. Decisions (resolved 2026-06-08)

1. **Bond = signed up to 2 sessions together**, assume the majority show up. [DONE]
2. **Time-together unit = hours** (it is more fun). [DONE]
3. **Sparks start subtle** - a quiet "People to meet" section, no aggressive nudges yet. [DONE]
4. **Privacy = per-activity visibility.** Public / Followers only / Invite-only (hidden, only tagged people can see). Enforced in the database. [DONE]
5. **Notifications v1** = in-app centre with: someone joined your activity, new-bond milestone, new follower, new activity from someone you follow. Time-based reminders come next. [DONE except reminders]
6. **Player level** added to activities (more important than recurring, which is parked). [DONE]
7. **Tag people in** when posting (existing users added as attending; WhatsApp share for non-users; phone-book sync needs native). [DONE]
8. **Payments** stay off-platform: organiser adds a "how to pay" note, collects themselves. [DONE]
9. **Following** stays one-directional. Privacy concern handled by per-activity visibility above. [DONE]
10. **Recaps cadence** - still open (monthly vs weekly). [OPEN]
11. **Tone of celebrations** - still calibrating; current milestone copy is gentle ("you and X are now a duo"). [OPEN]
12. **Reminders before an activity** - needs a scheduler; not built yet. [OPEN/NEXT]

---

## 8. Suggested sequencing (rough, editable)

**Now**
- Social graph upgrade: time-together + relationship cards (turn the count into a real bond view).
- In-app notification centre + "someone joined your activity" + activity reminders.

**Next**
- Connection sparks (people you should meet, with reasons) + the spark notification.
- Milestones and a first monthly recap.
- Web push and per-type notification controls.

**Later**
- Recurring activities, spots-left/waitlist, richer discovery filters.
- Payments (if/when you want it), chat, reliability scores.

---

*End of v2. Tell me what to change and I will update this doc, then we build from it.*
