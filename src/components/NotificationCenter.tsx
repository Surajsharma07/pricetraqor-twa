/**
 * NotificationCenter Component
 * Displays notifications and allows users to manage them
 */

import { useState } from 'react';
import { Notification } from '@/services/notifications';
import { useNotifications } from '@/hooks/useNotifications';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  BellSlash, 
  Check, 
  Trash, 
  TrendDown, 
  TrendUp, 
  Package,
  X,
  CheckCircle
} from '@phosphor-icons/react';
import { formatRelativeTime } from '@/lib/helpers';
import { toast } from 'sonner';

interface NotificationCenterProps {
  onNotificationClick?: (productId: string) => void;
  onClose?: () => void;
}

export function NotificationCenter({ onNotificationClick, onClose }: NotificationCenterProps) {
  const {
    notifications,
    stats,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => n.status !== 'read')
    : notifications;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'price_drop':
        return <TrendDown className="w-5 h-5 text-green-500" weight="bold" />;
      case 'price_increase':
        return <TrendUp className="w-5 h-5 text-red-500" weight="bold" />;
      case 'stock_recovery':
        return <Package className="w-5 h-5 text-blue-500" weight="bold" />;
      case 'price_target_reached':
        return <CheckCircle className="w-5 h-5 text-green-500" weight="bold" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" weight="bold" />;
    }
  };

  const getNotificationBadgeVariant = (type: Notification['type']) => {
    switch (type) {
      case 'price_drop':
      case 'price_target_reached':
        return 'default';
      case 'price_increase':
        return 'destructive';
      case 'stock_recovery':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.status !== 'read') {
      await markAsRead(notification._id);
    }

    if (onNotificationClick && notification.product_id) {
      onNotificationClick(notification.product_id);
    }
  };

  const handleDelete = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteNotification(notificationId);
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const handleMarkAsRead = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await markAsRead(notificationId);
  };

  const handleClearAll = async () => {
    try {
      await clearAll();
      toast.success('All notifications cleared');
    } catch (error) {
      toast.error('Failed to clear notifications');
    }
  };

  const formatPriceChange = (notification: Notification) => {
    if (!notification.old_price || !notification.new_price) {
      return '';
    }

    const change = notification.new_price - notification.old_price;
    const changePercent = notification.price_change_percent || 
      ((change / notification.old_price) * 100);

    const sign = change > 0 ? '+' : '';
    return `${sign}₹${Math.abs(change).toFixed(0)} (${sign}${changePercent.toFixed(1)}%)`;
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6" weight="bold" />
          <div>
            <h2 className="text-xl font-semibold">Notifications</h2>
            {stats.unread > 0 && (
              <p className="text-sm text-muted-foreground">
                {stats.unread} unread notification{stats.unread !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
        
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Filter and Actions */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({stats.total})
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Unread ({stats.unread})
          </Button>
        </div>

        <div className="flex gap-2">
          {stats.unread > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <Check className="w-4 h-4 mr-1" />
              Mark all read
            </Button>
          )}
          {stats.total > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearAll}>
              <Trash className="w-4 h-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading notifications...</p>
            </div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            {filter === 'unread' ? (
              <>
                <CheckCircle className="w-16 h-16 text-muted-foreground mb-4" weight="light" />
                <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                <p className="text-sm text-muted-foreground">
                  You have no unread notifications
                </p>
              </>
            ) : (
              <>
                <BellSlash className="w-16 h-16 text-muted-foreground mb-4" weight="light" />
                <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
                <p className="text-sm text-muted-foreground">
                  You'll see price alerts and updates here
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification._id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  notification.status !== 'read' ? 'bg-primary/5 border-primary/20' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm line-clamp-1">
                        {notification.title}
                      </h3>
                      <Badge 
                        variant={getNotificationBadgeVariant(notification.type)}
                        className="text-xs shrink-0"
                      >
                        {notification.type.replace('_', ' ')}
                      </Badge>
                    </div>

                    {notification.product_title && (
                      <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
                        {notification.product_title}
                      </p>
                    )}

                    <p className="text-sm text-foreground/80 mb-2 line-clamp-2">
                      {notification.message}
                    </p>

                    {(notification.old_price || notification.new_price) && (
                      <div className="flex items-center gap-2 text-xs mb-2">
                        {notification.old_price && (
                          <span className="line-through text-muted-foreground">
                            ₹{notification.old_price.toFixed(0)}
                          </span>
                        )}
                        {notification.new_price && (
                          <span className="font-semibold text-primary">
                            ₹{notification.new_price.toFixed(0)}
                          </span>
                        )}
                        {notification.price_change_percent !== undefined && (
                          <span className={
                            notification.price_change_percent < 0 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }>
                            {formatPriceChange(notification)}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(notification.created_at)}
                      </span>

                      <div className="flex gap-1">
                        {notification.status !== 'read' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleMarkAsRead(notification._id, e)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDelete(notification._id, e)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
