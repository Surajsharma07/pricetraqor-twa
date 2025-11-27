import { UserSettings } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Bell, Gear } from '@phosphor-icons/react'
import { NeumorphicRadioGroup } from '@/components/NeumorphicRadioGroup'
import { LampSwitch } from '@/components/ui/lamp-switch'

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

  const handleThemeChange = (isLight: boolean) => {
    onUpdateSettings({ ...settings, theme: isLight ? 'light' : 'dark' })
  }

  return (
    <div className="space-y-6 relative">
      <LampSwitch 
        isLight={settings.theme === 'light'}
        onToggle={() => handleThemeChange(settings.theme !== 'light')}
      />
      
      <div className="flex items-center gap-3">
        <Gear className="w-7 h-7 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" weight="bold" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">Manage your preferences</p>
        </div>
      </div>

      <Card className="p-6 space-y-6 glass-card relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-tr before:from-accent/5 before:via-transparent before:to-transparent before:opacity-50">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <Bell className="w-5 h-5 text-muted-foreground drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" weight="bold" />
            <h2 className="text-lg font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]">Notifications</h2>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 frosted-glass rounded-xl border border-border/30">
              <div className="space-y-1">
                <Label htmlFor="notifications-enabled" className="text-sm font-semibold cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
                  Enable Notifications
                </Label>
                <p className="text-xs text-muted-foreground drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
                  Receive alerts when prices change
                </p>
              </div>
              <Switch
                id="notifications-enabled"
                checked={settings.notificationsEnabled}
                onCheckedChange={handleToggleNotifications}
                className="neumorphic-button data-[state=checked]:glow-accent"
              />
            </div>

            {settings.notificationsEnabled && (
              <>
                <Separator className="shadow-[0_1px_3px_rgba(0,0,0,0.15)]" />

                <div className="space-y-3">
                  <Label className="text-sm font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">Alert Type</Label>
                  <NeumorphicRadioGroup
                    value={settings.alertType}
                    onValueChange={handleAlertTypeChange}
                    options={[
                      {
                        value: 'drops',
                        label: 'Price drops only',
                        description: 'Only notify when prices decrease'
                      },
                      {
                        value: 'all',
                        label: 'All price changes',
                        description: 'Notify for any price change (up or down)'
                      }
                    ]}
                  />
                </div>

                <Separator className="shadow-[0_1px_2px_rgba(0,0,0,0.1)]" />

                <div className="space-y-2">
                  <Label htmlFor="default-target" className="text-sm font-semibold">
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
                    className="neumorphic-inset"
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

      <Card className="p-5 bg-gradient-to-br from-muted/60 to-muted/40 shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.05)]">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
          About Notifications
        </h3>
        <ul className="text-xs text-muted-foreground space-y-2">
          <li className="flex gap-2.5">
            <span className="text-accent font-bold">•</span>
            <span>Notifications are delivered via Telegram bot messages</span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-accent font-bold">•</span>
            <span>You can set custom target prices for individual products</span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-accent font-bold">•</span>
            <span>Price checks happen automatically in the background</span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-accent font-bold">•</span>
            <span>Pause tracking on specific products to stop alerts temporarily</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
