/**
 * NotificationSettings Component
 * Allows users to configure notification preferences
 */

import { useState, useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  BellSlash, 
  TrendDown, 
  Package, 
  Moon,
  SpeakerHigh,
  Vibrate,
  TestTube
} from '@phosphor-icons/react';
import { toast } from 'sonner';

export function NotificationSettings() {
  const { preferences, updatePreferences, sendTestNotification, isLoading } = useNotifications();
  
  // Local state for form
  const [enabled, setEnabled] = useState(true);
  const [priceDropEnabled, setPriceDropEnabled] = useState(true);
  const [stockRecoveryEnabled, setStockRecoveryEnabled] = useState(true);
  const [significantChangeEnabled, setSignificantChangeEnabled] = useState(true);
  const [minPriceDropPercentage, setMinPriceDropPercentage] = useState(5);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('08:00');
  const [notificationSound, setNotificationSound] = useState(true);
  const [notificationVibration, setNotificationVibration] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load preferences when component mounts
  useEffect(() => {
    if (preferences) {
      setEnabled(preferences.enabled);
      setPriceDropEnabled(preferences.priceDropEnabled);
      setStockRecoveryEnabled(preferences.stockRecoveryEnabled);
      setSignificantChangeEnabled(preferences.significantChangeEnabled);
      setMinPriceDropPercentage(preferences.minPriceDropPercentage);
      setQuietHoursEnabled(preferences.quietHoursEnabled);
      setQuietHoursStart(preferences.quietHoursStart);
      setQuietHoursEnd(preferences.quietHoursEnd);
      setNotificationSound(preferences.notificationSound);
      setNotificationVibration(preferences.notificationVibration);
    }
  }, [preferences]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updatePreferences({
        enabled,
        priceDropEnabled,
        stockRecoveryEnabled,
        significantChangeEnabled,
        minPriceDropPercentage,
        quietHoursEnabled,
        quietHoursStart,
        quietHoursEnd,
        notificationSound,
        notificationVibration,
      });
      toast.success('Notification settings saved');
    } catch (error) {
      toast.error('Failed to save notification settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      await sendTestNotification();
      toast.success('Test notification sent');
    } catch (error) {
      toast.error('Failed to send test notification');
    }
  };

  const hasChanges = preferences && (
    enabled !== preferences.enabled ||
    priceDropEnabled !== preferences.priceDropEnabled ||
    stockRecoveryEnabled !== preferences.stockRecoveryEnabled ||
    significantChangeEnabled !== preferences.significantChangeEnabled ||
    minPriceDropPercentage !== preferences.minPriceDropPercentage ||
    quietHoursEnabled !== preferences.quietHoursEnabled ||
    quietHoursStart !== preferences.quietHoursStart ||
    quietHoursEnd !== preferences.quietHoursEnd ||
    notificationSound !== preferences.notificationSound ||
    notificationVibration !== preferences.notificationVibration
  );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Notification Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure how and when you receive price alerts
        </p>
      </div>

      <Card className="p-6 space-y-6">
        {/* Main Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {enabled ? (
              <Bell className="w-6 h-6 text-primary" weight="bold" />
            ) : (
              <BellSlash className="w-6 h-6 text-muted-foreground" weight="bold" />
            )}
            <div>
              <Label htmlFor="enabled" className="text-base font-semibold cursor-pointer">
                Enable Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Turn on/off all notifications
              </p>
            </div>
          </div>
          <Switch
            id="enabled"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>

        <Separator />

        {/* Notification Types */}
        <div className={`space-y-4 ${enabled ? 'opacity-100' : 'opacity-50'}`}>
          <h3 className="font-semibold">Notification Types</h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendDown className="w-5 h-5 text-green-500" weight="bold" />
              <div>
                <Label htmlFor="priceDropEnabled" className="cursor-pointer">
                  Price Drops
                </Label>
                <p className="text-xs text-muted-foreground">
                  Notify when prices decrease
                </p>
              </div>
            </div>
            <Switch
              id="priceDropEnabled"
              checked={priceDropEnabled}
              onCheckedChange={setPriceDropEnabled}
              disabled={!enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-blue-500" weight="bold" />
              <div>
                <Label htmlFor="stockRecoveryEnabled" className="cursor-pointer">
                  Stock Recovery
                </Label>
                <p className="text-xs text-muted-foreground">
                  Notify when out-of-stock items return
                </p>
              </div>
            </div>
            <Switch
              id="stockRecoveryEnabled"
              checked={stockRecoveryEnabled}
              onCheckedChange={setStockRecoveryEnabled}
              disabled={!enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-orange-500" weight="bold" />
              <div>
                <Label htmlFor="significantChangeEnabled" className="cursor-pointer">
                  Significant Changes
                </Label>
                <p className="text-xs text-muted-foreground">
                  Notify for major price movements
                </p>
              </div>
            </div>
            <Switch
              id="significantChangeEnabled"
              checked={significantChangeEnabled}
              onCheckedChange={setSignificantChangeEnabled}
              disabled={!enabled}
            />
          </div>
        </div>

        <Separator />

        {/* Minimum Price Drop */}
        <div className={`space-y-3 ${enabled && priceDropEnabled ? 'opacity-100' : 'opacity-50'}`}>
          <div className="flex items-center justify-between">
            <Label htmlFor="minPriceDropPercentage">
              Minimum Price Drop
            </Label>
            <span className="text-sm font-semibold text-primary">
              {minPriceDropPercentage}%
            </span>
          </div>
          <Slider
            id="minPriceDropPercentage"
            min={1}
            max={50}
            step={1}
            value={[minPriceDropPercentage]}
            onValueChange={(value) => setMinPriceDropPercentage(value[0])}
            disabled={!enabled || !priceDropEnabled}
          />
          <p className="text-xs text-muted-foreground">
            Only notify if price drops by at least this percentage
          </p>
        </div>

        <Separator />

        {/* Quiet Hours */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-indigo-500" weight="bold" />
              <div>
                <Label htmlFor="quietHoursEnabled" className="cursor-pointer">
                  Quiet Hours
                </Label>
                <p className="text-xs text-muted-foreground">
                  Mute notifications during specific hours
                </p>
              </div>
            </div>
            <Switch
              id="quietHoursEnabled"
              checked={quietHoursEnabled}
              onCheckedChange={setQuietHoursEnabled}
              disabled={!enabled}
            />
          </div>

          {quietHoursEnabled && (
            <div className="grid grid-cols-2 gap-4 pl-8">
              <div>
                <Label htmlFor="quietHoursStart" className="text-xs">
                  Start Time
                </Label>
                <Input
                  id="quietHoursStart"
                  type="time"
                  value={quietHoursStart}
                  onChange={(e) => setQuietHoursStart(e.target.value)}
                  disabled={!enabled}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="quietHoursEnd" className="text-xs">
                  End Time
                </Label>
                <Input
                  id="quietHoursEnd"
                  type="time"
                  value={quietHoursEnd}
                  onChange={(e) => setQuietHoursEnd(e.target.value)}
                  disabled={!enabled}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Notification Style */}
        <div className="space-y-4">
          <h3 className="font-semibold">Notification Style</h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SpeakerHigh className="w-5 h-5 text-purple-500" weight="bold" />
              <div>
                <Label htmlFor="notificationSound" className="cursor-pointer">
                  Sound
                </Label>
                <p className="text-xs text-muted-foreground">
                  Play sound for notifications
                </p>
              </div>
            </div>
            <Switch
              id="notificationSound"
              checked={notificationSound}
              onCheckedChange={setNotificationSound}
              disabled={!enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Vibrate className="w-5 h-5 text-pink-500" weight="bold" />
              <div>
                <Label htmlFor="notificationVibration" className="cursor-pointer">
                  Vibration
                </Label>
                <p className="text-xs text-muted-foreground">
                  Vibrate for notifications
                </p>
              </div>
            </div>
            <Switch
              id="notificationVibration"
              checked={notificationVibration}
              onCheckedChange={setNotificationVibration}
              disabled={!enabled}
            />
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving || isLoading}
          className="flex-1"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
        
        <Button
          variant="outline"
          onClick={handleTestNotification}
          disabled={!enabled}
        >
          <TestTube className="w-4 h-4 mr-2" />
          Test
        </Button>
      </div>

      {hasChanges && (
        <p className="text-sm text-muted-foreground text-center">
          You have unsaved changes
        </p>
      )}
    </div>
  );
}
