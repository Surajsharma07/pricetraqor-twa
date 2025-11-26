# Planning Guide

A compact mobile price-watch cockpit delivering a tactile, skeuomorphic experience that makes digital price tracking feel like interacting with premium physical hardware.

**Experience Qualities**: 
1. **Tactile** - Every interaction should feel physically responsive, with buttons that appear to press, switches that slide, and surfaces that catch light like real materials.
2. **Luxurious** - The app should evoke premium hardware through meticulous attention to light, shadow, and material quality—like holding an expensive watch or hi-fi equipment.
3. **Effortless** - Despite the rich visual treatment, navigation and actions should be immediate and obvious, with no learning curve between the user's intent and the interface's response.

**Complexity Level**: Light Application (multiple features with basic state)
  - Six distinct screens (Login, Signup, Home, Products, Alerts, Profile) with independent purposes but unified visual language, authentication flow with Telegram integration, basic state management for toggling alerts and switches, subscription tier management.

## Essential Features

### Authentication Flow
- **Functionality**: Provides login and signup screens with email/password or Telegram authentication options
- **Purpose**: Secure user access and enable personalized price tracking across devices
- **Trigger**: App loads and user is not authenticated
- **Progression**: App loads → Login screen appears → user can choose Telegram auth (instant) or email/password → enter credentials → validate → navigate to home screen
- **Success criteria**: Telegram button has distinctive blue gradient, form inputs have proper inset appearance, password visibility toggle works, authentication state persists using useKV

### Bottom Navigation Bar
- **Functionality**: Provides persistent access to four primary screens (Home, Products, Alerts, Profile)
- **Purpose**: Ensures users can jump between any major section with one tap, matching Telegram Mini App expectations
- **Trigger**: Always visible at bottom of viewport
- **Progression**: Tap icon → immediate screen transition with subtle slide animation → selected state highlights active icon with raised pill effect
- **Success criteria**: Navigation responds within 100ms, active state is visually obvious, transitions feel smooth

### Home Dashboard
- **Functionality**: Displays at-a-glance KPIs, today's watchlist (3-5 products), and quick action shortcuts
- **Purpose**: Gives users immediate context on their tracking activity without requiring navigation
- **Trigger**: Default landing screen when app opens
- **Progression**: App loads → KPI cards animate in with staggered timing → watchlist populates → quick action pills appear ready to tap
- **Success criteria**: All data visible without scrolling on 360px viewport, cards feel raised and glass-like, notification badge draws attention if present

### Product List & Management
- **Functionality**: Shows all tracked products with search/filter, displays price history indicators, allows adding new products
- **Purpose**: Central inventory of what user is monitoring, with enough detail to understand current status
- **Trigger**: Tap "Products" in bottom nav or "Add product" quick action
- **Progression**: Navigate to Products → search input appears inset at top → product cards load in vertical grid → tap card to see status → tap "Add new product" button → (MVP: shows feedback only)
- **Success criteria**: Search input looks carved into surface, product cards have frosted glass effect, hover states show gradient border accent, add button looks pressable

### Alert Rules Management
- **Functionality**: Lists configured alert rules with visual toggle switches, shows alert type chips, master alert control
- **Purpose**: Lets users see and control when they get notified about price changes
- **Trigger**: Tap "Alerts" in bottom nav or "Edit alerts" quick action
- **Progression**: Navigate to Alerts → summary chips show alert types → rule cards display with product name and threshold → toggle switch to enable/disable → master switch at bottom controls all alerts
- **Success criteria**: Toggle switches look like physical sliders with real shadows, ON state appears raised with inner highlight, OFF state looks sunken

### Profile & Preferences
- **Functionality**: Displays user identity card, subscription details with tier-based features, preference controls for theme/currency/notifications, account actions
- **Purpose**: Gives users control over app behavior, personal settings, and visibility into subscription benefits
- **Trigger**: Tap "Profile" in bottom nav
- **Progression**: Navigate to Profile → glass identity card at top → subscription card shows current tier (Free/Pro/Premium) with feature list → renewal date and pricing for paid tiers → preference rows with segmented controls → action buttons at bottom
- **Success criteria**: Identity card has clear glass effect with blur, subscription card shows Crown icon with gradient, feature list displays with checkmarks, upgrade button has accent gradient, preference controls feel like physical switches, sign out button has destructive color treatment

## Edge Case Handling

- **Empty States**: When no products tracked, show large glass card with icon and "Add your first product" CTA that maintains skeuomorphic treatment
- **Long Product Names**: Truncate to 2 lines with ellipsis, show full name on hover/long-press tooltip
- **Large Numbers**: Format with thousand separators and currency symbols, abbreviate very large numbers (1.2K, 5.6M)
- **Touch Target Sizes**: All interactive elements minimum 44px tap target even if visual appearance is smaller
- **No Alerts Configured**: Show helpful glass panel explaining how alerts work with example scenarios
- **Notification Badge Overflow**: Cap displayed count at 99, show "99+" for larger numbers
- **Unauthenticated Access**: Show login/signup screens with Telegram and email options before allowing app access
- **Password Visibility**: Toggle between masked and visible password with eye icon in input fields
- **Subscription Tiers**: Display appropriate feature lists based on user's current plan (Free/Pro/Premium)

## Design Direction

The design should feel like premium audio equipment or a luxury watch face—tactile, precise, and crafted from glass and metal rather than flat pixels. Skeuomorphic depth cues (bevels, inner shadows, specular highlights) should make every button feel pressable and every surface feel material. The interface should be dense but breathable, with just enough glassmorphism to see layers without losing clarity. Dark base with blue-violet accent glows creates a nighttime cockpit feeling.

## Color Selection

Custom palette using dark backgrounds with luminous blue-violet accents to create depth and premium feel, with additional accent gradients for important actions.

- **Primary Color**: Deep electric blue `oklch(0.55 0.22 250)` - represents active states, primary actions, and selected navigation items; communicates precision and technology
- **Secondary Colors**: 
  - Dark base `oklch(0.08 0.015 250)` for main background (near-black with blue tint)
  - Panel overlay `oklch(0.12 0.02 250)` for raised glass surfaces
  - Accent violet `oklch(0.60 0.20 290)` for gradients and glows
  - Telegram blue `#229ED9` to `#1B7DB8` gradient for OAuth buttons
- **Accent Color**: Bright cyan-blue `oklch(0.70 0.18 230)` for highlights, notification badges, active states, and specular reflections on glass surfaces
- **Action Gradients**: 
  - Primary actions: `from-accent/40 to-violet-accent/30` with hover state `from-accent/50 to-violet-accent/40`
  - Secondary actions: `from-primary/30 to-accent/20` with hover state `from-primary/40 to-accent/30`
  - Destructive actions: `bg-destructive/20` with `text-destructive` and `border-destructive/30`
- **Foreground/Background Pairings**:
  - Background (Dark base #020309): White text `oklch(0.98 0 0)` - Ratio 18.5:1 ✓
  - Card (Panel overlay #0B1020): White text `oklch(0.98 0 0)` - Ratio 14.2:1 ✓
  - Primary (Electric blue): White text `oklch(0.98 0 0)` - Ratio 4.9:1 ✓
  - Accent (Bright cyan-blue): Dark text `oklch(0.15 0 0)` - Ratio 7.8:1 ✓
  - Muted (Subdued gray): Light gray text `oklch(0.75 0.01 250)` - Ratio 4.6:1 ✓
  - Telegram Blue (#229ED9): White text - Ratio 5.2:1 ✓

## Font Selection

Typography should feel technical and precise yet readable at small sizes—suggesting instrument displays and premium electronics without sacrificing legibility.

- **Typographic Hierarchy**:
  - H1 (Screen Titles): Inter Bold / 24px / -0.02em letter-spacing / line-height 1.2
  - H2 (Section Headers): Inter Semibold / 18px / -0.01em letter-spacing / line-height 1.3
  - H3 (Card Titles): Inter Medium / 16px / normal letter-spacing / line-height 1.4
  - Body (Primary): Inter Regular / 14px / normal letter-spacing / line-height 1.5
  - Small (Labels/Meta): Inter Medium / 12px / 0.01em letter-spacing / line-height 1.4
  - Numeric (Prices/KPIs): Inter Semibold / 16-20px / tabular-nums / -0.01em letter-spacing

## Animations

Animations should reinforce the physical nature of the interface—switches slide with momentum, buttons depress with satisfying weight, and screen transitions maintain spatial continuity like panels sliding in a device.

- **Purposeful Meaning**: Motion communicates material weight and mechanical precision; toggles slide smoothly like real switches, buttons compress and release like physical keys, navigation transitions slide panels horizontally to maintain spatial model
- **Hierarchy of Movement**: Navigation transitions (300ms) > toggle switches (200ms) > button press feedback (150ms) > hover effects (100ms); only one major animation should occur at a time to maintain focus

## Component Selection

- **Components**: 
  - Shadcn `Button` for all CTAs with heavy customization (inner/outer shadows, gradient overlays, pressed states, accent color gradients)
  - Shadcn `Card` as base for glass panels with blur backdrop and border-gradient treatment
  - Shadcn `Switch` for toggles with complete visual override to create sliding thumb with shadow
  - Shadcn `Input` for search field and form inputs with inset shadow treatment
  - Shadcn `Badge` for status chips and notification counts
  - Shadcn `Tabs` as base for segmented controls in preferences
  - Shadcn `Checkbox` for terms agreement with accent color when checked
  - Custom bottom navigation component (not in Shadcn) with raised pill indicator
  - Custom login/signup screens with form layouts
  
- **Customizations**: 
  - All cards need `backdrop-filter: blur()` and semi-transparent backgrounds
  - Buttons require dual shadow system: outer drop shadow for raised state, inner shadow for pressed, with enhanced depth using pseudo-elements
  - Gradient buttons use accent color combinations: `from-accent/40 to-violet-accent/30` for primary actions
  - Switches need custom track with gradient and glossy highlight, circular thumb with shadow that moves with state
  - Input fields need carved-in appearance with inner shadow and subtle border, icon placement on left side
  - Telegram button uses official brand gradient `from-[#229ED9] to-[#1B7DB8]`
  
- **States**: 
  - Buttons: idle (raised, outer shadow + top highlight + pseudo-element overlay), hover (shadow grows, subtle scale, gradient intensifies), active (sunken, inner shadow, scale 0.98, dark overlay), disabled (opacity 0.5, no shadow)
  - Toggles: OFF (sunken track, thumb left, inner shadow), ON (raised track, thumb right, outer shadow, accent glow)
  - Nav items: inactive (flat, muted color), active (raised pill background, accent color, soft glow ring)
  - Form inputs: default (inset shadow, border), focus (accent border, subtle glow), error (destructive border)
  
- **Icon Selection**: 
  - @phosphor-icons/react for all UI icons
  - Bottom nav: `House`, `Package`, `BellRinging`, `User` 
  - Actions: `MagnifyingGlass`, `Plus`, `PencilSimple`, `Trash`, `Bell`, `Gear`
  - Auth screens: `TelegramLogo`, `EnvelopeSimple`, `LockKey`, `Eye`, `EyeSlash`
  - Profile: `Crown`, `CalendarBlank`, `Infinity`, `CheckCircle`, `SignOut`
  - Indicators: `TrendUp`, `TrendDown`, `Minus`
  - Use `weight="duotone"` for nav icons, `weight="bold"` for actions, `weight="fill"` for special icons like Crown and Telegram
  
- **Spacing**: 
  - Screen padding: 16px horizontal
  - Card padding: 20px
  - Section gaps: 24px vertical
  - Card grid gaps: 12px
  - Tight groups (KPI segments): 8px
  - Mobile-optimized max-width: 430px centered
  
- **Mobile**: 
  - Fixed bottom navigation (60px height) with safe-area padding
  - All screens scroll vertically with bottom nav always visible
  - Touch targets minimum 44px
  - Product cards stack single-column
  - Horizontal pill button groups scroll horizontally if needed
  - Reduce card padding to 16px on screens < 360px
