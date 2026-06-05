# Dazi - Complete Handoff Document

## Executive Summary

**Dazi** is an activity-first social coordination app that lets users post what they're doing, friends join, and time logs itself automatically. The vision is to enable event organizers to make money through the platform (not extractive - organizers keep 97.5% with a 2.5% platform fee).

**Current Status**: Core MVP built with real authentication and database, but deployment setup became complex. Handing off for clean rebuild with preferred provider.

---

## Product Vision

### Core Concept
- **Users post activities** they're doing (badminton, running, gym session, etc.)
- **Friends see them on feed** and join with one tap
- **Time tracking automatic** - no manual logging
- **Monetization**: Organizers set prices on activities, keep 97.5% of revenue
- **AI recommendations**: Smart matching to suggest activities based on friend behavior

### User Philosophy
- Non-extractive: We enable organizers to make money, don't take from them
- Mobile-first: Designed for 430px (phone) width
- Activity-centric: Organized by what people DO, not dates
- Time-saving: Minimal friction to post and join

---

## Technical Requirements

### Tech Stack (Recommended)
- **Frontend**: Next.js 16+ with React 19, TypeScript, Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL + Auth) OR Firebase + Postgres
- **State**: Zustand for client state
- **Auth**: Email/password with no email confirmation requirement (auto-confirm or skip verification)
- **Hosting**: Vercel (Recommended for Next.js)

### Key Non-Negotiables
1. **Email confirmation should NOT block login** - Users sign up and are immediately logged in
2. **Real database** - Not mock data. Everything persists.
3. **Proper session handling** - Auth state persists across pages/tabs
4. **RLS Policies** - Users can only see/modify their own data
5. **Environment variables** - No hardcoded secrets, use .env files

---

## Database Schema

### Tables Required

```sql
-- Users/Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY (refs auth.users),
  name TEXT,
  handle TEXT UNIQUE,
  bio TEXT,
  instagram TEXT,
  tiktok TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Activities/Posts
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  author_id UUID (refs profiles),
  activity TEXT (Badminton|Pickleball|Padel|Run|Gym),
  location TEXT,
  starts_at TIMESTAMP,
  duration_min INTEGER,
  price DECIMAL (optional, for monetization),
  cap INTEGER (optional, max participants),
  status TEXT (upcoming|completed|cancelled),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Participants
CREATE TABLE joins (
  id UUID PRIMARY KEY,
  post_id TEXT (refs posts),
  user_id UUID (refs profiles),
  joined_at TIMESTAMP,
  UNIQUE(post_id, user_id)
);
```

### RLS Policies Required
- Users can see all profiles
- Users can update only their own profile
- Users can see all posts
- Users can create posts (as author_id = current user)
- Users can update only their own posts
- Users can see all joins
- Users can join posts (as user_id = current user)
- Users can delete only their own joins

---

## Pages/Screens Required

### 1. Sign Up (`/signup`)
- **Fields**: Name, Username, Email, Password
- **Action**: Create auth user + profile record
- **Redirect**: To home feed (auto-logged in)
- **Key**: No email confirmation needed - auto-confirm or skip

### 2. Login (`/login`)
- **Fields**: Email, Password
- **Action**: Authenticate user
- **Redirect**: To home feed
- **Note**: Only needed if user logs out; most will stay signed in

### 3. Home Feed (`/`)
- **Protected**: Redirects to signup if not authenticated
- **Shows**: All upcoming activities posted by all users
- **Features**:
  - Activity cards with: activity icon, location, time, duration, who posted it
  - Price badge (💎 $X) if activity has price
  - "I'm in" button or "Join for $X" button (changes based on price)
  - Track user's joined activities
  - Real-time updates from database
- **Header**: Logo, Hi [user], + Post button, Logout

### 4. Post Activity (`/post`)
- **Fields**:
  - Activity type (dropdown: Badminton, Pickleball, Padel, Run, Gym)
  - Location (text input)
  - Start time (time picker)
  - Duration in minutes (number input)
  - Price per person (optional, decimal)
  - Capacity (optional, integer)
- **Action**: Save to database, redirect to feed
- **Key**: Must save with author_id = current user

### 5. User Profile (Optional for MVP)
- **Shows**: User's activities posted, activities joined
- **Editable**: Name, bio, handle, social links

---

## Authentication Flow

### Sign Up Flow
1. User enters: name, username, email, password
2. Create Supabase auth user with email/password
3. Create profile record with user ID
4. **IMPORTANT**: Auto-confirm email or skip confirmation
5. Session automatically created by Supabase
6. Redirect to home feed

### Login Flow
1. User enters: email, password
2. Supabase validates credentials
3. Session created if valid
4. Redirect to home feed
5. If not authenticated, redirect to signup

### Session Persistence
- Check auth state on app load (`useEffect`)
- Listen to auth state changes
- Redirect to signup if session expires
- Maintain session across page navigations

---

## Monetization (Phase 1)

### What Works Now
- Users can optionally set a price when posting an activity
- Price badge displays as "💎 $X" on activity cards
- Button text changes to "Join for $X" when price is set

### Not Implemented Yet (Phase 2+)
- Payment processing (Stripe/Paypal integration)
- Organizer payouts
- Transaction history
- Revenue dashboard

### Philosophy
- Organizers keep 97.5%, platform takes 2.5%
- No cuts on free activities
- Users pay when joining, organizer gets money immediately

---

## AI Features (Not MVP, but Reference)

### 5 Recommendation Engines (For Future)
1. **Smart Matching**: Score sessions by friend connections + activity preference
2. **Serendipity Matches**: Suggest new people in the user's activity circle
3. **Activity Momentum**: Show friends trending up/down in activities
4. **Social Bridges**: Find friend pairs who share activities but haven't met
5. **Notification Context**: Enrich notifications with relationship depth

### Current Status
- Code framework exists in codebase
- Not hooked into UI yet
- Can be added to feed as "✨ Moments you'll love" section

---

## Setup Instructions for New Builder

### Step 1: Create Backend
1. Create Supabase account (supabase.com)
2. Create new PostgreSQL project
3. Run the SQL schema (see Database Schema above)
4. **CRITICAL**: Disable email confirmation in Auth settings
   - Go to Auth → Policies
   - Turn off "Email confirmations required"
5. Copy API keys:
   - Project URL
   - Anon Key (for browser)
   - Service Role Key (for server)

### Step 2: Create Frontend Project
```bash
npx create-next-app@latest dazi --typescript --tailwind --app
cd dazi
npm install @supabase/supabase-js @supabase/ssr zustand
```

### Step 3: Add Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 4: Implement Pages (See Screens section above)

### Step 5: Deploy to Vercel
1. Push to GitHub
2. Create Vercel project from GitHub repo
3. Add same environment variables to Vercel project settings
4. Deploy

### Step 6: Test
1. Sign up with test email
2. Post an activity
3. Create second account and join the activity
4. Verify data persists in Supabase

---

## Common Pitfalls to Avoid

1. ❌ **Email confirmation required** - Blocks login. Disable in Supabase.
2. ❌ **No auth state management** - Session won't persist. Use proper hooks.
3. ❌ **Mock data in production** - Use real database queries.
4. ❌ **No RLS policies** - Users can see each other's private data.
5. ❌ **Multiple package.json files** - Causes build confusion in Vercel.
6. ❌ **Hardcoded secrets** - Use environment variables.

---

## Files Structure

```
dazi/
├── app/
│   ├── layout.tsx (Root layout)
│   ├── page.tsx (Feed/Home)
│   ├── signup/page.tsx (Sign up)
│   ├── login/page.tsx (Login)
│   ├── post/page.tsx (Create activity)
│   └── globals.css
├── lib/
│   ├── supabase.ts (Supabase client)
│   ├── useAuth.ts (Auth hook)
│   └── types.ts (TypeScript types)
├── .env.local (Secret keys)
├── .env.example (Template)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Success Criteria for Handoff

✅ Users can sign up and be immediately logged in
✅ Users can post activities with required fields
✅ Activities appear in real-time feed for all users
✅ Users can join activities
✅ Join status persists (button shows "✓ Joined")
✅ Optional: Price display works
✅ Deploys to production without errors
✅ No email confirmation blocking

---

## Contact & Questions

If rebuilding this, the key learnings:
- Keep auth simple: no email verification in MVP
- Session persistence is critical: test across page reloads
- Use Supabase for easy auth + database combo
- Vercel deployment: watch for conflicting root files
- Test signup → post → feed → join workflow end-to-end

Good luck! This is a solid MVP foundation.
