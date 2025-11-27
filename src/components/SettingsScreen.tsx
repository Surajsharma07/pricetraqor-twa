import { UserSettings } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Bell, Gear, Palette } from '@phosphor-icons/react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface SettingsScreenProps {
  settings: UserSettings
  onUpdateSettings: (settings: UserSettings) => void
  onShowNeumorphic?: () => void
}

export function SettingsScreen({ settings, onUpdateSettings, onShowNeumorphic }: SettingsScreenProps) {
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
                  <RadioGroup
                    value={settings.alertType}
                    onValueChange={handleAlertTypeChange}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 rounded-xl border border-border/50 p-4 glass-morphism hover:glow-accent transition-all duration-200">
                      <RadioGroupItem value="drops" id="alert-drops" />
                      <div className="flex-1">
                        <Label htmlFor="alert-drops" className="text-sm font-semibold cursor-pointer">
                          Price drops only
                        </Label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Only notify when prices decrease
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 rounded-xl border border-border/50 p-4 glass-morphism hover:glow-accent transition-all duration-200">
                      <RadioGroupItem value="all" id="alert-all" />
                      <div className="flex-1">
                        <Label htmlFor="alert-all" className="text-sm font-semibold cursor-pointer">
                          All price changes
                        </Label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Notify for any price change (up or down)
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
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

      {onShowNeumorphic && (
        <Card className="p-6 glass-card border-accent/30 relative overflow-hidden group hover:border-accent/60 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/5 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-primary/10 group-hover:scale-110 transition-transform duration-300">
              <Palette className="w-6 h-6 text-accent" weight="bold" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Neumorphic Components
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Explore tactile, real-world inspired UI elements with depth and dimension
              </p>
              <Button
                onClick={onShowNeumorphic}
                className="w-full glass-button hover:glow-accent"
              >
                View Showcase
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
