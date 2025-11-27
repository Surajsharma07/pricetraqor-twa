# Planning Guide

A Telegram Web App (TWA) interface for price tracking that monitors ecommerce products and alerts users when prices drop, providing a mobile-optimized experience for managing watchlists and receiving timely notifications.

**Experience Qualities**: 
1. **Instant** - Fast navigation, immediate feedback, and real-time price updates that feel snappy and responsive
2. **Trustworthy** - Clear data presentation with reliable notifications that users can depend on for important purchase decisions
3. **Focused** - Streamlined interface that prioritizes the watchlist and alerts without unnecessary complexity or distractions

**Complexity Level**: Light Application (multiple features with basic state)
- Multiple interconnected screens (watchlist, product detail, add product, settings) with navigation and state management, but maintaining simplicity in each individual view to serve the core price-tracking purpose efficiently.

## Essential Features

### Watchlist Management
- **Functionality**: Display all tracked products with current prices, change indicators, and quick actions
- **Purpose**: Central hub for monitoring all price-tracked items at a glance
- **Trigger**: App launch or bottom nav "Home" tap
- **Progression**: Launch app → View watchlist grid → See price changes → Tap product for details OR tap + to add new
- **Success criteria**: User can immediately identify which products have price drops and access product details in one tap

### Add Product Tracking
- **Functionality**: Accept ecommerce URLs, validate, and add products to watchlist
- **Purpose**: Allow users to expand their watchlist with any supported ecommerce product
- **Trigger**: Tap "+ Add Product" button OR deep-link with pre-filled URL parameter
- **Progression**: Tap add → Input URL → Optional: set target price → Submit → Validation → Confirmation → Redirect to watchlist
- **Success criteria**: User successfully adds product and sees it appear in watchlist with current price data

### Product Detail View
- **Functionality**: Show comprehensive product info, price history, and tracking controls
- **Purpose**: Provide detailed insights and management options for individual tracked products
- **Trigger**: Tap any product card in watchlist
- **Progression**: Tap product → View full details → See price trend → Adjust target price OR pause tracking OR delete
- **Success criteria**: User understands price history and can modify tracking settings without confusion

### Price Alert System
- **Functionality**: Display price change notifications with inline actions
- **Purpose**: Immediately inform users of price drops and allow quick responses
- **Trigger**: Price monitoring detects change (simulated in UI with badge/banner)
- **Progression**: Price drops → Alert appears → User reviews → Tap "View" to see details OR "Mute" to pause OR "Remove" to delete
- **Success criteria**: User can act on price alerts within seconds of seeing them

### Settings & Preferences
- **Functionality**: Configure notification behavior and tracking preferences
- **Purpose**: Give users control over alert frequency and types
- **Trigger**: Tap settings icon in bottom nav
- **Progression**: Open settings → Toggle notifications → Select alert type → Set default target percentage → Save automatically
- **Success criteria**: User preferences persist and affect alert behavior appropriately

## Edge Case Handling

- **Invalid URLs** - Clear inline error message with example of valid format (e.g., "Enter a valid Amazon, Flipkart, or supported store URL")
- **Duplicate Products** - Prevent adding same URL twice, show "Already tracking" toast with option to view existing
- **Empty Watchlist** - Welcoming empty state with large "+ Add Product" CTA and example use case
- **Network Errors** - Graceful loading states and retry options with friendly error messages
- **Out of Stock** - Visual badge indicator with timestamp when product became unavailable
- **Stale Prices** - Show "Last updated X time ago" to indicate data freshness

## Design Direction

The design should evoke trust and efficiency with a modern, data-focused aesthetic - clean cards with clear typography for prices and changes, subtle color coding for price movements (green drops, red increases), and professional polish that feels like a serious tool rather than a playful consumer app. A rich interface better serves the purpose since users need to quickly scan multiple data points (prices, changes, timestamps, status) across many products.

## Color Selection

Triadic color scheme with blue (trust/stability), green (positive/drops), and red/orange (alerts/increases) to create clear semantic meaning for price movements while maintaining professional appearance.

- **Primary Color**: Deep blue `oklch(0.45 0.15 250)` - Communicates reliability and data-focused professionalism, used for navigation and primary actions
- **Secondary Colors**: 
  - Muted slate `oklch(0.25 0.02 250)` for cards and containers
  - Dark navy `oklch(0.10 0.02 250)` for backgrounds
- **Accent Color**: Vibrant cyan `oklch(0.70 0.18 230)` - Attention-grabbing highlight for CTAs, active states, and new alerts
- **Foreground/Background Pairings**:
  - Background (Dark Navy `oklch(0.10 0.02 250)`): White text `oklch(0.98 0 0)` - Ratio 15.2:1 ✓
  - Card (Muted Slate `oklch(0.25 0.02 250)`): White text `oklch(0.98 0 0)` - Ratio 11.8:1 ✓
  - Primary (Deep Blue `oklch(0.45 0.15 250)`): White text `oklch(0.98 0 0)` - Ratio 6.2:1 ✓
  - Secondary (Dark Slate `oklch(0.20 0.03 250)`): White text `oklch(0.98 0 0)` - Ratio 13.5:1 ✓
  - Accent (Vibrant Cyan `oklch(0.70 0.18 230)`): Dark text `oklch(0.15 0 0)` - Ratio 8.9:1 ✓
  - Muted (Darker Slate `oklch(0.25 0.02 250)`): Muted text `oklch(0.75 0.01 250)` - Ratio 4.7:1 ✓
  - Success (Green `oklch(0.65 0.20 145)`): Dark text `oklch(0.15 0 0)` - Ratio 7.8:1 ✓
  - Destructive (Red `oklch(0.55 0.22 15)`): White text `oklch(0.98 0 0)` - Ratio 5.1:1 ✓

## Font Selection

Inter with tabular numerics for prices ensures professional readability and consistent digit spacing crucial for scanning price changes quickly - medium weight for body text, semibold for prices, and bold for headings to establish clear hierarchy.

- **Typographic Hierarchy**: 
  - H1 (Screen Titles): Inter Semibold/24px/tight letter spacing/-0.02em
  - H2 (Product Names): Inter Medium/16px/normal/1.4 line height
  - Price (Large): Inter Semibold/20px/tabular-nums/-0.01em
  - Price (Small): Inter Medium/14px/tabular-nums/-0.01em
  - Body: Inter Regular/14px/normal/1.5 line height
  - Labels: Inter Medium/12px/uppercase/0.05em tracking
  - Timestamps: Inter Regular/11px/normal/muted color

## Animations

Animations should be purposeful and fast, primarily serving to confirm user actions and guide attention to price changes - subtle rather than showy, with quick transitions (200-300ms) that maintain the efficient, professional tone while providing satisfying feedback.

- **Purposeful Meaning**: Quick scale feedback on taps (0.95 scale), smooth slide-in for screens (translate), gentle pulse on new price alerts to draw eye without being alarming
- **Hierarchy of Movement**: Price change badges deserve animation focus (gentle pulse, color shift), followed by screen transitions, with minimal motion on static content to keep focus on data

## Component Selection

- **Components**: 
  - Cards for product items with hover states
  - Badges for price change indicators and status
  - Input with validation states for URL entry
  - Buttons (primary for add, ghost for secondary actions)
  - Tabs for filtering watchlist (All, Dropped, Increased)
  - Switch for settings toggles
  - Dialog for delete confirmations
  - Sheet for bottom drawer product details on mobile
  - Avatar for potential user profile
  - Separator for visual grouping
  - ScrollArea for long lists
  - **Neumorphic Components**: Radio groups, switches, checkboxes, sliders, and buttons with tactile depth and real-world feel
  
- **Customizations**: 
  - Custom price display component with automatic formatting and change indicators
  - Custom product card with integrated image, title, price, and quick actions
  - Custom alert banner component with inline action buttons
  - Custom empty state illustrations
  - **Neumorphic Design System**: Complete suite of tactile UI components including:
    - Radio groups with pressed/extruded indicators
    - Switches with recessed tracks and raised thumbs
    - Checkboxes with inset selection states
    - Sliders with 3D depth and raised thumbs
    - Buttons with soft shadows and pressed states
    - Cards with raised and inset surface variations
  
- **States**: 
  - Buttons: default with subtle border, hover with background shift, active with scale down, disabled with reduced opacity
  - Inputs: default with border, focus with accent ring and border color shift, error with destructive color and icon, success with green checkmark
  - Cards: default flat, hover with subtle elevation increase, active/selected with accent border
  - **Neumorphic States**: Pressed (inset shadows), raised (outset shadows), hover (enhanced depth), active (scaled down with inverted shadows)
  
- **Icon Selection**: 
  - Plus (add product)
  - TrendDown/TrendUp (price changes)
  - Bell/BellSlash (notifications)
  - Trash (delete)
  - PauseCircle/PlayCircle (pause/resume tracking)
  - MagnifyingGlass (search/filter)
  - Gear (settings)
  - Check (success states)
  - X (close/remove)
  - Link (external product link)
  - Palette (design showcase)
  - Heart, Star, ShoppingCart (neumorphic button icons)
  
- **Spacing**: 
  - Container padding: p-4 (16px)
  - Card internal padding: p-4
  - Stack spacing: gap-4 for major sections, gap-2 for related items
  - Grid gaps: gap-3 for product grid
  - Section margins: mb-6 between major sections
  - Neumorphic padding: p-8 to p-12 for soft, spacious feel
  
- **Mobile**: 
  - Single column layout for watchlist (grid on tablet+)
  - Bottom navigation for primary screens
  - Sheet drawer for product details (replaces full page)
  - Larger touch targets (min 44px)
  - Simplified header with back button
  - Sticky bottom action bar for primary CTAs
  - Reduced padding in tight spaces (p-3 instead of p-4)

## Neumorphic Design System

The app includes a complete neumorphic (soft UI) design system that creates the illusion of extruded or pressed surfaces through careful use of highlights and shadows. This creates a tactile, real-world feel inspired by physical materials.

### Core Principles
- **Soft shadows**: Dual shadows (light and dark) create depth without harsh edges
- **Subtle gradients**: Linear gradients simulate light hitting raised or recessed surfaces
- **Limited color palette**: Monochromatic scheme (light grays) with subtle variations
- **Purposeful states**: Interactive elements respond with inverted shadows when pressed
- **Accessibility**: Maintains WCAG contrast ratios despite subtle nature

### Component Variations
- **Raised surfaces**: Cards, buttons, and toggles that appear to extrude from the background
- **Inset surfaces**: Input fields and pressed states that appear recessed into the background
- **Interactive feedback**: Transitions between raised and inset states on interaction

### Implementation Details
- Base color: `oklch(0.93 0.005 250)` - soft, nearly neutral light gray
- Light shadow: `oklch(1 0 0)` - pure white for highlights
- Dark shadow: `oklch(0.82 0.01 250)` - subtle gray for depth
- Shadow distances: 4-12px for components, up to 24px for cards
- Accent integration: Primary/accent colors used sparingly in sliders and active states
