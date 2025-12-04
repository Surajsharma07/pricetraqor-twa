/**
 * Notification Service
 * Handles real-time push notifications for price drops and product changes
 */

import apiClient from './api';
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp';

export interface NotificationPreferences {
  enabled: boolean;
  priceDropEnabled: boolean;
  stockRecoveryEnabled: boolean;
  significantChangeEnabled: boolean;
  minPriceDropPercentage: number;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:MM format
  quietHoursEnd: string; // HH:MM format
  notificationSound: boolean;
  notificationVibration: boolean;
}

export interface Notification {
  _id: string;
  user_id: string;
  product_id: string;
  type: 'price_drop' | 'stock_recovery' | 'price_increase' | 'price_target_reached';
  title: string;
  message: string;
  product_title?: string;
  old_price?: number;
  new_price?: number;
  price_change_percent?: number;
  status: 'pending' | 'sent' | 'failed' | 'read';
  created_at: string;
  sent_at?: string;
  read_at?: string;
  retry_count: number;
  metadata?: Record<string, any>;
}

export interface NotificationStats {
  total: number;
  unread: number;
  pending: number;
  failed: number;
}

class NotificationService {
  private retryAttempts = 3;
  private retryDelay = 2000; // 2 seconds
  private notificationQueue: Notification[] = [];
  private processingQueue = false;

  /**
   * Get user notification preferences
   */
  async getPreferences(): Promise<NotificationPreferences> {
    try {
      const response = await apiClient.get<NotificationPreferences>('/notifications/preferences');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch notification preferences:', error);
      // Return default preferences if API fails
      return this.getDefaultPreferences();
    }
  }

  /**
   * Update user notification preferences
   */
  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    try {
      const response = await apiClient.patch<NotificationPreferences>('/notifications/preferences', preferences);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update notification preferences:', error);
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Failed to update notification preferences'
      );
    }
  }

  /**
   * Get notification history
   */
  async getHistory(page = 1, perPage = 20): Promise<{ items: Notification[]; total: number }> {
    try {
      const response = await apiClient.get<{ items: Notification[]; total: number }>(
        `/notifications/history?page=${page}&per_page=${perPage}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch notification history:', error);
      return { items: [], total: 0 };
    }
  }

  /**
   * Get notification statistics
   */
  async getStats(): Promise<NotificationStats> {
    try {
      const response = await apiClient.get<NotificationStats>('/notifications/stats');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch notification stats:', error);
      return { total: 0, unread: 0, pending: 0, failed: 0 };
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await apiClient.patch(`/notifications/${notificationId}/read`);
    } catch (error: any) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    try {
      await apiClient.patch('/notifications/read-all');
    } catch (error: any) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await apiClient.delete(`/notifications/${notificationId}`);
    } catch (error: any) {
      console.error('Failed to delete notification:', error);
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Failed to delete notification'
      );
    }
  }

  /**
   * Clear all notifications
   */
  async clearAll(): Promise<void> {
    try {
      await apiClient.delete('/notifications/clear-all');
    } catch (error: any) {
      console.error('Failed to clear notifications:', error);
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Failed to clear notifications'
      );
    }
  }

  /**
   * Send a test notification
   */
  async sendTestNotification(): Promise<void> {
    try {
      await apiClient.post('/notifications/test');
    } catch (error: any) {
      console.error('Failed to send test notification:', error);
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Failed to send test notification'
      );
    }
  }

  /**
   * Show notification in Telegram Web App
   */
  async showTelegramNotification(notification: Notification): Promise<boolean> {
    try {
      // Get Telegram Web App instance
      const WebApp = (await import('@twa-dev/sdk')).default;
      
      // Check if we're in a Telegram environment
      if (!WebApp || !WebApp.initData) {
        console.warn('Not in Telegram environment, skipping notification');
        return false;
      }

      // Show notification using Telegram's notification API
      if (WebApp.HapticFeedback) {
        WebApp.HapticFeedback.notificationOccurred('success');
      }

      // Use Telegram's showPopup for important notifications
      if (notification.type === 'price_target_reached' || notification.type === 'stock_recovery') {
        return new Promise((resolve) => {
          if (WebApp.showPopup) {
            WebApp.showPopup({
              title: notification.title,
              message: notification.message,
              buttons: [
                { id: 'view', type: 'default', text: 'View Product' },
                { id: 'dismiss', type: 'close', text: 'Dismiss' }
              ]
            }, (buttonId) => {
              resolve(buttonId === 'view');
            });
          } else {
            resolve(false);
          }
        });
      }

      return true;
    } catch (error) {
      console.error('Failed to show Telegram notification:', error);
      return false;
    }
  }

  /**
   * Process notification queue with retry mechanism
   */
  private async processQueue() {
    if (this.processingQueue || this.notificationQueue.length === 0) {
      return;
    }

    this.processingQueue = true;

    while (this.notificationQueue.length > 0) {
      const notification = this.notificationQueue.shift();
      if (!notification) continue;

      let success = false;
      let attempts = 0;

      while (attempts < this.retryAttempts && !success) {
        try {
          success = await this.showTelegramNotification(notification);
          if (success) {
            await this.markAsRead(notification._id);
          }
        } catch (error) {
          console.error(`Notification delivery attempt ${attempts + 1} failed:`, error);
        }

        attempts++;
        if (!success && attempts < this.retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempts));
        }
      }

      if (!success) {
        console.error('Failed to deliver notification after all retry attempts:', notification);
      }
    }

    this.processingQueue = false;
  }

  /**
   * Queue notification for delivery
   */
  queueNotification(notification: Notification): void {
    this.notificationQueue.push(notification);
    this.processQueue();
  }

  /**
   * Poll for new notifications (for real-time updates)
   */
  async pollNotifications(): Promise<Notification[]> {
    try {
      const response = await apiClient.get<{ items: Notification[] }>('/notifications/pending');
      return response.data.items || [];
    } catch (error: any) {
      console.error('Failed to poll for notifications:', error);
      return [];
    }
  }

  /**
   * Start polling for notifications
   */
  startPolling(intervalMs = 30000, onNewNotifications?: (notifications: Notification[]) => void): number {
    const pollInterval = window.setInterval(async () => {
      const notifications = await this.pollNotifications();
      
      if (notifications.length > 0) {
        // Queue notifications for delivery
        notifications.forEach(notification => {
          this.queueNotification(notification);
        });

        // Call callback if provided
        if (onNewNotifications) {
          onNewNotifications(notifications);
        }
      }
    }, intervalMs);

    return pollInterval;
  }

  /**
   * Stop polling for notifications
   */
  stopPolling(pollInterval: number): void {
    window.clearInterval(pollInterval);
  }

  /**
   * Check if notifications should be shown (respect quiet hours)
   */
  shouldShowNotification(preferences: NotificationPreferences): boolean {
    if (!preferences.enabled) {
      return false;
    }

    if (!preferences.quietHoursEnabled) {
      return true;
    }

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const { quietHoursStart, quietHoursEnd } = preferences;
    
    // Simple time range check
    if (quietHoursStart < quietHoursEnd) {
      return currentTime < quietHoursStart || currentTime >= quietHoursEnd;
    } else {
      // Overnight quiet hours
      return currentTime >= quietHoursEnd && currentTime < quietHoursStart;
    }
  }

  /**
   * Get default notification preferences
   */
  private getDefaultPreferences(): NotificationPreferences {
    return {
      enabled: true,
      priceDropEnabled: true,
      stockRecoveryEnabled: true,
      significantChangeEnabled: true,
      minPriceDropPercentage: 5,
      quietHoursEnabled: false,
      quietHoursStart: '22:00',
      quietHoursEnd: '08:00',
      notificationSound: true,
      notificationVibration: true,
    };
  }

  /**
   * Request notification permissions (for web)
   */
  async requestPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }
}

export const notificationService = new NotificationService();
