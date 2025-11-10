# NumVerify AI Design Guidelines

## Design Approach
**Reference-Based SaaS Dashboard Aesthetic**
Drawing inspiration from Linear, Vercel Dashboard, and Stripe's interface patterns. Focus on utility-first design with subtle sophistication—clean data presentation, purposeful spacing, and micro-interactions that enhance usability without distraction.

## Typography System

**Font Stack**: Inter (primary) via Google Fonts CDN
- **Headings**: Font weight 600-700
  - H1: text-4xl (Dashboard page titles)
  - H2: text-2xl (Section headers)
  - H3: text-xl (Card titles, subsections)
- **Body**: Font weight 400-500
  - Base: text-base (Standard content)
  - Small: text-sm (Metadata, timestamps, secondary info)
  - Tiny: text-xs (Labels, badges, micro-copy)
- **Data Display**: Font weight 500-600, tracking-tight for numbers and stats
- **Buttons/CTAs**: Font weight 500, text-sm

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Consistent use of p-6 or p-8 for card interiors
- gap-4 or gap-6 for grid/flex layouts
- mb-8 or mb-12 for major section separation
- Component padding: py-2 px-4 (buttons), p-4 (small cards), p-6 (standard cards)

**Grid Structure**:
- Dashboard: Single column mobile, 12-column grid desktop with sidebar
- Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 for analytics/stats
- Search History: Single column list, max-w-4xl centered

**Container Widths**:
- Main content: max-w-7xl with px-4 md:px-6 lg:px-8
- Forms/Auth pages: max-w-md centered
- Dashboard content area: Fluid with sidebar offset

## Component Library

**Navigation**:
- Persistent sidebar (240px wide desktop, collapsible mobile drawer)
- Logo/branding top-left
- Navigation items: py-2 px-4, full-width, icon + text horizontal layout
- Active state: subtle background treatment, medium font weight
- Use lucide-react icons (Search, History, User, Moon/Sun for theme toggle)

**Authentication Pages (Login/Signup)**:
- Centered card layout: max-w-md, rounded-lg, shadow-lg
- Logo/brand at top
- Form fields: Full-width inputs with clear labels above
- Primary CTA button: w-full, py-3, rounded-md
- "Don't have an account?" link beneath form
- Subtle decorative element (abstract shape or gradient) in background

**Dashboard Page**:
- **Hero Search Section**: Prominent centered search area
  - Large heading (text-3xl) with descriptive subtext
  - Phone number input with country code selector (side-by-side)
  - Primary search button (px-8 py-3, rounded-md)
  - Input fields: border rounded-md, focus:ring treatment
- **Analytics Cards Row**: 3-column grid (desktop) below search
  - Cards: p-6, rounded-lg, shadow-sm
  - Icon top-left, stat number (text-3xl, font-bold), label below
  - Icons from lucide-react (TrendingUp, Clock, CheckCircle)
- **Recent Results**: List/cards showing last 3-5 searches with expand option

**Search Results Display**:
- Card-based layout: p-6, rounded-lg, shadow-md
- Header: Phone number (text-2xl, font-semibold)
- Info grid: 2-column on desktop, stacked mobile
  - Labels: text-sm, medium weight
  - Values: text-base, regular weight
- AI Insight section: p-4, rounded-md, subtle background differentiation, border-l-4 accent
- Action buttons row: "Save", "Share" (secondary style)

**Search History Page**:
- Page header: Title + filter/sort options
- List items: p-4, rounded-md, hover:shadow transition
  - Phone number prominent (text-lg, font-medium)
  - Timestamp and country (text-sm, muted)
  - Quick view icon (lucide-react Eye)
- Pagination: Centered below list, simple prev/next

**Profile Page**:
- Two-column desktop, stacked mobile
- Left: Avatar/initials circle (large), name, email
- Right: Info cards (Account Details, Settings)
- Logout button: Destructive style variant, w-full in its container

**Forms & Inputs**:
- Input fields: p-3, rounded-md, border, full-width
- Labels: text-sm, font-medium, mb-2
- Helper text: text-xs, muted, mt-1
- Error states: border-red, text-red helper
- Focus: ring treatment (ring-2, ring-offset-1)

**Buttons**:
- Primary: px-6 py-3, rounded-md, font-medium, shadow-sm, transition all
- Secondary: Similar sizing, border variant
- Icon buttons: p-2, rounded-md (theme toggle)
- Hover: slight scale (scale-105), shadow increase

**Cards**:
- Standard: p-6, rounded-lg, shadow-sm, border subtle
- Interactive cards (history items): hover:shadow-md transition-shadow
- Stat cards: Compact with large numbers, minimal padding

**Theme Toggle**:
- Positioned in sidebar footer or top-right navbar
- Icon button (Sun/Moon from lucide-react)
- Smooth icon rotation transition using framer-motion
- Persisted to localStorage

**Loading States**:
- Skeleton loaders for cards: Pulse animation, rounded rectangles matching content structure
- Search button: Spinner icon from lucide-react replacing text

**Empty States**:
- Centered icon + message + optional CTA
- Search history empty: "No searches yet" with search icon
- Friendly, concise copy

## Animations

**Minimal Approach**: Use sparingly for functional feedback
- Page transitions: Subtle fade-in (framer-motion)
- Card hover: Shadow elevation change (200ms ease)
- Button interactions: Scale 105% on hover (100ms ease)
- Theme toggle: Icon rotation 180deg (300ms ease)
- Search result appear: Stagger fade-in for list items
- Modal/drawer: Slide-in with backdrop fade

## Responsive Behavior

**Mobile (< 768px)**:
- Sidebar: Hamburger menu, overlay drawer
- Analytics cards: Stack vertically
- Search inputs: Stack vertically with full width
- Forms: Maintain max-w-md with horizontal padding

**Tablet (768px - 1024px)**:
- Sidebar: Persistent, icons + text
- Analytics: 2-column grid
- Content: Comfortable padding

**Desktop (> 1024px)**:
- Full sidebar navigation
- 3-column analytics grid
- Optimal whitespace and reading widths

## Accessibility

- Consistent form labels and ARIA attributes
- Focus visible states on all interactive elements
- Keyboard navigation support (tab order, escape to close modals)
- Sufficient contrast ratios for all text
- Screen reader friendly navigation structure

## Images

No large hero images required. This is a utility-focused dashboard application where function takes precedence over decorative imagery. Reserve visual space for data presentation and user workflows.