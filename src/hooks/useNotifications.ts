/**
 * useNotifications Hook
 * React hook for managing notifications in the app
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationService, Notification, NotificationPreferences, NotificationStats } from '@/services/notifications';
import { useTelegramWebApp } from './useTelegramWebApp';

interface UseNotificationsResult {
  notifications: Notification[];
  stats: NotificationStats;
  preferences: NotificationPreferences | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadNotifications: () => Promise<void>;
  loadPreferences: () => Promise<void>;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  sendTestNotification: () => Promise<void>;
  
  // Polling control
  startPolling: (intervalMs?: number) => void;
  stopPolling: () => void;
  isPolling: boolean;
}

export function useNotifications(): UseNotificationsResult {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    pending: 0,
    failed: 0,
  });
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  
  const pollIntervalRef = useRef<number | null>(null);
  const twa = useTelegramWebApp();

  /**
   * Load notification history
   */
  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await notificationService.getHistory(1, 50);
      setNotifications(result.items);
      
      // Also update stats
      const statsData = await notificationService.getStats();
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load notifications');
      console.error('Error loading notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Load notification preferences
   */
  const loadPreferences = useCallback(async () => {
    try {
      const prefs = await notificationService.getPreferences();
      setPreferences(prefs);
    } catch (err: any) {
      console.error('Error loading preferences:', err);
    }
  }, []);

  /**
   * Update notification preferences
   */
  const updatePreferences = useCallback(async (prefs: Partial<NotificationPreferences>) => {
    setError(null);
    try {
      const updated = await notificationService.updatePreferences(prefs);
      setPreferences(updated);
      
      // Show success haptic feedback
      twa.haptic.notification('success');
    } catch (err: any) {
      setError(err.message || 'Failed to update preferences');
      twa.haptic.notification('error');
      throw err;
    }
  }, [twa]);

  /**
   * Mark notification as read
   */
  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, status: 'read' as const, read_at: new Date().toISOString() } : n)
      );
      
      setStats(prev => ({
        ...prev,
        unread: Math.max(0, prev.unread - 1),
      }));
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
    }
  }, []);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      
      // Update local state
      const now = new Date().toISOString();
      setNotifications(prev => 
        prev.map(n => ({ ...n, status: 'read' as const, read_at: now }))
      );
      
      setStats(prev => ({
        ...prev,
        unread: 0,
      }));
      
      twa.haptic.notification('success');
    } catch (err: any) {
      console.error('Error marking all as read:', err);
      twa.haptic.notification('error');
    }
  }, [twa]);

  /**
   * Delete a notification
   */
  const deleteNotification = useCallback(async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      
      // Update local state
      setNotifications(prev => prev.filter(n => n._id !== id));
      setStats(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));
      
      twa.haptic.notification('success');
    } catch (err: any) {
      setError(err.message || 'Failed to delete notification');
      twa.haptic.notification('error');
      throw err;
    }
  }, [twa]);

  /**
   * Clear all notifications
   */
  const clearAll = useCallback(async () => {
    const confirmed = await twa.dialog.showConfirm('Are you sure you want to clear all notifications?');
    
    if (!confirmed) {
      return;
    }

    try {
      await notificationService.clearAll();
      
      // Update local state
      setNotifications([]);
      setStats({
        total: 0,
        unread: 0,
        pending: 0,
        failed: 0,
      });
      
      twa.haptic.notification('success');
    } catch (err: any) {
      setError(err.message || 'Failed to clear notifications');
      twa.haptic.notification('error');
      throw err;
    }
  }, [twa]);

  /**
   * Send a test notification
   */
  const sendTestNotification = useCallback(async () => {
    try {
      await notificationService.sendTestNotification();
      twa.haptic.notification('success');
      
      // Reload notifications to show the test one
      setTimeout(() => {
        loadNotifications();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to send test notification');
      twa.haptic.notification('error');
      throw err;
    }
  }, [twa, loadNotifications]);

  /**
   * Handle new notifications from polling
   */
  const handleNewNotifications = useCallback((newNotifications: Notification[]) => {
    if (newNotifications.length === 0) return;

    // Update notifications list
    setNotifications(prev => {
      const existingIds = new Set(prev.map(n => n._id));
      const uniqueNew = newNotifications.filter(n => !existingIds.has(n._id));
      return [...uniqueNew, ...prev];
    });

    // Update stats
    setStats(prev => ({
      ...prev,
      total: prev.total + newNotifications.length,
      unread: prev.unread + newNotifications.filter(n => n.status !== 'read').length,
    }));

    // Show haptic feedback for new notifications
    if (preferences?.notificationVibration) {
      twa.haptic.notification('success');
    }
  }, [preferences, twa]);

  /**
   * Start polling for new notifications
   */
  const startPolling = useCallback((intervalMs = 30000) => {
    if (pollIntervalRef.current) {
      return; // Already polling
    }

    const interval = notificationService.startPolling(intervalMs, handleNewNotifications);
    pollIntervalRef.current = interval;
    setIsPolling(true);
  }, [handleNewNotifications]);

  /**
   * Stop polling for notifications
   */
  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      notificationService.stopPolling(pollIntervalRef.current);
      pollIntervalRef.current = null;
      setIsPolling(false);
    }
  }, []);

  // Load initial data on mount
  useEffect(() => {
    loadNotifications();
    loadPreferences();
  }, [loadNotifications, loadPreferences]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        notificationService.stopPolling(pollIntervalRef.current);
      }
    };
  }, []);

  return {
    notifications,
    stats,
    preferences,
    isLoading,
    error,
    loadNotifications,
    loadPreferences,
    updatePreferences,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    sendTestNotification,
    startPolling,
    stopPolling,
    isPolling,
  };
}
