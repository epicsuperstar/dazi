# Dazi - Screen Specifications & Mockups

## Design System

### Colors
- **Background**: `#0f172a` (slate-900)
- **Gradient**: slate-900 → slate-800
- **Surface**: `rgba(51, 65, 85, 0.5)` (slate-700/50)
- **Border**: `#475569` (slate-600)
- **Text Primary**: `#ffffff` (white)
- **Text Muted**: `#94a3b8` (slate-400)
- **Accent**: `#2563eb` (blue-600)
- **Accent Hover**: `#1d4ed8` (blue-700)
- **Price Accent**: `#14b8a6` (teal)

### Typography
- **Font**: System default (SF Pro, Roboto)
- **Heading 1**: 24px, bold, white
- **Heading 2**: 20px, semibold, white
- **Body**: 14px, normal, slate-300
- **Label**: 12px, medium, slate-400
- **Small**: 12px, normal, slate-400

### Spacing
- **Base unit**: 4px
- **Common gaps**: 8px, 12px, 16px, 20px, 24px
- **Page padding**: 16px
- **Card padding**: 16px
- **Input height**: 40px
- **Button height**: 40px

---

## Screen 1: Sign Up (`/signup`)

### Layout
```
┌─────────────────────────────┐
│                             │
│         DAZI                │
│    Activity coordination,   │
│      reimagined            │
│                             │
│  ┌─────────────────────┐   │
│  │ Your name           │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ Username            │   │
│  │ (e.g. @username)    │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ Email               │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ Password            │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │    Sign up          │   │
│  └─────────────────────┘   │
│                             │
│  Already have account?      │
│  Log in                     │
│                             │
└─────────────────────────────┘
```

### Components

**Header**:
- "Dazi" logo, 24px bold, centered
- "Activity coordination, reimagined" tagline, 14px muted, centered
- Margin bottom: 32px

**Form**:
- Width: max 500px, centered
- Background: slate-800, 16px padding, rounded-lg
- 4 input fields: name, username, email, password
- Spacing between inputs: 16px

**Inputs**:
- Width: 100%
- Height: 40px
- Padding: 12px 16px
- Background: slate-700
- Border: 1px slate-600
- Border-radius: 8px
- Placeholder color: slate-400
- Focus: border-blue-500
- Font: 14px

**Button**:
- Width: 100%
- Height: 40px
- Background: blue-600
- Hover: blue-700
- Text: white, semibold
- Border-radius: 8px
- Margin top: 16px
- Disabled: opacity 50%

**Sign In Link**:
- Text: "Already have an account?" + "Log in"
- Margin top: 16px
- "Log in" is blue-400, clickable
- Alignment: center
- Font size: 14px

### Behavior
- Form validation on submit
- Show error message if signup fails (red text below button)
- Loading state on button: "Creating account..."
- Redirect to "/" on success

---

## Screen 2: Login (`/login`)

### Layout
```
┌─────────────────────────────┐
│                             │
│         DAZI                │
│    Activity coordination,   │
│      reimagined            │
│                             │
│  ┌─────────────────────┐   │
│  │ Email               │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ Password            │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │    Log in           │   │
│  └─────────────────────┘   │
│                             │
│  Don't have account?        │
│  Sign up                    │
│                             │
└─────────────────────────────┘
```

### Differences from Sign Up
- Only 2 inputs: email, password
- Button text: "Log in" (not "Creating account...")
- Link text: "Don't have an account?" + "Sign up"
- Same styling, spacing, and behavior

---

## Screen 3: Home Feed (`/`)

### Layout
```
┌────────────────────────────────┐
│  Dazi    Hi, [Name]  + Post Logout
├────────────────────────────────┤
│                                │
│  ┌──────────────────────────┐ │
│  │ 🎾 Badminton       💎 $15│ │
│  │ @marcus                 │ │
│  │                         │ │
│  │ 📍 Central Park, Court 3│ │
│  │ 🕐 19:00                │ │
│  │ ⏱ 120m                  │ │
│  │                         │ │
│  │      [Join for $15]    │ │
│  └──────────────────────────┘ │
│                                │
│  ┌──────────────────────────┐ │
│  │ 🏃 Run                   │ │
│  │ @james                  │ │
│  │                         │ │
│  │ 📍 East Coast Park      │ │
│  │ 🕐 17:30                │ │
│  │ ⏱ 50m                   │ │
│  │                         │ │
│  │      [✓ Joined]        │ │
│  └──────────────────────────┘ │
│                                │
│  ┌──────────────────────────┐ │
│  │ 🏋️ Gym                    │ │
│  │ @sarah                  │ │
│  │                         │ │
│  │ 📍 LA Fitness, Downtown │ │
│  │ 🕐 18:00                │ │
│  │ ⏱ 60m                   │ │
│  │                         │ │
│  │      [I'm in]           │ │
│  └──────────────────────────┘ │
│                                │
└────────────────────────────────┘
```

### Header
- Left: "Dazi" logo (22px bold)
- Middle: "Hi, [username]" greeting (14px)
- Right: Two buttons
  - "+ Post" (blue button, 14px)
  - "Logout" (slate button, 14px)
- Height: 56px
- Sticky to top

### Activity Card

**Structure**:
```
┌────────────────────────────┐
│ 🎾 Badminton      💎 $15   │ ← header with icon, name, price badge
│ @marcus                    │ ← author handle
│                            │
│ 📍 Central Park, Court 3   │ ← location
│ 🕐 19:00                   │ ← time
│ ⏱ 120m                     │ ← duration
│                            │
│      [Join for $15]        │ ← call-to-action button
└────────────────────────────┘
```

**Styling**:
- Width: 100% (max 500px container)
- Margin bottom: 16px
- Background: slate-700/50
- Border: 1px slate-600
- Border-radius: 8px
- Padding: 16px

**Activity Title**:
- Font size: 16px
- Font weight: semibold
- Color: white
- Display inline with emoji icon (20px)

**Price Badge**:
- Background: teal/20 (transparent teal)
- Text: teal accent color
- Text size: 12px
- Padding: 4px 12px
- Border-radius: 16px
- Display: if price exists
- Position: top right of card

**Author Handle**:
- Font size: 12px
- Color: slate-400
- Format: "@{handle}"
- Margin top: 4px

**Details** (location, time, duration):
- Font size: 14px
- Color: slate-300
- Each on own line with icon
- Icons: 📍, 🕐, ⏱
- Margin top: 12px

**Button**:
- Width: 100% (minus padding)
- Height: 40px
- Margin top: 12px
- If price: "Join for $[price]" on blue
- If no price: "I'm in" on blue
- If joined: "✓ Joined" on slate (disabled)
- Border-radius: 8px
- Font: semibold, 14px

### Behavior
- Real-time updates from database
- Sorting: by starts_at (upcoming first)
- Pagination: Load 20 per page, infinite scroll
- Join button on click: submit join to database, change button state
- Persist joined status (show "✓ Joined" after joining)
- Logout button: sign out, redirect to signup

---

## Screen 4: Create Activity (`/post`)

### Layout
```
┌────────────────────────────┐
│  ← Back                    │
│                            │
│   Post an Activity         │
│                            │
│  Activity *                │
│  ┌──────────────────────┐ │
│  │ Badminton ▼          │ │
│  └──────────────────────┘ │
│                            │
│  Location *                │
│  ┌──────────────────────┐ │
│  │ Central Park, Court 3│ │
│  └──────────────────────┘ │
│                            │
│  Start Time *              │
│  ┌──────────────────────┐ │
│  │ 19:00                │ │
│  └──────────────────────┘ │
│                            │
│  Duration (minutes) *      │
│  ┌──────────────────────┐ │
│  │ 120                  │ │
│  └──────────────────────┘ │
│                            │
│  Price per person          │
│  ┌──────────────────────┐ │
│  │ 15                   │ │
│  └──────────────────────┘ │
│                            │
│  Capacity                  │
│  ┌──────────────────────┐ │
│  │ 4                    │ │
│  └──────────────────────┘ │
│                            │
│  ┌──────────────────────┐ │
│  │   Post Activity      │ │
│  └──────────────────────┘ │
│                            │
└────────────────────────────┘
```

### Back Button
- Text: "← Back"
- Position: top left
- Color: slate-400
- Clickable: go back to feed

### Title
- "Post an Activity"
- Font size: 24px
- Font weight: bold
- Margin bottom: 24px

### Form

**Labels**:
- Font size: 12px
- Font weight: medium
- Color: slate-300
- Margin bottom: 8px
- "*" for required fields

**Inputs**:
- All same styling as signup inputs
- Height: 40px
- Width: 100%
- Margin bottom: 16px

**Activity Dropdown**:
- Options: Badminton, Pickleball, Padel, Run, Gym
- Required field
- Default: first option

**Location Input**:
- Placeholder: "e.g. Central Park, Court 3"
- Required field
- Text input

**Time Input**:
- Type: time picker (HTML5 `<input type="time">`)
- Default: 19:00 (7 PM today)
- Required field

**Duration Input**:
- Type: number
- Min: 1
- Default: 120
- Required field

**Price Input**:
- Type: number
- Min: 0
- Step: 0.01
- Placeholder: "optional"
- Optional field
- Show dollar sign prefix

**Capacity Input**:
- Type: number
- Min: 1
- Placeholder: "optional"
- Optional field

**Button**:
- "Post Activity"
- Width: 100%
- Height: 40px
- Blue background
- Margin top: 16px
- Loading state: "Creating..."

### Behavior
- Form validation before submit
- Error messages in red below fields (if validation fails)
- On submit:
  - Validate all required fields
  - Create post with author_id = current user
  - Generate post ID: `{userId}-{timestamp}`
  - Save to database
  - Redirect to "/"
- Back button: navigate back to feed

---

## Screen 5: Additional States

### Loading State
- Show spinner or skeleton cards
- "Loading activities..." text
- Gray background

### Empty State
- "No activities posted yet"
- "Be the first to post!" prompt
- Large + button in center

### Error State
- "Failed to load activities"
- "Try again" button
- Retry functionality

### Authenticated Header
```
┌─────────────────────────────┐
│  Dazi  |  Hi, marcus  |  + Post  |  Logout  │
└─────────────────────────────┘
```

### Unauthenticated Header
```
┌─────────────────────────────┐
│  Dazi  |  Sign up / Log in  │
└─────────────────────────────┘
```

---

## Responsive Design

### Mobile (430px - Design target)
- Full width
- 16px padding all sides
- Single column layout

### Tablet (768px)
- Center content
- Max width: 500px
- Still single column

### Desktop (1024px+)
- Center content
- Max width: 500px
- Sticky header
- Sidebar (future)

---

## Color Variations

### Activity Type Icons
- 🎾 Badminton (teal)
- 🏓 Pickleball (orange)
- 🔶 Padel (red)
- 🏃 Run (green)
- 🏋️ Gym (purple)

### Button States
- **Default**: blue-600
- **Hover**: blue-700
- **Active**: blue-800
- **Disabled**: gray, opacity 50%
- **Joined**: slate-600, disabled

### Text Hierarchy
- Primary: white (100%)
- Secondary: slate-300 (90%)
- Tertiary: slate-400 (70%)
- Muted: slate-500 (50%)

---

## Accessibility

- All buttons: 40px+ height for touch targets
- All text: minimum 12px, WCAG AA contrast
- Form labels associated with inputs
- Error messages in red + icon
- Focus states visible on keyboard nav
- Semantic HTML (form, button, input)

---

## Animation & Interaction

- Button hover: opacity transition 200ms
- Form submission: disable button, show "Creating..."
- Toast notifications for errors/success
- Smooth scroll on navigation
- Real-time feed updates (no page refresh)

---

## Design Tokens

```css
/* Colors */
--bg: #0f172a (slate-900)
--surface: rgba(51, 65, 85, 0.5) (slate-700/50)
--border: #475569 (slate-600)
--ink: #ffffff (white)
--ink-muted: #94a3b8 (slate-400)
--accent: #2563eb (blue-600)
--accent-hover: #1d4ed8 (blue-700)

/* Spacing */
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px

/* Typography */
--font-family: system-ui, -apple-system, sans-serif
--font-size-sm: 12px
--font-size-base: 14px
--font-size-lg: 16px
--font-size-xl: 20px
--font-size-2xl: 24px

/* Radii */
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
--radius-full: 999px
```

---

## Quality Checklist

- [ ] All inputs validate before submit
- [ ] All errors show helpful messages
- [ ] Loading states don't block interaction
- [ ] Join button state persists on refresh
- [ ] Real-time feed updates work
- [ ] Mobile layout works at 430px
- [ ] Touch targets are 40px+
- [ ] Focus states visible
- [ ] Tab navigation works
- [ ] No console errors
- [ ] Page load < 2 seconds
- [ ] Feed updates < 1 second
