import { Bell, Plus, PencilSimple, Gear, TrendUp, TrendDown, Minus } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function HomeScreen() {
  const kpiData = [
    { label: "Tracked products", value: "12", trend: "up" },
    { label: "Active alerts", value: "8", trend: "neutral" },
    { label: "Avg. discount", value: "23%", trend: "up" },
  ]

  const watchlistProducts = [
    {
      id: 1,
      name: "Sony WH-1000XM5 Wireless Headphones",
      currentPrice: 24990,
      priceChange: -1500,
      alertOn: true,
    },
    {
      id: 2,
      name: "Apple AirPods Pro (2nd Gen)",
      currentPrice: 21990,
      priceChange: 0,
      alertOn: true,
    },
    {
      id: 3,
      name: "Samsung Galaxy Buds2 Pro",
      currentPrice: 12990,
      priceChange: -2000,
      alertOn: false,
    },
    {
      id: 4,
      name: "JBL Flip 6 Bluetooth Speaker",
      currentPrice: 9999,
      priceChange: 500,
      alertOn: true,
    },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendUp weight="bold" className="w-4 h-4 text-accent" />
      case "down":
        return <TrendDown weight="bold" className="w-4 h-4 text-destructive" />
      default:
        return <Minus weight="bold" className="w-4 h-4 text-muted-foreground" />
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-3 skeuo-raised">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-accent flex items-center justify-center skeuo-inset">
            <span className="text-xs font-bold">PT</span>
          </div>
          <div>
            <h1 className="text-sm font-bold leading-none">Pricetraqor</h1>
            <p className="text-[10px] text-muted-foreground">Watch & Save</p>
          </div>
        </div>

        <button className="relative glass-panel w-12 h-12 rounded-full flex items-center justify-center skeuo-raised active:skeuo-pressed transition-all duration-150 active:scale-95">
          <Bell weight="duotone" className="w-5 h-5 text-foreground" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-[10px] bg-destructive border-0 skeuo-raised">
            3
          </Badge>
        </button>
      </div>

      <Card className="glass-panel p-0 overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-border/50">
          {kpiData.map((kpi, idx) => (
            <div key={idx} className="p-4 flex flex-col items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-semibold text-numeric">{kpi.value}</span>
                {getTrendIcon(kpi.trend)}
              </div>
              <p className="text-[11px] text-center text-muted-foreground leading-tight">
                {kpi.label}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Today's Watchlist</h2>
        
        <div className="space-y-2">
          {watchlistProducts.map((product) => (
            <Card
              key={product.id}
              className="glass-panel p-4 hover:border-accent/50 transition-all duration-200 hover:skeuo-raised active:scale-[0.98]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="skeuo-inset px-3 py-1.5 rounded-lg bg-secondary/30">
                      <span className="text-base font-semibold text-numeric">
                        {formatPrice(product.currentPrice)}
                      </span>
                    </div>
                    {product.priceChange !== 0 && (
                      <span
                        className={`text-xs font-medium ${
                          product.priceChange < 0 ? "text-accent" : "text-destructive"
                        }`}
                      >
                        {product.priceChange < 0 ? "↓" : "↑"} {formatPrice(Math.abs(product.priceChange))}
                      </span>
                    )}
                  </div>
                </div>
                <Badge
                  variant={product.alertOn ? "default" : "secondary"}
                  className={`shrink-0 text-[10px] ${
                    product.alertOn
                      ? "bg-accent/20 text-accent border-accent/30 skeuo-raised"
                      : "skeuo-inset"
                  }`}
                >
                  {product.alertOn ? "Alert on" : "Alert off"}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button className="glass-panel skeuo-raised hover:skeuo-pressed active:skeuo-pressed active:scale-95 bg-gradient-to-br from-accent/40 to-violet-accent/30 hover:from-accent/50 hover:to-violet-accent/40 border-accent/30 flex-1 min-w-fit font-semibold">
          <Plus weight="bold" className="w-4 h-4 mr-2" />
          Add product
        </Button>
        <Button variant="secondary" className="glass-panel skeuo-raised hover:skeuo-pressed active:skeuo-pressed active:scale-95 bg-primary/20 hover:bg-primary/30 border-primary/30 flex-1 min-w-fit">
          <PencilSimple weight="bold" className="w-4 h-4 mr-2" />
          Edit alerts
        </Button>
        <Button variant="secondary" className="glass-panel skeuo-raised hover:skeuo-pressed active:skeuo-pressed active:scale-95 bg-secondary/60 hover:bg-secondary/80 border-border flex-1 min-w-fit">
          <Gear weight="bold" className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  )
}
