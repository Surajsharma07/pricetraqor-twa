import { UserSettings } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Bell, Gear } from '@phosphor-icons/react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface SettingsScreenProps {
  settings: UserSettings
  onUpdateSettings: (settings: UserSettings) => void
}

export function SettingsScreen({ settings, onUpdateSettings }: SettingsScreenProps) {
  const handleToggleNotifications = (enabled: boolean) => {
    onUpdateSettings({ ...settings, notificationsEnabled: enabled })
  }

  const handleAlertTypeChange = (type: 'drops' | 'all') => {
    onUpdateSettings({ ...settings, alertType: type })
  }

  const handleDefaultTargetChange = (value: string) => {
    const percent = value.trim() ? parseFloat(value) : undefined
    if (value.trim() && (isNaN(percent!) || percent! <= 0 || percent! > 100)) {
      return
    }
    onUpdateSettings({ ...settings, defaultTargetPercent: percent })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Gear className="w-6 h-6" weight="bold" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your preferences</p>
        </div>
      </div>

      <Card className="p-6 space-y-6 shadow-[0_2px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.03)]">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-muted-foreground" weight="bold" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications-enabled" className="text-sm font-medium">
                  Enable Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Receive alerts when prices change
                </p>
              </div>
              <Switch
                id="notifications-enabled"
                checked={settings.notificationsEnabled}
                onCheckedChange={handleToggleNotifications}
              />
            </div>

            {settings.notificationsEnabled && (
              <>
                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Alert Type</Label>
                  <RadioGroup
                    value={settings.alertType}
                    onValueChange={handleAlertTypeChange}
                  >
                    <div className="flex items-center space-x-3 rounded-md border border-border p-3">
                      <RadioGroupItem value="drops" id="alert-drops" />
                      <div className="flex-1">
                        <Label htmlFor="alert-drops" className="text-sm font-medium cursor-pointer">
                          Price drops only
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Only notify when prices decrease
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border border-border p-3">
                      <RadioGroupItem value="all" id="alert-all" />
                      <div className="flex-1">
                        <Label htmlFor="alert-all" className="text-sm font-medium cursor-pointer">
                          All price changes
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Notify for any price change (up or down)
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="default-target" className="text-sm font-medium">
                    Auto-alert Threshold (%)
                  </Label>
                  <Input
                    id="default-target"
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    placeholder="e.g., 10"
                    value={settings.defaultTargetPercent || ''}
                    onChange={(e) => handleDefaultTargetChange(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Automatically notify when price drops by at least this percentage
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-muted/50 shadow-[0_2px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.03)]">
        <h3 className="text-sm font-medium mb-2">About Notifications</h3>
        <ul className="text-xs text-muted-foreground space-y-1.5">
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>Notifications are delivered via Telegram bot messages</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>You can set custom target prices for individual products</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>Price checks happen automatically in the background</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>Pause tracking on specific products to stop alerts temporarily</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
