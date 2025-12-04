# Notification System Documentation

## Overview

The PriceTraqor TWA includes a robust, real-time notification system that alerts users about price drops and product changes. The system is designed for reliability and user engagement.

## Features

### 1. Real-Time Push Notifications
- **Telegram Integration**: Uses Telegram Web App SDK for native notification delivery
- **Polling Mechanism**: Automatically polls for new notifications every 30 seconds
- **Instant Feedback**: Haptic feedback and visual indicators for new notifications
- **Background Processing**: Notifications are queued and processed with retry logic

### 2. Notification Types
- **Price Drop**: When a product's price decreases
- **Price Increase**: When a product's price increases (optional)
- **Stock Recovery**: When out-of-stock items become available again
- **Price Target Reached**: When price drops below user's target price
- **Significant Change**: Major price movements based on percentage threshold

### 3. Granular Notification Controls

#### Basic Settings (in Settings Screen)
- Enable/disable notifications globally
- Choose notification type (price drops only or all changes)
- Set default auto-alert threshold percentage

#### Advanced Settings (in Notification Settings)
- **Notification Types**: Enable/disable specific types individually
  - Price drops
  - Stock recovery
  - Significant changes
  
- **Thresholds**: 
  - Minimum price drop percentage (1-50%)
  - Only notify if price drops by at least this amount
  
- **Quiet Hours**: 
  - Enable quiet hours to mute notifications during specific times
  - Configurable start and end times (24-hour format)
  - Overnight quiet hours supported
  
- **Notification Style**:
  - Sound on/off
  - Vibration on/off

### 4. Notification Center

Accessible from the bottom navigation bar with a notification badge showing unread count.

#### Features:
- View all notifications with filtering (all/unread)
- Mark individual notifications as read
- Mark all as read
- Delete individual notifications
- Clear all notifications
- Navigate to products directly from notifications
- Visual indicators for notification types with color-coded icons

#### Notification Details Display:
- Product title
- Old price vs new price
- Price change percentage
- Time ago (relative time)
- Notification type badge

### 5. Notification History
- Persistent storage of notifications
- Pagination support (20 items per page)
- Filter by status (all, unread, pending, failed)
- Statistics tracking (total, unread, pending, failed)

### 6. Reliability Features

#### Retry Mechanism
- Automatic retry for failed notification deliveries
- Maximum 3 retry attempts per notification
- Exponential backoff between retries (2s, 4s, 6s)

#### Queue Processing
- Notifications are queued for orderly processing
- Prevents overwhelming the user with simultaneous notifications
- Ensures delivery order is maintained

#### Error Handling
- Graceful fallbacks when Telegram SDK is unavailable
- Development mode support for testing without Telegram
- Detailed error logging for debugging

### 7. Telegram Integration

#### Notification Delivery Methods:
- **Haptic Feedback**: Vibration patterns for different notification types
- **Popup Dialogs**: For critical notifications (target reached, stock recovery)
- **Toast Notifications**: For less urgent updates
- **Badge Indicators**: Unread count on navigation button

#### Telegram Features Used:
- `WebApp.showPopup()`: For important alerts with action buttons
- `WebApp.HapticFeedback`: For tactile feedback
- `WebApp.showAlert()`: For simple notifications

## Architecture

### Service Layer (`src/services/notifications.ts`)

```typescript
NotificationService
├── getPreferences()          // Fetch user notification preferences
├── updatePreferences()       // Update notification settings
├── getHistory()              // Get notification history with pagination
├── getStats()                // Get notification statistics
├── markAsRead()              // Mark single notification as read
├── markAllAsRead()           // Mark all as read
├── deleteNotification()      // Delete a notification
├── clearAll()                // Clear all notifications
├── sendTestNotification()    // Send test notification
├── showTelegramNotification() // Display in Telegram
├── processQueue()            // Process notification queue
├── queueNotification()       // Add to queue
├── pollNotifications()       // Poll for new notifications
├── startPolling()            // Start background polling
└── stopPolling()             // Stop polling
```

### React Hook (`src/hooks/useNotifications.ts`)

```typescript
useNotifications()
├── State
│   ├── notifications         // Array of notifications
│   ├── stats                 // Statistics object
│   ├── preferences           // User preferences
│   ├── isLoading             // Loading state
│   ├── error                 // Error message
│   └── isPolling             // Polling status
│
└── Actions
    ├── loadNotifications()   // Fetch notifications
    ├── loadPreferences()     // Fetch preferences
    ├── updatePreferences()   // Update preferences
    ├── markAsRead()          // Mark as read
    ├── markAllAsRead()       // Mark all read
    ├── deleteNotification()  // Delete notification
    ├── clearAll()            // Clear all
    ├── sendTestNotification() // Send test
    ├── startPolling()        // Start polling
    └── stopPolling()         // Stop polling
```

### UI Components

#### NotificationCenter (`src/components/NotificationCenter.tsx`)
- Full-screen notification list
- Filtering and actions
- Product navigation

#### NotificationSettings (`src/components/NotificationSettings.tsx`)
- Comprehensive settings form
- Real-time validation
- Save/test actions

## API Endpoints (Backend Required)

The notification system expects the following backend endpoints:

### Preferences
- `GET /notifications/preferences` - Get user notification preferences
- `PATCH /notifications/preferences` - Update preferences

### History & Stats
- `GET /notifications/history?page={page}&per_page={perPage}` - Get notification history
- `GET /notifications/stats` - Get notification statistics
- `GET /notifications/pending` - Get pending notifications for polling

### Actions
- `PATCH /notifications/{id}/read` - Mark as read
- `PATCH /notifications/read-all` - Mark all as read
- `DELETE /notifications/{id}` - Delete notification
- `DELETE /notifications/clear-all` - Clear all
- `POST /notifications/test` - Send test notification

## Data Models

### NotificationPreferences
```typescript
{
  enabled: boolean
  priceDropEnabled: boolean
  stockRecoveryEnabled: boolean
  significantChangeEnabled: boolean
  minPriceDropPercentage: number
  quietHoursEnabled: boolean
  quietHoursStart: string        // HH:MM format
  quietHoursEnd: string          // HH:MM format
  notificationSound: boolean
  notificationVibration: boolean
}
```

### Notification
```typescript
{
  _id: string
  user_id: string
  product_id: string
  type: 'price_drop' | 'stock_recovery' | 'price_increase' | 'price_target_reached'
  title: string
  message: string
  product_title?: string
  old_price?: number
  new_price?: number
  price_change_percent?: number
  status: 'pending' | 'sent' | 'failed' | 'read'
  created_at: string
  sent_at?: string
  read_at?: string
  retry_count: number
  metadata?: Record<string, any>
}
```

### NotificationStats
```typescript
{
  total: number
  unread: number
  pending: number
  failed: number
}
```

## Usage Examples

### Basic Integration in App Component

```typescript
import { useNotifications } from '@/hooks/useNotifications'

function App() {
  const { stats, startPolling, stopPolling } = useNotifications()
  
  useEffect(() => {
    if (user && notificationsEnabled) {
      startPolling(30000) // Poll every 30s
      return () => stopPolling()
    }
  }, [user, notificationsEnabled])
  
  return (
    <BottomNav notificationCount={stats.unread} />
  )
}
```

### Notification Settings

```typescript
import { NotificationSettings } from '@/components/NotificationSettings'

function SettingsScreen() {
  return <NotificationSettings />
}
```

### Notification Center

```typescript
import { NotificationCenter } from '@/components/NotificationCenter'

function NotificationScreen() {
  const handleNotificationClick = (productId) => {
    // Navigate to product detail
  }
  
  return (
    <NotificationCenter 
      onNotificationClick={handleNotificationClick}
      onClose={() => goBack()}
    />
  )
}
```

## Best Practices

### Performance
1. **Polling Interval**: Default 30 seconds balances freshness and performance
2. **Pagination**: Load notifications in batches of 20
3. **Lazy Loading**: Only load notification details when needed
4. **Debouncing**: Settings changes are debounced to prevent excessive API calls

### User Experience
1. **Immediate Feedback**: Haptic feedback on all interactions
2. **Visual Indicators**: Clear badges and icons for notification types
3. **Quiet Hours**: Respect user's quiet time preferences
4. **Test Notifications**: Let users verify their settings work

### Error Handling
1. **Graceful Degradation**: Continue working if backend is unavailable
2. **Retry Logic**: Automatically retry failed deliveries
3. **Error Messages**: Clear, actionable error messages for users
4. **Fallback Storage**: Use local storage if CloudStorage unavailable

### Security
1. **Authentication**: All API calls include JWT token
2. **Validation**: Input validation on client and server
3. **Rate Limiting**: Prevent notification spam
4. **Sanitization**: Sanitize notification content

## Testing

### Manual Testing Checklist
- [ ] Enable/disable notifications globally
- [ ] Configure notification types
- [ ] Set quiet hours and verify they work
- [ ] Send test notification
- [ ] Verify notification appears in list
- [ ] Mark notification as read
- [ ] Delete notification
- [ ] Clear all notifications
- [ ] Click notification to navigate to product
- [ ] Verify badge count updates
- [ ] Test polling starts/stops correctly

### Backend Mock for Development
If backend is not available, the system gracefully falls back to:
- Default preferences
- Empty notification list
- Local storage for preferences
- Console logging instead of API calls

## Troubleshooting

### Notifications Not Appearing
1. Check if notifications are enabled in settings
2. Verify polling is active (check console logs)
3. Check backend /notifications/pending endpoint
4. Verify JWT token is valid

### Polling Not Working
1. Check if user is authenticated
2. Verify notifications are enabled
3. Check browser console for errors
4. Ensure component is mounted

### Telegram Integration Issues
1. Verify running in Telegram environment
2. Check WebApp.initData is present
3. Test with Telegram Desktop/Mobile
4. Check WebApp SDK version compatibility

### Performance Issues
1. Increase polling interval (default: 30s)
2. Reduce notifications per page
3. Clear old notifications regularly
4. Check for memory leaks in DevTools

## Future Enhancements

### Planned Features
- [ ] WebSocket support for real-time notifications
- [ ] Rich notification previews with images
- [ ] Notification grouping by product
- [ ] Smart notification timing based on user behavior
- [ ] Push notification permissions for web
- [ ] Email notification fallback
- [ ] Custom notification sounds
- [ ] Do Not Disturb mode
- [ ] Notification templates
- [ ] A/B testing for notification content

### Backend Requirements
The backend needs to implement:
1. Notification creation when price changes detected
2. Notification storage in database
3. API endpoints for notification management
4. Background job for notification cleanup
5. Rate limiting per user
6. Notification preference validation

## Support

For issues or questions:
- Check browser DevTools console for errors
- Verify backend API is accessible
- Test with Telegram Web App debugger
- Review notification preferences
- Check CloudStorage for saved settings
