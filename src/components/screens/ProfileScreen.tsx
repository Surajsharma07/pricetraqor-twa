import { User, SignOut, Gear } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useKV } from "@github/spark/hooks"

export function ProfileScreen() {
  const [selectedTheme, setSelectedTheme] = useKV<string>("theme-preference", "Auto")
  const [selectedCurrency, setSelectedCurrency] = useKV<string>("currency-preference", "INR")
  const [notificationPrefs, setNotificationPrefs] = useKV<string[]>("notification-prefs", ["In-app", "Email"])

  const themes = ["Auto", "Light", "Dark"]
  const currencies = ["INR", "USD", "EUR", "GBP"]
  const notificationTypes = ["In-app", "Email", "Push"]

  const toggleNotification = (type: string) => {
    setNotificationPrefs((current) => {
      const prefs = current || []
      return prefs.includes(type)
        ? prefs.filter((t) => t !== type)
        : [...prefs, type]
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">user@example.com</p>
      </div>

      <Card className="glass-panel p-5 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full glass-panel skeuo-raised flex items-center justify-center bg-gradient-to-br from-primary/30 to-violet-accent/30">
            <User weight="duotone" className="w-8 h-8 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Guest User</h3>
            <p className="text-sm text-muted-foreground">user@example.com</p>
          </div>
        </div>
        <Badge className="bg-accent/20 text-accent border-accent/30 text-xs skeuo-raised">
          Beta Access
        </Badge>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Preferences</h2>

        <Card className="glass-panel p-4 space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Theme</label>
            <Tabs value={selectedTheme} onValueChange={setSelectedTheme} className="w-full">
              <TabsList className="grid w-full grid-cols-3 glass-panel skeuo-inset p-1">
                {themes.map((theme) => (
                  <TabsTrigger
                    key={theme}
                    value={theme}
                    className="data-[state=active]:glass-panel data-[state=active]:skeuo-raised data-[state=active]:bg-primary/20 data-[state=active]:text-accent text-xs"
                  >
                    {theme}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </Card>

        <Card className="glass-panel p-4 space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Currency</label>
            <div className="grid grid-cols-4 gap-2">
              {currencies.map((currency) => (
                <button
                  key={currency}
                  onClick={() => setSelectedCurrency(currency)}
                  className={`glass-panel py-2 rounded-lg text-xs font-medium transition-all duration-200 active:scale-95 ${
                    selectedCurrency === currency
                      ? "skeuo-raised bg-accent/20 text-accent border-accent/30"
                      : "skeuo-inset text-muted-foreground"
                  }`}
                >
                  {currency}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="glass-panel p-4 space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Notifications</label>
            <div className="flex flex-wrap gap-2">
              {notificationTypes.map((type) => {
                const isActive = (notificationPrefs || []).includes(type)
                return (
                  <button
                    key={type}
                    onClick={() => toggleNotification(type)}
                    className={`glass-panel px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 active:scale-95 ${
                      isActive
                        ? "skeuo-raised bg-accent/20 text-accent border-accent/30"
                        : "skeuo-inset text-muted-foreground"
                    }`}
                  >
                    {type}
                  </button>
                )
              })}
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-3 pt-4">
        <Button className="w-full h-12 glass-panel skeuo-raised hover:skeuo-pressed active:skeuo-pressed active:scale-[0.98] bg-primary/20 hover:bg-primary/30 border-primary/30">
          <Gear weight="bold" className="w-4 h-4 mr-2" />
          Manage account
        </Button>
        <Button variant="secondary" className="w-full h-12 glass-panel skeuo-raised hover:skeuo-pressed active:skeuo-pressed active:scale-[0.98] text-destructive">
          <SignOut weight="bold" className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  )
}
