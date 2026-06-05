# Dazi - Technical Architecture

## System Overview

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   Browser   │────────▶│  Next.js App │────────▶│  Supabase    │
│  (Frontend) │         │  (React 19)  │         │ (Auth + DB)  │
└─────────────┘         └──────────────┘         └──────────────┘
      ▲                        │                         │
      │                        │ useAuth() hook          │
      │                        │ Client queries          │
      │                        ▼                         │
      │                  ┌──────────────┐               │
      └──────────────────│ Zustand      │◀──────────────┘
                         │ (State Mgmt) │
                         └──────────────┘
```

---

## Frontend Architecture

### Tech Stack
- **Framework**: Next.js 16.2.7 (App Router)
- **UI Library**: React 19.2.4
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand 5
- **Database Client**: @supabase/supabase-js 2.107.0
- **Type Safety**: TypeScript 5
- **Deployment**: Vercel

### Project Structure

```
dazi/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout (HTML template)
│   ├── page.tsx                 # Home/Feed page
│   ├── signup/page.tsx          # Sign up form
│   ├── login/page.tsx           # Login form
│   ├── post/page.tsx            # Create activity form
│   └── globals.css              # Global Tailwind styles
│
├── lib/                          # Reusable utilities & hooks
│   ├── supabase.ts              # Supabase client initialization
│   ├── useAuth.ts               # Auth state hook
│   └── types.ts                 # TypeScript type definitions
│
├── public/                       # Static assets
│
├── .env.local                    # Environment variables (secret)
├── .env.example                  # Template for env vars
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
└── README.md                     # Documentation
```

---

## Database Layer

### Supabase Setup

**Project**: gjehbkluxheicvqhprtk (example, replace with your own)

**Authentication**:
- Method: Email/Password
- Email confirmation: **MUST BE DISABLED**
- Session duration: 24 hours
- Auto-refresh: Enabled

**Tables**:

#### 1. `profiles` (User data)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  handle TEXT UNIQUE,
  bio TEXT,
  instagram TEXT,
  tiktok TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view_all_profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE USING (auth.uid() = id);
```

#### 2. `posts` (Activities)
```sql
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  activity TEXT NOT NULL,
  location TEXT NOT NULL,
  starts_at TIMESTAMP NOT NULL,
  duration_min INTEGER NOT NULL,
  visibility TEXT DEFAULT 'open',
  cap INTEGER,
  price DECIMAL,
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view_all_posts" ON posts FOR SELECT USING (true);
CREATE POLICY "insert_own_posts" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "update_own_posts" ON posts FOR UPDATE USING (auth.uid() = author_id);
```

#### 3. `joins` (Participation)
```sql
CREATE TABLE joins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id TEXT REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE joins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view_all_joins" ON joins FOR SELECT USING (true);
CREATE POLICY "insert_own_joins" ON joins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_joins" ON joins FOR DELETE USING (auth.uid() = user_id);
```

**RLS Policies**: All tables use row-level security to isolate user data

---

## Key Components

### 1. Authentication Hook (`lib/useAuth.ts`)

```typescript
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check current session
    supabase.auth.getSession()
      .then(({data: {session}}) => setUser(session?.user ?? null))

    // Listen for auth changes
    const {data: {subscription}} = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    )

    return () => subscription?.unsubscribe()
  }, [])

  return {user, loading}
}
```

**Usage**:
```typescript
const {user, loading} = useAuth()
if (loading) return <Loading />
if (!user) return <Redirect to="/signup" />
```

### 2. Supabase Client (`lib/supabase.ts`)

```typescript
import {createClient} from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

**Usage**:
```typescript
// Sign up
const {data, error} = await supabase.auth.signUp({email, password})

// Create profile
const {error} = await supabase.from('profiles').insert({...})

// Query posts
const {data: posts} = await supabase
  .from('posts')
  .select('*, author:profiles(name, handle)')
  .eq('status', 'upcoming')
```

### 3. Type Definitions (`lib/types.ts`)

```typescript
export type User = {
  id: string
  email: string
}

export type Post = {
  id: string
  activity: 'Badminton' | 'Pickleball' | 'Padel' | 'Run' | 'Gym'
  location: string
  starts_at: string
  duration_min: number
  price: number | null
  cap: number | null
  author_id: string
  author?: {name: string; handle: string}
  status: 'upcoming' | 'completed' | 'cancelled'
}

export type Join = {
  id: string
  post_id: string
  user_id: string
  joined_at: string
}
```

---

## Page Components

### 1. Home Feed (`app/page.tsx`)

**Purpose**: Display all activities, allow joining

**Flow**:
1. Check if user authenticated (useAuth hook)
2. Redirect to signup if not
3. Fetch all posts from posts table
4. Fetch user's joins from joins table
5. Render activity cards
6. Handle join button click

**Key Features**:
- Real-time updates via Supabase listeners
- Show "I'm in" or "Join for $X"
- Display "✓ Joined" after clicking
- Persist join to database
- Protect with auth check

### 2. Sign Up (`app/signup/page.tsx`)

**Purpose**: Create new user account

**Flow**:
1. User fills form: name, username, email, password
2. Call `supabase.auth.signUp(email, password)`
3. Create profile record with user ID
4. **CRITICAL**: Session auto-created, no email confirmation
5. Redirect to home feed

**Error Handling**:
- Email already exists
- Password too weak
- Network errors

### 3. Login (`app/login/page.tsx`)

**Purpose**: Authenticate existing user

**Flow**:
1. User enters email and password
2. Call `supabase.auth.signInWithPassword(email, password)`
3. Session created if valid
4. Redirect to home feed
5. Redirect back to signup if unauthenticated

### 4. Post Activity (`app/post/page.tsx`)

**Purpose**: Create new activity

**Flow**:
1. User fills form:
   - Activity (dropdown)
   - Location (text)
   - Start time (time picker)
   - Duration (number)
   - Price (optional)
   - Capacity (optional)
2. Validate form (all required fields)
3. Create post ID: `{userId}-{timestamp}`
4. Call `supabase.from('posts').insert({...})`
5. Redirect to home
6. New activity appears in feed

**Validation**:
- All required fields filled
- Duration > 0
- Price >= 0 (if set)
- Capacity >= 1 (if set)

---

## Environment Variables

### Required
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### In Vercel Project Settings
Add the same two variables in:
Settings → Environment Variables

---

## Deployment Pipeline

### Local Development
```bash
npm install
npm run dev
# Visit http://localhost:3000
```

### Build & Test
```bash
npm run build
npm run lint
```

### Deploy to Vercel
1. Push to GitHub
2. Vercel auto-deploys
3. Check deployment status in Vercel dashboard
4. Add env vars to Vercel project
5. Redeploy

---

## Data Flow Examples

### Sign Up Flow
```
User Form
  ↓
supabase.auth.signUp(email, password)
  ↓
Create Auth User in supabase.auth.users
  ↓
Create Profile Record
  ↓
Session Auto-Created
  ↓
Redirect to /
```

### Post Activity Flow
```
User Form
  ↓
Validate all fields
  ↓
supabase.from('posts').insert({
  id: userId-timestamp,
  author_id: userId,
  activity, location, starts_at, duration_min, price, cap
})
  ↓
Database Insert
  ↓
Real-time Listener Notifies All Clients
  ↓
Feed Updates
```

### Join Activity Flow
```
User Clicks "I'm in"
  ↓
supabase.from('joins').insert({
  post_id, user_id
})
  ↓
Check result (success or duplicate error)
  ↓
Update local state
  ↓
Button changes to "✓ Joined"
  ↓
Real-time Listener Notifies
  ↓
Other Users See Updated Join Count
```

---

## Error Handling

### Auth Errors
- Email already exists → Show "Email already registered"
- Password weak → Show "Password must be 8+ characters"
- Wrong credentials → Show "Email or password incorrect"
- Network error → Show "Connection failed, try again"

### Database Errors
- Insert fails → Show "Failed to create post, try again"
- Join fails → Show "Failed to join, you may have already joined"
- Query fails → Show "Failed to load activities"

### Session Errors
- Session expired → Redirect to signup
- No session on page load → Redirect to signup

---

## Testing Checklist

### Sign Up
- [ ] Can sign up with email/password
- [ ] Auto-logged in after signup (no email confirmation)
- [ ] Profile created in database
- [ ] Redirects to home feed

### Post Activity
- [ ] Can create activity with all fields
- [ ] Activity appears in feed immediately
- [ ] Author ID is correct
- [ ] Price displays correctly (if set)

### Join Activity
- [ ] Can click "I'm in"
- [ ] Button changes to "✓ Joined"
- [ ] Join persists after page refresh
- [ ] Join count updates for other users

### Feed
- [ ] All activities display
- [ ] Real-time updates work
- [ ] Pagination (if more than 10)
- [ ] Load time <1 second

### Session Persistence
- [ ] Logged in state persists across pages
- [ ] Logged in state persists across tab close/reopen
- [ ] Logout clears session
- [ ] Unauthenticated users redirected to signup

---

## Performance Considerations

### Database Queries
- Use `.limit(50)` for initial feed load
- Implement pagination for older activities
- Index `status` and `starts_at` columns
- Cache user's join list locally

### Frontend
- Memoize activity cards
- Lazy load images (if added)
- Debounce form submission
- Virtualize long lists (if 100+ activities)

### Real-time Updates
- Use Supabase subscriptions for live feed
- Limit concurrent subscriptions (max 5)
- Unsubscribe on component unmount

---

## Security Considerations

### Auth
- Email confirmation **MUST be disabled** (RLS handles protection)
- Never store passwords client-side
- Validate all inputs server-side (RLS policies)
- Sessions auto-expire after 24 hours

### Database
- RLS policies prevent cross-user data access
- Users can only modify own records
- Public read for posts (security-by-design)
- Anon key limited to RLS permissions

### API
- Never expose service role key to client
- Supabase handles CORS
- All queries signed with session token

---

## Monitoring & Logging

### What to Track
- Sign up success/failure rates
- Average activities posted per day
- Average joins per activity
- Session duration
- Error rates by endpoint

### Tools
- Vercel Analytics (free tier)
- Supabase dashboard logs
- Browser console for dev errors
- Sentry (optional for production)

---

## Scaling Considerations (Post-MVP)

### When You Hit 1K Users
- Add database indexes on common queries
- Implement caching layer (Redis)
- Paginate feed (lazy load)
- Archive old activities

### When You Hit 10K Users
- Split tables by region
- Add CDN for static assets
- Implement job queue for notifications
- Add read replicas for analytics

### When You Hit 100K Users
- Consider microservices
- Separate auth from main database
- Implement API rate limiting
- Add data warehouse for analytics
