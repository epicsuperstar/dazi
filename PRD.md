# Dazi - Product Requirements Document

## 1. Product Overview

**Name**: Dazi
**Tagline**: Activity coordination, reimagined
**Mission**: Enable friends to discover and join activities together, with organizers able to monetize their events

**Core Problem**: 
- Friends struggle to find what others are doing
- No easy way for activity organizers to make money
- Time tracking is manual and tedious
- Social coordination happens across multiple apps

**Solution**: 
- One app for posting what you're doing
- Friends see it and join with one tap
- Organizers can charge for their activities
- Dazi handles the tech, keeps 97.5% for organizers

---

## 2. Target Users

### Primary
- **Activity organizers**: Run badminton games, gym sessions, running groups, padel tournaments
- **Age**: 20-45 years old
- **Tech-savvy**: Comfortable with apps, willing to pay for convenience
- **Motivation**: Make money running activities they love

### Secondary
- **Participants**: Want to join activities, discover new people, stay active
- **Age**: 18-50
- **Motivation**: Find things to do with friends, discover new activities

---

## 3. Feature Requirements

### MVP (Phase 0 - NOW)

#### 3.1 Authentication
- [x] Email/password sign up
- [x] Email/password login
- [x] Session persistence across pages
- [x] Logout functionality
- **Requirement**: No email confirmation blocking login

#### 3.2 Activity Posting
- [x] Create activity with fields:
  - Activity type (Badminton, Pickleball, Padel, Run, Gym)
  - Location
  - Start time
  - Duration (in minutes)
  - Optional: Price per person
  - Optional: Capacity/max participants
- [x] Activities persist to database
- [x] Author is automatically set to current user

#### 3.3 Activity Feed
- [x] Show all upcoming activities
- [x] Display activity info:
  - Activity emoji/icon
  - Location
  - Start time
  - Duration
  - Who posted it
- [x] Show price badge if activity has price (💎 $X)
- [x] "I'm in" button for free activities
- [x] "Join for $X" button for paid activities
- [x] Track which activities current user has joined
- [x] Button text changes to "✓ Joined" after joining

#### 3.4 Data Isolation
- [x] Users can only see their own posted activities in admin view
- [x] Users can see all activities in feed (public)
- [x] Join data only visible to user who joined

### Phase 1 (Monetization UI - PARTIALLY DONE)
- [x] Price badge display
- [x] Price input on post form
- [ ] Payment processing (NOT IN MVP)
- [ ] Organizer dashboard (NOT IN MVP)
- [ ] Transaction history (NOT IN MVP)

### Phase 2 (Social Features)
- [ ] User profiles
- [ ] Friend connections
- [ ] User search
- [ ] Direct messaging

### Phase 3 (AI Recommendations)
- [ ] Smart matching
- [ ] Momentum tracking
- [ ] Social bridges
- [ ] Serendipity matches
- [ ] Notifications

---

## 4. User Flows

### Flow 1: New User Signs Up
1. User lands on `/signup`
2. Enters: name, username, email, password
3. Clicks "Sign up"
4. System creates auth user + profile record
5. User is automatically logged in
6. Redirects to `/` (feed)
7. See "Hi [name]" greeting

**Success Criteria**: User sees feed immediately, no email confirmation email needed

### Flow 2: User Posts an Activity
1. User on feed clicks "+ Post"
2. Navigates to `/post`
3. Fills form:
   - Activity: "Badminton" (dropdown)
   - Location: "Central Park, Court 3"
   - Start time: "19:00" (7 PM today)
   - Duration: "120" minutes
   - Price: "$15" (optional)
   - Capacity: "4" (optional)
4. Clicks "Post Activity"
5. Activity saved to database
6. Redirect to feed
7. Activity appears at top of feed

**Success Criteria**: Activity visible immediately, other users see it

### Flow 3: User Joins an Activity
1. User sees activity in feed
2. Clicks "I'm in" (or "Join for $15" if paid)
3. Button changes to "✓ Joined"
4. User's join saved to database
5. If they refresh page, button still shows "✓ Joined"

**Success Criteria**: Join persists, button state reflects user's join status

### Flow 4: Returning User Logs In
1. User goes to `dazi-two.vercel.app`
2. Not logged in, redirected to `/signup`
3. Clicks "Log in" link
4. Navigates to `/login`
5. Enters email + password
6. Clicks "Log in"
7. Authenticated, redirected to `/`
8. Feed appears with activities

**Success Criteria**: User is logged in without email confirmation step

---

## 5. Monetization Model

### Phase 1 (MVP)
- **UI only**: Price field on post form, price badge on cards
- **Payment**: NOT IMPLEMENTED
- **Philosophy**: Organizers will eventually keep 97.5%

### Phase 2+
- Users can set price when posting
- When others join, payment is processed
- Organizer receives money (minus 2.5% platform fee)
- Transaction appears in organizer dashboard

### Why 97.5%?
- Platform costs: server, auth, database, payment processing
- 2.5% covers: Stripe fees (~2.2%) + operational costs
- Competitive: Most platforms take 10-20%
- Philosophy: We enable organizers to make money, not extract from them

---

## 6. Design Requirements

### Layout
- **Mobile-first**: Designed for 430px width
- **Max width**: 500px on desktop
- **Responsive**: Works on all screen sizes

### Color Palette
- **Background**: Slate-900 → Slate-800 gradient
- **Surface**: Slate-700/50
- **Text**: White + slate-400 (muted)
- **Accent**: Blue-600 (buttons)
- **Price badge**: Teal accent

### Typography
- **Headings**: Bold, 18-24px
- **Body**: 14-16px
- **Form labels**: 12-14px, medium weight

### Spacing
- **Padding**: 16px (4 units)
- **Card spacing**: 16px gap
- **Input height**: 40-44px

### Buttons
- **Primary**: Full width, 40px height, blue background
- **Secondary**: Outline style for non-primary actions
- **Disabled state**: Reduced opacity

---

## 7. Technical Specifications

### Authentication
```
Sign Up:
1. supabase.auth.signUp(email, password)
2. Create profile record in profiles table
3. Session automatically created
4. Redirect to home

Login:
1. supabase.auth.signInWithPassword(email, password)
2. Session created if credentials valid
3. Redirect to home

Session Check:
- useEffect: supabase.auth.getSession()
- Listen: supabase.auth.onAuthStateChange()
- Middleware: Redirect unauthenticated to signup
```

### Database Queries

**Fetch Activities**:
```sql
SELECT 
  id, activity, location, starts_at, duration_min, price, cap,
  author_id, 
  author: profiles(name, handle)
FROM posts
WHERE status = 'upcoming'
ORDER BY starts_at ASC
```

**Check if User Joined**:
```sql
SELECT post_id
FROM joins
WHERE user_id = [current_user_id]
```

**Create Join**:
```sql
INSERT INTO joins (post_id, user_id)
VALUES (?, ?)
```

### API Responses (Supabase real-time)
All queries auto-update in real-time via Supabase listeners

---

## 8. Success Metrics

### MVP Launch
- [ ] Sign up works without email confirmation
- [ ] Can post activities in <2 taps
- [ ] Feed loads <1 second
- [ ] Join persists across page reload
- [ ] No TypeScript errors in build
- [ ] Deploys to production
- [ ] 10 beta users can sign up

### Phase 1
- [ ] 50+ activities posted
- [ ] 200+ joins across activities
- [ ] 20% of activities have prices set
- [ ] $500+ value tracked through platform

---

## 9. Future Roadmap

### Phase 2: Social
- User profiles with bio, socials
- Friend connections
- Private messaging
- Activity history

### Phase 3: AI Intelligence
- Smart activity recommendations
- Momentum tracking (who's trending)
- Social bridges (find friend pairs)
- Smart notifications

### Phase 4: Monetization Phase 2
- Payment processing (Stripe)
- Organizer payouts
- Revenue dashboard
- Subscription options

### Phase 5: Scale
- Location-based discovery
- Categories beyond activities
- Calendar integration
- Native apps (iOS/Android)

---

## 10. Constraints & Assumptions

### Constraints
- MVP scope: Only signup, post, feed, join
- No email confirmation required
- No payment processing
- Mobile-first (430px focus)
- 5 activities only: Badminton, Pickleball, Padel, Run, Gym

### Assumptions
- Users have smartphones
- WiFi/cellular available
- Activities are recurring (weekly badminton, etc)
- Organizers will eventually set prices
- $5-30 price range initially

### Non-Requirements (Phase 2+)
- Event scheduling (Phase 2)
- Calendar UI (Phase 2)
- Maps/location (Phase 2)
- Messaging (Phase 2)
- Ratings/reviews (Phase 3)
- Analytics (Phase 3)

---

## 11. Acceptance Criteria

### The app is "done" when:
✅ User can sign up and be logged in immediately
✅ User can post activities
✅ All users see all activities in feed
✅ Users can join activities
✅ Join status persists across sessions
✅ Prices display correctly (optional field)
✅ App deploys to Vercel with no build errors
✅ Data persists to Supabase (not mock data)
✅ 10 real users can use it simultaneously
✅ No TypeScript errors
✅ All pages load in <2 seconds
✅ Mobile layout looks good at 430px

---

## 12. Go-to-Market

### Beta Launch
1. Invite 10 trusted friends to sign up
2. Each posts 1 activity
3. Others join to test workflow
4. Gather feedback on:
   - Posting friction
   - Discovery experience
   - Join flow

### Feedback Loop
- Weekly check-ins with beta users
- Track: posts per user, joins per activity, churn
- Iterate on top friction points

### Phase 1 Launch (Monetization)
- Enable price setting for beta users
- First 5 organizers set prices
- Track if anyone actually joins paid activities
- Decide: does monetization work?

---

## Questions for Product Manager

1. Should capacity limits be enforced? (e.g., activity shows "4/4 full")
2. Should organizers see who joined their activities?
3. Should we have activity categories beyond the 5 listed?
4. Should activities have a description field?
5. What's the ideal price range ($5-$50, $10-$100, flexible)?
