import { User, SignOut, Gear, Crown, CalendarBlank, Infinity, CheckCircle } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useKV } from "@github/spark/hooks"

export function ProfileScreen() {
  const [selectedTheme, setSelectedTheme] = useKV<string>("theme-preference", "Auto")
  const [selectedCurrency, setSelectedCurrency] = useKV<string>("currency-preference", "INR")
  const [notificationPrefs, setNotificationPrefs] = useKV<string[]>("notification-prefs", ["In-app", "Email"])
  const [subscriptionTier, setSubscriptionTier] = useKV<string>("subscription-tier", "Pro")

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

  const subscriptionFeatures = {
    Free: [
      "Track up to 5 products",
      "Basic price alerts",
      "Email notifications",
      "7-day price history"
    ],
    Pro: [
      "Track up to 50 products",
      "Advanced price alerts",
      "All notification types",
      "90-day price history",
      "Price drop predictions",
      "Priority support"
    ],
    Premium: [
      "Unlimited product tracking",
      "AI-powered alerts",
      "Telegram notifications",
      "Unlimited price history",
      "Advanced analytics",
      "API access",
      "Dedicated support"
    ]
  }

  const currentFeatures = subscriptionFeatures[subscriptionTier as keyof typeof subscriptionFeatures] || subscriptionFeatures.Free

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
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Subscription</h2>
          <Button 
            size="sm" 
            className="h-8 text-xs skeuo-raised hover:skeuo-pressed active:skeuo-pressed bg-gradient-to-br from-accent/40 to-violet-accent/40 hover:from-accent/50 hover:to-violet-accent/50 border-accent/30"
          >
            Upgrade
          </Button>
        </div>

        <Card className="glass-panel p-5 space-y-4 border-2 border-accent/20">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl glass-panel skeuo-raised flex items-center justify-center bg-gradient-to-br from-accent/30 to-violet-accent/30">
                <Crown weight="fill" className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{subscriptionTier} Plan</h3>
                <p className="text-sm text-muted-foreground">
                  {subscriptionTier === "Free" ? "Free forever" : "Active subscription"}
                </p>
              </div>
            </div>
            <Badge className="bg-accent/20 text-accent border-accent/30 text-xs skeuo-raised">
              Active
            </Badge>
          </div>

          {subscriptionTier !== "Free" && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="glass-panel skeuo-inset p-3 rounded-lg bg-secondary/20">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <CalendarBlank className="w-4 h-4" />
                  <span className="text-xs">Renewal Date</span>
                </div>
                <p className="text-sm font-semibold">Jan 15, 2025</p>
              </div>
              <div className="glass-panel skeuo-inset p-3 rounded-lg bg-secondary/20">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Infinity className="w-4 h-4" />
                  <span className="text-xs">Price</span>
                </div>
                <p className="text-sm font-semibold">
                  {subscriptionTier === "Pro" ? "₹299/mo" : "₹599/mo"}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2 pt-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Plan Features</p>
            <div className="space-y-2">
              {currentFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle weight="fill" className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground/90">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {subscriptionTier !== "Premium" && (
            <Button 
              className="w-full h-11 skeuo-raised hover:skeuo-pressed active:skeuo-pressed active:scale-[0.98] bg-gradient-to-br from-accent/50 to-violet-accent/50 hover:from-accent/60 hover:to-violet-accent/60 border-accent/30 font-semibold"
            >
              <Crown weight="fill" className="w-4 h-4 mr-2" />
              Upgrade to {subscriptionTier === "Free" ? "Pro" : "Premium"}
            </Button>
          )}
        </Card>
      </div>

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
        <Button className="w-full h-12 glass-panel skeuo-raised hover:skeuo-pressed active:skeuo-pressed active:scale-[0.98] bg-gradient-to-br from-primary/30 to-accent/20 hover:from-primary/40 hover:to-accent/30 border-primary/30">
          <Gear weight="bold" className="w-4 h-4 mr-2" />
          Manage account
        </Button>
        <Button variant="secondary" className="w-full h-12 glass-panel skeuo-raised hover:skeuo-pressed active:skeuo-pressed active:scale-[0.98] bg-destructive/20 hover:bg-destructive/30 text-destructive border-destructive/30">
          <SignOut weight="bold" className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  )
}
